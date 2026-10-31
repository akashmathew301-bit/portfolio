import Marquee from '../components/Marquee'
import services from '../data/services'

/** Infinite scrolling strip of service names between the hero and the about block. */
export default function ServicesMarquee() {
  const items = services.map((s) => s.title)

  return (
    <section aria-hidden="true" className="relative z-10 border-y border-white/[0.07] bg-ink-950/60 py-5 backdrop-blur-sm sm:py-7">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink to-transparent sm:w-32" />

      <Marquee
        items={items}
        duration={42}
        itemClassName="font-display text-xl font-medium tracking-tight text-white/85 sm:text-3xl lg:text-4xl"
      />
      <Marquee
        items={items}
        duration={52}
        reverse
        separator="/"
        className="mt-3 sm:mt-5"
        itemClassName="font-sans text-xs uppercase tracking-[0.25em] text-muted/70 sm:text-sm"
      />
    </section>
  )
}
