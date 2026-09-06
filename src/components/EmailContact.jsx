import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { email, emailHref } from '../data/site'

export default function EmailContact({ onEmailClick, onCopyEmail, copied }) {
  return (
    <div className="desk-mail reveal">
      <p>或者，写封信给我。</p>
      <div className="desk-mail-address">
        <a href={emailHref} onClick={onEmailClick}>{email} <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></a>
        <button type="button" className="icon-button desk-copy-button" onClick={onCopyEmail} aria-label={copied ? '邮箱已复制' : '复制邮箱地址'} title={copied ? '已复制' : '复制邮箱'}>{copied ? <Check size={17} /> : <Copy size={17} />}</button>
      </div>
    </div>
  )
}
