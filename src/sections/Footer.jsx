import { useEffect, useState } from 'react'
import Icon from '../components/Icon'
import Reveal, { RevealGroup, RevealItem } from '../components/Reveal'
import SocialLinks from '../components/SocialLinks'
import { scrollToId, scrollToTop } from '../lib/smoothScroll'
import site, { whatsappLink } from '../data/site'
import services from '../data/services'

/** Akash's local time, live. Small detail, but it tells you he is a person. */
function LocalTime() {
  const [now, setNow] = useState('')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    })
    const tick = () => setNow(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 20000)
    return () => window.clearInterval(id)
  }, [])

  if (!now) return null
  return (
    <span className="tabular-nums text-white">
      {now} <span className="text-muted">IST</span>
    </span>
  )
}

/** Small capitalised column head with its index, like a contents page. */
function ColumnHead({ n, children }) {
  return (
    <h2 className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] text-muted">
      <span className="font-mono text-[10px] tabular-nums text-blue-glow/60">{n}</span>
      {children}
      <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(255,255,255,0.14),transparent)]" />
    </h2>
  )
}

/** Link that grows a blue rule and steps right on hover. */
function FooterLink({ children, ...rest }) {
  return (
    <a
      data-cursor="hover"
      className="group inline-flex items-center gap-2 text-[14.5px] text-white/90 transition-colors duration-300 hover:text-white"
      {...rest}
    >
      <span className="h-px w-0 bg-blue-glow transition-all duration-500 ease-premium group-hover:w-4" />
      <span className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5">
        {children}
      </span>
    </a>
  )
}

