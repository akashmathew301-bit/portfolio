/* ------------------------------------------------------------------
   SITE CONFIG — edit everything about the brand from this one file.
   ------------------------------------------------------------------ */

export const site = {
  name: 'Akash',
  brand: 'Akash Web Solutions',
  role: 'Web Developer & Digital Growth Partner',
  location: 'Coimbatore, India',
  tagline: 'I build websites that bring customers.',
  intro:
    'For five years I have been the person local businesses call when their website is not bringing anyone in. Clinics, gyms, law firms, factories, farm-tech brands — I design it, build it, get it found on Google, and I am still on WhatsApp long after launch.',

  /* Contact -------------------------------------------------------- */
  phone: '9047950974', // plain, as displayed in India
  phoneDisplay: '+91 90479 50974',
  phoneIntl: '919047950974', // WhatsApp international format (no + / no spaces)
  email: 'akashmathew301@gmail.com',
  instagram: 'https://www.instagram.com/akash.websolutions/',
  instagramHandle: '@akash.websolutions',
  linkedin: 'https://www.linkedin.com/in/akash-mathew-589900262/',
  linkedinHandle: 'Akash Mathew',

  /* Social links — `color` is the platform's own brand colour and is used
     for the icon hover state everywhere on the site.                      */
  socials: [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: 'whatsapp',
      href: 'https://wa.me/919047950974',
      color: '#25D366',
      glow: 'rgba(37,211,102,0.45)',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      icon: 'instagram',
      href: 'https://www.instagram.com/akash.websolutions/',
      color: '#E1306C',
      glow: 'rgba(225,48,108,0.45)',
      gradient: 'linear-gradient(45deg,#F58529,#DD2A7B 45%,#8134AF 75%,#515BD4)',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: 'linkedin',
      href: 'https://www.linkedin.com/in/akash-mathew-589900262/',
      color: '#0A66C2',
      glow: 'rgba(10,102,194,0.5)',
    },
    {
      id: 'phone',
      label: 'Call',
      icon: 'phone',
      href: 'tel:+919047950974',
      color: '#2D9CFF',
      glow: 'rgba(45,156,255,0.5)',
    },
  ],

  /* Images — drop your files in /public/images and change the names here.
     The hero uses a true transparent-background cut-out, so it can sit on
     top of glows and rings without any visible box.                       */
  images: {
    hero: {
      src: '/images/akash-cutout.webp',
      fallback: '/images/akash-cutout.png',
      width: 1600,
      height: 1134,
      alt: 'Akash, web developer in Coimbatore, surrounded by website development, SEO and digital marketing graphics',
      position: 'center',
    },
    portrait: {
      src: '/images/akash-portrait-cutout.webp',
      fallback: '/images/akash-portrait-cutout.png',
      width: 760,
      height: 1093,
      alt: 'Portrait of Akash, founder of Akash Web Solutions',
      position: 'center top',
    },
    /* Studio headshot, keyed off its blue backdrop — floats on the About
       section's light ring with a soft bottom fade.                         */
    about: {
      src: '/images/akash-about-cutout.webp',
      fallback: '/images/akash-about-cutout.png',
      width: 1000,
      height: 984,
      alt: 'Akash Mathew, founder of Akash Web Solutions, Coimbatore',
      position: 'center bottom',
    },
    /* The original framed crops are still in /public/images if you ever want
       a non-cut-out look: akash-hero.webp / akash-portrait.webp             */
  },

  /* Hero floating badges — slots: top-left, bottom-left, top-right ---- */
  badges: [
    { label: '5+ Years Experience', pos: 'top-left' },
    { label: 'Web • SEO • Marketing', pos: 'bottom-left' },
    { label: 'Coimbatore, India', pos: 'top-right' },
  ],

  /* About counters -------------------------------------------------- */
  stats: [
    { value: 5, suffix: '+', label: 'Years of experience' },
    { value: 40, suffix: '+', label: 'Projects delivered' },
    { value: 30, suffix: '+', label: 'Happy clients' },
    { value: 100, suffix: '%', label: 'Client-first delivery' },
  ],

  /* Navigation ------------------------------------------------------ */
  nav: [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Work', id: 'work' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'Contact', id: 'contact' },
  ],
}

/* Helper: build the WhatsApp deep-link used across the site. */
export function whatsappLink(message) {
  const base = `https://wa.me/${site.phoneIntl}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export default site
