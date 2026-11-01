import Icon from './Icon'
import site from '../data/site'

/**
 * Social buttons that sit in their platform's own colour at rest: the button
 * is filled with the brand (Instagram gets its full orange to purple
 * gradient, WhatsApp green, LinkedIn blue) and hover only lifts it and pushes
 * the glow. Colours live in `site.socials`, one place to edit them.
 */
export default function SocialLinks({ size = 'md', className = '', items }) {
  const links = items || site.socials
  const dims = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  const icon = size === 'sm' ? 17 : 19

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            aria-label={s.label}
            title={s.label}
            data-cursor="hover"
            style={{
              '--brand': s.color,
              '--brand-glow': s.glow,
              background: s.gradient || s.color,
            }}
            className={`group relative flex ${dims} items-center justify-center overflow-hidden rounded-full border border-white/20 text-white shadow-[0_8px_20px_-10px_var(--brand-glow)] transition-[transform,box-shadow] duration-500 ease-premium hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_var(--brand-glow)]`}
          >
            {/* gloss, so the fill reads as a button rather than a flat swatch */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(150deg,rgba(255,255,255,0.35),rgba(255,255,255,0.08)_42%,transparent_65%)]"
            />
            <Icon
              name={s.icon}
              size={icon}
              className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] transition-transform duration-500 ease-premium group-hover:scale-110"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
