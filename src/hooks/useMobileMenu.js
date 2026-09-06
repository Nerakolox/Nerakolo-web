import { useCallback, useEffect, useRef, useState } from 'react'

export default function useMobileMenu(headerRef) {
  const menuRef = useRef(null)
  const menuContentRef = useRef(null)
  const menuToggleRef = useRef(null)
  const menuTransitionFrameRef = useRef(0)
  const menuCloseTimerRef = useRef(0)
  const focusFrameRef = useRef(0)
  const scrollLockRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const clearMenuTransition = useCallback(() => {
    window.cancelAnimationFrame(menuTransitionFrameRef.current)
    window.clearTimeout(menuCloseTimerRef.current)
    menuTransitionFrameRef.current = 0
    menuCloseTimerRef.current = 0
  }, [])

  const releaseMenu = useCallback(() => {
    clearMenuTransition()
    if (scrollLockRef.current !== null) {
      document.body.style.overflow = scrollLockRef.current
      scrollLockRef.current = null
    }
    headerRef.current?.style.removeProperty('--nav-height')
    menuRef.current?.removeAttribute('data-menu-state')
  }, [clearMenuTransition, headerRef])

  const finishClose = useCallback(() => {
    menuRef.current?.close()
    releaseMenu()
    setMenuOpen(false)
  }, [releaseMenu])

  const onMenuClosed = () => {
    // A queued close event can arrive after the same dialog has reopened.
    if (menuRef.current?.open) return
    releaseMenu()
    setMenuOpen(false)
    window.cancelAnimationFrame(focusFrameRef.current)
    focusFrameRef.current = window.requestAnimationFrame(() => {
      if (!menuRef.current?.open) menuToggleRef.current?.focus({ preventScroll: true })
    })
  }

  const closeMenu = (immediate = false) => {
    const dialog = menuRef.current
    if (!dialog?.open) return
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose()
      return
    }
    if (dialog.dataset.menuState === 'closing') return
    window.cancelAnimationFrame(menuTransitionFrameRef.current)
    dialog.dataset.menuState = 'closing'
    menuCloseTimerRef.current = window.setTimeout(() => {
      if (dialog.open && dialog.dataset.menuState === 'closing') finishClose()
    }, 340)
  }

  const openMenu = () => {
    const dialog = menuRef.current
    if (dialog.open) return
    window.cancelAnimationFrame(focusFrameRef.current)
    // Hold the shared top bar geometry even if opened during its compact transition.
    const height = headerRef.current.querySelector('.header-inner').getBoundingClientRect().height
    headerRef.current.style.setProperty('--nav-height', `${height}px`)
    scrollLockRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    dialog.dataset.menuState = 'opening'
    setMenuOpen(true)
    dialog.querySelector('.menu-close').focus({ preventScroll: true })
    menuTransitionFrameRef.current = window.requestAnimationFrame(() => {
      if (dialog.open && dialog.dataset.menuState === 'opening') dialog.dataset.menuState = 'open'
    })
  }

  const onMenuTransitionEnd = (event) => {
    if (event.target !== menuContentRef.current || event.propertyName !== 'opacity') return
    if (menuRef.current?.dataset.menuState === 'closing') finishClose()
  }

  useEffect(() => {
    const dialog = menuRef.current
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => {
      if (desktop.matches && dialog.open) finishClose()
    }
    desktop.addEventListener('change', onResize)
    return () => {
      desktop.removeEventListener('change', onResize)
      releaseMenu()
      window.cancelAnimationFrame(focusFrameRef.current)
    }
  }, [finishClose, releaseMenu])

  return {
    menuRef,
    menuContentRef,
    menuToggleRef,
    menuOpen,
    openMenu,
    closeMenu,
    onMenuClosed,
    onMenuTransitionEnd,
  }
}
