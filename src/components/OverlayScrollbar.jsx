import { useEffect, useRef } from 'react'
import './OverlayScrollbar.css'

export default function OverlayScrollbar() {
  const trackRef = useRef(null)
  const thumbRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    const thumb = thumbRef.current
    const page = document.documentElement
    const scroller = document.scrollingElement || page
    const forcedColors = window.matchMedia('(forced-colors: active)')
    const previousAttribute = page.getAttribute('data-overlay-scrollbar')
    let frame = 0
    let idleTimer = 0
    let drag = null
    let geometry = { top: 0, height: 0, thumbHeight: 0, thumbTop: 0, maxScroll: 0 }

    const show = () => {
      track.dataset.visible = 'true'
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(() => {
        delete track.dataset.visible
      }, 1200)
    }

    const stopDrag = () => {
      const pointerId = drag?.pointerId
      drag = null
      delete track.dataset.dragging
      if (pointerId !== undefined && track.hasPointerCapture(pointerId)) {
        track.releasePointerCapture(pointerId)
      }
    }

    const update = () => {
      const viewportHeight = page.clientHeight
      const maxScroll = Math.max(0, scroller.scrollHeight - viewportHeight)
      const bodyOverflow = window.getComputedStyle(document.body).overflowY
      const pageOverflow = window.getComputedStyle(page).overflowY
      const locked = [bodyOverflow, pageOverflow].some((value) => value === 'hidden' || value === 'clip')
      const unavailable = forcedColors.matches || locked || maxScroll < 1

      track.hidden = unavailable
      track.tabIndex = unavailable ? -1 : 0
      if (unavailable) {
        stopDrag()
        if (document.activeElement === track) track.blur()
        return
      }

      const rect = track.getBoundingClientRect()
      const thumbHeight = Math.min(rect.height, Math.max(36, rect.height * viewportHeight / scroller.scrollHeight))
      const position = Math.min(maxScroll, Math.max(0, scroller.scrollTop))
      const thumbTop = (rect.height - thumbHeight) * position / maxScroll
      geometry = { top: rect.top, height: rect.height, thumbHeight, thumbTop, maxScroll }
      thumb.style.height = `${thumbHeight}px`
      thumb.style.transform = `translate3d(0, ${thumbTop}px, 0)`
      track.setAttribute('aria-valuemax', String(Math.round(maxScroll)))
      track.setAttribute('aria-valuenow', String(Math.round(position)))
      track.setAttribute('aria-valuetext', `${Math.round(position / maxScroll * 100)}%`)
    }

    const scheduleUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const onScroll = () => {
      show()
      scheduleUpdate()
    }

    const scrollFromPointer = (clientY) => {
      const travel = geometry.height - geometry.thumbHeight
      if (!drag || travel <= 0) return
      const position = Math.min(travel, Math.max(0, clientY - geometry.top - drag.offset))
      window.scrollTo({ top: position / travel * geometry.maxScroll, behavior: 'instant' })
      show()
      scheduleUpdate()
    }

    const onPointerDown = (event) => {
      if (event.button !== 0 || !event.isPrimary) return
      update()
      if (track.hidden) return
      event.preventDefault()
      track.focus({ preventScroll: true })
      const thumbOffset = event.clientY - geometry.top - geometry.thumbTop
      const withinThumb = thumbOffset >= 0 && thumbOffset <= geometry.thumbHeight
      drag = {
        pointerId: event.pointerId,
        offset: withinThumb ? thumbOffset : geometry.thumbHeight / 2,
      }
      track.dataset.dragging = 'true'
      track.setPointerCapture(event.pointerId)
      scrollFromPointer(event.clientY)
    }

    const onPointerMove = (event) => {
      if (drag?.pointerId === event.pointerId) scrollFromPointer(event.clientY)
    }

    const onPointerEnd = (event) => {
      if (drag?.pointerId !== event.pointerId) return
      stopDrag()
      show()
    }

    const onKeyDown = (event) => {
      update()
      if (track.hidden) return
      const pageStep = page.clientHeight * 0.9
      const positions = {
        ArrowUp: scroller.scrollTop - 40,
        ArrowDown: scroller.scrollTop + 40,
        PageUp: scroller.scrollTop - pageStep,
        PageDown: scroller.scrollTop + pageStep,
        Home: 0,
        End: geometry.maxScroll,
        ' ': scroller.scrollTop + (event.shiftKey ? -pageStep : pageStep),
      }
      if (!(event.key in positions)) return
      event.preventDefault()
      window.scrollTo({ top: positions[event.key], behavior: 'instant' })
      show()
      scheduleUpdate()
    }

    // Observe layout and scroll locking without observing our own thumb updates.
    const resizeObserver = new ResizeObserver(scheduleUpdate)
    resizeObserver.observe(page)
    resizeObserver.observe(document.body)
    const lockObserver = new MutationObserver(scheduleUpdate)
    lockObserver.observe(page, { attributes: true, attributeFilter: ['class', 'style'] })
    lockObserver.observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] })

    page.setAttribute('data-overlay-scrollbar', 'true')
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    forcedColors.addEventListener('change', scheduleUpdate)
    track.addEventListener('pointerdown', onPointerDown)
    track.addEventListener('pointermove', onPointerMove)
    track.addEventListener('pointerup', onPointerEnd)
    track.addEventListener('pointercancel', onPointerEnd)
    track.addEventListener('lostpointercapture', onPointerEnd)
    track.addEventListener('keydown', onKeyDown)
    update()

    return () => {
      stopDrag()
      window.cancelAnimationFrame(frame)
      window.clearTimeout(idleTimer)
      resizeObserver.disconnect()
      lockObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', scheduleUpdate)
      forcedColors.removeEventListener('change', scheduleUpdate)
      track.removeEventListener('pointerdown', onPointerDown)
      track.removeEventListener('pointermove', onPointerMove)
      track.removeEventListener('pointerup', onPointerEnd)
      track.removeEventListener('pointercancel', onPointerEnd)
      track.removeEventListener('lostpointercapture', onPointerEnd)
      track.removeEventListener('keydown', onKeyDown)
      if (previousAttribute === null) page.removeAttribute('data-overlay-scrollbar')
      else page.setAttribute('data-overlay-scrollbar', previousAttribute)
    }
  }, [])

  return (
    <div
      ref={trackRef}
      className="overlay-scrollbar"
      role="scrollbar"
      aria-label={'\u9875\u9762\u6eda\u52a8'}
      aria-controls="root"
      aria-orientation="vertical"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      tabIndex={0}
      hidden
    >
      <span ref={thumbRef} className="overlay-scrollbar-thumb" />
    </div>
  )
}
