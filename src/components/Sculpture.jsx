import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

class RibbonPath extends THREE.Curve {
  getPoint(t, target = new THREE.Vector3()) {
    const angle = t * Math.PI * 2
    const radius = 1.35 + 0.42 * Math.cos(3 * angle)
    return target.set(radius * Math.cos(2 * angle), radius * Math.sin(2 * angle), 0.68 * Math.sin(3 * angle))
  }
}

function createRibbon() {
  const segments = 420
  const sides = 16
  const path = new RibbonPath()
  const frames = path.computeFrenetFrames(segments, true)
  const positions = []
  const silverIndices = []
  const lacquerIndices = []
  const geometry = new THREE.BufferGeometry()
  const point = new THREE.Vector3()
  const normal = new THREE.Vector3()
  const binormal = new THREE.Vector3()

  // A rounded rectangular profile follows a closed knot, producing a broad metal ribbon.
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    path.getPointAt(t, point)
    const twist = t * Math.PI * 4
    normal.copy(frames.normals[i]).multiplyScalar(Math.cos(twist)).addScaledVector(frames.binormals[i], Math.sin(twist))
    binormal.copy(frames.binormals[i]).multiplyScalar(Math.cos(twist)).addScaledVector(frames.normals[i], -Math.sin(twist))
    for (let j = 0; j <= sides; j++) {
      const theta = j / sides * Math.PI * 2
      const cosine = Math.cos(theta)
      const sine = Math.sin(theta)
      const width = Math.sign(cosine) * Math.abs(cosine) ** 0.45 * 0.31
      const depth = Math.sign(sine) * Math.abs(sine) ** 0.45 * 0.105
      positions.push(point.x + normal.x * width + binormal.x * depth, point.y + normal.y * width + binormal.y * depth, point.z + normal.z * width + binormal.z * depth)
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < sides; j++) {
      const a = i * (sides + 1) + j
      const b = a + sides + 1
      const indices = j >= 9 && j <= 13 ? lacquerIndices : silverIndices
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex([...silverIndices, ...lacquerIndices])
  geometry.addGroup(0, silverIndices.length, 0)
  geometry.addGroup(silverIndices.length, lacquerIndices.length, 1)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}

export default function Sculpture({ theme }) {
  const containerRef = useRef(null)
  const themeRef = useRef(theme)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const pausedRef = useRef(paused)

  useEffect(() => { themeRef.current = theme }, [theme])
  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      container.dataset.unavailable = 'true'
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    container.prepend(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 50)
    camera.position.set(0, 0, 10)
    const environment = new RoomEnvironment()
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environmentTarget = pmrem.fromScene(environment, 0.04)
    scene.environment = environmentTarget.texture
    environment.dispose()
    pmrem.dispose()

    const silver = new THREE.MeshPhysicalMaterial({ color: 0xc9ceca, metalness: 1, roughness: 0.21, clearcoat: 1, clearcoatRoughness: 0.16, side: THREE.DoubleSide })
    const lacquer = new THREE.MeshPhysicalMaterial({ color: 0x943020, metalness: 0.55, roughness: 0.23, clearcoat: 1, clearcoatRoughness: 0.1, side: THREE.DoubleSide })
    const geometry = createRibbon()
    const sculpture = new THREE.Mesh(geometry, [silver, lacquer])
    const group = new THREE.Group()
    group.add(sculpture)
    scene.add(group)

    const keyLight = new THREE.DirectionalLight(0xffffff, 3)
    keyLight.position.set(-3, 5, 6)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xc9d5ee, 2)
    fillLight.position.set(4, 1, -2)
    scene.add(fillLight)

    let baseY = 0
    let visible = true
    let isPageVisible = !document.hidden
    let dragging = false
    let pointerStart = 0
    let dragStart = 0
    let rotationTarget = 0
    let rotationCurrent = 0
    let pointerX = 0
    let pointerY = 0
    let phase = 0
    let lastTime = 0
    let lastProbe = 0

    const resize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      const viewHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      const viewWidth = viewHeight * camera.aspect
      if (width < 768) {
        const scale = Math.min(viewWidth / 5.1, viewHeight * (height - 290) / height / 4.2)
        group.scale.setScalar(Math.max(0.38, scale))
        baseY = -viewHeight * 0.24
        group.position.set(viewWidth * 0.06, baseY, 0)
      } else {
        const scale = Math.min(1.03, viewWidth / 9.4)
        group.scale.setScalar(scale)
        baseY = -0.18
        group.position.set(viewWidth * 0.245, baseY, 0)
      }
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { rootMargin: '80px' })
    visibilityObserver.observe(container)
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const reduceMotion = (event) => setPaused(event.matches)
    preference.addEventListener('change', reduceMotion)
    const pageVisibility = () => { isPageVisible = !document.hidden }
    document.addEventListener('visibilitychange', pageVisibility)

    const pointerMove = (event) => {
      const rect = container.getBoundingClientRect()
      pointerX = (event.clientX - rect.left) / rect.width - 0.5
      pointerY = (event.clientY - rect.top) / rect.height - 0.5
      if (dragging) rotationTarget = dragStart + (event.clientX - pointerStart) * 0.008
    }
    const pointerDown = (event) => {
      if (event.button !== 0 || preference.matches) return
      dragging = true
      pointerStart = event.clientX
      dragStart = rotationTarget
      renderer.domElement.setPointerCapture(event.pointerId)
    }
    const pointerUp = () => { dragging = false }
    const pointerLeave = () => { pointerX = 0; pointerY = 0 }
    const contextLost = (event) => { event.preventDefault(); setFailed(true) }
    const contextRestored = () => setFailed(false)
    renderer.domElement.addEventListener('pointermove', pointerMove)
    renderer.domElement.addEventListener('pointerdown', pointerDown)
    renderer.domElement.addEventListener('pointerup', pointerUp)
    renderer.domElement.addEventListener('pointercancel', pointerUp)
    renderer.domElement.addEventListener('pointerleave', pointerLeave)
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    renderer.domElement.addEventListener('webglcontextrestored', contextRestored)

    renderer.setAnimationLoop((time) => {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0
      lastTime = time
      if (!visible || !isPageVisible) return
      if (!pausedRef.current) phase += delta
      rotationCurrent += (rotationTarget - rotationCurrent) * 0.07
      const allowPointer = !pausedRef.current && !preference.matches
      sculpture.rotation.set(0.26 + Math.sin(phase * 0.2) * 0.07 + (allowPointer ? pointerY * 0.12 : 0), -0.3 + phase * 0.055 + rotationCurrent + (allowPointer ? pointerX * 0.2 : 0), -0.28)
      group.position.y = baseY + Math.sin(phase * 0.48) * 0.04
      scene.environmentIntensity = themeRef.current === 'dark' ? 1.6 : 1.1
      renderer.render(scene, camera)
      // Development-only pixel evidence supports visual regression checks through the DOM.
      if (import.meta.env.DEV && time - lastProbe > 1500) {
        lastProbe = time
        const canvas = renderer.domElement
        const gl = renderer.getContext()
        const pixels = new Uint8Array(canvas.width * canvas.height * 4)
        gl.readPixels(0, 0, canvas.width, canvas.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        let samples = 0
        let signature = 0
        let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0
        for (let y = 0; y < canvas.height; y += 8) {
          for (let x = 0; x < canvas.width; x += 8) {
            const i = (y * canvas.width + x) * 4
            if (pixels[i + 3] < 32) continue
            samples++
            signature = (signature + pixels[i] * (x + 1) + pixels[i + 1] * (y + 1)) % 1000000007
            minX = Math.min(minX, x); maxX = Math.max(maxX, x)
            minY = Math.min(minY, y); maxY = Math.max(maxY, y)
          }
        }
        canvas.dataset.renderEvidence = JSON.stringify({ samples, signature, left: minX / canvas.width, right: maxX / canvas.width, top: 1 - maxY / canvas.height, bottom: 1 - minY / canvas.height })
      }
    })

    return () => {
      renderer.setAnimationLoop(null)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      preference.removeEventListener('change', reduceMotion)
      document.removeEventListener('visibilitychange', pageVisibility)
      renderer.domElement.removeEventListener('pointermove', pointerMove)
      renderer.domElement.removeEventListener('pointerdown', pointerDown)
      renderer.domElement.removeEventListener('pointerup', pointerUp)
      renderer.domElement.removeEventListener('pointercancel', pointerUp)
      renderer.domElement.removeEventListener('pointerleave', pointerLeave)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      renderer.domElement.removeEventListener('webglcontextrestored', contextRestored)
      geometry.dispose()
      silver.dispose()
      lacquer.dispose()
      environmentTarget.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return (
    <div ref={containerRef} className="sculpture" role="group" aria-label="银色与朱红金属缎带雕塑">
      <img className={`sculpture-fallback${failed ? ' is-visible' : ''}`} src="/images/quiet-landscape.jpg" alt="" />
      {!failed && <button className="icon-button sculpture-control" onClick={() => setPaused((value) => !value)} aria-label={paused ? '播放雕塑动画' : '暂停雕塑动画'} title={paused ? '播放动画' : '暂停动画'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>}
    </div>
  )
}
