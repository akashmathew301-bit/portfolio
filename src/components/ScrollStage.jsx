import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * Wraps a section so it eases in as it arrives and eases back out as it
 * leaves, which is what makes a long page feel like scenes rather than one
 * continuous scroll.
 *
 * Deliberately OPACITY ONLY. A transform here would create a containing
 * block and shift every measurement inside, and several sections do their
 * own scroll maths (the process rail, the scroll-lit paragraphs, the
 * coverflow). Fading costs nothing and never moves a trigger point.
 */
export default function ScrollStage({ children, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  /* in over the first slice of the passage, hold, out over the last */
  /* never all the way to zero: a section that blanks out mid-interaction
     (a form field, a dragged carousel) reads as a bug, not as a transition */
  const opacity = useTransform(scrollYProgress, [0, 0.13, 0.87, 1], [0.08, 1, 1, 0.2])

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  )
}
