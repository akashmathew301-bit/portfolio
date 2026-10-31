import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotionNow } from './useReducedMotion'

/**
 * 3D tilt + a cursor-following blue glow.
 * The glow position is written to CSS custom properties (--mx / --my)
 * so the visual layer stays pure CSS and cheap to paint.
 */
export default function useTilt({ max = 9, scale = 1.015, glow = true } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotionNow()) return

    const rxTo = gsap.quickTo(el, 'rotateX', { duration: 0.55, ease: 'power3.out' })
    const ryTo = gsap.quickTo(el, 'rotateY', { duration: 0.55, ease: 'power3.out' })
    const sTo = gsap.quickTo(el, 'scale', { duration: 0.55, ease: 'power3.out' })

    let frame = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width
      const py = (e.clientY - r.top) / r.height
      rxTo((0.5 - py) * max * 2)
      ryTo((px - 0.5) * max * 2)
      if (glow) {
        cancelAnimationFrame(frame)
        frame = requestAnimationFrame(() => {
          el.style.setProperty('--mx', `${px * 100}%`)
          el.style.setProperty('--my', `${py * 100}%`)
        })
      }
    }
    const onEnter = () => sTo(scale)
    const onLeave = () => {
      rxTo(0)
      ryTo(0)
      sTo(1)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [max, scale, glow])

  return ref
}
