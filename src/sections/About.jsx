import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import ScrollWords from '../components/ScrollWords'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'
import SocialLinks from '../components/SocialLinks'
import useReducedMotion from '../hooks/useReducedMotion'
import { scrollToId } from '../lib/smoothScroll'
import site from '../data/site'

/**
 * Portrait stage: the keyed headshot stands inside a ring of light rather than
 * in a photo box. A soft bottom mask dissolves the original crop line into the
 * page, so there is no hard edge where the studio frame ended.
 */
function PortraitStage() {
  const reduced = useReducedMotion()
  const wrapRef = useRef(null)
  const [failed, setFailed] = useState(false)
  const [ready, setReady] = useState(false)
  const img = site.images.about

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start end', 'end start'] })
  const floatY = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['5%', '-5%'])

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
      {/* ---------- light stage ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="animate-breathe absolute left-[6%] top-[16%] block h-[62%] w-[88%] rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.32),rgba(0,75,147,0.12)_52%,transparent_72%)] blur-[46px]" />

        <span className="absolute left-[3%] top-[14%] block aspect-square w-[94%] rounded-full border border-white/[0.07]" />

        <span className="absolute left-[9%] top-[18%] block aspect-square w-[82%] overflow-hidden rounded-full">
          <span
            className={`block h-full w-full rounded-full opacity-70 [mask-image:radial-gradient(circle,transparent_64%,#000_65.5%,#000_67%,transparent_68.5%)] ${
              reduced ? '' : 'animate-spin-slow'
            }`}
            style={{
              background:
                'conic-gradient(from 90deg, transparent 0deg, rgba(45,156,255,0.9) 70deg, transparent 150deg, transparent 250deg, rgba(10,108,255,0.55) 320deg, transparent 360deg)',
            }}
          />
        </span>

        <span
          className="absolute left-[13%] top-[20%] block aspect-square w-[74%] rounded-full opacity-30 [mask-image:radial-gradient(circle,#000_52%,transparent_74%)]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
        />
      </div>

      {/* ---------- the headshot ---------- */}
      <motion.div style={{ y: floatY }} className="relative aspect-[4/5]">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-[28px] border border-white/10 bg-[linear-gradient(140deg,#05070A,#0A1428_55%,#05070A)]">
            <Icon name="spark" size={28} className="text-blue-glow" />
            <p className="px-6 text-center text-sm text-muted">
              Add <span className="text-white">akash-about-cutout.webp</span>
            </p>
          </div>
        ) : (
          <motion.picture
            initial={{ opacity: 0, y: 26, filter: 'blur(14px)' }}
            animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="block h-full w-full"
          >
            <source srcSet={img.src} type="image/webp" />
            <img
              src={img.fallback}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
              decoding="async"
              draggable="false"
              onLoad={() => setReady(true)}
              onError={() => setFailed(true)}
              className="h-full w-full object-contain object-bottom drop-shadow-[0_18px_40px_rgba(0,0,0,0.75)] [mask-image:linear-gradient(to_bottom,#000_76%,rgba(0,0,0,0.35)_92%,transparent_100%)]"
            />
          </motion.picture>
        )}

        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[2%] left-[20%] block h-px w-[60%] bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.8),transparent)]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-1%] left-[22.5%] block h-[8%] w-[55%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(45,156,255,0.4),transparent_70%)] blur-lg"
        />
      </motion.div>

      {/* ---------- floating glass chips ---------- */}
      <motion.div
        initial={{ opacity: 0, x: -14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="absolute left-[-3%] top-[28%] z-10 hidden xs:block"
      >
        <span
          className={`glass-strong inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ${
            reduced ? '' : 'animate-float'
          }`}
        >
          <Icon name="spark" size={13} className="text-blue-glow" />
          5+ years building
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 14 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="absolute right-[-3%] top-[54%] z-10 hidden xs:block"
      >
        <span
          className={`glass-strong inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[11px] font-medium text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.9)] ${
            reduced ? '' : 'animate-float'
          }`}
          style={{ animationDelay: '-2.6s' }}
        >
          <Icon name="layers" size={13} className="text-blue-glow" />
          120+ projects delivered
        </span>
      </motion.div>

      {/* ---------- identity card ---------- */}
      <Reveal delay={0.2} y={18} className="relative z-10 -mt-1">
        <div className="glass-strong flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <picture>
              <source srcSet={site.images.mark.src} type="image/webp" />
              <img
                src={site.images.mark.fallback}
                alt=""
                width={site.images.mark.width}
                height={site.images.mark.height}
                loading="lazy"
                decoding="async"
                className="h-10 w-auto shrink-0"
              />
            </picture>
            <div className="min-w-0">
              <p className="truncate font-display text-[15px] font-semibold">Akash Mathew</p>
              <p className="text-[11.5px] leading-snug text-muted">{site.role}</p>
            </div>
          </div>
          <SocialLinks
            size="sm"
            className="hidden shrink-0 gap-2 sm:flex"
            items={site.socials.filter((s) => s.id !== 'phone')}
          />
        </div>
      </Reveal>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="section-pad relative z-10">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* ---- portrait ---- */}
          <div className="lg:col-span-5">
            <PortraitStage />
          </div>

          {/* ---- copy + counters ---- */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About me"
              lines={[
                'Behind every site here,',
                {
                  text: 'there is a business I care about.',
                  node: (
                    <>
                      there is a <span className="text-grad">business I care about.</span>
                    </>
                  ),
                },
              ]}
            />

            <ScrollWords
              className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-base"
              text={
                'I am Akash. If your business needs a website, or something online is not working the way it should, that is what I solve. Where you are based does not matter. I judge every project by one question: did it bring you customers?'
              }
            />

            <div className="mt-4 max-w-2xl space-y-4">
              <ScrollWords
                className="text-[15px] leading-relaxed text-white/90 sm:text-base"
                text={
                  'Clinics, gyms, factories, law firms, showrooms and studios. Different businesses, same starting point: who is your customer, and what should they do when they land on your site?'
                }
              />
              <ScrollWords
                className="text-[15px] leading-relaxed text-white/90 sm:text-base"
                text={
                  'You work with me directly. No account manager, no ticket number. I answer my own phone, send the updates myself, and stay reachable long after the site goes live.'
                }
              />
            </div>

            <Reveal delay={0.15} className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('work', -40)}>
                See my work
              </MagneticButton>
              <span className="inline-flex items-center gap-2 text-sm text-muted">
                <Icon name="check" size={16} className="text-blue-glow" />
                Direct communication, no agency layers
              </span>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
