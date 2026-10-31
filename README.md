# Akash Web Solutions — Portfolio

A single-page, heavily animated portfolio site for **Akash**, web developer & digital growth partner in Coimbatore, India.

Built with **Vite + React + Tailwind CSS**, animated with **Framer Motion** (component motion), **GSAP + ScrollTrigger** (scroll-driven sequences) and **Lenis** (smooth scroll). The contact form has no backend — it builds a WhatsApp deep link and opens the chat with the enquiry pre-typed.

---

## Quick start

```bash
npm install
npm run dev       # local dev server  → http://localhost:5173
npm run build     # static production build → dist/
npm run preview   # preview the production build locally
```

The build output is a plain static folder (`dist/`). Upload its **contents** to Hostinger `public_html`, or point Vercel / Netlify at the repo (build command `npm run build`, output directory `dist`).

---

## Things you will want to change

Everything editable lives in **`src/data/`** and **`public/images/`**. You never need to touch component code for normal content updates.

### 1. Your photos — `public/images/` + `src/data/site.js`

Three images are used, and all three are **transparent-background cut-outs** generated from your originals:

| File | Where it appears | Source |
|---|---|---|
| `akash-cutout.webp` / `.png` | Hero, desktop (≥1024px) | the wide promo composite |
| `akash-portrait-cutout.webp` / `.png` | Hero on mobile | portrait crop of the same composite |
| `akash-about-cutout.webp` / `.png` | About section | the studio headshot |

Paths live in `src/data/site.js` under `images` — change the filenames there, or just overwrite the files keeping the same names.

```js
images: {
  hero:     { src, fallback, width, height, alt, position },  // desktop hero
  portrait: { ... },                                           // mobile hero
  about:    { ... },                                           // About section
}
```

Keep `width`/`height` accurate — they reserve the space and prevent layout shift. `alt` is read by Google and by screen readers, so describe the photo.

If a file is missing or fails to load the layout does **not** break: a branded placeholder panel appears instead.

#### Cutting out a new photo

Two scripts do the background removal locally — no paid tool, no upload.

```bash
node scripts/cutout.mjs         # black-background promo shot  -> hero + mobile crops
node scripts/cutout-about.mjs   # studio headshot on a coloured backdrop -> About
```

Edit the `SRC` constant at the top of whichever script matches your new photo, run it, then open the proof image it writes (`scripts/cutout-proof.jpg` / `scripts/about-proof.jpg`) — it composites the result over bright purple so any leftover background is obvious.

How they work, in case you need to tune them:

- **`cutout.mjs`** flood-fills the black that is *connected to the border*. A plain "make dark pixels transparent" key would punch holes through black trousers and shoes; starting from the edge means only the actual backdrop goes. Tune `BG_MAX` (default `12`) — raise it if a grey halo survives, lower it if parts of the subject disappear.
- **`cutout-about.mjs`** keys on *hue* instead: every backdrop pixel is markedly blue (blue channel well above red) while hair, suit and skin are neutral or warm. Tune `BLUE_BIAS` (default `24`) and `MIN_LUMA` (default `56`). It also de-spills the blue that bleeds into hair edges.
- Both feather the alpha edge (`FEATHER`) so there are no jagged stair-steps.
- `cutout.mjs` also clears **enclosed vignette pockets**: the promo shot has a soft grey halo around the subject, and where that halo is sealed off from the frame edge (between his leg, the chair and the plant pot) the border fill can never reach it. Those pockets are neutral grey while the other dark objects — the UI cards, the laptop screen — are navy, so neutrality plus size identifies them.
- **Known limit:** down near the chair base the backdrop vignette is the same brightness *and* the same texture as his black trousers, so no automatic key can separate them. Rather than ship a ragged edge, the script fades the bottom of the frame out (`FADE_START`); the figure dissolves into the page and the chair, shoes and blue floor swoosh go with it. If you ever get a photo shot on a proper green screen or with a real alpha channel, drop that in and lower `FADE_START` to `1`.

