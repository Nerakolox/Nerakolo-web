import { ArrowDown } from 'lucide-react'
import { directions } from '../../data/site'
import './Hero.css'

export default function Hero() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-art" src="/art/portrait.png" alt="灰色纸面上的长发人物线稿，安静地望向左侧" width="1254" height="1254" fetchPriority="high" draggable={false} />
        <div className="hero-heading">
          <p className="hero-kicker">你好，欢迎来到我的世界。</p>
          <h1 id="hero-title"><img src="/art/signature-en.svg" alt="Nerakolo" width="2788" height="774" draggable={false} /></h1>
        </div>
        <div className="hero-intro">
          <p className="hero-statement">栖息与地球某处。</p>
          <p className="hero-subtitle">仿佛无处不在，<br />却又无影无踪。</p>
          <a className="text-link" href="#about">关于我 <ArrowDown size={15} /></a>
        </div>
      </section>
      <div className="direction-band" aria-label="核心方向">
        {directions.map((direction) => <span key={direction}>{direction}</span>)}
      </div>
    </>
  )
}
