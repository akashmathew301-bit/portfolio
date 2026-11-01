/* ------------------------------------------------------------------
   REVIEWS
   ------------------------------------------------------------------
   ⚠️  READ THIS BEFORE THE SITE GOES LIVE.

   The wording below is PLACEHOLDER text. The businesses are real clients
   from /src/data/projects.js, but none of them has actually said these
   words yet, and the contact names are not their real people.

   Publishing a quote somebody never gave is a fabricated endorsement:
   it misleads the visitor and it falls foul of India's consumer rules on
   fake reviews. So before launch, do this:

     1. WhatsApp three or four of these clients and ask for one line
        about the work, plus permission to put it on the site.
     2. Replace `text`, `name` and `role` with exactly what they sent.
     3. Delete any entry you could not get a real quote for. Four honest
        reviews beat eight invented ones.

   Shape: { name, role, business, rating (1-5), text, avatar }
   `avatar` can be an image path like '/images/reviews/ravi.webp' or null,
   in which case the UI shows the person's initials.
   The UI handles any number of reviews (1 to 20+) automatically.
   ------------------------------------------------------------------ */

export const reviews = [
  {
    name: 'Dr. Aravind',
    role: 'Clinic Director',
    business: 'Nalan Dental Care, Coimbatore',
    rating: 5,
    text: 'Patients used to call just to ask the timing and the address. Now the site answers that and they book straight from the phone. Appointment-ku call panradhu kammi aayiduchu, treatment-la concentrate panna mudiyudhu.',
    avatar: null,
  },
  {
    name: 'Suresh Kumar',
    role: 'Export Manager',
    business: 'Super Tech Laces, Tiruppur',
    rating: 4.5,
    text: 'Buying houses abroad check the certifications before they even reply to a mail. Everything they ask for is on one page now, so the first conversation starts much further ahead.',
    avatar: null,
  },
  {
    name: 'Manoj Kumar',
    role: 'Marketing Lead',
    business: 'Cornext',
    rating: 5,
    text: 'Two very different audiences on one site: farmers buying machinery, and people who want to join the network. Rendum separate-a work aagudhu, aana brand onnu maari dhaan theriyudhu. That was the hard part and he got it right.',
    avatar: null,
  },
  {
    name: 'Vignesh R',
    role: 'Owner',
    business: 'Qore Club',
    rating: 4,
    text: 'The plans are on the page with the price, so people walk in already knowing what they want. Join panradhu romba easy aayiduchu. Oru chinna change kekka konjam wait panna vendi irundhuchu, but the result is good.',
    avatar: null,
  },
  {
    name: 'Karthik Subramanian',
    role: 'Partner',
    business: 'AK Legal Associates',
    rating: 4.5,
    text: 'For a law practice the site has to look serious before anything else. This one does. Clients tell us they read the practice areas first and then call, which saves a lot of explaining.',
    avatar: null,
  },
  {
    name: 'Prakash S',
    role: 'Sales Head',
    business: 'Vedha Buildtech Solutions',
    rating: 3.5,
    text: 'Customers want to see finished work and the brochure before they talk price. Both are one tap away now. We were slow sending the product photos so the launch slipped by a week, but the enquiry rate since then has been good.',
    avatar: null,
  },
]

export default reviews
