/* The 8 services. `title` values are reused verbatim by the contact form
   dropdown and the WhatsApp message, so keep them in sync if you edit. */

export const services = [
  {
    id: 'website-development',
    title: 'Website Development',
    icon: 'code',
    description:
      'A site built for the enquiry, not the applause. It loads fast on a 4G phone, says what you do in five seconds, and puts the call button where the thumb already is.',
    points: ['Custom design', 'Mobile-first build', 'Speed optimised'],
  },
  {
    id: 'website-revamp',
    title: 'Website Revamp',
    icon: 'refresh',
    description:
      'The site works, it just looks like 2016 and nobody enquires. I rebuild the design, the structure and the speed without losing the rankings you already have.',
    points: ['Modern redesign', 'Content restructure', 'Core Web Vitals fix'],
  },
  {
    id: 'e-commerce',
    title: 'E-commerce',
    icon: 'cart',
    description:
      'A store your customer can actually finish buying from. Clean product pages, payments that do not fail, and a checkout that does not lose people at step three.',
    points: ['Payment gateway', 'Inventory ready', 'Order flow'],
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: 'search',
    description:
      'When someone in your city searches for what you sell, you should be the first name they see. On-page, technical and local SEO to get you there and keep you there.',
    points: ['Keyword strategy', 'Google Business', 'Technical audit'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: 'megaphone',
    description:
      'Meta and Google ads judged on one number: what a real enquiry cost you. Targeting, creatives and tracking, never vanity impressions.',
    points: ['Paid ads', 'Lead funnels', 'Performance tracking'],
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    icon: 'palette',
    description:
      'A mark that still reads on a shop board and at thumbnail size. Logo, colours, type and a small brand kit that belongs to you, not to a template.',
    points: ['Concept rounds', 'Brand kit', 'All file formats'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    icon: 'film',
    description:
      'Reels and ads cut for the first three seconds, because that is all you get. Hooks, captions, motion and sound that stop the thumb.',
    points: ['Reels & shorts', 'Ad creatives', 'Motion graphics'],
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    icon: 'share',
    description:
      'A profile that looks like a business worth buying from. A calendar you can trust, posts that actually go out, and the numbers at the end of every month.',
    points: ['Content calendar', 'Design + copy', 'Monthly reporting'],
  },
]

/* The exact option list used by the contact form. Each option carries its
   service icon so the dropdown matches the cards above it. */
export const OTHER_SERVICE = 'Other'

export const serviceOptions = [
  ...services.map((s) => ({ value: s.title, label: s.title, icon: s.icon })),
  /* escape hatch: picking this reveals a free-text field in the form, so an
     enquiry that is not on the list never has to be forced into one */
  { value: OTHER_SERVICE, label: 'Something else', icon: 'spark' },
]

export default services
