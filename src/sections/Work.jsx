import { useEffect, useRef, useState } from 'react'

import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/SmartImage'
import MagneticButton from '../components/MagneticButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import useTilt from '../hooks/useTilt'
import { scrollToId } from '../lib/smoothScroll'
import projects from '../data/projects'

/** cornext.in from https://cornext.in/whatever, for the chrome bar. */
function domainOf(url) {
  if (!url) return 'preview'
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '')
}

function ProjectCard({ project, index }) {
  const tiltRef = useTilt({ max: 5, scale: 1.01 })
  const clickable = Boolean(project.url)
  const Tag = clickable ? 'a' : 'article'

  return (
    <Tag
      ref={tiltRef}
      href={clickable ? project.url : undefined}
      target={clickable ? '_blank' : undefined}
      rel={clickable ? 'noopener noreferrer' : undefined}
      data-cursor="hover"
      className="grad-border group relative block h-full overflow-hidden rounded-[26px] [transform-style:preserve-3d] will-tf"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      <div className="glass relative flex h-full flex-col overflow-hidden rounded-[26px]">
        {/* corner bloom */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.35),transparent_70%)] opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
        />

        {/* ---- browser chrome: the screenshot reads as a live site, not a picture ---- */}
        <div className="relative z-10 flex items-center gap-2 border-b border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
          <span aria-hidden="true" className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
            <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
            <span className="h-2 w-2 rounded-full bg-[#28C840]/70" />
          </span>
          <span className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-white/[0.07] bg-ink-950/60 px-2.5 py-1">
            <Icon name="check" size={9} strokeWidth={3} className="shrink-0 text-[#2BE673]" />
            <span className="truncate font-mono text-[11px] text-white/60">
              {domainOf(project.url)}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="font-mono text-[11px] tabular-nums text-white/25 transition-colors duration-500 group-hover:text-blue-glow/70"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* ---- visual ---- */}
        <div className="relative aspect-[16/11] w-full overflow-hidden">
          <SmartImage
            src={project.image}
            fallback={project.fallback}
            alt={project.title + ', ' + project.category}
            className="h-full w-full transition-transform duration-[900ms] ease-premium group-hover:scale-[1.07]"
            placeholderLabel="Screenshot coming soon"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(4,8,15,0.96),rgba(4,8,15,0.25)_52%,transparent)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(420px circle at var(--mx) var(--my), rgba(10,108,255,0.26), transparent 65%)',
            }}
          />

          {project.placeholder && (
            <span className="absolute left-4 top-4 rounded-full border border-blue-glow/30 bg-ink-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-glow backdrop-blur">
              {project.placeholder}
            </span>
          )}

          {/* the blurb slides out of the image, so the card height never jumps */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-4 sm:px-6">
            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[600ms] ease-premium group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <p className="text-[13px] leading-relaxed text-white/85">{project.blurb}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- body ---- */}
        <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <div className="flex items-center gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-glow">
              {project.category}
            </p>
            <span aria-hidden="true" className="h-px flex-1 bg-white/[0.09]" />
            <span className="font-mono text-[11px] tabular-nums text-muted">{project.year}</span>
          </div>

          <h3 className="mt-2.5 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {project.title}
          </h3>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70 transition-colors duration-500 group-hover:border-blue-main/30 group-hover:text-white"
              >
                {t}
              </li>
            ))}
          </ul>

          {/* same CTA treatment as the service cards */}
          <div className="mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-grad px-4 py-2 text-[12.5px] font-medium text-white shadow-glow-sm transition-shadow duration-500 ease-premium group-hover:shadow-glow">
              {clickable ? 'Visit live site' : 'Case study soon'}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-grad text-white shadow-glow-sm transition-shadow duration-500 ease-premium group-hover:shadow-glow">
              <Icon
                name="arrowUpRight"
                size={15}
                className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </div>
        </div>
      </div>
    </Tag>
  )
}

/**
 * Position readout for the mobile slider: which card you are on, how far
 * through you are, and a nudge that there is more to the right.
 *
 * Ten projects is too many for a row of tappable dots at phone width, each
 * target ends up below the size a thumb can reliably hit, so this reads the
 * scroll position back instead of trying to drive it. The swipe is the
 * control; this just tells you where you are.
 */
function SliderProgress({ index, count }) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    <div className="mt-5 flex items-center gap-4 sm:hidden">
      <span className="font-mono text-[11px] tabular-nums text-white">
        {pad(index + 1)}
        <span className="text-white/30"> / {pad(count)}</span>
      </span>

      <span aria-hidden="true" className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-blue-grad shadow-glow-sm transition-transform duration-500 ease-premium"
          style={{ width: `${100 / count}%`, transform: `translateX(${index * 100}%)` }}
        />
      </span>

      <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] text-muted">
        Swipe
        <Icon name="arrowRight" size={13} className="text-blue-glow" />
      </span>
    </div>
  )
}

export default function Work() {
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const count = projects.length

  /* Which card is nearest the middle of the track. Read from the real scroll
     position rather than kept in state and pushed, so a flick, a drag and a
     keyboard tab into a card all report the same answer. */
  useEffect(() => {
    const el = trackRef.current
    if (!el || count < 2) return
    let ticking = false

    const read = () => {
      ticking = false
      const cards = el.children
      if (!cards.length) return
      const middle = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestGap = Infinity
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        const gap = Math.abs(card.offsetLeft + card.offsetWidth / 2 - middle)
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

    read()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [count])

  return (
    <section id="work" className="section-pad relative z-10">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            lines={[
              'Real sites, real',
              { text: 'businesses, live today.', node: <span className="text-grad">businesses, live today.</span> },
            ]}
            lead="Every one of these is live right now and earning its keep. Manufacturing, healthcare, legal, agri-tech, fitness, retail and events. Open any of them and judge the work yourself."
            className="max-w-2xl"
          />
          <div className="shrink-0">
            <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
              Start yours
            </MagneticButton>
          </div>
        </div>

        {/* ---------------- the work ----------------
             One card at a time on a phone, swiped. Ten of these stacked
             vertically is a very long scroll past work the visitor did not ask
             to see one by one; side by side they can flick through and stop at
             the one that looks like their own business.

             It is a native scroll-snap track, not a JS carousel: the swipe is
             the browser's own, so it keeps its momentum, its rubber band and
             its accessibility for free. From sm up nothing changes, the same
             children fall back into the original grid. */}
        <RevealGroup
          innerRef={trackRef}
          data-lenis-prevent="true"
          className="no-scrollbar -mx-5 mt-9 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 [perspective:1400px] sm:mx-0 sm:mt-10 sm:grid sm:snap-none sm:overflow-x-visible sm:px-0 sm:pb-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          stagger={0.08}
          amount={0.1}
        >
          {projects.map((project, i) => (
            <RevealItem
              key={project.id}
              className="w-[85vw] max-w-[360px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:h-full"
            >
              <ProjectCard project={project} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>

        {count > 1 && <SliderProgress index={index} count={count} />}

        {count === 0 && (
          <p className="mt-12 text-center text-muted">Projects are being added. Check back soon.</p>
        )}
      </div>
    </section>
  )
}
