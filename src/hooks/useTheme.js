import { useEffect, useState } from 'react'

const STORAGE_KEY = 'nerakolo-theme'

export default function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark') return saved
    } catch { /* System preference remains available without storage. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = (event) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch { /* Continue to follow the system when storage is unavailable. */ }
      setTheme(event.matches ? 'dark' : 'light')
    }
    preference.addEventListener('change', syncTheme)
    return () => preference.removeEventListener('change', syncTheme)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem(STORAGE_KEY, next) } catch { /* This visit still uses the selected theme. */ }
  }

  return [theme, toggleTheme]
}
