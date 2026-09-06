import { useEffect, useRef, useState } from 'react'
import { navigation } from '../data/site'

export default function useHeaderNavigation() {
  const headerRef = useRef(null)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const header = headerRef.current
    header.dataset.compact = String(window.scrollY > 65)
    const observer = new IntersectionObserver(([entry]) => {
      header.dataset.compact = String(!entry.isIntersecting)
    }, { rootMargin: '64px 0px 0px' })
    observer.observe(document.getElementById('home'))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let observer
    const observeSections = () => {
      observer?.disconnect()
      const readingLine = Math.round(window.innerHeight * .3)
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) setActiveSection(target.id || 'home')
        })
      }, { rootMargin: `-${readingLine}px 0px -${window.innerHeight - readingLine - 1}px 0px` })
      const selectors = ['.hero', ...navigation.map(({ href }) => href)]
      document.querySelectorAll(selectors.join(', ')).forEach((section) => observer.observe(section))
    }
    observeSections()
    window.addEventListener('resize', observeSections)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeSections)
    }
  }, [])

  return { headerRef, activeSection }
}
