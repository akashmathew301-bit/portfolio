import Icon from '../components/Icon'
import SectionHeading from '../components/SectionHeading'
import SmartImage from '../components/SmartImage'
import MagneticButton from '../components/MagneticButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import useTilt from '../hooks/useTilt'
import { scrollToId } from '../lib/smoothScroll'
import projects from '../data/projects'

function ProjectCard({ project }) {
  const tiltRef = useTilt({ max: 5, scale: 1.01 })
  const clickable = Boolean(project.url)
  const Tag = clickable ? 'a' : 'article'

  return (
    <Tag
      ref={tiltRef}
      href={clickable ? project.url : undefined}
      target={clickable ? '_blank' : undefined}
      rel={clickable ? 'noopener noreferrer' : undefined}
      data-cursor="hover"
      className="grad-border group relative block h-full overflow-hidden rounded-3xl [transform-style:preserve-3d] will-tf"
      style={{ '--mx': '50%', '--my': '50%' }}
    >
      <div className="glass relative h-full overflow-hidden rounded-3xl">
        {/* visual */}
        <div className="relative aspect-[16/11] w-full overflow-hidden">
          <SmartImage
            src={project.image}
            fallback={project.fallback}
            alt={project.title + ' — ' + project.category}
            className="h-full w-full transition-transform duration-[900ms] ease-premium group-hover:scale-[1.06]"
            placeholderLabel="Screenshot coming soon"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.9),rgba(0,0,0,0.15)_55%,transparent)]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(420px circle at var(--mx) var(--my), rgba(10,108,255,0.26), transparent 65%)',
            }}
          />

          {project.placeholder && (
            <span className="absolute left-4 top-4 rounded-full border border-blue-glow/30 bg-ink-950/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-glow backdrop-blur">
              {project.placeholder}
            </span>
          )}

          <span className="absolute right-4 top-4 rounded-full border border-white/10 bg-ink-950/70 px-2.5 py-1 text-[11px] text-muted backdrop-blur">
            {project.year}
          </span>
        </div>

        {/* body */}
        <div className="relative z-10 -mt-12 px-5 pb-5 sm:px-6 sm:pb-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-blue-glow">
            {project.category}
          </p>
          <h3 className="mt-2 flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {project.title}
            <Icon
              name="arrowUpRight"
              size={18}
              className="translate-y-0.5 text-muted opacity-0 transition-all duration-500 ease-premium group-hover:translate-y-0 group-hover:text-blue-glow group-hover:opacity-100"
            />
          </h3>

          {/* hover-revealed blurb */}
          <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[600ms] ease-premium group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <p className="pt-3 text-[13.5px] leading-relaxed text-muted">{project.blurb}</p>
            </div>
          </div>

          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-muted/90"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Tag>
  )
}

export default function Work() {
  return (
    <section id="work" className="section-pad relative z-10">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Selected work"
            lines={[
              'Real sites, real',
              { text: 'businesses, live today.', node: <span className="text-grad">businesses, live today.</span> },
            ]}
            lead="Every one of these is live right now. Manufacturing, healthcare, legal, agri-tech, fitness, retail and events — tap a card to open the site and judge it yourself."
            className="max-w-2xl"
          />
          <div className="shrink-0">
            <MagneticButton variant="outline" icon="arrowRight" onClick={() => scrollToId('contact', -40)}>
              Start yours
            </MagneticButton>
          </div>
        </div>

        <RevealGroup
          className="mt-12 grid gap-4 [perspective:1400px] sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
          stagger={0.08}
          amount={0.1}
        >
          {projects.map((project) => (
            <RevealItem key={project.id} className="h-full">
              <ProjectCard project={project} />
            </RevealItem>
          ))}
        </RevealGroup>

        {projects.length === 0 && (
          <p className="mt-12 text-center text-muted">Projects are being added. Check back soon.</p>
        )}
      </div>
    </section>
  )
}
