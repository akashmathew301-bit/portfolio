import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export function getLenis() {
  return lenis
}

/**
 * Create the Lenis instance and drive it from GSAP's ticker so that
 * ScrollTrigger and Lenis share a single RAF loop (no jitter, no drift).
 */
export function initSmoothScroll({ reducedMotion = false } = {}) {
  if (lenis) return lenis

  lenis = new Lenis({
    duration: reducedMotion ? 0 : 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reducedMotion,
    syncTouch: false, // native inertia on touch = far better on mid-range phones
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
  })

  lenis.on('scroll', ScrollTrigger.update)

  const raf = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && lenis) lenis.scrollTo(value, { immediate: true })
      return lenis ? lenis.scroll : window.scrollY
    },
  })

  ScrollTrigger.refresh()

  return Object.assign(lenis, {
    __destroy() {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenis = null
    },
  })
}

export function destroySmoothScroll() {
  if (lenis && lenis.__destroy) lenis.__destroy()
  lenis = null
}

/** Stop / start scrolling (used by the preloader and the mobile menu). */
export function lockScroll(locked) {
  if (!lenis) {
    document.documentElement.style.overflow = locked ? 'hidden' : ''
    return
  }
  if (locked) lenis.stop()
  else lenis.start()
}

/** Anchor navigation that works with Lenis and falls back to native. */
export function scrollToId(id, offset = -70) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.2 })
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.3 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
