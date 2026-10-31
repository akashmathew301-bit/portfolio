import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { Avatar } from '../components/Rating'
import useCountUp from '../hooks/useCountUp'
import useMediaQuery from '../hooks/useMediaQuery'
import useReducedMotion from '../hooks/useReducedMotion'
import reviews from '../data/reviews'
import projects from '../data/projects'

const AUTOPLAY_MS = 5200
const EASE = [0.22, 1, 0.36, 1]

/* Fixed card size, so every slide is identical regardless of copy length. */
function ReviewCard({ review, active }) {
  return (
    <figure
      className={`glass relative flex h-[500px] w-[min(86vw,400px)] flex-col gap-5 overflow-hidden rounded-[28px] p-7 transition-[border-color,box-shadow] duration-500 lg:h-[420px] lg:w-[460px] lg:p-10 ${
        active ? 'border-blue-main/35 shadow-glow-lg' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(10,108,255,0.20),rgba(0,75,147,0.08)_45%,transparent_75%)]"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.35),transparent_70%)] blur-2xl transition-opacity duration-500 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <figcaption className="relative flex shrink-0 items-center gap-4">
        <Avatar src={review.avatar} name={review.name} size={72} className="!rounded-2xl" />
        <span className="min-w-0">
          <span className="block font-display text-[18px] font-semibold leading-tight text-white lg:text-[20px]">
            {review.name}
          </span>
          <span className="mt-1 block text-[13.5px] leading-snug text-muted">
            {[review.role, review.business].filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>

      <span aria-hidden="true" className="relative h-px shrink-0 bg-white/[0.14]" />

      <div className="no-scrollbar relative flex-1 overflow-y-auto pr-1">
        <Icon name="quote" size={22} className="mb-3 text-blue-main/40" strokeWidth={1.2} />
        <blockquote className="text-[14.5px] font-normal italic leading-[1.7] text-white/85 lg:text-[15px]">
          {review.text}
        </blockquote>
      </div>
    </figure>
  )
}

/**
 * Headline stat. Deliberately NOT a star score or anything that looks like a
 * Google rating — Akash has no collected ratings yet, so this counts the work
 * that actually shipped instead.
 */
function DeliveredStat({ count }) {
  const [ref, shown] = useCountUp(count)
  return (
    <div ref={ref} className="glass inline-flex items-center gap-4 rounded-2xl px-5 py-4">
      <span className="font-display text-3xl font-semibold leading-none text-white sm:text-4xl">
        <span className="tabular-nums">{shown}</span>
        <span className="text-grad">+</span>
      </span>
      <span className="flex flex-col gap-0.5 border-l border-white/10 pl-4">
        <span className="text-[13px] font-medium text-white">Projects delivered</span>
        <span className="text-[11.5px] text-muted">Live websites for real businesses</span>
      </span>
    </div>
  )
}

export default function Reviews() {
  const reduced = useReducedMotion()
  const isWide = useMediaQuery('(min-width: 1025px)')
  const count = reviews.length
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count])

  useEffect(() => {
    if (paused || reduced || count < 2) return
    const id = window.setInterval(() => go(1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, reduced, count, go])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    }
  }

  /* shortest signed distance from the active slide, so the loop wraps both ways */
  const offsetOf = useMemo(
    () => (i) => {
      let d = i - index
      if (d > count / 2) d -= count
      if (d < -count / 2) d += count
      return d
    },
    [index, count],
  )

  if (!count) {
    return (
      <section id="reviews" className="section-pad relative z-10">
        <div className="container-x">
          <SectionHeading eyebrow="Testimonials" lines={['What clients say.']} />
          <p className="mt-8 text-muted">Reviews are being collected.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="reviews" className="section-pad relative z-10 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,108,255,0.14),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Testimonials"
            lines={['What clients', { text: 'say.', node: <span className="text-grad">say.</span> }]}
            lead="Honest feedback from the businesses I have built for."
            className="max-w-xl"
          />
          <Reveal delay={0.1} className="shrink-0">
            <DeliveredStat count={projects.length} />
          </Reveal>
        </div>
      </div>

      {/* ---------------- 3D coverflow ----------------
           The neighbouring cards rotate away in perspective and blur back, so
           the active quote is unmistakable. Drag, arrow keys and dots all move
           it; autoplay pauses on hover and focus. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        className="relative mt-12 select-none outline-none sm:mt-14"
      >
        <div className="relative mx-auto h-[520px] w-full max-w-[1400px] [perspective:1200px] lg:h-[460px]">
          {reviews.map((review, i) => {
            const d = offsetOf(i)
            const abs = Math.abs(d)
            const visible = abs <= 1
            return (
              <motion.div
                key={i}
                aria-hidden={d !== 0}
                className="absolute left-1/2 top-1/2 flex cursor-grab items-center justify-center will-tf active:cursor-grabbing"
                initial={false}
                animate={{
                  x: '-50%',
                  y: '-50%',
                  translateX: isWide && !reduced ? d * 470 : 0,
                  rotateY: reduced || !isWide ? 0 : d * -18,
                  scale: d === 0 ? 1 : 0.85,
                  opacity: visible ? 1 : 0,
                  filter: d === 0 ? 'blur(0px) brightness(1)' : 'blur(1.5px) brightness(0.65)',
                  zIndex: d === 0 ? 10 : 5 - abs,
                }}
                transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
                style={{
                  pointerEvents: visible ? 'auto' : 'none',
                  transformOrigin: d < 0 ? 'right center' : d > 0 ? 'left center' : 'center',
                }}
                drag={count > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.12}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1)
                  else if (info.offset.x > 60) go(-1)
                }}
              >
                <ReviewCard review={review} active={d === 0} />
              </motion.div>
            )
          })}
        </div>

        {/* controls */}
        <div className="container-x mt-7 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            data-cursor="hover"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition-all duration-500 ease-premium hover:border-blue-glow/50 hover:bg-blue-main/10 hover:shadow-glow-sm"
          >
            <Icon name="arrowRight" size={18} className="rotate-180" />
          </button>

          <div className="flex items-center gap-2">
            {reviews.map((r, i) => (
              <button
                key={i}
                type="button"
                aria-label={'Show testimonial ' + (i + 1) + ' of ' + count + ', ' + r.name}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ease-premium ${
                  i === index ? 'w-7 bg-blue-grad shadow-glow-sm' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            data-cursor="hover"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white transition-all duration-500 ease-premium hover:border-blue-glow/50 hover:bg-blue-main/10 hover:shadow-glow-sm"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
