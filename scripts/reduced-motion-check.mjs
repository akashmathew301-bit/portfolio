import puppeteer from 'puppeteer-core'
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.CHECK_URL || 'http://localhost:4178/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--force-prefers-reduced-motion'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2500))

const state = await page.evaluate(() => ({
  reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
  preloaderGone: !document.querySelector('[role="status"][aria-live="polite"]'),
  heroText: document.querySelector('h1')?.textContent || '',
  canvas: document.querySelectorAll('canvas').length,
  bodyLen: document.body.innerText.length,
  scrollable: document.body.scrollHeight > window.innerHeight,
}))
console.log(JSON.stringify(state, null, 2))

// scroll to the bottom and confirm late sections render (no stuck reveals)
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await new Promise((r) => setTimeout(r, 1200))
const visible = await page.evaluate(() => {
  const nodes = [...document.querySelectorAll('#contact, #reviews, footer')]
  return nodes.map((n) => ({
    id: n.id || 'footer',
    opacity: getComputedStyle(n).opacity,
    height: Math.round(n.getBoundingClientRect().height),
  }))
})
console.log(JSON.stringify(visible, null, 2))
await page.screenshot({ path: 'scripts/shots-reduced.png' })
await browser.close()
console.log('console errors: ' + (errors.length ? errors.join(' | ') : 'none'))
