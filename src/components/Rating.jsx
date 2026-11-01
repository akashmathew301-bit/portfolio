import { useState } from 'react'
import { StarIcon } from './Icon'

/** Star row. `value` may be fractional (e.g. 4.7), the last star part-fills. */
export function Stars({ value = 5, size = 15, className = '', label }) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-blue-glow ${className}`}
      role="img"
      aria-label={label || value + ' out of 5 stars'}
    >
      {stars.map((s) => {
        const fill = Math.max(0, Math.min(1, value - (s - 1)))
        return (
          <span key={s} className="relative inline-block" style={{ width: size, height: size }}>
            <span className="absolute inset-0 text-white/15">
              <StarIcon size={size} filled />
            </span>
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: fill * 100 + '%' }}
              aria-hidden="true"
            >
              <StarIcon size={size} filled />
            </span>
          </span>
        )
      })}
    </span>
  )
}

/** Avatar with an automatic initials fallback. */
export function Avatar({ src, name = '', size = 48, className = '' }) {
  const [failed, setFailed] = useState(false)
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  const box = { width: size, height: size }

  if (!src || failed) {
    return (
      <span
        style={box}
        aria-hidden="true"
        className={`inline-flex shrink-0 items-center justify-center rounded-full border border-white/12 bg-[linear-gradient(140deg,rgba(10,108,255,0.35),rgba(0,75,147,0.18))] font-display text-sm font-semibold text-white ${className}`}
      >
        {initials || '★'}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={box}
      className={`shrink-0 rounded-full border border-white/12 object-cover ${className}`}
    />
  )
}
