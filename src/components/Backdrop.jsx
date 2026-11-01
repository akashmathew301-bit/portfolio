/**
 * Page-wide atmosphere: thin grid lines, two slow blue auras, a rising field
 * of glowing blue particles and a film-grain overlay. All fixed +
 * pointer-events-none, so it costs nothing on scroll (no repaint, no layout).
 */

/* ------------------------------------------------------------------
   PARTICLE FIELD
   Every particle is a glow: a radial core with a matching halo. Nothing
   here is a flat dot, because a flat dot on this background reads as dust
   on the screen rather than light in the scene.

   They all travel upward on one long loop. Start positions come from a
   golden-angle walk (deterministic, so no hydration drift and no impure
   call during render) and each one carries a NEGATIVE animation delay, so
   at any moment the stream is already spread over the full height instead
   of launching together.
   ------------------------------------------------------------------ */
function field(count, { min, max, seed, blur, alpha, slow }) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + seed
    const t = ((n * 7919) % 1000) / 1000
    const duration = slow + (((n * 31) % 100) / 100) * slow * 0.8
    return {
      x: (n * 37.5076 + (n % 5) * 4.1) % 100,
      size: min + t * (max - min),
      blur,
      opacity: alpha[0] + (((n * 13) % 10) / 10) * (alpha[1] - alpha[0]),
      drift: (n % 2 ? 1 : -1) * (10 + ((n * 17) % 40)),
      rise: 112 + ((n * 7) % 26),
      duration,
      /* spread the stream out along its own path */
      delay: -((i / count) * duration).toFixed(2),
      bright: n % 4 === 0,
    }
  })
}

const NEAR = field(34, { min: 2.5, max: 5.5, seed: 1, blur: 0, alpha: [0.45, 0.95], slow: 22 })
const FAR = field(14, { min: 9, max: 22, seed: 61, blur: 5, alpha: [0.14, 0.32], slow: 34 })

function Particle({ d }) {
  return (
    <span
      className="animate-dot absolute rounded-full"
      style={{
        left: `${d.x}%`,
        top: '100%',
        width: `${d.size}px`,
        height: `${d.size}px`,
        background: d.bright
          ? 'radial-gradient(circle,#E4F2FF 0%,#6FB8FF 42%,rgba(45,156,255,0) 72%)'
          : 'radial-gradient(circle,#9AD2FF 0%,#2D9CFF 40%,rgba(10,108,255,0) 72%)',
        boxShadow: `0 0 ${d.size * 4}px ${d.size * 1.1}px rgba(45,156,255,${d.bright ? 0.55 : 0.35})`,
        filter: d.blur ? `blur(${d.blur}px)` : undefined,
        '--dot-opacity': d.opacity,
        '--dot-drift': `${d.drift}px`,
        '--dot-rise': `${d.rise}vh`,
        animationDuration: `${d.duration}s`,
        animationDelay: `${d.delay}s`,
      }}
    />
  )
}

export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* grid */}
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(90%_75%_at_50%_30%,#000_35%,transparent_85%)] opacity-70" />

      {/* auras */}
      <div className="animate-breathe absolute -left-[12%] top-[6%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.16),transparent_68%)] blur-[60px]" />
      <div
        className="animate-breathe absolute -right-[14%] top-[48%] h-[52vw] w-[52vw] rounded-full bg-[radial-gradient(circle,rgba(0,75,147,0.2),transparent_70%)] blur-[70px]"
        style={{ animationDelay: '-3.5s' }}
      />

      {/* far, soft embers first; sharp ones ride over them */}
      <div className="absolute inset-0">
        {FAR.map((d, i) => (
          <Particle key={'f' + i} d={d} />
        ))}
      </div>
      <div className="absolute inset-0">
        {NEAR.map((d, i) => (
          <Particle key={'n' + i} d={d} />
        ))}
      </div>

      {/* grain */}
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      {/* vignette, kept under the particles so they still read at the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_0%,transparent_45%,rgba(0,0,0,0.72)_100%)]" />
    </div>
  )
}
