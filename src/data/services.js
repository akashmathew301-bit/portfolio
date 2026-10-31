/* The 8 services. `title` values are reused verbatim by the contact form
   dropdown and the WhatsApp message, so keep them in sync if you edit. */

export const services = [
  {
    id: 'website-development',
    title: 'Website Development',
    icon: 'code',
    description:
      'Fast, responsive, SEO-ready websites built from scratch — business sites, landing pages and portfolios that load quick and convert.',
    points: ['Custom design', 'Mobile-first build', 'Speed optimised'],
  },
  {
    id: 'website-revamp',
    title: 'Website Revamp',
    icon: 'refresh',
    description:
      'Your site works, but it looks dated and nobody enquires. I rebuild the design, structure and speed without losing your rankings.',
    points: ['Modern redesign', 'Content restructure', 'Core Web Vitals fix'],
  },
  {
    id: 'e-commerce',
    title: 'E-commerce',
    icon: 'cart',
    description:
      'Online stores with clean product pages, secure payments and a checkout that does not lose customers halfway.',
    points: ['Payment gateway', 'Inventory ready', 'Order flow'],
  },
  {
    id: 'seo',
    title: 'SEO',
    icon: 'search',
    description:
      'On-page, technical and local SEO so the right customers in your city find you on Google instead of your competitor.',
    points: ['Keyword strategy', 'Google Business', 'Technical audit'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    icon: 'megaphone',
    description:
      'Meta and Google campaigns built around real leads — targeting, creatives and tracking, not vanity impressions.',
    points: ['Paid ads', 'Lead funnels', 'Performance tracking'],
  },
  {
    id: 'logo-design',
    title: 'Logo Design',
    icon: 'palette',
    description:
      'A mark your business can own — logo, colours, typography and a mini brand kit that works on signage and screens.',
    points: ['Concept rounds', 'Brand kit', 'All file formats'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    icon: 'film',
    description:
      'Reels, ads and promos cut for attention — hooks, captions, motion graphics and sound that stop the scroll.',
    points: ['Reels & shorts', 'Ad creatives', 'Motion graphics'],
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    icon: 'share',
    description:
      'Consistent content, a calendar you can trust and a profile that actually looks like a business worth buying from.',
    points: ['Content calendar', 'Design + copy', 'Monthly reporting'],
  },
]

/* The exact option list used by the contact form. Each option carries its
   service icon so the dropdown matches the cards above it. */
export const serviceOptions = services.map((s) => ({
  value: s.title,
  label: s.title,
  icon: s.icon,
}))

export default services
