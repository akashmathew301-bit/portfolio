import { useEffect, useState } from 'react'

/**
 * Tracks which section id is currently in view, for nav highlighting.
 * Uses a scroll listener with a fixed activation line so it stays
 * accurate while Lenis is animating (IntersectionObserver is laggy here).
 */
export default function useActiveSection(ids = []) {
  const [active, setActive] = useState(ids[0] || '')

  useEffect(() => {
    if (!ids.length) return
    let frame = 0

    const update = () => {
      const line = window.innerHeight * 0.35
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= line) current = id
      }
      // Pin the last section when the page is scrolled to the very bottom.
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 80) {
        current = ids[ids.length - 1]
      }
      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps

  return active
}
