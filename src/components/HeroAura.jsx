import { useEffect, useRef } from 'react'
import useReducedMotion from '../hooks/useReducedMotion'

/**
 * Hero particle field. Deliberately cheap:
 *  - device pixel ratio capped at 1.5
 *  - particle count scales with viewport width (24 on a phone, ~70 on desktop)
 *  - single 2D canvas, additive glow via radial gradients, no shaders
 *  - stops rendering when the hero scrolls out of view
 */
export default function HeroAura() {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let w = 0
    let h = 0
    let dpr = 1
    let particles = []
    let raf = 0
    let running = true
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = Math.max(1, Math.round(rect.width))
      h = Math.max(1, Math.round(rect.height))
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(Math.min(70, Math.max(24, w / 18)))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.9,
        vx: (Math.random() - 0.5) * 0.16,
        vy: -0.06 - Math.random() * 0.22,
        a: 0.16 + Math.random() * 0.5,
        depth: 0.3 + Math.random() * 0.7,
      }))
    }

    const draw = () => {
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      const ox = (pointer.x - 0.5) * 26
      const oy = (pointer.y - 0.5) * 18

      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.y < -12) {
          p.y = h + 12
          p.x = Math.random() * w
        }
        if (p.x < -12) p.x = w + 12
        if (p.x > w + 12) p.x = -12

        const px = p.x + ox * p.depth
        const py = p.y + oy * p.depth
        const g = ctx.createRadialGradient(px, py, 0, px, py, p.r * 6)
        g.addColorStop(0, 'rgba(45,156,255,' + p.a + ')')
        g.addColorStop(0.45, 'rgba(10,108,255,' + p.a * 0.35 + ')')
        g.addColorStop(1, 'rgba(10,108,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, p.r * 6, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      if (running) raf = requestAnimationFrame(draw)
    }

    const onPointer = (e) => {
      pointer.tx = e.clientX / window.innerWidth
      pointer.ty = e.clientY / window.innerHeight
    }

    resize()
    raf = requestAnimationFrame(draw)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    window.addEventListener('pointermove', onPointer, { passive: true })

    // Pause when the hero leaves the viewport.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true
          raf = requestAnimationFrame(draw)
        } else if (!entry.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  )
}
