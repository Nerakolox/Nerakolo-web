import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { email, emailHref } from '../data/site'
import './Footer.css'

export default function Footer({ onEmailClick }) {
  return (
    <footer className="site-footer">
      <div className="footer-contact reveal">
        <p>很高兴，在这里遇见你。</p>
        <a href={emailHref} onClick={onEmailClick}>打个招呼吧。<ArrowUpRight strokeWidth={1} aria-hidden="true" /></a>
        <a className="footer-email" href={emailHref} onClick={onEmailClick}>{email}</a>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Nerakolo</p>
        <a className="back-top" href="#home">回到顶部 <ArrowUp size={15} /></a>
      </div>
    </footer>
  )
}
