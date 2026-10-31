import { Fragment } from 'react'
import { motion } from 'framer-motion'
import useReducedMotion from '../hooks/useReducedMotion'

const EASE = [0.22, 1, 0.36, 1]

/** Generic fade / slide reveal on scroll. */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 28,
  x = 0,
  duration = 0.8,
  once = true,
  amount = 0.25,
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag] || motion.div

  if (reduced) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: EASE }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/** Staggered container — pair with <RevealItem>. */
export function RevealGroup({ children, className = '', stagger = 0.08, delay = 0, amount = 0.2, once = true }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className = '', y = 34, as: Tag = 'div', ...rest }) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag] || motion.div
  if (reduced)
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    )
  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Line-by-line mask reveal. Each line sits in an overflow-hidden box and
 * rises out of it — the signature "awwwards" headline entrance.
 */
export function MaskLines({
  lines = [],
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.12,
  duration = 1,
  animate = true, // set false to hold until a parent is ready (e.g. preloader)
  as: Tag = 'h2',
}) {
  const reduced = useReducedMotion()
  const label = lines.map((l) => (typeof l === 'string' ? l : l.text)).join(' ')

  return (
    <Tag className={className} aria-label={label}>
      {lines.map((line, i) => {
        const content = typeof line === 'string' ? line : line.node
        return (
          <span key={i} className="block overflow-hidden pb-[0.12em]" aria-hidden="true">
            <motion.span
              className={`block will-tf ${lineClassName}`}
              initial={reduced ? false : { y: '110%' }}
              animate={reduced || animate ? { y: '0%' } : { y: '110%' }}
              transition={{ duration, ease: EASE, delay: delay + i * stagger }}
            >
              {content}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

/** Word-by-word entrance (viewport triggered). */
export function SplitWords({ text, className = '', wordClassName = '', delay = 0, stagger = 0.03, as: Tag = 'p' }) {
  const reduced = useReducedMotion()
  const MotionTag = motion[Tag] || motion.p
  const words = text.split(' ')

  if (reduced) return <Tag className={className}>{text}</Tag>

  return (
    <MotionTag
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom" aria-hidden="true">
            <motion.span
              className={`inline-block will-tf ${wordClassName}`}
              variants={{
                hidden: { y: '105%', opacity: 0 },
                show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </Fragment>
      ))}
    </MotionTag>
  )
}
