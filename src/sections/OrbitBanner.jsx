import { motion } from 'framer-motion'
import MagneticButton from '../components/MagneticButton'
import {
  CodeMark,
  GrowthMark,
  ResultBadge,
  SeoPill,
  VideoMark,
  WordPressMark,
} from '../components/OrbitMarks'
import Reveal, { MaskLines } from '../components/Reveal'
import ScrollWords from '../components/ScrollWords'
import useMediaQuery from '../hooks/useMediaQuery'
import useReducedMotion from '../hooks/useReducedMotion'
import { scrollToId } from '../lib/smoothScroll'
import site, { whatsappLink } from '../data/site'

const WA_MESSAGE = 'Hi Akash, I saw your site. Can we talk about a project?'

/* Six objects, evenly spaced around the track. No labels: each one already
   says what it is, which keeps the stage clean at every size. */
const TILE = 'h-[46px] w-[46px] sm:h-[58px] sm:w-[58px] lg:h-[66px] lg:w-[66px]'

const ORBIT = [
  { key: 'code', label: 'Web development', node: <CodeMark className={TILE} /> },
  { key: 'seo', label: 'Search engine optimisation', node: <SeoPill /> },
  { key: 'growth', label: 'Campaign growth', node: <GrowthMark className={TILE} /> },
  { key: 'result', label: 'Traffic up 320 percent', node: <ResultBadge /> },
  { key: 'video', label: 'Video editing', node: <VideoMark className={TILE} /> },
  { key: 'wordpress', label: 'WordPress builds', node: <WordPressMark className={TILE} /> },
]

/* Small particles on a second, slower track running the other way. */
const PARTICLES = [0, 38, 74, 119, 160, 203, 246, 288, 320, 341]

function polar(angleDeg, radiusPct) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    left: `${50 + radiusPct * Math.cos(rad)}%`,
    top: `${50 + radiusPct * Math.sin(rad)}%`,
  }
}

/**
 * One object riding the outer track. The wrapper is carried round by the
 * track; the inner span spins back at the same rate so the mark itself never
 * tilts, and a third layer adds a slow bob so it floats rather than slides.
 */
function OrbitMark({ node, label, angle, delay, radius, reduced }) {
  return (
    <span
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={polar(angle, radius)}
      role="img"
      aria-label={label}
    >
      <span className={`block ${reduced ? '' : 'animate-orbit-rev'}`}>
        <span
          className={`block ${reduced ? '' : 'animate-float-soft'}`}
          style={{ animationDelay: `${delay}s` }}
        >
          {node}
        </span>
      </span>
    </span>
  )
}

/**
 * Second banner. The figure sits inside a live orbit: capability chips travel
 * clockwise on the outer track while dust particles drift anti-clockwise on an
 * inner one, so the whole stage keeps moving without anything blinking.
 */
export default function OrbitBanner() {
  const reduced = useReducedMotion()
  /* the wide pills hang half their width outside the track, so on a phone the
     track is pulled in or they clip against the section edge */
  const roomy = useMediaQuery('(min-width: 640px)')
  const radius = roomy ? 50 : 44
  const img = site.images.seated

  return (
    <section id="capabilities" className="relative z-10 overflow-hidden py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-[72%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)]"
      />

      <div className="container-x relative">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- copy ---------------- */}
          <div className="lg:col-span-6">
            <Reveal y={16}>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-glow shadow-glow-sm" />
                One partner, every piece
              </span>
            </Reveal>

            <MaskLines
              as="h2"
              lines={[
                'Development, SEO and',
                {
                  text: 'marketing in one place.',
                  node: (
                    <>
                      marketing <span className="text-grad">in one place.</span>
                    </>
                  ),
                },
              ]}
              className="mt-6 font-display text-[clamp(1.85rem,5vw,3.1rem)] font-semibold leading-[1.06] tracking-[-0.02em]"
            />

            <ScrollWords
              className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/90 sm:text-lg"
              text={
                'Most businesses end up with a designer, an SEO guy and an ads agency who never talk to each other. Here it is one person who builds the site, makes Google find it and runs the campaigns that fill it. Same number, start to finish.'
              }
            />

            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <MagneticButton size="lg" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
                Start a Project
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="outline"
                icon="whatsapp"
                href={whatsappLink(WA_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Me
              </MagneticButton>
            </Reveal>
          </div>

          {/* ---------------- orbit stage ---------------- */}
          <div className="lg:col-span-6">
            <motion.div
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto aspect-square w-full max-w-[400px] sm:max-w-[480px] lg:max-w-[540px]"
            >
              {/* rings */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full border border-white/[0.07] bg-[radial-gradient(circle_at_50%_55%,rgba(10,108,255,0.16),transparent_62%)]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-[13%] rounded-full border border-dashed border-white/[0.08]"
              />
              <span
                aria-hidden="true"
                className="absolute inset-[27%] rounded-full border border-white/[0.05] bg-[radial-gradient(circle,rgba(45,156,255,0.12),transparent_70%)] blur-sm"
              />

              {/* inner particle track, running the other way */}
              <div
                aria-hidden="true"
                className={`absolute inset-[13%] ${reduced ? '' : 'animate-orbit-inner'}`}
              >
                {PARTICLES.map((a, i) => (
                  <span
                    key={a}
                    className={`absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                      i % 3 === 0
                        ? 'bg-blue-glow shadow-[0_0_10px_2px_rgba(45,156,255,0.75)]'
                        : 'bg-[#9AD2FF] shadow-[0_0_8px_1.5px_rgba(45,156,255,0.5)]'
                    }`}
                    style={polar(a, 50)}
                  />
                ))}
              </div>

              {/* the figure, centred and sitting on the glow */}
              <div className="absolute inset-[9%] z-10 flex items-end justify-center">
                <picture className="flex h-full w-full items-end justify-center">
                  <source srcSet={img.src} type="image/webp" />
                  <img
                    src={img.fallback}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto max-w-full object-contain object-bottom drop-shadow-[0_28px_45px_rgba(0,0,0,0.6)]"
                  />
                </picture>
              </div>

              {/* floor line he sits on */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[8%] left-1/2 h-px w-[62%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.65),transparent)]"
              />

              {/* outer capability track */}
              <div className={`absolute inset-0 z-20 ${reduced ? '' : 'animate-orbit'}`}>
                {ORBIT.map((item, i) => (
                  <OrbitMark
                    key={item.key}
                    node={item.node}
                    label={item.label}
                    /* offset by 60deg so no mark ever parks on his head or
                       his feet, whatever the track radius is */
                    angle={(360 / ORBIT.length) * i - 60}
                    radius={radius}
                    delay={i * 0.55}
                    reduced={reduced}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
