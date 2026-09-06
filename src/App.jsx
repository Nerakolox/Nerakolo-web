import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import OverlayScrollbar from './components/OverlayScrollbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Elsewhere from './components/sections/Elsewhere'
import Friends from './components/sections/Friends'
import usePageEffects from './hooks/usePageEffects'
import useTheme from './hooks/useTheme'
import useEmailActions from './hooks/useEmailActions'
import FollowPopover from './components/FollowPopover'

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const { toast, copied, onEmailClick, onCopyEmail, dismissToast } = useEmailActions()
  usePageEffects()

  return (
    <>
      <a href="#about" className="skip-link">跳到主要内容</a>
      <div id="home" aria-hidden="true" />
      <Header theme={theme} toggleTheme={toggleTheme} onEmailClick={onEmailClick} />
      <main>
        <Hero />
        <About />
        <Elsewhere onEmailClick={onEmailClick} onCopyEmail={onCopyEmail} copied={copied} />
        <Friends onEmailClick={onEmailClick} />
      </main>
      <Footer onEmailClick={onEmailClick} />
      <OverlayScrollbar />
      <FollowPopover toast={toast} onDismiss={dismissToast} />
    </>
  )
}
