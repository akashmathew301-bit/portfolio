import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import Icon from '../components/Icon'
import HeroAura from '../components/HeroAura'
import MagneticButton from '../components/MagneticButton'
import { MaskLines } from '../components/Reveal'
import useReducedMotion from '../hooks/useReducedMotion'
import { useIsTouch } from '../hooks/useMediaQuery'
import { scrollToId } from '../lib/smoothScroll'
import site, { whatsappLink } from '../data/site'
import { useApp } from '../context/AppContext'

const HERO_WA_MESSAGE = 'Hi Akash, I found your website and want to connect.'

/* On lg+ the photo column is pulled past the container edge (-mr), so the
   right-hand badge has to come back inwards or it clips off-screen. */
const BADGE_POS = {
  'top-left': 'left-[-2%] top-[-1%] sm:left-[-4%] lg:left-[-6%] lg:top-[4%]',
  'bottom-left': 'bottom-[4%] left-[-3%] sm:left-[-6%] lg:bottom-[16%] lg:left-[-8%]',
  'top-right': 'right-[-2%] top-[6%] sm:right-[-4%] lg:right-[6%] lg:top-[2%] xl:right-[10%]',
}

/**
 * Hero photo: a true transparent-background cut-out, so it can sit on top of
 * the rings and glows with no box around it. Desktop gets the wide composite,
 * mobile an art-directed portrait crop, one <picture>, one download.
 */
function HeroPhoto({ glow = false, onFail, onReady }) {
  const { hero, portrait } = site.images
  return (
    <picture className="block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={hero.src} type="image/webp" />
      <source media="(min-width: 1024px)" srcSet={hero.fallback} type="image/png" />
      <source srcSet={portrait.src} type="image/webp" />
      <img
        src={portrait.fallback}
        alt={glow ? '' : hero.alt}
        aria-hidden={glow ? 'true' : undefined}
        width={hero.width}
        height={hero.height}
        fetchPriority={glow ? 'low' : 'high'}
        decoding={glow ? 'async' : 'sync'}
        draggable="false"
        onLoad={onReady}
        onError={onFail}
        style={{ objectPosition: hero.position }}
        className="h-full w-full object-contain"
      />
    </picture>
  )
}

