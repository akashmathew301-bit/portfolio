import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import useReducedMotion from '../hooks/useReducedMotion'
import site, { whatsappLink } from '../data/site'

const DEFAULT_MESSAGE = 'Hi Akash, I found your website and want to connect.'

/**
 * Sticky WhatsApp button. Three stacked motions so it reads as alive without
 * being annoying: two expanding rings, a slow vertical bob, and a wiggle on
 * the icon every few seconds.
 */
export default function FloatingWhatsApp() {
  const [show, setShow] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-5 right-5 z-[95] sm:bottom-7 sm:right-7"
        >
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

            <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap rounded-full border border-white/10 bg-ink-950/90 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-300 group-hover:opacity-100 lg:block">
              Chat on WhatsApp
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
