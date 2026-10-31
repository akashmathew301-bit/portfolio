import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotionNow } from './useReducedMotion'

/**
 * Magnetic hover: the element (and optionally an inner label) drifts
 * toward the cursor, then springs back on leave.
 * Automatically disabled on touch devices and with reduced motion.
 */
export default function useMagnetic({ strength = 0.35, labelStrength = 0.18, radius = 1 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotionNow()) return

    const label = el.querySelector('[data-magnetic-label]')
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' })
    const lxTo = label ? gsap.quickTo(label, 'x', { duration: 0.6, ease: 'power3.out' }) : null
    const lyTo = label ? gsap.quickTo(label, 'y', { duration: 0.6, ease: 'power3.out' }) : null

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = (e.clientX - (r.left + r.width / 2)) * radius
      const dy = (e.clientY - (r.top + r.height / 2)) * radius
      xTo(dx * strength)
      yTo(dy * strength)
      if (lxTo) {
        lxTo(dx * labelStrength)
        lyTo(dy * labelStrength)
      }
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
      if (lxTo) {
        lxTo(0)
        lyTo(0)
      }
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
      if (label) gsap.killTweensOf(label)
    }
  }, [strength, labelStrength, radius])

  return ref
}
