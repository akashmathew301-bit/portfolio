import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'
import { lockScroll } from '../lib/smoothScroll'
import site from '../data/site'
import services from '../data/services'

const EASE = [0.76, 0, 0.24, 1]
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@$><*+=/\\'
const PANELS = 6

/**
 * Loading sequence:
 *   1. the name decodes letter by letter out of scrambled glyphs,
 *      each letter locking as the real load progress passes it
 *   2. a service word flickers through the stack underneath
 *   3. an oversized ghost counter runs in the corner
 *   4. six vertical panels wipe upward with a blue flash to reveal the hero
 */
export default function Preloader({ onComplete }) {
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [tick, setTick] = useState(0)
  const finished = useRef(false)

  const letters = useMemo(() => site.name.toUpperCase().split(''), [])
  const words = useMemo(() => services.map((s) => s.title.toUpperCase()), [])

  function finish(delay) {
    if (finished.current) return
    finished.current = true
    window.setTimeout(() => setDone(true), delay)
  }

  /* ---- real load progress ---- */
  useEffect(() => {
    // hand over from the static boot layer in index.html
    document.getElementById('boot')?.remove()
    lockScroll(true)
    window.scrollTo(0, 0)

    if (reduced) {
      setProgress(100)
      finish(0)
      return
    }

    let pageReady = document.readyState === 'complete'
    const onLoad = () => {
      pageReady = true
    }
    window.addEventListener('load', onLoad)

    const start = performance.now()
    let raf = 0
    const run = (now) => {
      const t = now - start
      const ramp = Math.min(92, (t / 1500) * 92)
      const target = pageReady && t > 900 ? 100 : ramp
      setProgress((p) => {
        const next = p + (target - p) * 0.1
        return next > 99.3 ? 100 : next
      })
      if (!finished.current) raf = requestAnimationFrame(run)
    }
    raf = requestAnimationFrame(run)

    const safety = window.setTimeout(() => {
      pageReady = true
    }, 4500)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(safety)
      window.removeEventListener('load', onLoad)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  /* ---- glyph scramble clock ---- */
  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setTick((t) => t + 1), 55)
    return () => window.clearInterval(id)
  }, [reduced])

  useEffect(() => {
    if (progress >= 100) finish(520)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  function handleExitComplete() {
    lockScroll(false)
    onComplete?.()
  }

  const shown = Math.round(progress)
  const lockedCount = Math.floor((Math.min(progress, 92) / 92) * letters.length)
  const word = words[Math.floor(tick / 6) % words.length]

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {!done && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[200]"
          role="status"
          aria-live="polite"
          aria-label={'Loading ' + shown + ' percent'}
        >
          {/* ---- wiping panels ---- */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: PANELS }).map((_, i) => (
              <motion.span
                key={i}
                className="h-full flex-1 bg-ink"
                initial={{ y: 0 }}
                exit={{ y: '-101%' }}
                transition={{
                  duration: reduced ? 0 : 0.85,
                  ease: EASE,
                  delay: reduced ? 0 : 0.12 + i * 0.055,
                }}
              />
            ))}
          </div>

          {/* ---- blue flash at hand-off ---- */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(45,156,255,0.55),transparent_60%)]"
            initial={{ opacity: 0 }}
            exit={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: reduced ? 0 : 0.6, times: [0, 0.35, 1] }}
          />

          {/* ---- content ---- */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-between p-5 sm:p-8 lg:p-10"
            exit={{ opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.3, ease: 'easeIn' }}
          >
            {/* HUD top row */}
            <div className="flex items-start justify-between font-sans text-[10px] uppercase tracking-[0.28em] text-muted sm:text-[11px]">
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {site.brand}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-right"
              >
                Coimbatore · IN
              </motion.span>
            </div>

            {/* centre: decoding name */}
            <div className="relative flex flex-1 flex-col items-center justify-center">
              <div className="pointer-events-none absolute h-[46vw] max-h-[460px] w-[46vw] max-w-[460px] rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.22),transparent_66%)] blur-3xl" />

              <p
                aria-hidden="true"
                className="relative flex font-display text-[clamp(3rem,15vw,9rem)] font-bold leading-none tracking-[-0.03em]"
              >
                {letters.map((char, i) => {
                  const isLocked = reduced || i < lockedCount
                  const display = isLocked
                    ? char
                    : GLYPHS[(tick * 7 + i * 13) % GLYPHS.length]
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.06 }}
                      className={`inline-block w-[0.72em] text-center transition-colors duration-300 ${
                        isLocked ? 'text-white' : 'text-blue-main/50'
                      }`}
                    >
                      {display}
                    </motion.span>
                  )
                })}
                <span className="sr-only">{site.name}</span>
              </p>

              {/* flickering service word */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-4 h-4 overflow-hidden font-sans text-[10px] uppercase tracking-[0.4em] text-blue-glow sm:text-[11px]"
              >
                {reduced ? 'Web Solutions' : word}
              </motion.p>
            </div>

            {/* bottom: rail + oversized counter */}
            <div>
              <div className="flex items-end justify-between gap-6">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pb-2 font-sans text-[10px] uppercase tracking-[0.28em] text-muted sm:text-[11px]"
                >
                  Loading experience
                </motion.span>
                <span
                  aria-hidden="true"
                  className="font-display text-[clamp(3.5rem,13vw,8rem)] font-bold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.22)] tabular-nums"
                >
                  {String(shown).padStart(3, '0')}
                </span>
              </div>

              <div className="relative mt-4 h-px w-full overflow-hidden bg-white/10">
                <motion.span
                  className="absolute inset-0 block origin-left bg-blue-grad shadow-[0_0_12px_rgba(45,156,255,0.8)]"
                  style={{ scaleX: progress / 100 }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
