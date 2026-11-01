import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from './Icon'
import MagneticButton from './MagneticButton'
import useActiveSection from '../hooks/useActiveSection'
import { lockScroll, scrollToId } from '../lib/smoothScroll'
import site from '../data/site'

const EASE = [0.76, 0, 0.24, 1]

export default function Navbar() {
  const ids = useMemo(() => site.nav.map((n) => n.id), [])
  const active = useActiveSection(ids)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  /**
   * The bar follows reading intent, the same rule the floating dock uses.
   *
   * Scrolling DOWN means the visitor is reading, so the bar slides away and
   * gives a phone back its top 60px. Scrolling UP means they are looking for
   * something, which is exactly when navigation should be there. Near the top
   * of the page it is always shown. The 6px threshold stops it flickering on
   * scroll jitter and on the rubber-band bounce at either end.
   */
  useEffect(() => {
    let last = window.scrollY
    let ticking = false

    const evaluate = () => {
      const y = window.scrollY
      const delta = y - last
      setScrolled(y > 24)

      if (y < 120) setHidden(false)
      else if (delta > 6) setHidden(true)
      else if (delta < -6) setHidden(false)

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

  /* An open menu must never scroll itself out of reach. */
  useEffect(() => {
    if (open) setHidden(false)
  }, [open])

  useEffect(() => {
    lockScroll(open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id) => {
    setOpen(false)
    window.setTimeout(() => scrollToId(id, -70), open ? 420 : 0)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-[transform,padding] duration-500 ease-premium ${
          scrolled ? 'py-2.5' : 'py-4 sm:py-5'
        } ${hidden && !open ? '-translate-y-[130%]' : 'translate-y-0'}`}
      >
        <div className="container-x">
          <nav
            aria-label="Main"
            className={`flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 ease-premium sm:px-5 ${
              scrolled ? 'glass-strong shadow-[0_8px_40px_-18px_rgba(0,0,0,0.9)]' : 'border border-transparent'
            }`}
          >
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                go('home')
              }}
              data-cursor="hover"
              className="group flex items-center gap-2.5"
              aria-label={site.brand + ', back to top'}
            >
              <picture>
                <source srcSet={site.images.mark.src} type="image/webp" />
                <img
                  src={site.images.mark.fallback}
                  alt=""
                  width={site.images.mark.width}
                  height={site.images.mark.height}
                  className="h-11 w-auto transition-transform duration-500 ease-premium group-hover:scale-105 sm:h-12"
                />
              </picture>
            </a>

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 lg:flex">
              {site.nav.map((item) => {
                const isActive = active === item.id
                return (
                  <li key={item.id}>
                    <a
                      href={'#' + item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        go(item.id)
                      }}
                      aria-current={isActive ? 'true' : undefined}
                      data-cursor="hover"
                      className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-muted hover:text-white'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-blue-main/35 bg-blue-main/12"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* CTA + burger */}
            <div className="flex items-center gap-2">
              <MagneticButton
                size="sm"
                icon="arrowUpRight"
                onClick={() => go('contact')}
                className="hidden sm:inline-flex"
              >
                Let&apos;s Talk
              </MagneticButton>

              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition-colors duration-300 hover:border-blue-glow/40 lg:hidden"
              >
                <Icon name={open ? 'close' : 'menu'} size={20} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            className="fixed inset-0 z-[99] lg:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.div
              className="absolute inset-0 bg-ink-950"
              variants={{
                hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
                show: { clipPath: 'inset(0% 0% 0% 0%)' },
              }}
              transition={{ duration: 0.65, ease: EASE }}
            >
              <div className="absolute inset-0 grid-lines opacity-50" />
              <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.25),transparent_70%)] blur-2xl" />
              <div className="noise absolute inset-0 opacity-[0.04]" />
            </motion.div>

            <div className="relative flex h-full flex-col justify-between px-6 pb-10 pt-28">
              <ul className="flex flex-col gap-1">
                {site.nav.map((item, i) => (
                  <li key={item.id} className="overflow-hidden">
                    <motion.a
                      href={'#' + item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        go(item.id)
                      }}
                      className={`block py-2.5 font-display text-[clamp(2rem,10vw,3.2rem)] font-semibold leading-tight tracking-tight transition-colors ${
                        active === item.id ? 'text-grad' : 'text-white'
                      }`}
                      variants={{
                        hidden: {
                          y: '110%',
                          opacity: 0,
                          transition: { duration: 0.28, ease: 'easeIn' },
                        },
                        show: {
                          y: '0%',
                          opacity: 1,
                          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.07 },
                        },
                      }}
                    >
                      <span className="mr-3 align-middle font-sans text-xs text-muted">
                        0{i + 1}
                      </span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>

              <motion.div
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0, y: 24, transition: { duration: 0.2 } },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 } },
                }}
              >
                <MagneticButton onClick={() => go('contact')} icon="arrowUpRight" className="w-full">
                  Let&apos;s Talk
                </MagneticButton>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
                  <a href={'tel:+' + site.phoneIntl} className="hover:text-white">
                    {site.phoneDisplay}
                  </a>
                  <a href={'mailto:' + site.email} className="hover:text-white">
                    {site.email}
                  </a>
                </div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted/70">{site.location}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
