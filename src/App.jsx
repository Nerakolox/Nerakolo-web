import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Copy, Menu, Moon, Sun, X } from 'lucide-react'
import OverlayScrollbar from './components/OverlayScrollbar'
import './App.css'
import './Connections.css'

const navigation = [
  { href: '#about', label: '关于', english: 'About' },
  { href: '#links', label: '链接', english: 'Elsewhere' },
  { href: '#friends', label: '友链', english: 'Friends' },
]

function preventArtworkDrag(event) {
  const target = event.target
  if (target instanceof Element && (target.closest('img, svg') || target.closest('a')?.querySelector('img'))) {
    event.preventDefault()
  }
}

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('nerakolo-theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch { /* System preference remains available without storage. */ }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = (event) => {
      try {
        if (localStorage.getItem('nerakolo-theme')) return
      } catch { /* Continue to follow the system when storage is unavailable. */ }
      setTheme(event.matches ? 'dark' : 'light')
    }
    preference.addEventListener('change', syncTheme)
    return () => preference.removeEventListener('change', syncTheme)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    try { localStorage.setItem('nerakolo-theme', next) } catch { /* This visit still uses the selected theme. */ }
  }

  return [theme, toggleTheme]
}

function ThemeToggle({ theme, toggleTheme }) {
  const label = theme === 'light' ? '切换深色主题' : '切换浅色主题'
  return (
    <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={label} title={label}>
      <span className="theme-symbols" aria-hidden="true"><Moon className="theme-moon" size={18} /><Sun className="theme-sun" size={18} /></span>
    </button>
  )
}

function Header({ theme, toggleTheme }) {
  const headerRef = useRef(null)
  const menuRef = useRef(null)
  const menuContentRef = useRef(null)
  const menuToggleRef = useRef(null)
  const menuTransitionFrameRef = useRef(0)
  const menuCloseTimerRef = useRef(0)
  const focusFrameRef = useRef(0)
  const scrollLockRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const header = headerRef.current
    header.dataset.compact = String(window.scrollY > 65)
    const observer = new IntersectionObserver(([entry]) => {
      header.dataset.compact = String(!entry.isIntersecting)
    }, { rootMargin: '64px 0px 0px' })
    observer.observe(document.getElementById('home'))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let observer
    const observeSections = () => {
      observer?.disconnect()
      const readingLine = Math.round(window.innerHeight * .3)
      observer = new IntersectionObserver((entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) setActiveSection(target.id || 'home')
        })
      }, { rootMargin: `-${readingLine}px 0px -${window.innerHeight - readingLine - 1}px 0px` })
      document.querySelectorAll('.hero, #about, #links, #friends').forEach((section) => observer.observe(section))
    }
    observeSections()
    window.addEventListener('resize', observeSections)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', observeSections)
    }
  }, [])

  const clearMenuTransition = () => {
    window.cancelAnimationFrame(menuTransitionFrameRef.current)
    window.clearTimeout(menuCloseTimerRef.current)
    menuTransitionFrameRef.current = 0
    menuCloseTimerRef.current = 0
  }

  const releaseMenu = () => {
    clearMenuTransition()
    if (scrollLockRef.current !== null) {
      document.body.style.overflow = scrollLockRef.current
      scrollLockRef.current = null
    }
    headerRef.current?.style.removeProperty('--nav-height')
    menuRef.current?.removeAttribute('data-menu-state')
  }

  const finishClose = () => {
    menuRef.current?.close()
    releaseMenu()
    setMenuOpen(false)
  }

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
    const header = headerRef.current
    const desktop = window.matchMedia('(min-width: 768px)')
    const onResize = () => {
      if (desktop.matches && dialog.open) {
        dialog.close()
        clearMenuTransition()
        if (scrollLockRef.current !== null) {
          document.body.style.overflow = scrollLockRef.current
          scrollLockRef.current = null
        }
        header.style.removeProperty('--nav-height')
        dialog.removeAttribute('data-menu-state')
        setMenuOpen(false)
      }
    }
    desktop.addEventListener('change', onResize)
    return () => {
      desktop.removeEventListener('change', onResize)
      clearMenuTransition()
      window.cancelAnimationFrame(focusFrameRef.current)
      if (scrollLockRef.current !== null) document.body.style.overflow = scrollLockRef.current
    }
  }, [])

  return (
    <header ref={headerRef} className="site-header">
      <div className="header-surface" inert={menuOpen} aria-hidden={menuOpen || undefined}>
        <div className="header-inner">
          <a className="wordmark" href="#home" aria-label="Nerakolo 首页"><img className="signature" src="/art/signature-en.svg" alt="Nerakolo" width="2788" height="774" draggable={false} /></a>
          <nav className="desktop-nav" aria-label="主导航">
            {navigation.map(({ href, label }) => <a key={href} href={href} aria-current={activeSection === href.slice(1) ? 'location' : undefined}>{label}</a>)}
          </nav>
          <div className="header-actions">
            <a className="header-contact" href="mailto:nerakolo@outlook.com">打个招呼 <ArrowUpRight size={16} /></a>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button ref={menuToggleRef} className="icon-button menu-toggle" onClick={openMenu} aria-label="打开导航" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="mobile-navigation"><Menu size={22} /></button>
          </div>
        </div>
      </div>
      <dialog id="mobile-navigation" ref={menuRef} className="mobile-menu" onCancel={(event) => { event.preventDefault(); closeMenu() }} onClose={onMenuClosed} onTransitionEnd={onMenuTransitionEnd} aria-label="网站导航">
        <div className="mobile-menu-top header-inner">
          <a className="wordmark" href="#home" onClick={() => closeMenu(true)} aria-label="Nerakolo 首页"><img className="signature" src="/art/signature-en.svg" alt="Nerakolo" width="2788" height="774" draggable={false} /></a>
          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button className="icon-button menu-close" onClick={() => closeMenu()} aria-label="关闭导航"><X size={22} /></button>
          </div>
        </div>
        <div ref={menuContentRef} className="mobile-menu-content">
          <nav aria-label="移动导航">
            {navigation.map(({ href, label, english }, index) => <a key={href} href={href} onClick={() => closeMenu(true)} aria-current={activeSection === href.slice(1) ? 'location' : undefined} style={{ '--menu-order': index }}><span>{label}<small>{english}</small></span><ArrowUpRight size={28} strokeWidth={1.5} /></a>)}
          </nav>
          <a className="menu-email" href="mailto:nerakolo@outlook.com" onClick={() => closeMenu(true)}>nerakolo@outlook.com <ArrowUpRight size={18} /></a>
        </div>
      </dialog>
    </header>
  )
}

