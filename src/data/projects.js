/* ------------------------------------------------------------------
   PROJECTS, real client work.

   Screenshots live in /public/images/work/ (WebP with a JPG fallback).
   To add a project: drop a screenshot in that folder, then copy one of
   the blocks below and change the fields. The grid reflows on its own.

   Regenerate a card image from a full-page screenshot with:
     node -e "require('sharp')('shot.png').extract({left:0,top:0,width:1920,height:1320}).resize(1000,688,{fit:'cover'}).webp({quality:82}).toFile('public/images/work/slug.webp')"
   ------------------------------------------------------------------ */

export const projects = [
  {
    id: 'cornext',
    title: 'Cornext',
    category: 'Agri-Tech Platform',
    year: '2025',
    blurb:
      'India\'s largest silage ecosystem for dairy growth. One site doing two jobs: selling machinery and silage to farmers, and recruiting for the 600-strong "Fodderpreneur" network.',
    tags: ['Web Development', 'Lead Funnel', 'SEO'],
    image: '/images/work/cornext.webp',
    fallback: '/images/work/cornext.jpg',
    url: 'https://cornext.in',
    placeholder: null,
  },
  {
    id: 'supertech-laces',
    title: 'Super Tech Laces',
    category: 'Manufacturing & Export',
    year: '2025',
    blurb:
      'Schiffli fabric manufacturer in Tiruppur selling to buying houses in India, the UAE, France and Hong Kong. Built around certifications, MOQ enquiries and a product gallery that survives slow export-market connections.',
    tags: ['Web Development', 'Product Catalogue', 'Export SEO'],
    image: '/images/work/supertech-laces.webp',
    fallback: '/images/work/supertech-laces.jpg',
    url: 'https://supertechlaces.net',
    placeholder: null,
  },
  {
    id: 'inbuilt-tensile',
    title: 'Inbuilt Infra Tensile',
    category: 'Lead Generation',
    year: '2025',
    blurb:
      'Conversion-first landing page for a tensile structure contractor. The nine-field project brief sits above the fold next to the headline, so a site assessment request takes one screen instead of three.',
    tags: ['Landing Page', 'Lead Capture', 'CRO'],
    image: '/images/work/inbuilt-tensile.webp',
    fallback: '/images/work/inbuilt-tensile.jpg',
    url: 'https://tensile.inbuiltinfra.com',
    placeholder: null,
  },
  {
    id: 'kkr-metal',
    title: 'KKR Metal Components',
    category: 'Corporate Website',
    year: '2025',
    blurb:
      'Precision manufacturing group with 38 years behind it, moving from automotive into aerospace, railways and oil & gas. The site reframes a legacy supplier as a multi-industry engineering partner.',
    tags: ['Corporate Site', 'Brand Positioning', 'Careers'],
    image: '/images/work/kkr-metal.webp',
    fallback: '/images/work/kkr-metal.jpg',
    url: 'https://kkrmetalcomponents.com',
    placeholder: null,
  },
  {
    id: 'nalan-dental',
    title: 'Nalan Dental Care',
    category: 'Clinic + Local SEO',
    year: '2025',
    blurb:
      'Specialist-led dental clinic in Siddhapudur, Coimbatore. Appointment booking, clinic hours and a map landmark are all above the fold, the three things a patient actually looks for.',
    tags: ['Web Development', 'Appointments', 'Local SEO'],
    image: '/images/work/nalan-dental.webp',
    fallback: '/images/work/nalan-dental.jpg',
    url: 'https://nalandentalcare.vercel.app',
    placeholder: null,
  },
  {
    id: 'blf-legal',
    title: 'AK Legal Associates',
    category: 'Legal Practice',
    year: '2025',
    blurb:
      'Law firm practising in the District and High Courts across Tiruppur and Coimbatore. Built to signal credibility fast: courtroom record, practice areas and a direct line to an advocate.',
    tags: ['Web Development', 'Trust Design', 'Consultation Flow'],
    image: '/images/work/blf-legal.webp',
    fallback: '/images/work/blf-legal.jpg',
    url: 'https://blflegal.in',
    placeholder: null,
  },
  {
    id: 'investmentmasterclass',
    title: 'Investment Masterclass',
    category: 'Event Landing Page',
    year: '2026',
    blurb:
      'Fourth edition of Jhaveri Securities\' investor conference in Vadodara. Speaker line-up, schedule, venue and pass booking on one page, built to convert cold traffic into paid registrations.',
    tags: ['Event Site', 'Registrations', 'Campaign Page'],
    image: '/images/work/investmentmasterclass.webp',
    fallback: '/images/work/investmentmasterclass.jpg',
    url: 'https://investmentmasterclass.in',
    placeholder: null,
  },
  {
    id: 'vedha-buildtech',
    title: 'Vedha Buildtech Solutions',
    category: 'Product Catalogue',
    year: '2025',
    blurb:
      'Bengaluru manufacturer of uPVC and system aluminium windows and doors. The buyer wants the range, finished projects and a brochure, so all three sit one tap away with the call button pinned to the header.',
    tags: ['Web Development', 'Catalogue', 'Enquiry Flow'],
    image: '/images/work/vedha-buildtech.webp',
    fallback: '/images/work/vedha-buildtech.jpg',
    url: 'https://vedhabuildtechsolutions.com',
    placeholder: null,
  },
  {
    id: 'qoreclub',
    title: 'Qore Club',
    category: 'Fitness & Membership',
    year: '2025',
    blurb:
      'Gym site built for sign-ups: a hard-hitting hero offer, three clear membership tiers and a joining CTA that follows you down the page.',
    tags: ['Web Development', 'Membership Pricing', 'Conversion'],
    image: '/images/work/qoreclub.webp',
    fallback: '/images/work/qoreclub.jpg',
    url: 'https://qoreclub.in',
    placeholder: null,
  },
  {
    id: 'toldbytwo',
    title: 'Toldbytwo',
    category: 'Creative Studio',
    year: '2025',
    blurb:
      'Brand site for a two-person photo and video studio. Personality-led copy and a work-first layout that lets the storytelling carry the pitch.',
    tags: ['Brand Site', 'Portfolio Layout', 'Art Direction'],
    image: '/images/work/toldbytwo.webp',
    fallback: '/images/work/toldbytwo.jpg',
    url: 'https://toldbytwo.in',
    placeholder: null,
  },
]

export default projects
