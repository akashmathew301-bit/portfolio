import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import { MaskLines } from './Reveal'
import useReducedMotion from '../hooks/useReducedMotion'
import { whatsappLink } from '../data/site'

const DELAY_MS = 7000
const WA_MESSAGE = 'Hi Akash, I saw the free sample offer on your site. My business is '

/* Typed into the address bar, one after another. Deliberately the kinds of
   businesses that actually walk in: a gym, a clinic, a boutique, a mill. */
const DOMAINS = ['your-gym.in', 'your-clinic.in', 'your-boutique.in', 'your-factory.in']

const PROOF = ['No advance', 'A real page, not a template', 'You decide after seeing it']

/** Address bar that types a domain, holds, deletes, and moves to the next. */
function TypedDomain({ reduced }) {
  const [text, setText] = useState(reduced ? DOMAINS[0] : '')

  useEffect(() => {
    if (reduced) return
    let i = 0
    let chars = 0
    let deleting = false
    let timer

    const tick = () => {
      const full = DOMAINS[i]
      chars += deleting ? -1 : 1
      setText(full.slice(0, chars))

      let wait = deleting ? 36 : 70
      if (!deleting && chars === full.length) {
        wait = 2600
        deleting = true
      } else if (deleting && chars === 0) {
        deleting = false
        i = (i + 1) % DOMAINS.length
        wait = 260
      }
      timer = window.setTimeout(tick, wait)
    }

    timer = window.setTimeout(tick, 300)
    return () => window.clearTimeout(timer)
  }, [reduced])

  return (
    <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/40 px-2.5 py-1">
      <Icon name="search" size={10} className="shrink-0 text-white/40" />
      <span className="truncate font-mono text-[11px] text-white/75">
        {text}
        <span className="animate-caret ml-px inline-block h-[11px] w-[1.5px] translate-y-[2px] bg-blue-glow" />
      </span>
    </span>
  )
}

/**
 * The miniature site, and what happens to it.
 *
 * This is the whole pitch in nine seconds: a page for your business builds
 * itself, a visitor clicks the enquire button, and the enquiry lands on your
 * WhatsApp. Every element shares one 9s clock (see index.css) so the beats
 * stay in order however long the dialog has been open.
 */