export default function Hero() {
  const { loaded } = useApp()
  const reduced = useReducedMotion()
  const isTouch = useIsTouch()
  const sectionRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [imgReady, setImgReady] = useState(false)

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const photoScrollY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90])
  const textScrollY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 150])
  const heroFade = useTransform(scrollYProgress, [0, 0.85], [1, reduced ? 1 : 0.1])

  /* Mouse parallax (desktop only), the figure and the light stage drift by
     different amounts, and in opposite directions. That split is what sells
     the depth; a single uniform shift just looks like a sliding image. */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const spring = { stiffness: 90, damping: 20, mass: 0.6 }
  const sx = useSpring(mx, spring)
  const sy = useSpring(my, spring)
  const stageX = useTransform(sx, (v) => v * -0.45)
  const stageY = useTransform(sy, (v) => v * -0.45)

  useEffect(() => {
    if (isTouch || reduced) return
    const el = sectionRef.current
    if (!el) return
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 34)
      my.set(((e.clientY - r.top) / r.height - 0.5) * 24)
    }
    const onLeave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [isTouch, reduced, mx, my])

  const headline = [
    'I build websites',
    {
      text: 'that bring customers.',
      node: (
        <>
          that <span className="text-grad">bring customers.</span>
        </>
      ),
    },
  ]

  const flat = isTouch || reduced
  const show = loaded && (imgReady || failed)

  return (
    <section
      id="home"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-28"
    >
      <HeroAura />

      {/* overhead spotlight cone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[120vw] -translate-x-1/2 bg-[conic-gradient(from_200deg_at_50%_0%,transparent_0deg,rgba(45,156,255,0.09)_152deg,rgba(45,156,255,0.15)_180deg,rgba(45,156,255,0.09)_208deg,transparent_360deg)] blur-[22px] lg:left-[70%]"
      />

      <motion.div style={{ opacity: heroFade }} className="container-x relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
          {/* ---------------- Text ---------------- */}
          <motion.div style={{ y: textScrollY }} className="relative z-20 lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-glow opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-glow" />
                </span>
                Websites, SEO and ads under one roof
              </span>
            </motion.div>

            <MaskLines
              as="h1"
              lines={headline}
              animate={loaded}
              delay={0.2}
              stagger={0.14}
              className="mt-6 font-display text-[clamp(2.05rem,5.8vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
            />

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.62 }}
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-lg"
            >
              {site.intro}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.76 }}
              className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <MagneticButton size="lg" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
                Start a Project
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="outline"
                icon="whatsapp"
                href={whatsappLink(HERO_WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Me
              </MagneticButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={loaded ? { opacity: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.95 }}
              className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-muted"
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="check" size={15} className="text-blue-glow" />
                <span className="text-white">120+</span> projects delivered
              </span>
              <span className="inline-flex items-center gap-2">
                <Icon name="pin" size={15} className="text-blue-glow" />
                Coimbatore based, working anywhere
              </span>
            </motion.div>
          </motion.div>

          {/* ---------------- Photo ---------------- */}
          <motion.div
            style={{ y: photoScrollY }}
            className="relative z-10 lg:col-span-6 lg:-mr-[4%] xl:-mr-[8%]"
          >
            <div className="relative mx-auto w-full max-w-[460px] sm:max-w-[540px] lg:max-w-none">
              {/* ---------- light stage ----------
                   No rings: a shaft of light from above, a bright floor line
                   he stands on, and a faint grid behind. Reads as a studio set
                   rather than a badge, and keeps the lower half dark. */}
              <motion.div
                aria-hidden="true"
                style={{ x: flat ? 0 : stageX, y: flat ? 0 : stageY }}
                className="pointer-events-none absolute inset-0"
              >
                {/* light shaft from above */}
                <motion.span
                  initial={{ opacity: 0, scaleY: 0.7 }}
                  animate={show ? { opacity: 1, scaleY: 1 } : {}}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  className="absolute left-[16%] top-[-16%] block h-[92%] w-[68%] origin-top bg-[radial-gradient(ellipse_60%_55%_at_50%_18%,rgba(45,156,255,0.30),rgba(10,108,255,0.12)_45%,transparent_72%)] blur-[40px]"
                />

                {/* faint grid wall behind him */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={show ? { opacity: 0.5 } : {}}
                  transition={{ duration: 1.4, delay: 0.45 }}
                  className="grid-lines absolute left-[12%] top-[6%] block h-[72%] w-[76%] [mask-image:radial-gradient(ellipse_at_50%_40%,#000_10%,transparent_72%)]"
                />

                {/* floor he stands on */}
                <motion.span
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={show ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
                  className="absolute bottom-[13%] left-[12%] block h-px w-[76%] bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.9)_45%,rgba(45,156,255,0.9)_55%,transparent)]"
                />
                <motion.span
                  initial={{ opacity: 0, scaleX: 0.3 }}
                  animate={show ? { opacity: 1, scaleX: 1 } : {}}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.95 }}
                  className="absolute bottom-[8%] left-[22%] block h-[10%] w-[56%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(45,156,255,0.45),rgba(10,108,255,0.12)_48%,transparent_74%)] blur-[20px]"
                />

                {/* light sweep travelling across the floor line */}
                {!reduced && (
                  <span className="absolute bottom-[12.4%] left-[12%] block h-[3px] w-[76%] overflow-hidden">
                    <span className="animate-beam block h-full w-[22%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)] blur-[2px]" />
                  </span>
                )}
              </motion.div>

              {/* ---------- the cut-out ---------- */}
              <motion.div
                style={{ x: flat ? 0 : sx, y: flat ? 0 : sy }}
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(18px)' }}
                animate={show ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
                transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                className="relative aspect-[4/5] w-full sm:aspect-[5/4] lg:aspect-[3/2]"
              >
                {failed ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(140deg,#05070A,#0A1428_55%,#05070A)]">
                    <Icon name="spark" size={30} className="text-blue-glow" />
                    <p className="px-6 text-center text-sm text-muted">
                      Add your photo to <span className="text-white">/public/images/</span>
                    </p>
                  </div>
                ) : (
                  <>
                    {/* silhouette halo: a blurred copy of the same cut-out, so the
                        glow traces his exact shape rather than a generic circle */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 hidden scale-[1.04] opacity-50 blur-[26px] saturate-150 lg:block"
                    >
                      <HeroPhoto glow />
                    </div>
                    <div className="relative h-full w-full drop-shadow-[0_0_26px_rgba(10,108,255,0.35)]">
                      <HeroPhoto onFail={() => setFailed(true)} onReady={() => setImgReady(true)} />
                    </div>
                  </>
                )}
              </motion.div>

              {/* ---------- floating glass badges ---------- */}
              {!failed &&
                site.badges.map((badge, i) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.85, y: 12 }}
                    animate={show ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.7 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute z-20 hidden xs:block ${BADGE_POS[badge.pos]}`}
                  >
                    <span
                      className={`glass-strong inline-flex items-center whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-medium tracking-tight text-white shadow-[0_8px_30px_-10px_rgba(0,0,0,0.9)] sm:px-4 sm:text-xs ${
                        reduced ? '' : 'animate-float'
                      }`}
                      style={{ animationDelay: i * -2.2 + 's' }}
                    >
                      <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-glow shadow-glow-sm" />
                      {badge.label}
                    </span>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        type="button"
        onClick={() => scrollToId('about', -20)}
        initial={{ opacity: 0 }}
        animate={loaded ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-label="Scroll to next section"
        className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted transition-colors hover:text-white lg:flex"
      >
        Scroll
        <span className="relative flex h-10 w-[22px] justify-center rounded-full border border-white/15 pt-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-blue-glow"
            animate={reduced ? {} : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.button>
    </section>
  )
}
