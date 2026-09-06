import { useCallback, useEffect, useRef, useState } from 'react'
import { email } from '../data/site'
import copyText from '../utils/copyText'

export default function useEmailActions() {
  const [toast, setToast] = useState(null)
  const requestRef = useRef(0)

  useEffect(() => () => { requestRef.current += 1 }, [])

  const dismissToast = useCallback(() => {
    requestRef.current += 1
    setToast(null)
  }, [])

  const copyEmail = async (openingMail = false, position = null) => {
    const id = ++requestRef.current
    setToast(null)
    try {
      await copyText(email)
      if (id !== requestRef.current) return
      setToast({ id, type: 'success', message: openingMail ? '邮箱已复制，若未打开邮件应用，可粘贴使用。' : '邮箱地址已复制。', position })
    } catch {
      if (id !== requestRef.current) return
      setToast({ id, type: 'error', message: '未能自动复制，请手动复制邮箱地址：', detail: email, position })
    }
  }

  const onEmailClick = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    // Start copying within the user gesture; keep native mailto navigation intact.
    void copyEmail(true, event.detail === 0 ? null : { x: event.clientX, y: event.clientY })
  }

  return {
    toast,
    copied: toast?.type === 'success',
    onEmailClick,
    onCopyEmail: (event) => { void copyEmail(false, event.detail === 0 ? null : { x: event.clientX, y: event.clientY }) },
    dismissToast,
  }
}
