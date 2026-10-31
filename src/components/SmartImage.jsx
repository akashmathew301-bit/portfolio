import { useState } from 'react'
import Icon from './Icon'

/**
 * Image with a WebP source, a JPG fallback and a graceful placeholder.
 * If every source fails (or the file simply is not there yet) the layout
 * still holds its shape and shows a branded panel instead of a broken icon.
 */
export default function SmartImage({
  src,
  fallback,
  alt,
  width,
  height,
  className = '',
  imgClassName = '',
  position = 'center',
  eager = false,
  fit = 'cover',
  placeholderLabel = 'Image coming soon',
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-[inherit] border border-white/10 bg-[linear-gradient(140deg,#05070A,#0A1428_55%,#05070A)] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="noise absolute inset-0 opacity-[0.05]" />
        <div className="absolute h-2/3 w-2/3 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.22),transparent_70%)] blur-2xl" />
        <div className="relative flex flex-col items-center gap-2 px-4 text-center">
          <Icon name="spark" size={26} className="text-blue-glow" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted">{placeholderLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <picture className={`block ${className}`}>
      {fallback && <source srcSet={src} type="image/webp" />}
      <img
        src={fallback || src}
        alt={alt}
        width={width}
        height={height}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : 'auto'}
        draggable="false"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={{ objectPosition: position }}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} transition-[opacity,filter] duration-700 ease-premium ${
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        } ${imgClassName}`}
      />
    </picture>
  )
}
