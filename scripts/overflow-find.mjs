import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 360, height: 780, isMobile: true, hasTouch: true })
await page.goto(process.env.CHECK_URL || 'http://localhost:4180/', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 5200))
const res = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth
  const depth = (el) => { let d = 0; while ((el = el.parentElement)) d++; return d }
  const rows = []
  document.querySelectorAll('body *').forEach((el) => {
    const over = el.scrollWidth - el.clientWidth
    if (over > 1 && getComputedStyle(el).overflowX === 'visible') {
      rows.push({
        d: depth(el),
        tag: el.tagName.toLowerCase(),
        over,
        cw: el.clientWidth,
        sw: el.scrollWidth,
        cls: String(el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').slice(0, 100),
        txt: (el.textContent || '').trim().slice(0, 30),
      })
    }
  })
  rows.sort((a, b) => b.d - a.d)
  return { vw, rows: rows.slice(0, 18), preloaderGone: !document.querySelector('[role="status"][aria-live="polite"]') }
})
console.log('viewport', res.vw, 'preloaderGone', res.preloaderGone)
res.rows.forEach((r) => console.log(`d${String(r.d).padStart(2)} ${r.tag.padEnd(7)} over:${String(r.over).padStart(4)} cw:${r.cw} sw:${r.sw}  ${r.cls} | ${r.txt}`))
await browser.close()