function MiniSite({ reduced }) {
  const at = (delay) => (reduced ? undefined : { animationDelay: `${delay}s` })
  const mini = reduced ? '' : 'animate-mini'

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.12] bg-[#070d18] shadow-[0_30px_60px_-28px_rgba(0,0,0,1)]">
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.04] px-3 py-2">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]/80" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/80" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]/80" />
          </span>
          <TypedDomain reduced={reduced} />
        </div>

        {/* the page itself, styled rather than skeleton grey */}
        <div className="relative p-4 sm:p-5">
          <div className={`flex items-center justify-between ${mini}`} style={at(0.2)}>
            <span className="h-6 w-6 rounded-lg bg-blue-grad shadow-glow-sm" />
            <span className="flex gap-2">
              <span className="h-1.5 w-7 rounded-full bg-white/20" />
              <span className="h-1.5 w-7 rounded-full bg-white/20" />
              <span className="h-1.5 w-5 rounded-full bg-white/20" />
            </span>
          </div>

          <div className="mt-5 flex gap-4">
            <div className="min-w-0 flex-1">
              <span className={`block h-2.5 w-[86%] rounded-full bg-white/85 ${mini}`} style={at(0.5)} />
              <span className={`mt-2 block h-2.5 w-[62%] rounded-full bg-white/85 ${mini}`} style={at(0.72)} />
              <span className={`mt-3 block h-1.5 w-[92%] rounded-full bg-white/25 ${mini}`} style={at(0.95)} />
              <span className={`mt-1.5 block h-1.5 w-[70%] rounded-full bg-white/25 ${mini}`} style={at(1.1)} />

              {/* the button the visitor is about to press */}
              <span className={`relative mt-4 inline-flex ${mini}`} style={at(1.35)}>
                <span className="relative flex items-center gap-1.5 rounded-full bg-blue-grad px-3 py-1.5 text-[9.5px] font-semibold text-white shadow-glow-sm">
                  Enquire now
                  <span
                    aria-hidden="true"
                    className={`absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/45 ${
                      reduced ? 'hidden' : 'animate-ripple'
                    }`}
                  />
                </span>

                {/* the cursor that travels in and presses it */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-1 -right-1 ${
                    reduced ? 'hidden' : 'animate-cursor'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    <path
                      d="M5 3l14 8.5-6.2 1.4L9.8 19 5 3z"
                      fill="#fff"
                      stroke="#0b1424"
                      strokeWidth="1.1"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>

            <span
              className={`h-[74px] w-[38%] shrink-0 rounded-lg bg-[linear-gradient(145deg,rgba(45,156,255,0.75),rgba(10,108,255,0.35)_55%,rgba(255,255,255,0.08))] ${mini}`}
              style={at(0.6)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`flex-1 rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-1.5 ${mini}`}
                style={at(1.6 + i * 0.12)}
              >
                <span className="block h-1.5 w-8 rounded-full bg-blue-glow/70" />
                <span className="mt-1 block h-1 w-full rounded-full bg-white/15" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* the enquiry landing on WhatsApp, which is the actual promise */}
      {/* the animation writes its own transform, so the centring has to live
          on a separate wrapper or it gets overwritten mid-keyframe */}
      <div className={`absolute -bottom-5 right-0 w-[74%] ${reduced ? 'hidden' : ''}`}>
        <div className={reduced ? '' : 'animate-notif'}>
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/[0.12] bg-[#0d1b14]/95 px-3 py-2.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,1),0_0_30px_-10px_rgba(37,211,102,0.8)] backdrop-blur">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(145deg,#2BE673,#128C4B)]">
            <Icon name="whatsapp" size={16} className="text-white" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-white">New enquiry</span>
            <span className="block truncate text-[10.5px] text-white/60">Ravi K. wants a quote</span>
          </span>
          <span className="shrink-0 font-mono text-[9.5px] text-[#2BE673]">now</span>
        </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The offer, seven seconds in, on every load. Seven seconds is long enough
 * that the visitor has seen real work first, so it reads as an invitation
 * rather than an ad.
 */
export default function OfferPopup() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()
  const closeRef = useRef(null)

  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])

  const dismiss = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') dismiss()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={dismiss}
            className="absolute inset-0 cursor-default bg-ink-950/88 backdrop-blur-md"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.3),transparent_68%)] blur-[80px]"
          />

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 190, damping: 22 }}
            className="relative w-full max-w-[900px]"
          >
            {/* travelling edge light, the same language as the site's buttons */}
            <div className={reduced ? '' : 'shimmer-card'}>
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="offer-title"
                data-lenis-prevent="true"
                className="no-scrollbar relative max-h-[86dvh] overflow-y-auto overscroll-contain rounded-[26px] bg-[linear-gradient(150deg,#123a7d,#0b2050_42%,#060c18)]"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
                  <span
                    className={`absolute -left-[16%] -top-[32%] h-[72%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.6),transparent_68%)] blur-[60px] ${
                      reduced ? '' : 'animate-aurora'
                    }`}
                  />
                  <span
                    className={`absolute -bottom-[36%] -right-[12%] h-[74%] w-[74%] rounded-full bg-[radial-gradient(circle,rgba(43,230,115,0.22),transparent_70%)] blur-[70px] ${
                      reduced ? '' : 'animate-aurora'
                    }`}
                    style={{ animationDelay: '-7s' }}
                  />
                  <span className="absolute inset-0 bg-[radial-gradient(130%_95%_at_50%_0%,transparent_38%,rgba(2,5,11,0.72)_100%)]" />
                </span>

                <button
                  ref={closeRef}
                  type="button"
                  onClick={dismiss}
                  aria-label="Close"
                  data-cursor="hover"
                  className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur transition-colors duration-300 hover:border-white/35 hover:text-white"
                >
                  <Icon name="close" size={16} />
                </button>

                <div className="relative grid items-center gap-0 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
                  {/* ---------------- pitch ---------------- */}
                  <div className="p-6 pr-16 sm:p-8 sm:pr-8">
                    <span className="eyebrow !border-white/25 !bg-black/30 !text-white">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2BE673] opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2BE673]" />
                      </span>
                      Free sample, pay later
                    </span>

                    <MaskLines
                      as="h2"
                      lines={[
                        'See your website',
                        {
                          text: 'before you pay for it.',
                          node: (
                            <>
                              before you <span className="text-grad">pay for it.</span>
                            </>
                          ),
                        },
                      ]}
                      delay={0.15}
                      stagger={0.12}
                      className="mt-5 font-display text-[clamp(1.6rem,4.4vw,2.4rem)] font-semibold leading-[1.07] tracking-tight text-white"
                    />

                    <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-white/85">
                      Send me your business name. I build a real sample page for it, then you
                      decide.
                    </p>

                    <ul className="mt-5 flex flex-wrap gap-2">
                      {PROOF.map((t) => (
                        <li
                          key={t}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] bg-white/[0.06] px-2.5 py-1.5 text-[11.5px] text-white/85"
                        >
                          <Icon name="check" size={10} strokeWidth={2.8} className="text-[#2BE673]" />
                          {t}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-7 flex flex-wrap items-center gap-4">
                      <span className="shimmer-wrap">
                        <a
                          href={whatsappLink(WA_MESSAGE)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={dismiss}
                          data-cursor="hover"
                          className="group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[linear-gradient(145deg,#2BE673,#25D366_45%,#128C4B)] px-7 py-4 text-[15px] font-semibold text-white shadow-[0_14px_36px_-10px_rgba(37,211,102,0.95)] transition-transform duration-500 ease-premium hover:scale-[1.02]"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-[900ms] ease-premium group-hover:translate-x-full"
                          />
                          <Icon name="whatsapp" size={19} />
                          Get my free sample
                        </a>
                      </span>

                      <span className="flex items-center gap-2 text-[12px] text-white/60">
                        <Icon name="clock" size={13} className="text-blue-glow" />
                        Takes a minute to ask
                      </span>
                    </div>
                  </div>

                  {/* ---------------- the story ---------------- */}
                  <div className="relative p-6 pb-14 pt-2 sm:p-8 sm:pb-16 sm:pt-10">
                    <MiniSite reduced={reduced} />

                    <span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-1 z-20 flex h-[72px] w-[72px] sm:-bottom-3 sm:left-4 sm:h-[78px] sm:w-[78px] -rotate-[14deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-[#2BE673]/70 bg-[#06100b]/95 text-center shadow-[0_0_34px_-8px_rgba(43,230,115,0.9)] sm:left-5"
                    >
                      <span className="font-display text-[21px] font-bold leading-none text-[#2BE673]">
                        &#8377;0
                      </span>
                      <span className="mt-0.5 text-[8px] uppercase tracking-[0.18em] text-white/70">
                        sample
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