/** Contact row: brand-tinted icon chip, label, then the value itself. */
function ContactRow({ icon, brand, label, value, mono, ...rest }) {
  return (
    <a
      data-cursor="hover"
      style={{ '--brand': brand }}
      className="group flex items-start gap-3"
      {...rest}
    >
      <span className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[color:var(--brand)]/40 bg-white/[0.04] transition-[background-color,box-shadow,transform] duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_22px_-8px_var(--brand)]">
        <span
          aria-hidden="true"
          className="absolute inset-0 scale-0 rounded-xl opacity-0 transition-all duration-500 ease-premium group-hover:scale-100 group-hover:opacity-100"
          style={{ background: brand }}
        />
        <Icon
          name={icon}
          size={16}
          style={{ color: brand }}
          className="relative z-10 transition-colors duration-500 group-hover:!text-white"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] uppercase tracking-[0.16em] text-muted">{label}</span>
        <span
          className={`mt-0.5 block break-all text-[14.5px] font-medium text-white ${
            mono ? 'tabular-nums' : ''
          }`}
        >
          {value}
          <span className="block h-px w-0 bg-[color:var(--brand)] transition-all duration-500 ease-premium group-hover:w-full" />
        </span>
      </span>
    </a>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-10 overflow-hidden pt-10 sm:pt-12">
      {/* top edge: hairline with a light that sweeps along it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden">
        <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]" />
        <span className="animate-beam absolute inset-y-0 w-[22%] bg-[linear-gradient(90deg,transparent,rgba(45,156,255,0.95),transparent)]" />
      </div>

      {/* the monogram, huge and almost gone, anchoring the bottom right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-16 w-[42vw] max-w-[560px] opacity-[0.038] grayscale sm:-bottom-28 sm:-right-20"
      >
        <picture>
          <source srcSet={site.images.mark.src} type="image/webp" />
          <img src={site.images.mark.fallback} alt="" loading="lazy" decoding="async" className="w-full" />
        </picture>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 left-1/2 h-72 w-[80vw] max-w-3xl -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.16),transparent_70%)] blur-3xl"
      />

      <div className="container-x relative">
        {/* ---------------- status strip ---------------- */}
        <Reveal y={16}>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 text-[12.5px] text-muted backdrop-blur sm:px-6">
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2BE673] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2BE673]" />
              </span>
              <span className="text-white">Taking new projects</span>
            </span>

            <span aria-hidden="true" className="hidden h-4 w-px bg-white/10 sm:block" />

            <span className="inline-flex items-center gap-2">
              <Icon name="pin" size={14} className="text-blue-glow" />
              Coimbatore, working anywhere
            </span>

            <span aria-hidden="true" className="hidden h-4 w-px bg-white/10 sm:block" />

            <span className="inline-flex items-center gap-2">
              <Icon name="clock" size={14} className="text-blue-glow" />
              <LocalTime />
            </span>

            <span className="ml-auto hidden text-right text-[12px] lg:block">
              Most messages answered the same day
            </span>
          </div>
        </Reveal>

        {/* ---------------- main grid ---------------- */}
        <div className="grid gap-10 py-11 lg:grid-cols-12 lg:gap-8 lg:py-12">
          {/* brand */}
          <div className="lg:col-span-4">
            <Reveal>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToTop()
                }}
                className="group inline-block"
                aria-label={site.brand}
                data-cursor="hover"
              >
                <picture>
                  <source srcSet={site.images.mark.src} type="image/webp" />
                  <img
                    src={site.images.mark.fallback}
                    alt=""
                    width={site.images.mark.width}
                    height={site.images.mark.height}
                    loading="lazy"
                    decoding="async"
                    className="h-[72px] w-auto transition-transform duration-500 ease-premium group-hover:scale-105 sm:h-20"
                  />
                </picture>
              </a>
              <p className="mt-6 max-w-sm text-[14.5px] leading-relaxed text-white/90">
                I build websites and fix digital problems for any business that asks, wherever it
                is. If the site is not bringing you enquiries, it is not finished.
              </p>
              <SocialLinks className="mt-7" />
            </Reveal>
          </div>

          {/* nav */}
          <nav aria-label="Footer" className="lg:col-span-2">
            <Reveal delay={0.05}>
              <ColumnHead n="01">Navigate</ColumnHead>
              <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-col">
                {site.nav.map((item) => (
                  <li key={item.id}>
                    <FooterLink
                      href={'#' + item.id}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToId(item.id, -70)
                      }}
                    >
                      {item.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          </nav>

          {/* services */}
          <div className="lg:col-span-3">
            <Reveal delay={0.1}>
              <ColumnHead n="02">Services</ColumnHead>
              <RevealGroup
                className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:flex lg:flex-col"
                stagger={0.05}
              >
                {services.map((s) => (
                  <RevealItem key={s.id} y={12}>
                    <button
                      type="button"
                      onClick={() => scrollToId('services', -40)}
                      data-cursor="hover"
                      className="group inline-flex items-center gap-2 text-left text-[14px] text-white/85 transition-colors duration-300 hover:text-white"
                    >
                      <span className="h-px w-0 bg-blue-glow transition-all duration-500 ease-premium group-hover:w-4" />
                      <span className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5">
                        {s.title}
                      </span>
                    </button>
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>
          </div>

          {/* contact */}
          <div className="lg:col-span-3">
            <Reveal delay={0.15}>
              <ColumnHead n="03">Contact</ColumnHead>

              <div className="mt-5 space-y-4">
                <ContactRow
                  icon="phone"
                  brand="#2D9CFF"
                  label="Phone"
                  value={site.phoneDisplay}
                  mono
                  href={'tel:+' + site.phoneIntl}
                />
                <ContactRow
                  icon="whatsapp"
                  brand="#25D366"
                  label="WhatsApp"
                  value="Message me"
                  href={whatsappLink('Hi Akash, I found your website and want to connect.')}
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <ContactRow
                  icon="mail"
                  brand="#8AB4F8"
                  label="Email"
                  value={site.email}
                  href={'mailto:' + site.email}
                />
                <ContactRow
                  icon="linkedin"
                  brand="#0A66C2"
                  label="LinkedIn"
                  value={site.linkedinHandle}
                  href={site.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <ContactRow
                  icon="instagram"
                  brand="#E1306C"
                  label="Instagram"
                  value={site.instagramHandle}
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </div>
            </Reveal>
          </div>
        </div>

        {/* ---------------- bottom bar ---------------- */}
        <div className="border-t border-white/[0.07] py-7">
          <p className="text-center text-[13px] text-muted">
            © {year} {site.brand}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
