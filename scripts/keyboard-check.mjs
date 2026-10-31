import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--no-sandbox'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })
await page.goto(process.env.CHECK_URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 3200))
await page.evaluate(() => document.getElementById('contact').scrollIntoView())
await new Promise((r) => setTimeout(r, 800))

const read = () => page.$eval('select[name="service"]', (el) => el.value)
let fail = 0
const check = (label, got, want) => {
  const ok = got === want
  if (!ok) fail++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: "${got}" (want "${want}")`)
}

// focus the combobox with the keyboard, open it, arrow down, enter
await page.focus('#field-service')
await page.keyboard.press('Enter')         // open, highlight index 0
await new Promise((r) => setTimeout(r, 350))
await page.keyboard.press('ArrowDown')     // -> index 1
await page.keyboard.press('ArrowDown')     // -> index 2
await page.keyboard.press('Enter')         // commit
await new Promise((r) => setTimeout(r, 350))
check('arrow keys + Enter', await read(), 'E-commerce')

// type-ahead while closed
await page.keyboard.type('v')
await new Promise((r) => setTimeout(r, 300))
check('type-ahead "v"', await read(), 'Video Editing')

// Escape closes without changing the value
await page.keyboard.press('Enter')
await new Promise((r) => setTimeout(r, 300))
await page.keyboard.press('ArrowDown')
await page.keyboard.press('Escape')
await new Promise((r) => setTimeout(r, 300))
check('Escape keeps value', await read(), 'Video Editing')
const closed = await page.$eval('#field-service', (el) => el.getAttribute('aria-expanded'))
check('Escape closes list', closed, 'false')

// focus returns to the trigger after committing
const focused = await page.evaluate(() => document.activeElement?.id)
check('focus returns to trigger', focused, 'field-service')

await browser.close()
console.log(fail === 0 ? 'ALL KEYBOARD CHECKS PASSED' : `${fail} FAILED`)
process.exit(fail ? 1 : 0)
