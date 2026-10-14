import { useEffect, useRef, useState } from 'react'
import './hween.css'
import {
  CODE_LENGTH, formatDate, isCodeComplete, normalizeCode, readCodeFromLocation, toParagraphs,
} from './letter'
import useLetter from './useLetter'
import useTheme from '../hooks/useTheme'

// rest (card in the envelope) → turn (flips over, still card-sized) → read (grows to the letter)
// Matches the transform transition of [data-phase='turn'] in hween.css.
const FLIP_MS = 560
const READ_WIDTH = 920
const CARD_RATIO = 3 / 2
const HINT_DELAY_MS = 3200

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function CodeForm({ initialValue = '', onSubmit }) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef(null)

  // Keeping the caret at the end makes the six cells read left to right after any edit.
  useEffect(() => {
    const input = inputRef.current
    if (input) input.setSelectionRange(input.value.length, input.value.length)
  }, [value])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (isCodeComplete(value)) onSubmit(value)
  }

  return (
    <form className="hween-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="hween-form-fieldset">
        <legend>输入明信片背面的 6 位编号</legend>
        <div className="hween-code">
          <input
            ref={inputRef}
            id="hween-code"
            className="hween-code-input"
            name="code"
            value={value}
            onChange={(event) => setValue(normalizeCode(event.target.value))}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            inputMode="latin"
            aria-describedby="hween-code-hint"
          />
          <div className="hween-code-cells" aria-hidden="true">
            {Array.from({ length: CODE_LENGTH }, (_, index) => (
              <span
                key={index}
                className="hween-code-cell"
                data-filled={index < value.length || undefined}
                data-active={index === Math.min(value.length, CODE_LENGTH - 1) || undefined}
              >
                {value[index] ?? ''}
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="hween-submit" disabled={!isCodeComplete(value)}>拆开</button>
      </fieldset>
    </form>
  )
}

function LetterFace({ letter }) {
  return (
    <>
      <header className="hween-letter-head">
        <p className="hween-letter-kicker"><span>Letter</span><span>No. 01</span></p>
        {letter.to && <h2 className="hween-letter-to">{letter.to}</h2>}
      </header>
      <div className="hween-letter-body">
        {toParagraphs(letter.body).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
      <footer className="hween-letter-foot">
        {letter.date && <p className="hween-letter-date">{formatDate(letter.date)}</p>}
        <img
          className="hween-letter-signature"
          src="/art/signature-en.svg"
          alt="Nerakolo 签名"
          width="2788"
          height="774"
          draggable={false}
        />
      </footer>
    </>
  )
}

// The face has a 1px border on each side, and a short letter still gets a full postcard.
function readingHeight(natural, width) {
  return Math.max(Math.ceil(natural) + 2, Math.round(width / CARD_RATIO))
}

function Postcard({ letter }) {
  const [phase, setPhase] = useState('rest')
  const [height, setHeight] = useState(null)
  const [hovering, setHovering] = useState(false)
  const [idle, setIdle] = useState(false)

  const cardRef = useRef(null)
  const letterRef = useRef(null)
  const timerRef = useRef(0)

  const resting = phase === 'rest'

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  // The hint only appears once the card has sat untouched for a while.
  useEffect(() => {
    if (!resting || hovering) return
    const timer = window.setTimeout(() => setIdle(true), HINT_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [resting, hovering])

  // The reading height follows the letter, so a resize re-measures it instead of clipping.
  useEffect(() => {
    if (phase !== 'read') return
    const remeasure = () => {
      const content = letterRef.current
      const card = cardRef.current
      if (content && card) setHeight(readingHeight(content.offsetHeight, card.offsetWidth))
    }
    window.addEventListener('resize', remeasure)
    return () => window.removeEventListener('resize', remeasure)
  }, [phase])

  const setTilt = (x, y) => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--px', x.toFixed(3))
    card.style.setProperty('--py', y.toFixed(3))
  }

  const handlePointerEnter = (event) => {
    if (event.pointerType !== 'mouse') return
    setHovering(true)
    setIdle(false)
  }

  const handlePointerMove = (event) => {
    if (!resting || event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const rect = cardRef.current.getBoundingClientRect()
    setTilt((event.clientX - rect.left) / rect.width - 0.5, (event.clientY - rect.top) / rect.height - 0.5)
  }

  const handlePointerLeave = () => {
    setHovering(false)
    setIdle(false)
    setTilt(0, 0)
  }

  // One flip, then one expand: the card turns over at card size, then grows into the letter.
  const reveal = () => {
    const card = cardRef.current
    const content = letterRef.current
    if (!resting || !card || !content) return

    setTilt(0, 0)
    setIdle(false)

    // Measure the letter at the width it is about to have, so the grow lands on the right height.
    const target = Math.min(READ_WIDTH, window.innerWidth - 32)
    content.style.right = 'auto'
    content.style.width = `${target - 2}px`
    const natural = content.offsetHeight
    content.style.right = ''
    content.style.width = ''

    // Pin the current height in px first, so the later change to the reading height can animate.
    setHeight(card.offsetHeight)
    setPhase('turn')
    timerRef.current = window.setTimeout(
      () => {
        setHeight(readingHeight(natural, target))
        setPhase('read')
      },
      prefersReducedMotion() ? 0 : FLIP_MS,
    )
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      reveal()
    }
  }

  return (
    <div className="hween-postcard" data-phase={phase}>
      <div
        className="hween-card"
        ref={cardRef}
        style={height ? { height: `${height}px` } : undefined}
        role={resting ? 'button' : undefined}
        tabIndex={resting ? 0 : undefined}
        aria-label={resting ? '从信封里取出明信片，查看这封信' : undefined}
        onClick={reveal}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <span className="hween-card-face hween-card-front" aria-hidden={resting ? undefined : 'true'}>
          <img className="hween-card-art" src="/art/26hween/main.png" alt="万圣节明信片" width="1536" height="1024" fetchPriority="high" draggable={false} />
          <span className="hween-card-grain" aria-hidden="true" />
          <span className="hween-card-hint" aria-hidden="true" data-shown={(idle && resting && !hovering) || undefined}>
            <span className="hween-card-hint-label">
              <span className="hween-card-hint-dot" />
              点击查看
            </span>
          </span>
        </span>

        <span className="hween-card-face hween-card-back">
          <span className="hween-card-sheen" aria-hidden="true" />
          <span className="hween-card-grain" aria-hidden="true" />
          <span className="hween-letter" ref={letterRef}>
            <LetterFace letter={letter} />
          </span>
        </span>
      </div>
    </div>
  )
}

// The page borrows the site's theme, so only the title, description, and robots meta change here.
function useHweenDocument() {
  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.getAttribute('content')
    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'

    document.title = 'Happy Halloween · Nerakolo'
    description?.setAttribute('content', '一封来自 Nerakolo 的万圣节信件。')
    document.head.append(robots)

    return () => {
      document.title = previousTitle
      if (previousDescription) description?.setAttribute('content', previousDescription)
      robots.remove()
    }
  }, [])
}

export default function HalloweenApp() {
  const initialCode = readCodeFromLocation()
  const { letter, lookup, settled } = useLetter(initialCode)
  // The homepage branch is the only other place that writes the theme, so the page claims it here.
  useTheme()
  useHweenDocument()

  // The code panel plays its exit before it leaves the layout, so unsealing reads as one motion.
  const [introGone, setIntroGone] = useState(false)
  useEffect(() => {
    if (!letter) return
    const timer = window.setTimeout(() => setIntroGone(true), 560)
    return () => window.clearTimeout(timer)
  }, [letter])

  const handleSubmit = (code) => {
    void lookup(code)
    window.history.replaceState(null, '', `/26hween/${code}`)
  }

  return (
    <div className="hween" data-unsealed={letter ? 'true' : undefined}>
      <div className="hween-stage">
        <div className="hween-stack">
          <div className="hween-envelope">
            <img className="hween-envelope-closed" src="/art/26hween/envelope-closed.png" alt="" width="1024" height="1024" fetchPriority="high" draggable={false} />
            <img className="hween-envelope-open" src="/art/26hween/envelope-open.png" alt="" width="1024" height="1024" draggable={false} />
          </div>

          {letter && <Postcard letter={letter} />}
        </div>

        {settled && !introGone && (
          <div className="hween-intro" data-leaving={letter ? '' : undefined}>
            <p className="hween-label"><span>2026 万圣节</span><span>限定信件</span></p>
            <h1 className="hween-title">Happy Halloween</h1>
            <p className="hween-hint" id="hween-code-hint">这封信只写给一个人。输入明信片背面的编号，把它拆开。</p>
            <CodeForm initialValue={initialCode} onSubmit={handleSubmit} />
          </div>
        )}
      </div>

      <footer className="hween-footer">
        <a href="/">Nerakolo</a>
        <span>2026 Halloween</span>
      </footer>
    </div>
  )
}
