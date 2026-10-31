import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useIsTouch } from '../hooks/useMediaQuery'
import useReducedMotion from '../hooks/useReducedMotion'

const INTERACTIVE = 'a,button,[role="button"],input,textarea,select,label,[data-cursor="hover"]'

/**
 * Blue dot + trailing ring. The ring lags behind the dot and swells over
 * anything interactive. Never rendered on touch devices or with reduced motion.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (isTouch || reduced) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' })

    let visible = false
    const onMove = (e) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const grow = () => {
      gsap.to(ring, {
        scale: 1.9,
        borderColor: 'rgba(45,156,255,0.95)',
        backgroundColor: 'rgba(10,108,255,0.12)',
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(dot, { scale: 0.4, duration: 0.35, ease: 'power3.out' })
    }
    const shrink = () => {
      gsap.to(ring, {
        scale: 1,
        borderColor: 'rgba(255,255,255,0.35)',
        backgroundColor: 'rgba(10,108,255,0)',
        duration: 0.35,
        ease: 'power3.out',
      })
      gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power3.out' })
    }

    const onOver = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE)) grow()
    }
    const onOut = (e) => {
      if (e.target.closest && e.target.closest(INTERACTIVE)) shrink()
    }
    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.18 })
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25 })
    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeaveWindow)
      gsap.killTweensOf([dot, ring])
    }
  }, [isTouch, reduced])

  if (isTouch || reduced) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[150] hidden lg:block">
      <span
        ref={ringRef}
        className="absolute left-0 top-0 h-9 w-9 rounded-full border border-white/35 opacity-0"
      />
      <span
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-blue-glow opacity-0 shadow-[0_0_12px_rgba(45,156,255,0.9)]"
      />
    </div>
  )
}
