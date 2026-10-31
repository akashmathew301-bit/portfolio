import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const URL = process.env.CHECK_URL || 'http://localhost:4177/'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200))

// capture window.open calls instead of actually navigating
await page.evaluate(() => {
  window.__opened = []
  window.open = (url) => {
    window.__opened.push(url)
    return null
  }
})

const SERVICES = [
  'Website Development', 'Website Revamp', 'E-commerce', 'SEO',
  'Digital Marketing', 'Logo Design', 'Video Editing', 'Social Media Management',
]

let fail = 0

// --- 1. clicking a service card pre-selects it in the form -----------------
for (const service of SERVICES) {
  await page.evaluate((s) => {
    const btn = [...document.querySelectorAll('button[aria-label^="Enquire about"]')]
      .find((b) => b.getAttribute('aria-label') === 'Enquire about ' + s)
    btn.click()
  }, service)
  await new Promise((r) => setTimeout(r, 1500))
  // #field-service is now the custom combobox button; read its label and
  // the mirrored native <select> that backs it.
  const selected = await page.$eval('#field-service', (el) => el.textContent.trim())
  const mirrored = await page.$eval('select[name="service"]', (el) => el.value)
  const ok = selected === service && mirrored === service
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  card "${service}" -> combobox "${selected}" / select "${mirrored}"`)
}

// --- 2. validation blocks a bad phone number -------------------------------
await page.evaluate(() => (window.__opened = []))
await page.$eval('#field-name', (el) => { el.focus() })
await page.type('#field-name', 'Ravi Kumar')
await page.type('#field-phone', '12345')
await page.evaluate(() => document.querySelector('form button[type=submit]').click())
await new Promise((r) => setTimeout(r, 600))
let opened = await page.evaluate(() => window.__opened)
const blocked = opened.length === 0
if (!blocked) fail++
console.log(`${blocked ? 'PASS' : 'FAIL'}  invalid phone blocks submit (opened ${opened.length} tabs)`)
const errText = await page.$eval('#field-phone-error', (el) => el.textContent.trim()).catch(() => '')
console.log(`       error shown: "${errText}"`)

// --- 3. a valid submission opens the right WhatsApp URL --------------------
await page.$eval('#field-phone', (el) => { el.value = '' })
await page.click('#field-phone', { clickCount: 3 })
await page.type('#field-phone', '+91 98765 43210')
await page.type('#field-message', 'Need a store before Diwali')
await page.evaluate(() => document.querySelector('form button[type=submit]').click())
await new Promise((r) => setTimeout(r, 1700))
opened = await page.evaluate(() => window.__opened)
const url = opened[0] || ''
const okUrl = url.startsWith('https://wa.me/919047950974?text=')
if (!okUrl) fail++
console.log(`\n${okUrl ? 'PASS' : 'FAIL'}  submit opened: ${url.slice(0, 48)}...`)
console.log('--- decoded message ---')
console.log(decodeURIComponent(url.split('text=')[1] || ''))

// --- 4. success state rendered --------------------------------------------
const success = await page.evaluate(() =>
  document.body.innerText.includes('WhatsApp is opening'),
)
if (!success) fail++
console.log(`\n${success ? 'PASS' : 'FAIL'}  success animation shown`)

// --- 5. mobile menu opens / closes ----------------------------------------
await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true })
await new Promise((r) => setTimeout(r, 500))
await page.evaluate(() => document.querySelector('[aria-controls="mobile-menu"]').click())
await new Promise((r) => setTimeout(r, 1700))
const menuOpen = await page.evaluate(() => Boolean(document.getElementById('mobile-menu')))
if (!menuOpen) fail++
console.log(`${menuOpen ? 'PASS' : 'FAIL'}  mobile menu opens`)
await page.evaluate(() => document.querySelector('[aria-controls="mobile-menu"]').click())
await new Promise((r) => setTimeout(r, 1700))
const menuClosed = await page.evaluate(() => !document.getElementById('mobile-menu'))
if (!menuClosed) fail++
console.log(`${menuClosed ? 'PASS' : 'FAIL'}  mobile menu closes`)

await browser.close()
console.log('\nconsole errors: ' + (errors.length ? errors.join(' | ') : 'none'))
console.log(fail === 0 ? 'ALL FLOW CHECKS PASSED' : `${fail} FLOW CHECK(S) FAILED`)
process.exit(fail === 0 ? 0 : 1)
