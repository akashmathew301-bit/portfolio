import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'
import useReducedMotion from '../hooks/useReducedMotion'
import { scrollToId } from '../lib/smoothScroll'
import processSteps from '../data/process'

const EASE = [0.22, 1, 0.36, 1]

/**
 * One step. It does not just fade in, it *activates* as the scroll-drawn rail
 * reaches it: the node fills with the blue gradient, the card lifts and its
 * glow switches on. `progress` is the rail's 0→1 draw value.
 *
 * Every card is the same width (grid) and the same height (`h-full` all the
 * way down, with the footer pinned by `mt-auto`), so uneven copy length never
 * produces a ragged row.
 */
function Step({ step, index, total, progress }) {
  const reduced = useReducedMotion()
  const at = (index + 0.35) / total
  const active = useTransform(progress, (v) => (reduced ? 1 : v >= at ? 1 : 0))

  const fill = useTransform(active, [0, 1], [0, 1])
  const nodeScale = useTransform(active, [0, 1], [0.6, 1])
  const nodeColor = useTransform(active, [0, 1], ['#9AA4B2', '#FFFFFF'])
  const lift = useTransform(active, [0, 1], [0, -8])
  const cardOpacity = useTransform(active, [0, 1], [0.5, 1])

  return (
    <motion.li
      initial={reduced ? false : { y: 30 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      style={{ opacity: cardOpacity }}
      className="relative flex h-full flex-col pl-[72px] md:pl-0"
    >
      {/* ---- node on the rail ---- */}
      <div className="absolute left-0 top-0 md:relative md:mb-9 md:flex">
        <span className="relative flex h-14 w-14 items-center justify-center">
          <motion.span
            style={{ opacity: fill }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.75),transparent_68%)] blur-lg"
          />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/12 bg-ink">
            <motion.span
              style={{ opacity: fill, scale: nodeScale }}
              className="absolute inset-[3px] rounded-full bg-blue-grad shadow-glow"
            />
            <motion.span style={{ color: nodeColor }} className="relative z-10">
              <Icon name={step.icon} size={22} />
            </motion.span>
          </span>
        </span>
      </div>

      {/* ---- card ---- */}
      <motion.div style={{ y: lift }} className="grad-border group relative flex h-full flex-col rounded-3xl">
        <motion.span
          style={{ opacity: fill }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-3xl shadow-[0_0_38px_-26px_rgba(10,108,255,0.85)]"
        />
        <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
          {/* the card fills with blue as the rail reaches this step */}
          <motion.span
            style={{ opacity: fill }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(155deg,rgba(10,108,255,0.3),rgba(0,75,147,0.14)_52%,rgba(10,108,255,0.06))]"
          />
          <motion.span
            style={{ opacity: fill }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-blue-main/40"
          />
          {/* ghost number */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-3 -top-6 font-display text-[5.5rem] font-bold leading-none text-white/[0.06]"
          >
            {step.step}
          </span>
          {/* glow that switches on with the node */}
          <motion.span
            style={{ opacity: fill }}
            aria-hidden="true"
            className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.22),transparent_70%)] blur-2xl"
          />

          <div className="relative flex items-center gap-2.5">
            <span className="font-display text-[11px] font-semibold tracking-[0.22em] text-blue-glow">
              STEP {step.step}
            </span>
            <span className="h-px flex-1 bg-white/10" />
            <span className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11.5px] text-muted">
              {step.duration}
            </span>
          </div>

          <h3 className="relative mt-4 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {step.title}
          </h3>
          <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-white/85">{step.description}</p>

          <ul className="relative mt-auto space-y-2 border-t border-white/[0.07] pt-4 [margin-top:1.5rem]">
            {step.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[12.5px] text-white/70">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-main/15 text-blue-glow">
                  <Icon name="check" size={10} strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </motion.li>
  )
}

export default function Process() {
  const reduced = useReducedMotion()
  const trackRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 80%', 'end 60%'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 85, damping: 26, restDelta: 0.001 })
  const draw = useTransform(smooth, (v) => (reduced ? 1 : v))
  const headPos = useTransform(draw, (v) => v * 100 + '%')

  return (
    <section id="process" className="section-pad relative z-10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[40vh] w-[90vw] max-w-5xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,108,255,0.12),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="How it works"
            lines={[
              'Four steps from idea',
              { text: 'to a live website.', node: <span className="text-grad">to a live website.</span> },
            ]}
            lead="No jargon and no three-month agency process. At every point you know what is being built, what it costs and what happens next."
            className="max-w-2xl"
          />
          <div className="shrink-0">
            <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
              Start step one
            </MagneticButton>
          </div>
        </div>

        <div ref={trackRef} className="relative mt-14 sm:mt-20">
          {/* ---- scroll-drawn rail: vertical on mobile, horizontal from md ---- */}
          <div
            aria-hidden="true"
            className="absolute left-[27px] top-3 h-[calc(100%-1.5rem)] w-px bg-white/[0.08] md:hidden"
          >
            <motion.span
              style={{ scaleY: draw }}
              className="absolute inset-0 block origin-top bg-blue-grad shadow-[0_0_16px_rgba(45,156,255,0.7)]"
            />
            <motion.span
              style={{ top: headPos }}
              className="absolute left-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(45,156,255,1)]"
            />
          </div>

          <div
            aria-hidden="true"
            className="absolute left-0 top-[27px] hidden h-px w-full bg-white/[0.08] md:block"
          >
            <motion.span
              style={{ scaleX: draw }}
              className="absolute inset-0 block origin-left bg-blue-grad shadow-[0_0_16px_rgba(45,156,255,0.7)]"
            />
            <motion.span
              style={{ left: headPos }}
              className="absolute top-1/2 block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_14px_rgba(45,156,255,1)]"
            />
          </div>

          <ul className="grid items-stretch gap-9 md:grid-cols-4 md:gap-5">
            {processSteps.map((step, i) => (
              <Step key={step.step} step={step} index={i} total={processSteps.length} progress={draw} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
