import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new', args: ['--no-sandbox'],
})
for (const [w, h, name] of [[1280, 800, 'desktop'], [390, 844, 'mobile']]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h })
  const client = await page.createCDPSession()
  await client.send('Network.emulateNetworkConditions', {
    offline: false, downloadThroughput: 420 * 1024, uploadThroughput: 220 * 1024, latency: 150,
  })
  page.goto(process.env.CHECK_URL || 'http://localhost:4182/', { waitUntil: 'domcontentloaded' }).catch(() => {})
  await new Promise((r) => setTimeout(r, 1100))
  await page.screenshot({ path: `scripts/preloader-${name}-a.png` })
  await new Promise((r) => setTimeout(r, 900))
  await page.screenshot({ path: `scripts/preloader-${name}-b.png` })
  await page.close()
}
await browser.close()
console.log('captured')
