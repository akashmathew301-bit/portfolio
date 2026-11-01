import { useRef } from 'react'
import { useInView } from 'framer-motion'
import Reveal, { MaskLines } from './Reveal'
import ScrollWords from './ScrollWords'

/**
 * Shared section header: eyebrow + masked headline + optional lead line.
 * `lines` is an array of strings or { text, node } so a word can be
 * wrapped in the blue gradient.
 */
export default function SectionHeading({ eyebrow, lines = [], lead, align = 'left', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.35 })
  const centered = align === 'center'

  return (
    <div
      ref={ref}
      className={`flex flex-col ${centered ? 'items-center text-center' : 'items-start text-left'} ${className}`}
    >
      {eyebrow && (
        <Reveal y={16}>
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-glow shadow-glow-sm" />
            {eyebrow}
          </span>
        </Reveal>
      )}

      <MaskLines
        as="h2"
        lines={lines}
        animate={inView}
        className="mt-5 w-full font-display text-[clamp(1.75rem,4.9vw,3.05rem)] font-semibold leading-[1.06]"
      />

      {lead &&
        (typeof lead === 'string' ? (
          /* the lead lights up word by word as you scroll past it */
          <ScrollWords
            text={lead}
            start="top 88%"
            end="bottom 68%"
            className={`mt-5 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-lg ${
              centered ? 'mx-auto' : ''
            }`}
          />
        ) : (
          <Reveal
            delay={0.15}
            className={`mt-5 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-lg ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {lead}
          </Reveal>
        ))}
    </div>
  )
}