`public/images/og-cover.jpg` (1200 × 630) is the social-share preview — regenerate it whenever the photo changes. The original framed (non-cut-out) versions are still in `public/images` as `akash-hero.*` and `akash-portrait.*` if you ever want that look back.

### 2. Reviews — `src/data/reviews.js`

**⚠️ The six reviews currently in this file are SAMPLES, not real client feedback.** They are written in Tanglish so the section looks finished while the site is in progress. Publishing invented testimonials as genuine reviews is deceptive and breaches India's consumer-protection rules on fake reviews — replace every one with a real review (with the client's permission) before the site goes live.

Replace them and the UI updates itself: average rating, star counts, and how many marquee rows render.

```js
{
  name: 'Ravi Kumar',
  role: 'Owner',
  business: 'FitZone Gym',
  rating: 5,                       // 1–5, decimals like 4.5 are fine
  text: 'The review text…',
  avatar: null,                    // or '/images/reviews/ravi.webp'
}
```

- `avatar: null` → the person's initials are shown in a blue glass circle. No broken images, ever.
- The `rating` field is kept in the data but **is not displayed anywhere**. There is no star score and nothing that imitates a Google rating, because no ratings have actually been collected. The headline stat next to the heading counts entries in `src/data/projects.js` instead — real, verifiable work. If you later collect genuine Google reviews, that is the moment to show a score.
- The carousel is a 3D coverflow: the active quote sits centre and sharp while its neighbours rotate away, blur and dim. Drag, arrow keys, the dots and autoplay (paused on hover and focus) all drive it. Cards are a fixed size, so one long review never makes a taller row.

### 3. Projects — `src/data/projects.js`

Ten real client sites, every one live. Each entry:

```js
{
  id: 'cornext',
  title: 'Cornext',
  category: 'Agri-Tech Platform',
  year: '2025',
  blurb: 'One or two lines on what the site had to achieve.',
  tags: ['Web Development', 'Lead Funnel', 'SEO'],
  image: '/images/work/cornext.webp',   // card screenshot
  fallback: '/images/work/cornext.jpg', // used if WebP is unsupported
  url: 'https://cornext.in',            // makes the whole card clickable
  placeholder: null,                    // set to 'PLACEHOLDER' to flag a demo entry
}
```

To add a project, take a full-page screenshot, then crop the top of it into a
16:11 card:

```bash
node -e "require('sharp')('shot.png').extract({left:0,top:0,width:1920,height:1320}).resize(1000,688,{fit:'cover'}).webp({quality:82}).toFile('public/images/work/slug.webp')"
node -e "require('sharp')('shot.png').extract({left:0,top:0,width:1920,height:1320}).resize(1000,688,{fit:'cover'}).jpeg({quality:80,mozjpeg:true}).toFile('public/images/work/slug.jpg')"
```

Raise `top:` if the hero of that site starts lower down. Add or delete entries
freely — the grid reflows, and the "projects delivered" stat in the
testimonials section counts this array automatically.

### 4. Services — `src/data/services.js`

The 8 services power **three** things at once: the service cards, the marquee strip, and the contact form's options. Editing a `title` updates all of them, including the WhatsApp message.

`icon` accepts any key from `src/components/Icon.jsx`
(`code`, `refresh`, `cart`, `search`, `megaphone`, `palette`, `film`, `share`, `phone`, `mail`, `instagram`, `whatsapp`, `spark`, …). To add a new icon, add a new path entry to that file.

### 5. Phone number, email, socials — `src/data/site.js`

```js
phone:      '9047950974',      // plain, for display logic
phoneDisplay: '+91 90479 50974', // what visitors see
phoneIntl:  '919047950974',    // WhatsApp format — no +, no spaces
email:      'akashmathew301@gmail.com',
instagram:  'https://www.instagram.com/akash.websolutions/',
linkedin:   'https://www.linkedin.com/in/akash-mathew-589900262/',
```

`site.socials` holds the social buttons, each with its own **brand colour**:

