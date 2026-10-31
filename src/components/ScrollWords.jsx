import { Fragment, useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useReducedMotion from '../hooks/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Word-by-word brightness reveal driven by scroll position (scrubbed).
 * The paragraph "lights up" as you scroll through it.
 */
export default function ScrollWords({ text, className = '', wordClassName = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const words = useMemo(() => text.split(' '), [text])

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.18, filter: 'blur(0.4px)' },
        {
          opacity: 1,
          filter: 'blur(0px)',
          ease: 'none',
          stagger: 0.5,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            end: 'bottom 55%',
            scrub: 0.6,
          },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [reduced, text])

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span
            data-word
            className={`inline-block ${wordClassName}`}
            style={reduced ? undefined : { opacity: 0.18 }}
          >
            {w}
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </p>
  )
}
