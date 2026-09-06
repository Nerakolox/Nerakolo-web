import { useEffect } from 'react'
import { navigation } from '../data/site'

function preventArtworkDrag(event) {
  const target = event.target
  if (target instanceof Element && (target.closest('img, svg') || target.closest('a')?.querySelector('img'))) {
    event.preventDefault()
  }
}

export default function usePageEffects() {
  useEffect(() => {
    const initialHash = window.location.hash
    if (!navigation.some(({ href }) => href === initialHash)) return
    let cancelled = false
    // React mounts anchor targets after the browser's first fragment lookup.
    document.fonts.ready.then(() => {
      if (cancelled || window.location.hash !== initialHash || window.scrollY !== 0) return
      document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    document.addEventListener('dragstart', preventArtworkDrag, true)
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.removeEventListener('dragstart', preventArtworkDrag, true)
    }
  }, [])
}
