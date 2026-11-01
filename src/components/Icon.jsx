/* Hand-written stroke icons, no icon library, no extra bytes. */

const PATHS = {
  code: (
    <>
      <path d="m8 7-5 5 5 5" />
      <path d="m16 7 5 5-5 5" />
      <path d="m13.5 4-3 16" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 0 1-15.3 6.4L3 16" />
      <path d="M3 12a9 9 0 0 1 15.3-6.4L21 8" />
      <path d="M21 4v4h-4" />
      <path d="M3 20v-4h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.6" />
      <path d="M12 7.3V12l3.2 2" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H6" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17.5" cy="20" r="1.4" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.8-3.8" />
      <path d="M8.5 11.5h5M11 9v5" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10v4a2 2 0 0 0 2 2h2l8 4V4L8 8H6a2 2 0 0 0-2 2Z" />
      <path d="M19 9.5a3.5 3.5 0 0 1 0 5" />
      <path d="M8 16v4" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3a9 9 0 1 0 0 18c1.3 0 2-.9 2-2s-.7-2-.7-2.6c0-.8.7-1.4 1.6-1.4H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8Z" />
      <circle cx="8" cy="11" r="1.1" />
      <circle cx="11.5" cy="7.5" r="1.1" />
      <circle cx="16" cy="9.5" r="1.1" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M3 15h18M8 4v16M16 4v16" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5.5" r="2.6" />
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="18" cy="18.5" r="2.6" />
      <path d="m8.4 10.7 7.2-3.9M8.4 13.3l7.2 3.9" />
    </>
  ),
  phone: (
    <>
      <path d="M6.5 3h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.6 6.6L17 13l4 1.5v3a2.5 2.5 0 0 1-2.7 2.5C10.5 19.4 4.6 13.5 4 5.7A2.5 2.5 0 0 1 6.5 3Z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3.2" />
      <path d="M7.2 10.4v6.2" />
      <circle cx="7.2" cy="7.3" r="1.15" fill="currentColor" stroke="none" />
      <path d="M11.2 16.6v-3.5a2.3 2.3 0 0 1 4.6 0v3.5" />
      <path d="M11.2 16.6v-6.2" />
    </>
  ),
  chat: (
    <>
      <path d="M21 11.5a7.5 7.5 0 0 1-10.9 6.7L4 20l1.4-4.6A7.5 7.5 0 1 1 21 11.5Z" />
      <path d="M9 10.5h6M9 13.5h3.5" />
    </>
  ),
  pen: (
    <>
      <path d="m15.5 4.5 4 4L8 20H4v-4L15.5 4.5Z" />
      <path d="m13.5 6.5 4 4" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c3.3 2 5 5.4 5 9l-2.2 2.2H9.2L7 12c0-3.6 1.7-7 5-9Z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M9.2 14.2 7 18l3-.8M14.8 14.2 17 18l-3-.8" />
      <path d="M12 17.5V21" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z" />
      <path d="m4.5 12 7.5 4 7.5-4" />
      <path d="m4.5 16.3 7.5 4 7.5-4" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.5l1.6-4.5a8.4 8.4 0 1 1 15.4-4.4Z" />
      <path d="M9.2 9c-.3.7-.2 1.7.6 2.8a7.4 7.4 0 0 0 2.6 2.4c1.1.6 2 .6 2.6.2l.5-.9-1.8-1-.8.7a5.6 5.6 0 0 1-2-1.9l.7-.8-.9-1.8-.9.3Z" />
    </>
  ),
  arrowUp: (
    <>
      <path d="M12 20V5" />
      <path d="m5.5 11.5 6.5-6.5 6.5 6.5" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  arrowUpRight: (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.5 7H17v8.5" />
    </>
  ),
  quote: (
    <>
      <path d="M9.5 6C7 7.2 5.5 9.6 5.5 12.6V18h6v-6H8.8c0-1.8.7-3 2.2-3.8L9.5 6Z" />
      <path d="M18.5 6C16 7.2 14.5 9.6 14.5 12.6V18h6v-6h-2.7c0-1.8.7-3 2.2-3.8L18.5 6Z" />
    </>
  ),
  star: <path d="m12 3.5 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.9l6-.9L12 3.5Z" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </>
  ),
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  /* industry marks */
  stethoscope: (
    <>
      <path d="M6 3v5a4.5 4.5 0 0 0 9 0V3" />
      <path d="M6 3H4.3M15 3h1.7" />
      <path d="M10.5 12.5v2.2a4.8 4.8 0 0 0 9.5 0v-1.4" />
      <circle cx="20" cy="11.4" r="1.9" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20h18" />
      <path d="M3 20V10l5 3.2V10l5 3.2V10l5 3.2V20" />
      <path d="M18 10V5.5h2.6V10" />
    </>
  ),
  leaf: (
    <>
      <path d="M20 4c0 8.5-4.6 12.8-10.4 12.8A5.6 5.6 0 0 1 4 11.2C4 6.4 9.5 4 20 4Z" />
      <path d="M15.5 8.5 4.5 19.5" />
    </>
  ),
  scales: (
    <>
      <path d="M12 4v16M7.5 20h9" />
      <path d="M4.5 7.5h15" />
      <path d="M4.5 7.5 2 13.5h5l-2.5-6ZM19.5 7.5 17 13.5h5l-2.5-6Z" />
    </>
  ),
  dumbbell: (
    <>
      <path d="M3 10v4M6.5 7.5v9M17.5 7.5v9M21 10v4" />
      <path d="M6.5 12h11" />
    </>
  ),
  bag: (
    <>
      <path d="M4.5 7.5h15L18.5 20h-13L4.5 7.5Z" />
      <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
    </>
  ),
  ticket: (
    <>
      <path d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.3a2.2 2.2 0 0 0 0 4.4v1.3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1.3a2.2 2.2 0 0 0 0-4.4V8.5Z" />
      <path d="M14 7v2.2M14 14.8V17" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
      <path d="m6.3 6.3 3 3M14.7 14.7l3 3M17.7 6.3l-3 3M9.3 14.7l-3 3" />
    </>
  ),
}

export default function Icon({ name, size = 22, className = '', strokeWidth = 1.6, ...rest }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {path}
    </svg>
  )
}

export function StarIcon({ size = 16, filled = true, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    >
      <path d="m12 3.5 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.9l6-.9L12 3.5Z" />
    </svg>
  )
}