```js
{ id: 'linkedin', label: 'LinkedIn', icon: 'linkedin',
  href: '…', color: '#0A66C2', glow: 'rgba(10,102,194,0.5)' }
```

Those colours drive the hover state of every social icon on the page (WhatsApp green, Instagram's orange→purple gradient, LinkedIn blue). Add a platform by appending an entry and adding a matching icon path to `src/components/Icon.jsx`.

Change `phoneIntl` and **every** WhatsApp link on the site updates: the hero button, the floating bubble, the contact card, and the form submission.

Also update the phone/email in two non-React places:
- `index.html` → the JSON-LD block (`telephone`, `email`, `sameAs`) and the `<noscript>` fallback
- `index.html` → `og:url` / `canonical` once you have a real domain

### 6. Counters, badges, nav labels — `src/data/site.js`

`stats` (the animated counters), `badges` (floating glass pills around the hero photo — slots are `top-left`, `bottom-left`, `top-right`), and `nav`.

### 7. Process steps — `src/data/process.js`

---

## How the contact form works

No server, no database, no email service.

1. Validates the name, the phone (10-digit Indian mobile; `+91`, `0`, spaces and dashes are all accepted) and the service.
2. Builds this message:
   ```
   Hi Akash, I found your website and want to connect.

   Name: {name}
   Phone: {phone}
   Service: {service}
   Message: {message or "-"}
   ```
3. Opens `https://wa.me/919047950974?text=<url-encoded message>` in a new tab — the WhatsApp **app** on mobile, **WhatsApp Web** on desktop.

The service picker is a custom dropdown (`src/components/Select.jsx`) rather than a native `<select>`, so it can be styled to match the rest of the UI. Each option shows the same icon as its card in the Services section — `serviceOptions` in `src/data/services.js` exports `{ value, label, icon }`, so editing a service updates the card, the marquee and the dropdown together. Icons come from the built-in set in `src/components/Icon.jsx` rather than Font Awesome, which keeps it to a few hundred bytes of inline SVG instead of a ~100 KB external icon font (and the site makes no third-party requests). It is a real listbox: arrow keys, Home/End, Enter/Space, Escape and type-ahead all work, and a hidden native `<select>` mirrors the value so browser autofill still behaves.

The tab is opened inside the click handler so popup blockers never swallow it, and the success panel also shows a manual "Did not open? Tap here" link as a fallback.

Clicking any **service card** scrolls to the form and pre-selects that service.

Logic lives in `src/lib/whatsapp.js`. Verify it any time with:

```bash
node scripts/verify-whatsapp.mjs
```

---

## Project structure

```
public/
  images/            your photos + og-cover.jpg
  favicon.svg
  robots.txt
src/
  components/        reusable UI (Navbar, Preloader, Cursor, Marquee, Icon, …)
  sections/          one file per page section (Hero, About, Services, …)
  data/              ← everything you edit: site, services, projects, reviews, process
  hooks/             useMagnetic, useTilt, useCountUp, useActiveSection, …
  lib/               smoothScroll.js (Lenis + ScrollTrigger), whatsapp.js
  index.css          design tokens, glass/grain/grid utilities, keyframes
scripts/             verification scripts (see below)
index.html           meta tags, Open Graph, Twitter card, JSON-LD schema
tailwind.config.js   colour palette, fonts, shadows
```

---

## Design system

| Token | Value |
|---|---|
| Background | `#000000`, layers `#05070A` |
| Pepsi blue | deep `#004B93` · main `#0A6CFF` · glow `#2D9CFF` |
| Text | `#FFFFFF`, muted `#9AA4B2` |
| Font | Poppins 400/500/600/700 (self-hosted, used for both display and body) |

Poppins is bundled via `@fontsource/poppins`, not loaded from Google — no third-party request, no layout shift. To change the typeface: `npm i @fontsource/<name>`, swap the four `@import` lines at the top of `src/index.css`, and update `fontFamily` in `tailwind.config.js`. Poppins runs wider than most display faces, so if you switch again you may need to retune the `clamp()` sizes in `src/components/SectionHeading.jsx` and `src/sections/Hero.jsx`.

Useful CSS classes (defined in `src/index.css`): `.glass`, `.glass-strong`, `.text-grad`, `.grad-border`, `.eyebrow`, `.noise`, `.grid-lines`, `.edge-fade`, `.container-x`, `.section-pad`.

---

## Loading sequence

Two layers, so nothing is ever a blank screen:

1. **`#boot` in `index.html`** — a static HUD (brand, location, a filling rail, a blue glow) styled with inline CSS. It paints as soon as the stylesheet lands, long before the JS bundle finishes downloading. To change it, edit the `#boot` markup and its `<style>` block in `index.html`.
2. **`src/components/Preloader.jsx`** — removes `#boot` the moment React mounts and takes over with the same layout: the name decodes letter by letter out of scrambled glyphs (each letter locks as real load progress passes it), a service word flickers underneath, an oversized ghost counter runs in the corner. At 100% six vertical panels wipe upward with a blue flash onto the hero.

The counter tracks the real `window.load` event, with a 4.5s ceiling so a slow asset can never trap a visitor. With `prefers-reduced-motion` the whole sequence is skipped.

## Animation notes

- **Lenis** drives scrolling, pinned to GSAP's ticker so Lenis and ScrollTrigger share one RAF loop (no jitter).
- Everything animates **transform and opacity only**; the canvas caps DPR at 1.5 and pauses when the hero leaves the viewport.
- `prefers-reduced-motion: reduce` is respected everywhere — the preloader skips, the cursor and particles are not rendered, marquees stop, and all reveals become instant.
- The custom cursor and magnetic/tilt effects are disabled on touch devices.
- ScrollTriggers are killed on unmount (`gsap.context` / `ScrollTrigger.getAll()`).

---

## Verification scripts

```bash
node scripts/verify-whatsapp.mjs      # phone parsing + a WhatsApp URL for all 8 services
node scripts/visual-check.mjs         # screenshots at 360/768/1280/1920 + console-error & overflow audit
node scripts/flow-check.mjs           # service card → form pre-select → submit → WhatsApp URL
node scripts/keyboard-check.mjs       # dropdown arrow keys, type-ahead, Escape, focus return
node scripts/reduced-motion-check.mjs # everything still readable with motion disabled
node scripts/overflow-find.mjs        # pinpoints any element causing horizontal scroll at 360px
node scripts/cutout.mjs               # regenerate the hero cut-outs
node scripts/cutout-about.mjs         # regenerate the About cut-out
```

The two browser scripts need a running preview server and use your installed Chrome via `puppeteer-core`:

```bash
npm run preview                                   # terminal 1
CHECK_URL=http://localhost:4173/ node scripts/visual-check.mjs   # terminal 2
```

If Chrome is installed somewhere else, edit the `CHROME` constant at the top of each script. Screenshots land in `scripts/shots*/` — safe to delete.

---

## Deploying

**Hostinger** — run `npm run build`, then upload everything **inside** `dist/` to `public_html`. It is a single-page app with hash anchors only, so no `.htaccess` rewrite rules are needed.

**Vercel / Netlify** — connect the repo. Build command `npm run build`, publish directory `dist`.

After the domain is live, update in `index.html`: `canonical`, `og:url`, `og:image`, `twitter:image`, and the `@id`/`url` fields in the JSON-LD block. Then update `public/robots.txt`.

---

## Credits

All code is original. Interaction patterns were studied from these MIT-licensed open-source templates — no code or assets were copied:
[motionfolio](https://github.com/zickrian/motionfolio) · [Portfolio-Template-06](https://github.com/Muhammad112233-creator/Portfolio-Template-06) · [Portfolio-Template-26](https://github.com/Muhammad112233-creator/Portfolio-Template-26) · [sample-portfolio](https://github.com/aadhithianm/sample-portfolio) · [agency-website](https://github.com/Shatlyk1011/agency-website)
