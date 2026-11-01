import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { Avatar, Stars } from '../components/Rating'
import useCountUp from '../hooks/useCountUp'
import useMediaQuery from '../hooks/useMediaQuery'
import useReducedMotion from '../hooks/useReducedMotion'
import reviews from '../data/reviews'

const AUTOPLAY_MS = 5200
const EASE = [0.22, 1, 0.36, 1]

/**
 * Fixed card size from lg up, where three of these sit side by side in the
 * coverflow and any height difference between them would be obvious.
 *
 * Below lg the height follows the copy instead. A fixed height there meant a
 * quote longer than 336px of column was quietly clipped behind a hidden
 * scrollbar, so testimonials ended mid-sentence with nothing to say they had
 * more to give. Only one card is on screen at a phone width, so matching
 * heights bought nothing and cost the words.
 */
function ReviewCard({ review, active }) {
  return (
    <figure
      className={`glass relative flex h-auto w-full min-h-[272px] flex-col overflow-hidden rounded-[26px] p-6 transition-[border-color,box-shadow] duration-500 sm:p-7 lg:h-[312px] lg:w-[470px] lg:min-h-0 lg:p-8 ${
        active ? 'border-blue-main/30 shadow-[0_0_54px_-28px_rgba(45,156,255,0.55)]' : ''
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.9),transparent)] transition-opacity duration-500 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(150deg,rgba(10,108,255,0.12),rgba(0,75,147,0.05)_45%,transparent_72%)]"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.22),transparent_70%)] blur-2xl transition-opacity duration-500 ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-1 top-6 font-display text-[9rem] font-bold leading-none text-white/[0.045]"
      >
        &rdquo;
      </span>

      <div className="no-scrollbar relative flex-1 pr-1 lg:overflow-y-auto">
        <Stars value={review.rating} size={15} />
        <blockquote className="mt-4 font-display text-[15px] font-medium leading-[1.65] tracking-tight text-white/90 lg:text-base">
          {review.text}
        </blockquote>
      </div>

      <span aria-hidden="true" className="relative mt-5 h-px shrink-0 bg-white/[0.12]" />

      <figcaption className="relative mt-4 flex shrink-0 items-center gap-3.5">
        <span className="relative shrink-0">
          <Avatar src={review.avatar} name={review.name} size={48} className="!rounded-2xl" />
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute -inset-0.5 rounded-[18px] ring-1 transition-colors duration-500 ${
              active ? 'ring-blue-main/45' : 'ring-white/10'
            }`}
          />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[15.5px] font-semibold leading-tight text-white">
            {review.name}
          </span>
          <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">
            {[review.role, review.business].filter(Boolean).join(' · ')}
          </span>
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * Headline stat. Deliberately NOT a star score or anything that looks like a
 * Google rating, Akash has no collected ratings yet, so this counts the work
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
        <span className="text-[11.5px] text-muted">Five years of work for real businesses</span>
      </span>
    </div>
  )
}

export default function Reviews() {
  const reduced = useReducedMotion()
  const isWide = useMediaQuery('(min-width: 1024px)')
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
        className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,108,255,0.09),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div className="flex flex-col items-start gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Testimonials"
            lines={[
              {
                text: 'What clients say.',
                node: (
                  <>
                    What clients <span className="text-grad">say.</span>
                  </>
                ),
              },
            ]}
            lead="Short notes from the owners, in their own words. Ask any of them and they will tell you the same thing."
            className="max-w-xl"
          />
          <Reveal delay={0.1} className="shrink-0">
            <DeliveredStat count={120} />
          </Reveal>
        </div>
      </div>

      {/* ---------------- the carousel ----------------
           Two layouts, one state: a 3D coverflow where there is room for it,
           stacked cross-fading cards where there is not. Drag, arrow keys and
           dots move both; autoplay pauses on hover and focus. */}
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
        className="relative mt-9 select-none outline-none sm:mt-10"
      >
        {isWide ? (
          /* ---------------- 3D coverflow, lg and up ----------------
             The neighbouring cards rotate away in perspective and blur back,
             so the active quote is unmistakable. */
          <div className="relative mx-auto h-[352px] w-full max-w-[1400px] [perspective:1200px]">
            {reviews.map((review, i) => {
              const d = offsetOf(i)
              const abs = Math.abs(d)
              const visible = reduced ? d === 0 : abs <= 1
              return (
                <motion.div
                  key={i}
                  aria-hidden={d !== 0}
                  className="absolute left-1/2 top-1/2 flex cursor-grab items-center justify-center will-tf active:cursor-grabbing"
                  initial={false}
                  animate={{
                    x: '-50%',
                    y: '-50%',
                    translateX: reduced ? 0 : d * 482,
                    rotateY: reduced ? 0 : d * -18,
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
        ) : (
          /* ---------------- stacked cards, below lg ----------------
             The coverflow has nothing to spread out at this width: the
             neighbours sit exactly behind the active card, so it was building
             a pile of invisible 3D layers to show one. Here the cards share a
             single grid cell and cross-fade in place. The cell is as tall as
             the longest quote, so no card clips its own words and the page
             never changes height as the autoplay moves on. */
          <div className="container-x">
            <div className="mx-auto grid w-full max-w-[460px]">
              {reviews.map((review, i) => {
                const current = i === index
                return (
                  <motion.div
                    key={i}
                    aria-hidden={!current}
                    className="flex cursor-grab [grid-area:1/1] active:cursor-grabbing"
                    initial={false}
                    animate={{ opacity: current ? 1 : 0, scale: current ? 1 : 0.97 }}
                    transition={{ duration: reduced ? 0 : 0.42, ease: EASE }}
                    style={{ pointerEvents: current ? 'auto' : 'none' }}
                    drag={count > 1 ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -60) go(1)
                      else if (info.offset.x > 60) go(-1)
                    }}
                  >
                    <ReviewCard review={review} active={current} />
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* controls */}
        <div className="container-x mt-7 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            data-cursor="hover"
            className="glow-ring relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-ink-950/80 text-white transition-all duration-500 ease-premium hover:bg-blue-main/15 hover:shadow-glow-sm"
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
                className="group flex h-9 items-center px-2"
              >
                <span
                  aria-hidden="true"
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-premium ${
                    i === index ? 'w-7 bg-blue-grad' : 'w-1.5 bg-white/20 group-hover:bg-white/40'
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonial"
            data-cursor="hover"
            className="glow-ring relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-ink-950/80 text-white transition-all duration-500 ease-premium hover:bg-blue-main/15 hover:shadow-glow-sm"
          >
            <Icon name="arrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
