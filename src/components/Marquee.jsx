import { Fragment } from 'react'

/**
 * Infinite CSS marquee. The track is rendered twice and translated by -50%,
 * so the loop is seamless with a single transform animation (GPU only).
 */
export default function Marquee({
  items = [],
  duration = 36,
  reverse = false,
  separator = '•',
  className = '',
  itemClassName = '',
  pauseOnHover = true,
}) {
  const track = (
    <div className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
      {items.map((item, i) => (
        <Fragment key={i}>
          <span className={itemClassName}>{item}</span>
          {separator ? (
            <span aria-hidden="true" className="text-blue-main/70">
              {separator}
            </span>
          ) : null}
        </Fragment>
      ))}
    </div>
  )

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={{ '--marquee-duration': duration + 's' }}
    >
      <div
        className={`flex w-max will-tf ${reverse ? 'animate-marquee-rev' : 'animate-marquee'} ${
          pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''
        }`}
      >
        {track}
        <div aria-hidden="true" className="contents">
          {track}
        </div>
      </div>
    </div>
  )
}
