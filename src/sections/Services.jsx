import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import useTilt from '../hooks/useTilt'
import { scrollToId } from '../lib/smoothScroll'
import { useApp } from '../context/AppContext'
import services from '../data/services'

/* ------------------------------------------------------------------
   Bento layout. A flat 4x2 grid of identical cards read as a price list;
   giving the two services people actually search for ("website" and "SEO")
   twice the room turns the same content into a composition. The spans below
   are the whole layout, everything else is shared card furniture.
   ------------------------------------------------------------------ */
const SPAN = {
  'website-development': 'lg:col-span-4',
  'website-revamp': 'lg:col-span-2',
  'e-commerce': 'lg:col-span-2',
  seo: 'lg:col-span-4',
  'digital-marketing': 'lg:col-span-3',
  'logo-design': 'lg:col-span-3',
  'video-editing': 'lg:col-span-3',
  'social-media-management': 'lg:col-span-3',
}
/* the two wide ones lay their content out sideways and get bigger type */
const FEATURE = new Set(['website-development', 'seo'])

/** Glossy icon slab, same construction as the banner marks. */
function IconTile({ name, large }) {
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center rounded-2xl border border-white/[0.14] bg-[linear-gradient(150deg,#22365c,#101d33_48%,#070d18)] text-blue-glow shadow-[0_14px_28px_-14px_rgba(0,0,0,0.9),0_0_26px_-8px_rgba(45,156,255,0.6)] transition-transform duration-500 ease-premium group-hover:-translate-y-1 ${
        large ? 'h-16 w-16' : 'h-12 w-12'
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.28),rgba(255,255,255,0.05)_36%,transparent_60%)]"
      />
      <Icon name={name} size={large ? 28 : 22} className="relative z-10" />
    </span>
  )
}

/* The two wide cards would otherwise sit half empty, so each gets a quiet
   line-art prop in the corner: a browser for the build work, a search result
   for the SEO work. Decorative only, never announced to a screen reader. */
function Ornament({ id }) {
  if (id === 'website-development') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 240 150"
        className="pointer-events-none absolute -bottom-3 right-2 hidden w-[210px] text-blue-glow/35 transition-transform duration-700 ease-premium group-hover:-translate-y-1 sm:block sm:w-[250px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <rect x="14" y="10" width="212" height="132" rx="12" />
        <path d="M14 36h212" />
        <circle cx="31" cy="23" r="3.2" />
        <circle cx="44" cy="23" r="3.2" />
        <circle cx="57" cy="23" r="3.2" />
        <path d="M34 56h58M34 72h96M34 88h74M34 104h110" className="opacity-70" />
        <path d="M150 58l-14 13 14 13M176 58l14 13-14 13M170 52l-14 40" className="text-blue-glow" />
      </svg>
    )
  }
  if (id === 'seo') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 240 150"
        className="pointer-events-none absolute -bottom-2 right-2 hidden w-[200px] text-blue-glow/35 transition-transform duration-700 ease-premium group-hover:-translate-y-1 sm:block sm:w-[240px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="16" y="12" width="180" height="30" rx="15" />
        <circle cx="176" cy="27" r="7" />
        <path d="m181 32 7 7" />
        <path d="M36 27h92" className="opacity-70" />
        <rect x="18" y="96" width="26" height="40" rx="5" className="opacity-80" />
        <rect x="56" y="78" width="26" height="58" rx="5" className="opacity-80" />
        <rect x="94" y="88" width="26" height="48" rx="5" className="opacity-80" />
        <rect x="132" y="60" width="26" height="76" rx="5" />
        <path d="M24 86 68 62l24 12 60-32" className="text-blue-glow" strokeWidth="2" />
        <path d="M140 30h14v14" className="text-blue-glow" strokeWidth="2" />
      </svg>
    )
  }
  return null
}