function SectionLabel({ children, english }) {
  return <p className="section-label"><span>{children}</span><span>{english}</span></p>
}

function About() {
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
            <div><h3>在代码里</h3><ul><li>Frontend</li><li>Backend</li><li>Minecraft Server</li></ul></div>
            <div><h3>在生活里</h3><ul><li>Vocaloid</li><li>Anime</li><li>Music</li></ul></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Elsewhere() {
  const [copyState, setCopyState] = useState('idle')
  const resetRef = useRef(null)

  useEffect(() => () => window.clearTimeout(resetRef.current), [])

  const copyEmail = async () => {
    window.clearTimeout(resetRef.current)
    try {
      await navigator.clipboard.writeText('nerakolo@outlook.com')
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
    resetRef.current = window.setTimeout(() => setCopyState('idle'), 3000)
  }

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
            <a className="platform-link platform-github reveal" href="https://github.com/Nerakolox" target="_blank" rel="noopener noreferrer">
              <span className="platform-caption">代码与创作</span>
              <span className="platform-name">GitHub <ArrowUpRight size={28} strokeWidth={1.3} aria-hidden="true" /></span>
              <span className="platform-address">github.com/Nerakolox</span>
            </a>
            <a className="platform-link platform-gitee reveal" href="https://gitee.com/Nerakolo" target="_blank" rel="noopener noreferrer">
              <span className="platform-caption">另一处代码仓库</span>
              <span className="platform-name">Gitee <ArrowUpRight size={25} strokeWidth={1.3} aria-hidden="true" /></span>
              <span className="platform-address">gitee.com/Nerakolo</span>
            </a>
          </div>
          <div className="desk-mail reveal">
            <p>或者，写封信给我。</p>
            <div className="desk-mail-address">
              <a href="mailto:nerakolo@outlook.com">nerakolo@outlook.com <ArrowUpRight size={19} strokeWidth={1.5} aria-hidden="true" /></a>
              <button className="icon-button desk-copy-button" onClick={copyEmail} aria-label={copyState === 'copied' ? '邮箱已复制' : '复制邮箱地址'} title={copyState === 'copied' ? '已复制' : '复制邮箱'}>{copyState === 'copied' ? <Check size={17} /> : <Copy size={17} />}</button>
            </div>
            <p className="desk-copy-status" role="status">{copyState === 'copied' ? '邮箱地址已复制。' : copyState === 'error' ? '复制未成功，请选择邮箱地址手动复制。' : ''}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Friends() {
  return (
    <section id="friends" className="horizon-section" aria-labelledby="friends-title">
      <div className="friends-preface">
        <SectionLabel english="Good company">友情链接</SectionLabel>
        <a className="friend-invite" href="mailto:nerakolo@outlook.com?subject=%E5%8F%8B%E9%93%BE%E7%94%B3%E8%AF%B7">申请友链 <ArrowUpRight size={17} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
      <div className="horizon-scene illustrated-section">
        <img className="scene-art horizon-art" src="/art/rooftop-distance.png" alt="屋顶上的人物背影望向远方，城市、电线与大片安静的天空" width="1672" height="941" loading="lazy" draggable={false} />
        <div className="horizon-content">
          <div className="horizon-heading reveal">
            <h2 id="friends-title">一些值得<br /><span>停留的地方。</span></h2>
          </div>
          <a className="destination destination-tools reveal" href="https://tools.nerakolo.cc/" target="_blank" rel="noopener noreferrer">
            <span className="destination-caption">我的工具集合</span>
            <h3>tools. <ArrowUpRight size={29} strokeWidth={1.3} aria-hidden="true" /></h3>
            <span className="destination-domain">tools.nerakolo.cc</span>
          </a>
          <a className="destination destination-club reveal" href="https://axogc.net/" target="_blank" rel="noopener noreferrer">
            <span className="destination-caption">朋友们的游戏俱乐部</span>
            <h3>Axolotland <ArrowUpRight size={27} strokeWidth={1.3} aria-hidden="true" /></h3>
            <span className="destination-domain">Gaming club<span aria-hidden="true"> / </span>www.axogc.net</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-contact reveal"><p>很高兴，在这里遇见你。</p><a href="mailto:nerakolo@outlook.com">打个招呼吧。<ArrowUpRight strokeWidth={1} aria-hidden="true" /></a><a className="footer-email" href="mailto:nerakolo@outlook.com">nerakolo@outlook.com</a></div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Nerakolo</p><a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">蜀ICP备2024095824号-2</a><a className="back-top" href="#home">回到顶部 <ArrowUp size={15} /></a></div>
    </footer>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()

  useEffect(() => {
    const initialHash = window.location.hash
    if (!navigation.some(({ href }) => href === initialHash)) return
    let cancelled = false
    // React mounts anchor targets after the browser's first fragment lookup.
    document.fonts.ready.then(() => {
      if (cancelled || window.location.hash !== initialHash || window.scrollY !== 0) return
      document.getElementById(initialHash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    document.addEventListener('dragstart', preventArtworkDrag, true)
    const elements = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12 })
    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.removeEventListener('dragstart', preventArtworkDrag, true)
    }
  }, [])

  return (
    <>
      <a href="#about" className="skip-link">跳到主要内容</a>
      <div id="home" aria-hidden="true" />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-art" src="/art/portrait.png" alt="灰色纸面上的长发人物线稿，安静地望向左侧" width="1254" height="1254" fetchPriority="high" draggable={false} />
          <div className="hero-heading"><p className="hero-kicker">你好，欢迎来到我的世界。</p><h1 id="hero-title"><img src="/art/signature-en.svg" alt="Nerakolo" width="2788" height="774" draggable={false} /></h1></div>
          <div className="hero-intro"><p className="hero-statement">栖息与地球某处。</p><p className="hero-subtitle">仿佛无处不在，<br />却又无影无踪。</p><a className="text-link" href="#about">关于我 <ArrowDown size={15} /></a></div>
        </section>
        <div className="direction-band" aria-label="核心方向"><span>Code</span><span>Vibe Coding</span><span>AI Applications</span></div>
        <About />
        <Elsewhere />
        <Friends />
      </main>
      <Footer />
      <OverlayScrollbar />
    </>
  )
}
