import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import useReducedMotion from '../hooks/useReducedMotion'
import { scrollToTop } from '../lib/smoothScroll'
import site, { whatsappLink } from '../data/site'
import { useApp } from '../context/AppContext'

const DEFAULT_MESSAGE = 'Hi Akash, I found your website and want to connect.'

function Tooltip({ children }) {
  return (
    <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-white/10 bg-ink-950/90 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 group-hover:opacity-100 lg:block">
      {children}
    </span>
  )
}

/** Sits directly above the WhatsApp button and flies the page home. */
function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      data-cursor="hover"
      className="glow-ring group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink-950/90 text-white backdrop-blur transition-[background-color,transform] duration-500 ease-premium hover:scale-110 hover:bg-blue-main/15 sm:h-[52px] sm:w-[52px]"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.35),transparent_70%)] opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100"
      />
      <Icon
        name="arrowUp"
        size={19}
        className="relative z-10 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5"
      />
      <Tooltip>Back to top</Tooltip>
    </button>
  )
}

/**
 * The WhatsApp button. Three stacked motions so it reads as alive without
 * being annoying: two expanding rings, a slow vertical bob, and a wiggle on
 * the icon every few seconds.
 */
function WhatsAppButton({ reduced }) {
  return (
    <a
      href={whatsappLink(DEFAULT_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={'Chat with ' + site.name + ' on WhatsApp'}
      data-cursor="hover"
      className={`group relative flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(145deg,#2BE673,#25D366_45%,#128C4B)] shadow-[0_10px_34px_-8px_rgba(37,211,102,0.8)] transition-transform duration-300 ease-premium hover:scale-110 sm:h-[60px] sm:w-[60px] ${
        reduced ? '' : 'animate-bob'
      }`}
    >
      {/* expanding rings */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366]/60"
        style={reduced ? undefined : { animation: 'pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) infinite' }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-[#25D366]/40"
        style={reduced ? undefined : { animation: 'pulse-ring 2.4s cubic-bezier(0.22,1,0.36,1) 1.2s infinite' }}
      />
      {/* inner sheen */}
      <span
        aria-hidden="true"
        className="absolute inset-[3px] rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.4),transparent_55%)]"
      />

      <span className={reduced ? 'relative z-10' : 'relative z-10 animate-wiggle'}>
        <Icon name="whatsapp" size={28} strokeWidth={1.7} className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.35)]" />
      </span>

      <Tooltip>Chat on WhatsApp</Tooltip>
    </a>
  )
}

/** Sticky corner dock: back to top on top, WhatsApp underneath. */
export default function FloatingDock() {
  const [show, setShow] = useState(false)
  const reduced = useReducedMotion()
  const { overlayOpen } = useApp()

  /**
   * The dock follows reading intent instead of sitting there permanently.
   *
   * Scrolling DOWN means the visitor is reading, so it gets out of the way
   * (on a phone it would otherwise cover the bottom-right of whatever is on
   * screen). Scrolling UP, or reaching the end of the page, means they are
   * looking for something, which is exactly when a contact button should be
   * there. A small threshold keeps it from flickering on tiny scroll jitter.
   */
  useEffect(() => {
    let last = window.scrollY
    let ticking = false

    const evaluate = () => {
      const y = window.scrollY
      const delta = y - last
      const atBottom = y + window.innerHeight >= document.body.scrollHeight - 160

      if (y <= 420) setShow(false)
      else if (atBottom) setShow(true)
      else if (delta > 6) setShow(false)
      else if (delta < -6) setShow(true)

      if (Math.abs(delta) > 6) last = y
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(evaluate)
    }

    evaluate()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && !overlayOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-[95] flex flex-col items-center gap-3 sm:bottom-7 sm:right-7 sm:gap-3.5"
        >
          <BackToTop />
          <WhatsAppButton reduced={reduced} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