function ServiceCard({ service, index }) {
  const tiltRef = useTilt({ max: 6 })
  const { requestService } = useApp()
  const feature = FEATURE.has(service.id)

  return (
    <button
      type="button"
      ref={tiltRef}
      onClick={() => requestService(service.title)}
      aria-label={'Enquire about ' + service.title}
      data-cursor="hover"
      className="grad-border group relative flex h-full w-full flex-col rounded-[26px] text-left [transform-style:preserve-3d] will-tf"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      <div
        className={`glass relative flex h-full flex-col overflow-hidden rounded-[26px] transition-colors duration-500 ease-premium ${
          feature ? 'p-6 sm:p-7' : 'p-5 sm:p-6'
        }`}
      >
        {/* cursor-following glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(380px circle at var(--mx) var(--my), rgba(10,108,255,0.24), transparent 68%)',
          }}
        />
        {/* standing blue wash on the feature cards, hover-only on the rest */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 bg-[linear-gradient(155deg,rgba(10,108,255,0.18),rgba(0,75,147,0.06)_55%,transparent)] transition-opacity duration-500 ${
            feature ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
        {/* top hairline that lights up */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.9),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        {feature && <Ornament id={service.id} />}

        {/* ghost index */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-2 -top-5 font-display font-bold leading-none text-white/[0.05] transition-colors duration-500 group-hover:text-white/[0.09] ${
            feature ? 'text-[7rem]' : 'text-[4.5rem]'
          }`}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="relative z-10 flex h-full flex-col">
          <div className={feature ? 'sm:flex sm:gap-6' : ''}>
            <IconTile name={service.icon} large={feature} />

            <div className={feature ? 'min-w-0 flex-1' : ''}>
              <h3
                className={`mt-5 font-display font-semibold leading-snug tracking-tight text-white ${
                  feature ? 'text-xl sm:mt-0 sm:text-2xl' : 'text-[17px] sm:text-lg'
                }`}
              >
                {service.title}
              </h3>

              <p
                className={`mt-2.5 leading-relaxed text-white/85 ${
                  feature ? 'max-w-lg text-[14.5px] sm:text-[15px]' : 'text-[13.5px]'
                }`}
              >
                {service.description}
              </p>

              {/* deliverables as chips: lighter than a bullet list, and every
                  card keeps the same visual weight whatever the copy length */}
              <ul className="mt-5 flex flex-wrap gap-2">
                {service.points.map((p) => (
                  <li
                    key={p}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.03] px-2.5 py-1.5 text-[11.5px] text-white/75 transition-colors duration-500 group-hover:border-blue-main/30 group-hover:text-white"
                  >
                    <Icon name="check" size={10} strokeWidth={2.6} className="text-blue-glow" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA row: gradient pill + matching arrow, so the action on every
              card reads as the same button rather than a text link */}
          <span className="relative mt-auto flex items-center justify-between gap-3 pt-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-grad px-4 py-2 text-[12.5px] font-medium text-white shadow-glow-sm transition-shadow duration-500 ease-premium group-hover:shadow-glow">
              Start this project
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-grad text-white shadow-glow-sm transition-[box-shadow,transform] duration-500 ease-premium group-hover:shadow-glow">
              <Icon
                name="arrowUpRight"
                size={15}
                className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </span>
          </span>
        </div>
      </div>
    </button>
  )
}

export default function Services() {
  return (
    <section id="services" className="section-pad relative z-10 overflow-hidden">
      {/* section glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[18%] h-[46vh] w-[92vw] max-w-5xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,108,255,0.12),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What I do"
            lines={[
              'Everything your business',
              {
                text: 'needs to be found online.',
                node: (
                  <>
                    needs to be <span className="text-grad">found online.</span>
                  </>
                ),
              },
            ]}
            lead="Eight things I do, and one person answerable for all of them. Pick the one you need and it drops straight into the enquiry form, already filled in."
            className="max-w-2xl"
          />
          <div className="shrink-0">
            <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
              Get a quote
            </MagneticButton>
          </div>
        </div>

        <RevealGroup
          className="mt-9 grid items-stretch gap-4 [perspective:1400px] sm:mt-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-5"
          stagger={0.07}
          amount={0.1}
        >
          {services.map((service, i) => (
            <RevealItem key={service.id} y={40} className={`h-full ${SPAN[service.id] || 'lg:col-span-2'}`}>
              <ServiceCard service={service} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
