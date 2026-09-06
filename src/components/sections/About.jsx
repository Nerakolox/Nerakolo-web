import { interests } from '../../data/site'
import SectionLabel from '../SectionLabel'
import './About.css'

export default function About() {
  return (
    <section id="about" className="about-section page-section" aria-labelledby="about-title">
      <div className="about-header reveal">
        <SectionLabel english="A little about me">关于我</SectionLabel>
      </div>
      <div className="about-layout">
        <div className="about-intro reveal">
          <p className="greeting">你好，我是 Nerakolo。</p>
          <h2 id="about-title"><span>写代码，听音乐。</span><span>把热爱做成</span><span className="about-emphasis">美好的事物。</span></h2>
          <img className="signature personal-signature" src="/art/signature-cn.svg" alt="中文手写签名" width="1760" height="774" loading="lazy" draggable={false} />
        </div>
        <div className="about-details">
          <div className="about-copy reveal">
            <p>平时写代码、做小工具，也折腾 Minecraft 服务器。对 Vibe Coding 和 AI 应用感兴趣，有想法就动手试试。</p>
            <p>喜欢听 Vocaloid、看动画。欢迎来聊技术，也欢迎推荐好听的歌。</p>
          </div>
          <div className="interests reveal" aria-label="兴趣与方向">
            {interests.map(({ title, items }) => (
              <div key={title}>
                <h3>{title}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
