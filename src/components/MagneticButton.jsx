import useMagnetic from '../hooks/useMagnetic'
import Icon from './Icon'

const VARIANTS = {
  primary:
    'text-white bg-blue-grad shadow-glow hover:shadow-glow-lg border border-white/10',
  outline:
    'text-white bg-ink-950/85 backdrop-blur border border-white/10 hover:border-blue-glow/45 hover:shadow-glow-sm',
  ghost:
    'text-muted hover:text-white border border-transparent hover:border-white/10',
}

/**
 * Magnetic CTA. Renders a <button> by default, or an <a> when `href` is given.
 * The inner label drifts slightly less than the shell, that offset is what
 * makes the effect read as "magnetic" rather than just "moving".
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  strength = 0.3,
  shimmer,
  /* fill the wrapper instead of sizing to the label, for rows where two
     buttons share the width evenly */
  block = false,
  ...rest
}) {
  const ref = useMagnetic({ strength })
  const Tag = href ? 'a' : 'button'
  /* the rotating shimmer edge is the signature on every CTA; pass
     shimmer={false} for the rare button that should sit quiet */
  const ring = shimmer ?? variant !== 'ghost'

  /* lg shrinks below sm so a pair of them fits one phone row rather than
     wrapping onto two. Only the hero and the orbit banner use lg. */
  const sizes = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-[15px]',
    lg: 'px-4 py-3.5 text-[13.5px] sm:px-8 sm:py-4 sm:text-base',
  }

  const button = (
    <Tag
      ref={ring ? undefined : ref}
      href={href}
      onClick={onClick}
      type={href ? undefined : rest.type || 'button'}
      data-cursor="hover"
      className={`group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-medium tracking-tight transition-[box-shadow,border-color,background-color] duration-500 ease-premium will-tf sm:gap-2.5 ${
        block ? 'w-full' : ''
      } ${sizes[size]} ${VARIANTS[variant]} ${ring ? '' : className}`}
      {...rest}
    >
      {/* light sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.28),transparent)] transition-transform duration-[900ms] ease-premium group-hover:translate-x-full"
      />
      <span data-magnetic-label className="relative z-10 inline-flex items-center gap-2 sm:gap-2.5">
        {children}
        {icon && (
          <Icon
            name={icon}
            size={16}
            className="shrink-0 transition-transform duration-500 ease-premium group-hover:translate-x-0.5"
          />
        )}
      </span>
    </Tag>
  )

  if (!ring) return button

  return (
    <span ref={ref} className={`shimmer-wrap will-tf ${className}`}>
      {button}
    </span>
  )
}
