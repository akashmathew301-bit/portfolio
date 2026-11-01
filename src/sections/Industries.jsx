import Icon from '../components/Icon'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import useCountUp from '../hooks/useCountUp'
import site from '../data/site'

const INDUSTRIES = [
  { label: 'Healthcare & clinics', icon: 'stethoscope' },
  { label: 'Manufacturing & export', icon: 'factory' },
  { label: 'Agri-tech', icon: 'leaf' },
  { label: 'Legal', icon: 'scales' },
  { label: 'Fitness', icon: 'dumbbell' },
  { label: 'Retail & boutiques', icon: 'bag' },
  { label: 'Events', icon: 'ticket' },
  { label: 'Creative studios', icon: 'palette' },
]

/**
 * One industry chip. `.spin-ring` draws the 2px border whose light segment
 * travels anti-clockwise; the stagger keeps the row from pulsing in unison.
 */
function IndustryPill({ label, icon, index }) {
  return (
    <Reveal
      as="li"
      y={18}
      delay={0.12 + index * 0.06}
      amount={0.4}
      className="spin-ring group rounded-full"
      style={{ '--ring-delay': `${index * -0.7}s`, '--ring-speed': '6.5s' }}
    >
      <span className="flex items-center gap-2.5 rounded-full border-2 border-white/[0.09] bg-white/[0.025] px-4 py-2.5 text-[13px] text-white/75 transition-colors duration-500 ease-premium group-hover:bg-white/[0.06] group-hover:text-white sm:px-5 sm:text-[14px]">
        <Icon
          name={icon}
          size={15}
          className="shrink-0 text-blue-glow/70 transition-colors duration-500 group-hover:text-blue-glow"
        />
        {label}
      </span>
    </Reveal>
  )
}

function Counter({ value, suffix, label, index }) {
  const [ref, current] = useCountUp(value)
  return (
    <div
      ref={ref}
      className="group relative h-full overflow-hidden rounded-[22px] border border-white/[0.07] bg-[linear-gradient(160deg,rgba(255,255,255,0.055),rgba(255,255,255,0.012))] p-5 transition-colors duration-700 ease-premium hover:border-blue-main/30 sm:p-6"
    >
      {/* corner bloom, only on hover */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.3),transparent_70%)] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
      />

      <span className="relative block font-display text-[11px] tabular-nums tracking-[0.2em] text-muted/55">
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="relative mt-5 block font-display text-[clamp(2.2rem,5.6vw,3.4rem)] font-semibold leading-none tracking-tight text-white sm:mt-7">
        <span className="tabular-nums">{current}</span>
        <span className="text-grad">{suffix}</span>
      </span>

      {/* hairline that fills in on hover */}
      <span aria-hidden="true" className="relative mt-4 block h-px w-full bg-white/[0.07]">
        <span className="absolute inset-y-0 left-0 w-0 bg-blue-grad transition-[width] duration-1000 ease-premium group-hover:w-full" />
      </span>

      <span className="relative mt-3 block text-[13px] leading-snug text-muted">{label}</span>
    </div>
  )
}

/**
 * Industries + numbers. Its own section so the chips and the counters get the
 * full page width instead of the About copy track.
 */
export default function Industries() {
  return (
    <section id="industries" className="relative z-10 overflow-hidden pb-14 pt-2 sm:pb-16 lg:pb-20 lg:pt-6">
      {/* soft field behind the numbers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[46vh] w-[88vw] max-w-5xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(10,108,255,0.1),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div
          aria-hidden="true"
          className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]"
        />

        <div className="mt-9 grid gap-9 lg:grid-cols-12 lg:gap-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Industries"
              lines={[
                'Different industries,',
                {
                  text: 'the same question every time.',
                  node: (
                    <>
                      the same <span className="text-grad">question every time.</span>
                    </>
                  ),
                },
              ]}
              lead="Clinics, factories, courtrooms, gyms and studios. The look changes with every project. The brief never does: who is your customer, and what do you want them to do next?"
            />
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.08}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted/80">
                Industries I have built for
              </p>
            </Reveal>
            <ul className="mt-5 flex flex-wrap gap-2.5 sm:gap-3">
              {INDUSTRIES.map((item, i) => (
                <IndustryPill key={item.label} {...item} index={i} />
              ))}
            </ul>
          </div>
        </div>

        <RevealGroup
          className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4 lg:gap-5"
          stagger={0.09}
        >
          {site.stats.map((stat, i) => (
            <RevealItem key={stat.label} className="h-full">
              <Counter {...stat} index={i} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
