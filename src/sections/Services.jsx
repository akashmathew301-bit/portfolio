import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import MagneticButton from '../components/MagneticButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import useTilt from '../hooks/useTilt'
import { scrollToId } from '../lib/smoothScroll'
import { useApp } from '../context/AppContext'
import services from '../data/services'

function ServiceCard({ service, index }) {
  const tiltRef = useTilt({ max: 7 })
  const { requestService } = useApp()

  return (
    <button
      type="button"
      ref={tiltRef}
      onClick={() => requestService(service.title)}
      aria-label={'Enquire about ' + service.title}
      data-cursor="hover"
      className="grad-border group relative flex h-full w-full flex-col rounded-3xl text-left [transform-style:preserve-3d] will-tf"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      <div className="glass relative flex h-full flex-col overflow-hidden rounded-3xl p-5 transition-colors duration-500 ease-premium sm:p-6">
        {/* cursor-following glow */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(360px circle at var(--mx) var(--my), rgba(10,108,255,0.22), transparent 68%)',
          }}
        />
        {/* corner light that blooms on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.45),transparent_70%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        />
        {/* top hairline that lights up */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.9),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* icon + index */}
          <div className="flex items-start justify-between">
            <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(145deg,rgba(10,108,255,0.28),rgba(255,255,255,0.03))] text-blue-glow shadow-glow-sm transition-all duration-500 ease-premium group-hover:-translate-y-1 group-hover:border-blue-glow/40 group-hover:shadow-glow">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.22),transparent_60%)]"
              />
              <Icon name={service.icon} size={25} className="relative z-10" />
            </span>
            <span
              aria-hidden="true"
              className="font-display text-sm font-semibold tracking-[0.2em] text-white/20 transition-colors duration-500 group-hover:text-blue-glow/70"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <h3 className="mt-5 font-display text-lg font-semibold leading-snug tracking-tight text-white sm:text-xl">
            {service.title}
          </h3>

          <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{service.description}</p>

          {/* deliverables — pushed to a consistent position by mt-auto */}
          <ul className="mt-5 space-y-2 border-t border-white/[0.07] pt-4">
            {service.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-[12.5px] text-white/70">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-main/15 text-blue-glow">
                  <Icon name="check" size={10} strokeWidth={2.4} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <span className="mt-auto flex items-center justify-between gap-2 pt-6 text-[13px] font-medium text-white/70 transition-colors duration-500 group-hover:text-white">
            Start this project
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] transition-all duration-500 ease-premium group-hover:border-blue-glow/50 group-hover:bg-blue-main/20 group-hover:text-blue-glow">
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
            lead="Eight things I do, one person accountable for all of them. Tap any card and it drops straight into the enquiry form with that service already filled in."
            className="max-w-2xl"
          />
          <div className="shrink-0">
            <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
              Get a quote
            </MagneticButton>
          </div>
        </div>

        <RevealGroup
          className="mt-12 grid items-stretch gap-4 [perspective:1400px] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4"
          stagger={0.07}
          amount={0.1}
        >
          {services.map((service, i) => (
            <RevealItem key={service.id} className="h-full">
              <ServiceCard service={service} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
