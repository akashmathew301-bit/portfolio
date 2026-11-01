/* ------------------------------------------------------------------
   ORBIT MARKS
   ------------------------------------------------------------------
   The glossy objects that ride the banner's orbit. Everything here is
   vector + CSS so it stays razor sharp at any size and on any screen,
   and costs nothing to download.

   The 3D read comes from four stacked layers on every tile:
     1. a deep diagonal body gradient        (form)
     2. a top-left specular sheen            (gloss)
     3. a 1px inset highlight ring           (edge light)
     4. a coloured outer bloom + cast shadow (lift off the page)
   ------------------------------------------------------------------ */

/** Shared glossy slab. `glow` tints the bloom so each mark has its own light. */
function Tile({ children, glow = 'rgba(45,156,255,0.55)', body, className = '' }) {
  return (
    <span
      style={{ '--glow': glow }}
      className={`relative flex items-center justify-center rounded-[26%] border border-white/[0.14] shadow-[0_18px_34px_-14px_rgba(0,0,0,0.95),0_0_34px_-6px_var(--glow)] ${
        body || 'bg-[linear-gradient(150deg,#22365c_0%,#101d33_45%,#070d18_100%)]'
      } ${className}`}
    >
      {/* gloss */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(145deg,rgba(255,255,255,0.3),rgba(255,255,255,0.06)_34%,transparent_58%)]"
      />
      {/* edge light */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/[0.16]"
      />
      {/* floor bounce */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-[18%] rounded-[50%] bg-[radial-gradient(ellipse,var(--glow),transparent_70%)] opacity-60 blur-[6px]"
      />
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </span>
  )
}

/* ------------------------------------------------------- 01  code */
export function CodeMark({ className = '' }) {
  return (
    <Tile
      glow="rgba(109,92,255,0.65)"
      body="bg-[linear-gradient(150deg,#3b3f8f_0%,#1b1f4d_48%,#0b0e22_100%)]"
      className={className}
    >
      <svg viewBox="0 0 48 48" className="h-[52%] w-[52%]" aria-hidden="true">
        <defs>
          <linearGradient id="om-code" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8EA2FF" />
            <stop offset="55%" stopColor="#4D6BFF" />
            <stop offset="100%" stopColor="#6D4DFF" />
          </linearGradient>
        </defs>
        <g
          fill="none"
          stroke="url(#om-code)"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 14 6 24l11 10" />
          <path d="M31 14l11 10-11 10" />
          <path d="M26.5 9 21.5 39" strokeWidth="4.6" />
        </g>
      </svg>
    </Tile>
  )
}

/* ------------------------------------------------- 02  growth chart */
export function GrowthMark({ className = '' }) {
  return (
    <Tile glow="rgba(45,156,255,0.6)" className={className}>
      <svg viewBox="0 0 48 48" className="h-[58%] w-[58%]" aria-hidden="true">
        <defs>
          <linearGradient id="om-bar" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#0A4FBF" />
            <stop offset="100%" stopColor="#4FB0FF" />
          </linearGradient>
          <linearGradient id="om-arrow" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#2BE673" />
            <stop offset="100%" stopColor="#8CFFC0" />
          </linearGradient>
        </defs>
        {/* bars, tallest last so the arrow lands on it */}
        <g>
          <rect x="5" y="28" width="8" height="15" rx="2.4" fill="url(#om-bar)" opacity="0.75" />
          <rect x="16" y="21" width="8" height="22" rx="2.4" fill="url(#om-bar)" opacity="0.88" />
          <rect x="27" y="25" width="8" height="18" rx="2.4" fill="url(#om-bar)" opacity="0.8" />
          <rect x="38" y="13" width="8" height="30" rx="2.4" fill="url(#om-bar)" />
        </g>
        {/* rising arrow */}
        <path
          d="M6 32 18 22l7 6L41 9"
          fill="none"
          stroke="url(#om-arrow)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M31.5 8h10v10" fill="none" stroke="url(#om-arrow)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </Tile>
  )
}

/* --------------------------------------------------- 03  WordPress */
export function WordPressMark({ className = '' }) {
  return (
    <Tile glow="rgba(45,156,255,0.6)" className={className}>
      <svg viewBox="0 0 48 48" className="h-[60%] w-[60%]" aria-hidden="true">
        <defs>
          <linearGradient id="om-wp" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#B9D4FF" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="18.5" fill="none" stroke="url(#om-wp)" strokeWidth="2.6" />
        {/* the W, drawn rather than typed so it never depends on a font */}
        <path
          d="M11.5 17 17.5 31 24 19l6.5 12 6-14"
          fill="none"
          stroke="url(#om-wp)"
          strokeWidth="2.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tile>
  )
}

/* ------------------------------------------------------- 04  video */
export function VideoMark({ className = '' }) {
  return (
    <Tile
      glow="rgba(236,72,153,0.5)"
      body="bg-[linear-gradient(150deg,#5b2a6b_0%,#2a1540_48%,#0d0718_100%)]"
      className={className}
    >
      <svg viewBox="0 0 48 48" className="h-[50%] w-[50%]" aria-hidden="true">
        <defs>
          <linearGradient id="om-play" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFC2F0" />
            <stop offset="55%" stopColor="#F472D0" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill="none" stroke="url(#om-play)" strokeWidth="3" opacity="0.5" />
        <path d="M19.5 15.5 34 24l-14.5 8.5Z" fill="url(#om-play)" stroke="url(#om-play)" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </Tile>
  )
}

/* --------------------------------------------- 05  Google SEO pill */
/* A white search pill reads instantly as "found on Google", which is the
   whole point of the SEO work, so it is a pill rather than a tile. */
export function SeoPill({ className = '' }) {
  return (
    <span
      className={`relative flex items-center gap-2 rounded-full border border-black/5 bg-[linear-gradient(170deg,#FFFFFF,#E8EDF5)] px-2.5 py-1.5 shadow-[0_16px_30px_-12px_rgba(0,0,0,0.9),0_0_30px_-8px_rgba(255,255,255,0.35)] sm:gap-2.5 sm:px-3.5 sm:py-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.9),transparent_45%)]"
      />
      {/* Google G, four arcs with the bar punched in over the white body */}
      <svg viewBox="0 0 24 24" className="relative h-[15px] w-[15px] shrink-0 sm:h-[17px] sm:w-[17px]" aria-hidden="true">
        <g fill="none" strokeWidth="3.6">
          <path d="M12 4.5a7.5 7.5 0 0 1 6.5 3.75" stroke="#EA4335" strokeLinecap="round" />
          <path d="M18.5 7.75a7.5 7.5 0 0 1 0 8.5" stroke="#4285F4" strokeLinecap="round" />
          <path d="M18.5 16.25A7.5 7.5 0 0 1 5.5 16.25" stroke="#34A853" strokeLinecap="round" />
          <path d="M5.5 16.25a7.5 7.5 0 0 1 6.5-11.75" stroke="#FBBC05" strokeLinecap="round" />
        </g>
        <rect x="11.2" y="9.9" width="9" height="4.2" fill="#fff" />
        <path d="M12 12h7.4v2.6H12z" fill="#4285F4" />
      </svg>
      <span className="relative font-display text-[11px] font-semibold tracking-tight text-[#1f2937] sm:text-[13px]">
        SEO
      </span>
      <svg
        viewBox="0 0 24 24"
        className="relative h-[13px] w-[13px] shrink-0 text-[#5f6368] sm:h-[15px] sm:w-[15px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 4 4" />
      </svg>
    </span>
  )
}

/* ------------------------------------------------------ 06  +320% */
export function ResultBadge({ className = '' }) {
  return (
    <span
      className={`relative flex items-center gap-1.5 rounded-full border border-white/20 bg-[linear-gradient(160deg,#36F08A,#12B45C_55%,#0A7A3D)] px-2.5 py-1.5 shadow-[0_16px_30px_-12px_rgba(0,0,0,0.9),0_0_32px_-6px_rgba(43,230,115,0.75)] sm:px-3.5 sm:py-2 ${className}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(160deg,rgba(255,255,255,0.45),transparent_48%)]"
      />
      <svg
        viewBox="0 0 24 24"
        className="relative h-[13px] w-[13px] shrink-0 text-white sm:h-[15px] sm:w-[15px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 17 17 5" />
        <path d="M9 5h8v8" />
      </svg>
      <span className="relative font-display text-[11px] font-bold tracking-tight text-white sm:text-[13px]">
        +320%
      </span>
    </span>
  )
}
