import { ArrowUpRight } from 'lucide-react'
import { socialLinks } from '../../data/site'
import EmailContact from '../EmailContact'
import ExternalLink from '../ExternalLink'
import './Connections.css'

export default function Elsewhere() {
  return (
    <section id="links" className="desk-section illustrated-section" aria-labelledby="links-title">
      <img className="scene-art desk-art" src="/art/letter-desk.png" alt="灰调书桌线稿，右侧放着耳机和信笺，一只手停在纸面上" width="1672" height="941" loading="lazy" draggable={false} />
      <div className="desk-content">
        <div className="desk-copy">
          <div className="desk-heading reveal">
            <p className="scene-label">链接</p>
            <h2 id="links-title" lang="en">Elsewhere.</h2>
            <p className="desk-subtitle">在别处，也能找到我。</p>
          </div>
          <div className="desk-platforms">
            {socialLinks.map(({ id, name, caption, href, address, arrowSize }) => (
              <ExternalLink key={id} className={`platform-link platform-${id} reveal`} href={href}>
                <span className="platform-caption">{caption}</span>
                <span className="platform-name">{name} <ArrowUpRight size={arrowSize} strokeWidth={1.3} aria-hidden="true" /></span>
                <span className="platform-address">{address}</span>
              </ExternalLink>
            ))}
          </div>
          <EmailContact />
        </div>
      </div>
    </section>
  )
}
