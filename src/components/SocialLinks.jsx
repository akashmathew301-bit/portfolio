import Icon from './Icon'
import site from '../data/site'

/**
 * Social buttons that light up in each platform's own brand colour on hover
 * (Instagram gets its full orange→purple gradient, WhatsApp green, LinkedIn
 * blue). Colours live in `site.socials` so there is one place to edit them.
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
            style={{ '--brand': s.color, '--brand-glow': s.glow }}
            className={`group relative flex ${dims} items-center justify-center overflow-hidden rounded-full border border-white/12 bg-white/[0.04] text-white transition-[transform,border-color,box-shadow] duration-500 ease-premium hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:shadow-[0_8px_26px_-6px_var(--brand-glow)]`}
          >
            {/* brand colour wash, revealed on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-0 scale-0 rounded-full opacity-0 transition-all duration-500 ease-premium group-hover:scale-100 group-hover:opacity-100"
              style={{ background: s.gradient || s.color }}
            />
            <Icon
              name={s.icon}
              size={icon}
              className="relative z-10 transition-transform duration-500 ease-premium group-hover:scale-110"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
