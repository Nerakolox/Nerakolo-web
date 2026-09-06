import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, CircleAlert, X } from 'lucide-react'
import './FollowPopover.css'

function PopoverContent({ toast, onDismiss, closing }) {
  const popoverRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const duration = toast.duration ?? (toast.type === 'error' ? 0 : 7000)

  useLayoutEffect(() => {
    const popover = popoverRef.current
    const viewport = window.visualViewport
    const place = () => {
      const width = viewport?.width ?? window.innerWidth
      const height = viewport?.height ?? window.innerHeight
      const viewportLeft = viewport?.offsetLeft ?? 0
      const viewportTop = viewport?.offsetTop ?? 0
      const margin = 16
      popover.style.width = `${Math.min(440, width - margin * 2)}px`
      popover.style.maxHeight = `${height - margin * 2}px`
      const bounds = popover.getBoundingClientRect()
      const safeBottom = parseFloat(getComputedStyle(popover).getPropertyValue('--popover-safe-bottom')) || 0
      let x = viewportLeft + (width - bounds.width) / 2
      let y = viewportTop + height - bounds.height - Math.max(24, safeBottom)

      if (width > 600 && toast.position) {
        x = toast.position.x - bounds.width / 2
        y = toast.position.y + margin
        if (y + bounds.height > viewportTop + height - margin) y = toast.position.y - bounds.height - margin
      }
      popover.style.left = `${Math.max(viewportLeft + margin, Math.min(x, viewportLeft + width - bounds.width - margin))}px`
      popover.style.top = `${Math.max(viewportTop + margin, Math.min(y, viewportTop + height - bounds.height - margin))}px`
      popover.style.visibility = 'visible'
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(popover)
    window.addEventListener('resize', place)
    viewport?.addEventListener('resize', place)
    viewport?.addEventListener('scroll', place)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', place)
      viewport?.removeEventListener('resize', place)
      viewport?.removeEventListener('scroll', place)
    }
  }, [toast.position])

  useEffect(() => {
    if (duration <= 0 || hovered || focused) return
    let timer
    const schedule = () => {
      window.clearTimeout(timer)
      if (!document.hidden) timer = window.setTimeout(onDismiss, duration)
    }
    schedule()
    document.addEventListener('visibilitychange', schedule)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', schedule)
    }
  }, [duration, onDismiss, hovered, focused])

  return (
    <div ref={popoverRef} className={`follow-popover${closing ? ' is-closing' : ''}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocus={() => setFocused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      {toast.type === 'error' ? <CircleAlert size={18} strokeWidth={1.4} aria-hidden="true" /> : <Check size={18} strokeWidth={1.4} aria-hidden="true" />}
      <p className="follow-popover-copy">{toast.message}{toast.detail && <span className="follow-popover-address">{toast.detail}</span>}</p>
      <button type="button" className="icon-button" onClick={onDismiss} aria-label="关闭提示" title="关闭提示"><X size={16} strokeWidth={1.4} aria-hidden="true" /></button>
    </div>
  )
}

export default function FollowPopover({ toast, onDismiss }) {
  const [displayedToast, setDisplayedToast] = useState(toast)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    if (toast) {
      // Keep the previous node available for the exit transition when the parent clears toast.
      // oxlint-disable-next-line react(set-state-in-effect)
      setDisplayedToast(toast)
      setClosing(false)
      return undefined
    }
    if (!displayedToast) return undefined
    setClosing(true)
    const timer = window.setTimeout(() => {
      setDisplayedToast(null)
      setClosing(false)
    }, 140)
    return () => window.clearTimeout(timer)
  }, [toast, displayedToast])

  return createPortal(
    <div className="follow-popover-region" role="status" aria-live="polite" aria-atomic="true">
      {displayedToast && <PopoverContent key={displayedToast.id} toast={displayedToast} onDismiss={onDismiss} closing={closing} />}
    </div>,
    document.body,
  )
}
