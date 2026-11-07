import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import Reveal from '../components/Reveal'
import { Avatar, Stars } from '../components/Rating'
import useCountUp from '../hooks/useCountUp'
import useMediaQuery from '../hooks/useMediaQuery'
import useReducedMotion from '../hooks/useReducedMotion'
import reviews from '../data/reviews'

/**
 * Autoplay is slower on a phone than on a desktop. There is one card on screen
 * instead of three, so the quote on it is the only thing being read, and it is
 * read on a small screen. 5.2s was enough of a glance for the coverflow and
 * not nearly enough here.
 */
const AUTOPLAY_WIDE_MS = 5200
const AUTOPLAY_TOUCH_MS = 7800

/**
 * How long autoplay keeps out of the way after a swipe, a tap or an arrow.
 * Without it the next tick could land a fraction of a second after the finger
 * left the screen and yank the card the visitor just chose.
 */
const QUIET_AFTER_INPUT_MS = 4000

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
  const [inView, setInView] = useState(false)

  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  /* when a human last touched the carousel, so autoplay can keep its distance */
  const inputAtRef = useRef(0)
  /* which way autoplay is walking the phone track, see advance() */
  const dirRef = useRef(1)

  /* Autoplay only while the carousel is on screen. Otherwise someone scrolling
     down arrives at a quote that is already halfway through leaving. */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* Centre card i in the phone track. Measured off the card itself, so it lands
     exactly where snapping would and the track's padding does not matter. */
  const scrollToCard = useCallback(
    (i, smooth = true) => {
      const el = trackRef.current
      const card = el?.children?.[i]
      if (!card) return
      el.scrollTo({
        left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
        behavior: smooth && !reduced ? 'smooth' : 'auto',
      })
    },
    [reduced],
  )

  const go = useCallback(
    (dir) => {
      inputAtRef.current = Date.now()
      if (isWide) {
        setIndex((i) => (i + dir + count) % count)
        return
      }
      dirRef.current = dir
      const next = (index + dir + count) % count
      /* wrapping an end is a scroll across the whole track, so take it instantly
         rather than smearing every quote past the reader on the way */
      scrollToCard(next, Math.abs(next - index) === 1)
    },
    [isWide, count, index, scrollToCard],
  )

  const goTo = useCallback(
    (i) => {
      inputAtRef.current = Date.now()
      if (isWide) {
        setIndex(i)
        return
      }
      scrollToCard(i, Math.abs(i - index) <= 2)
    },
    [isWide, index, scrollToCard],
  )

  /* One step of autoplay.
     The coverflow loops freely: its cards are stacked in 3D, so last-to-first
     costs the same move as any other. The phone track cannot loop that cheaply,
     so it walks to the end and turns around instead. */
  const advance = useCallback(() => {
    if (isWide) {
      setIndex((i) => (i + 1) % count)
      return
    }
    let dir = dirRef.current
    if (index + dir > count - 1) dir = -1
    else if (index + dir < 0) dir = 1
    dirRef.current = dir
    scrollToCard(index + dir)
  }, [isWide, count, index, scrollToCard])

  useEffect(() => {
    if (paused || reduced || count < 2 || !inView) return
    /* advance() is rebuilt whenever the index moves, so this interval is too:
       a swipe, a dot or an arrow restarts the clock rather than inheriting
       whatever was left of the previous tick. That leftover was the old bug,
       a swipe could be followed by an autoplay jump a moment later. */
    const id = window.setInterval(
      () => {
        if (Date.now() - inputAtRef.current < QUIET_AFTER_INPUT_MS) return
        advance()
      },
      isWide ? AUTOPLAY_WIDE_MS : AUTOPLAY_TOUCH_MS,
    )
    return () => window.clearInterval(id)
  }, [paused, reduced, count, inView, isWide, advance])

  /* Which card the phone track has settled on, read from the real scroll
     position so a flick, a dot and an arrow all report the same answer. */
  useEffect(() => {
    const el = trackRef.current
    if (isWide || !el || count < 2) return
    let ticking = false

    const read = () => {
      ticking = false
      const cards = el.children
      if (!cards.length) return
      const middle = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestGap = Infinity
      for (let i = 0; i < cards.length; i++) {
        const gap = Math.abs(cards[i].offsetLeft + cards[i].offsetWidth / 2 - middle)
        if (gap < bestGap) {
          bestGap = gap
          best = i
        }
      }
      setIndex(best)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(read)
    }
    const onInput = () => {
      inputAtRef.current = Date.now()
    }

    read()
    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('pointerdown', onInput, { passive: true })
    el.addEventListener('touchstart', onInput, { passive: true })
    el.addEventListener('wheel', onInput, { passive: true })
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('pointerdown', onInput)
      el.removeEventListener('touchstart', onInput)
      el.removeEventListener('wheel', onInput)
    }
  }, [isWide, count])

  /**
   * Pause for a keyboard visitor stepping through with the arrow keys, not for
   * the phone visitor whose tap on a card or an arrow happens to focus the
   * region. Pausing on that tap left autoplay dead for the rest of the visit.
   */
  const onFocus = (e) => {
    const el = e.target
    if (el instanceof HTMLElement && el.matches(':focus-visible')) setPaused(true)
  }

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
    <section ref={sectionRef} id="reviews" className="section-pad relative z-10 overflow-hidden">
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
           Two layouts, one index: a 3D coverflow where there is room for it,
           a native scroll-snap track where there is not. Swipe, arrow keys,
           arrows and dots move both; autoplay pauses on hover, on keyboard
           focus, while the section is off screen, and for a few seconds after
           any input. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Client testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={onFocus}
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
          /* ---------------- native snap track, below lg ----------------
             This was a pile of cross-fading cards sharing one grid cell.
             Nothing followed the finger there, so a swipe was a guess that
             either did nothing or teleported the next card in, and it read as
             the carousel flicking past on its own.

             It is a scroll-snap track now, the same as the work slider: the
             swipe is the browser's own, so it keeps its momentum, its rubber
             band and its snapping for free, and the dots follow the scroll
             position rather than the other way round. */
          <div className="container-x">
            <div
              ref={trackRef}
              data-lenis-prevent="true"
              className="no-scrollbar -mx-5 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:-mx-8 sm:px-8"
            >
              {reviews.map((review, i) => (
                <div key={i} className="flex w-[85vw] max-w-[420px] shrink-0 snap-center sm:w-[400px]">
                  <ReviewCard review={review} active={i === index} />
                </div>
              ))}
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
                onClick={() => goTo(i)}
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
