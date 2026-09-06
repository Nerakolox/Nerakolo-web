import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { email, emailHref } from '../data/site'

export default function EmailContact() {
  const [copyState, setCopyState] = useState('idle')
  const resetRef = useRef(null)

  useEffect(() => () => window.clearTimeout(resetRef.current), [])

  const copyEmail = async () => {
    window.clearTimeout(resetRef.current)
    try {
      await navigator.clipboard.writeText(email)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    resetRef.current = window.setTimeout(() => setCopyState('idle'), 3000)
  }

  return (
    <div className="desk-mail reveal">
      <p>或者，写封信给我。</p>
      <div className="desk-mail-address">
        <a href={emailHref}>{email} <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></a>
        <button className="icon-button desk-copy-button" onClick={copyEmail} aria-label={copyState === 'copied' ? '邮箱已复制' : '复制邮箱地址'} title={copyState === 'copied' ? '已复制' : '复制邮箱'}>{copyState === 'copied' ? <Check size={17} /> : <Copy size={17} />}</button>
      </div>
      <p className="desk-copy-status" role="status">{copyState === 'copied' ? '邮箱地址已复制。' : copyState === 'error' ? '复制未成功，请选择邮箱地址手动复制。' : ''}</p>
    </div>
  )
}
