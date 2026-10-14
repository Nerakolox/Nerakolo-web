import './App.css'
import { lazy, Suspense } from 'react'
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

const HalloweenApp = lazy(() => import('./hween/HalloweenApp'))

// The server answers every unknown path with this bundle, so the first path segment picks the page.
function isHalloweenPath() {
  return /^\/26hween(\/|$)/.test(window.location.pathname)
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const { toast, copied, onEmailClick, onCopyEmail, dismissToast } = useEmailActions()
  usePageEffects()

  return (
    <>
      {isHalloweenPath() ? (
        <Suspense fallback={null}>
          <HalloweenApp />
        </Suspense>
      ) : (
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
      )}
    </>
  )
}
