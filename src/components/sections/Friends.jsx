import { ArrowUpRight } from 'lucide-react'
import { friendLinks, friendRequestHref } from '../../data/site'
import ExternalLink from '../ExternalLink'
import SectionLabel from '../SectionLabel'
import './Connections.css'

export default function Friends() {
  return (
    <section id="friends" className="horizon-section" aria-labelledby="friends-title">
      <div className="friends-preface">
        <SectionLabel english="Good company">友情链接</SectionLabel>
        <a className="friend-invite" href={friendRequestHref}>申请友链 <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
      <div className="horizon-scene illustrated-section">
        <img className="scene-art horizon-art" src="/art/rooftop-distance.png" alt="屋顶上的人物背影望向远方，城市、电线与大片安静的天空" width="1672" height="941" loading="lazy" draggable={false} />
        <div className="horizon-content">
          <div className="horizon-heading reveal">
            <h2 id="friends-title">一些值得<br /><span>停留的地方。</span></h2>
          </div>
          {friendLinks.map(({ id, name, caption, href, description, domain, arrowSize }) => (
            <ExternalLink key={id} className={`destination destination-${id} reveal`} href={href}>
              <span className="destination-caption">{caption}</span>
              <h3>{name} <ArrowUpRight size={arrowSize} strokeWidth={1.3} aria-hidden="true" /></h3>
              <span className="destination-domain">{description && <>{description}<span aria-hidden="true"> / </span></>}{domain}</span>
            </ExternalLink>
          ))}
        </div>
      </div>
    </section>
  )
}
