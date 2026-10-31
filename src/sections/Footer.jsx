import Icon from '../components/Icon'
import Reveal from '../components/Reveal'
import SocialLinks from '../components/SocialLinks'
import useMagnetic from '../hooks/useMagnetic'
import { scrollToId, scrollToTop } from '../lib/smoothScroll'
import site from '../data/site'
import services from '../data/services'

function BackToTop() {
  const ref = useMagnetic({ strength: 0.4 })
  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      data-cursor="hover"
      className="glow-ring group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-ink-950 text-white transition-[box-shadow,background-color] duration-500 ease-premium hover:bg-blue-main/10 hover:shadow-glow"
    >
      {/* soft bloom under the travelling ring */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1.5 rounded-full bg-[radial-gradient(circle,rgba(45,156,255,0.35),transparent_70%)] opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100"
      />
      <Icon
        name="arrowUp"
        size={19}
        className="relative z-10 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5"
      />
    </button>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/[0.07] pt-16 sm:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[1px] w-[70%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.6),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[80vw] max-w-3xl -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.16),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        <div className="grid gap-10 pb-14 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="lg:col-span-5">
            <Reveal>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTop()
                }}
                className="inline-flex items-center gap-3"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-grad font-display text-lg font-bold text-white shadow-glow-sm">
                  A
                </span>
                <span className="font-display text-xl font-semibold tracking-tight">
                  {site.brand}
                </span>
              </a>
              <p className="mt-5 max-w-sm text-[14.5px] leading-relaxed text-muted">
                {site.role} in {site.location}. Websites, search visibility and content that help
                local businesses grow.
              </p>
              <SocialLinks className="mt-6" />
            </Reveal>
          </div>

          {/* nav */}
          <nav aria-label="Footer" className="lg:col-span-3">
            <Reveal delay={0.05}>
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Navigate</h2>
              <ul className="mt-4 space-y-2.5">
                {site.nav.map((item) => (
                  <li key={item.id}>
                    <a
                      href={'#' + item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToId(item.id, -70)
                      }}
                      data-cursor="hover"
                      className="group inline-flex items-center gap-2 text-[14.5px] text-muted transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-blue-glow transition-all duration-500 ease-premium group-hover:w-4" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          {/* services + contact */}
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <h2 className="text-[11px] uppercase tracking-[0.2em] text-muted">Services</h2>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {services.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId('services', -40)}
                      className="text-[13.5px] text-muted transition-colors hover:text-white"
                    >
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>

              <h2 className="mt-8 text-[11px] uppercase tracking-[0.2em] text-muted">Contact</h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={'tel:+' + site.phoneIntl}
                    className="text-[14.5px] text-white transition-colors hover:text-blue-glow"
                  >
                    {site.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={'mailto:' + site.email}
                    className="break-all text-[14.5px] text-white transition-colors hover:text-blue-glow"
                  >
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={site.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14.5px] text-white transition-colors hover:text-[#0A66C2]"
                  >
                    LinkedIn · {site.linkedinHandle}
                  </a>
                </li>
                <li className="text-[14.5px] text-muted">{site.location}</li>
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/[0.07] py-7 sm:flex-row">
          <p className="text-center text-[13px] text-muted sm:text-left">
            © {year} {site.brand}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="hidden text-[13px] text-muted sm:block">Built in Coimbatore</p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
