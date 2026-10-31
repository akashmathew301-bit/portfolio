/**
 * Page-wide atmosphere: thin grid lines, two slow blue auras and a
 * film-grain overlay. All fixed + pointer-events-none, so it costs
 * nothing on scroll (no repaint, no layout).
 */
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* grid */}
      <div className="absolute inset-0 grid-lines [mask-image:radial-gradient(90%_75%_at_50%_30%,#000_35%,transparent_85%)] opacity-70" />
      {/* auras */}
      <div className="animate-breathe absolute -left-[12%] top-[6%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(10,108,255,0.16),transparent_68%)] blur-[60px]" />
      <div
        className="animate-breathe absolute -right-[14%] top-[48%] h-[52vw] w-[52vw] rounded-full bg-[radial-gradient(circle,rgba(0,75,147,0.2),transparent_70%)] blur-[70px]"
        style={{ animationDelay: '-3.5s' }}
      />
      {/* grain */}
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_50%_0%,transparent_45%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  )
}
