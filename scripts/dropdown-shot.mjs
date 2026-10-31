import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto(process.env.CHECK_URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200))
await page.evaluate(() => {
  document.getElementById('contact').scrollIntoView()
  window.scrollBy(0, 280)
})
await new Promise((r) => setTimeout(r, 900))
await page.evaluate(() => document.getElementById('field-service').click())
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: 'scripts/dropdown.png' })
// keyboard: arrow down twice then Enter
await page.keyboard.press('ArrowDown')
await page.keyboard.press('ArrowDown')
await page.keyboard.press('Enter')
await new Promise((r) => setTimeout(r, 500))
const picked = await page.$eval('select[name="service"]', (el) => el.value)
console.log('keyboard pick ->', picked)
await browser.close()
