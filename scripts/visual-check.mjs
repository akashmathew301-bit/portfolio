import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.CHECK_URL || 'http://localhost:4173/'
const OUT = process.env.OUT_DIR || 'scripts/shots'
fs.mkdirSync(OUT, { recursive: true })

const VIEWPORTS = [
  { name: '360', width: 360, height: 780, mobile: true },
  { name: '768', width: 768, height: 1024, mobile: true },
  { name: '1280', width: 1280, height: 800, mobile: false },
  { name: '1920', width: 1920, height: 1080, mobile: false },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-color-profile=srgb'],
})

const problems = []

for (const vp of VIEWPORTS) {
  const page = await browser.newPage()
  await page.setViewport({
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  })

  page.on('console', (msg) => {
    const type = msg.type()
    if (type === 'error' || type === 'warning') problems.push(`[${vp.name}] console.${type}: ${msg.text()}`)
  })
  page.on('pageerror', (err) => problems.push(`[${vp.name}] pageerror: ${err.message}`))
  page.on('requestfailed', (req) =>
    problems.push(`[${vp.name}] requestfailed: ${req.url()} (${req.failure()?.errorText})`),
  )

  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 5600)) // preloader + entrance animations

  // horizontal overflow check
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow > 1) problems.push(`[${vp.name}] horizontal overflow: ${overflow}px`)

  await page.screenshot({ path: `${OUT}/${vp.name}-hero.png` })

  // scroll through the page and capture each section
  const sections = await page.evaluate(() =>
    Array.from(document.querySelectorAll('section[id], footer')).map((s) => s.id || 'footer'),
  )
  for (const id of sections) {
    await page.evaluate((sid) => {
      const el = sid === 'footer' ? document.querySelector('footer') : document.getElementById(sid)
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' })
    }, id)
    await new Promise((r) => setTimeout(r, 1400))
    await page.screenshot({ path: `${OUT}/${vp.name}-${id}.png` })
  }

  // after a full scroll, re-check overflow at the bottom
  const overflow2 = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  if (overflow2 > 1) problems.push(`[${vp.name}] horizontal overflow after scroll: ${overflow2}px`)

  // headings / a11y sanity
  if (vp.name === '1280') {
    const audit = await page.evaluate(() => ({
      h1: Array.from(document.querySelectorAll('h1')).map((h) => h.textContent.trim()),
      imgsNoAlt: Array.from(document.images).filter((i) => !i.alt && i.getAttribute('aria-hidden') !== 'true').length,
      imgCount: document.images.length,
      title: document.title,
      sections: Array.from(document.querySelectorAll('section[id]')).map((s) => s.id),
    }))
    console.log('AUDIT', JSON.stringify(audit, null, 2))
  }

  await page.close()
}

await browser.close()

console.log('\n=== PROBLEMS (' + problems.length + ') ===')
const unique = [...new Set(problems)]
unique.forEach((p) => console.log('- ' + p))
if (!unique.length) console.log('none')
