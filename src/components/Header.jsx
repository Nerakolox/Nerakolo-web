import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { email, emailHref, navigation } from '../data/site'
import useHeaderNavigation from '../hooks/useHeaderNavigation'
import useMobileMenu from '../hooks/useMobileMenu'
import './Header.css'

function Wordmark({ onClick }) {
  return (
    <a className="wordmark" href="#home" onClick={onClick} aria-label="Nerakolo 首页">
      <img className="signature" src="/art/signature-en.svg" alt="Nerakolo" width="2788" height="774" draggable={false} />
    </a>
  )
}

function ThemeToggle({ theme, toggleTheme }) {
  const label = theme === 'light' ? '切换深色主题' : '切换浅色主题'
  return (
    <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={label} title={label}>
      <span className="theme-symbols" aria-hidden="true"><Moon className="theme-moon" size={18} /><Sun className="theme-sun" size={18} /></span>
    </button>
  )
}

export default function Header({ theme, toggleTheme }) {
  const { headerRef, activeSection } = useHeaderNavigation()
  const {
    menuRef, menuContentRef, menuToggleRef, menuOpen,
    openMenu, closeMenu, onMenuClosed, onMenuTransitionEnd,
  } = useMobileMenu(headerRef)

  return (
    <header ref={headerRef} className="site-header">
      <div className="header-surface" inert={menuOpen} aria-hidden={menuOpen || undefined}>
        <div className="header-inner">
          <Wordmark />
          <nav className="desktop-nav" aria-label="主导航">
            {navigation.map(({ href, label }) => (
              <a key={href} href={href} aria-current={activeSection === href.slice(1) ? 'location' : undefined}>{label}</a>
            ))}
          </nav>
          <div className="header-actions">
            <a className="header-contact" href={emailHref}>打个招呼 <ArrowUpRight size={16} /></a>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button ref={menuToggleRef} className="icon-button menu-toggle" onClick={openMenu} aria-label="打开导航" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="mobile-navigation"><Menu size={22} /></button>
          </div>
        </div>
      </div>
      <dialog id="mobile-navigation" ref={menuRef} className="mobile-menu" onCancel={(event) => { event.preventDefault(); closeMenu() }} onClose={onMenuClosed} onTransitionEnd={onMenuTransitionEnd} aria-label="网站导航">
        <div className="mobile-menu-top header-inner">
          <Wordmark onClick={() => closeMenu(true)} />
          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button className="icon-button menu-close" onClick={() => closeMenu()} aria-label="关闭导航"><X size={22} /></button>
          </div>
        </div>
        <div ref={menuContentRef} className="mobile-menu-content">
          <nav aria-label="移动导航">
            {navigation.map(({ href, label, english }, index) => (
              <a key={href} href={href} onClick={() => closeMenu(true)} aria-current={activeSection === href.slice(1) ? 'location' : undefined} style={{ '--menu-order': index }}>
                <span>{label}<small>{english}</small></span><ArrowUpRight size={28} strokeWidth={1.5} />
              </a>
            ))}
          </nav>
          <a className="menu-email" href={emailHref} onClick={() => closeMenu(true)}>{email} <ArrowUpRight size={18} /></a>
        </div>
      </dialog>
    </header>
  )
}
