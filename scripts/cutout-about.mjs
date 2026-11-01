/**
 * Keys the studio headshot off its blue-grey backdrop.
 *
 * Darkness keying is useless here, the blazer and shirt are nearly black while
 * the backdrop is a mid blue-grey. What separates them cleanly is hue: every
 * backdrop pixel is markedly blue (blue channel well above red), while hair,
 * blazer and skin are neutral or warm. So we flood fill from the border on
 * "bluish and bright enough", which also copes with the backdrop's gradient.
 */
import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'C:/Users/HP/Downloads/file_0000000015d88208b1d15a605468e99e.png'
const OUT = 'public/images'

const BLUE_BIAS = 24 // blue channel must exceed red by this much
const MIN_LUMA = 56 // ...and the pixel must not be a deep shadow
const FEATHER = 1.0

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

const isBgLike = new Uint8Array(W * H)
for (let p = 0, i = 0; p < W * H; p++, i += C) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const luma = (r * 299 + g * 587 + b * 114) / 1000
  isBgLike[p] = b - r > BLUE_BIAS && luma > MIN_LUMA ? 1 : 0
}

const isBg = new Uint8Array(W * H)
const stack = new Int32Array(W * H)
let top = 0
const push = (p) => {
  if (!isBg[p] && isBgLike[p]) {
    isBg[p] = 1
    stack[top++] = p
  }
}
for (let x = 0; x < W; x++) {
  push(x)
  push((H - 1) * W + x)
}
for (let y = 0; y < H; y++) {
  push(y * W)
  push(y * W + W - 1)
}
while (top > 0) {
  const p = stack[--top]
  const x = p % W
  if (x > 0) push(p - 1)
  if (x < W - 1) push(p + 1)
  if (p >= W) push(p - W)
  if (p < W * (H - 1)) push(p + W)
}

const alpha = Buffer.alloc(W * H)
let kept = 0
for (let p = 0; p < W * H; p++) {
  alpha[p] = isBg[p] ? 0 : 255
  if (!isBg[p]) kept++
}
console.log('foreground coverage:', ((kept / (W * H)) * 100).toFixed(1) + '%')

const softBuf = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
  .blur(FEATHER)
  .toColourspace('b-w')
  .raw()
  .toBuffer()
const aStride = softBuf.length / (W * H)

/* De-spill: backdrop blue bleeds into the hair edge, so pull the blue channel
   back toward green wherever the pixel is both semi-transparent and bluish. */
const rgba = Buffer.alloc(W * H * 4)
for (let p = 0, i = 0, j = 0; p < W * H; p++, i += C, j += 4) {
  const a = softBuf[p * aStride]
  let r = data[i]
  let g = data[i + 1]
  let b = data[i + 2]
  if (a > 0 && a < 250 && b > g) b = Math.round(g + (b - g) * 0.35)
  rgba[j] = r
  rgba[j + 1] = g
  rgba[j + 2] = b
  rgba[j + 3] = a
}

const mk = () => sharp(Buffer.from(rgba), { raw: { width: W, height: H, channels: 4 } })
const trimmed = await mk().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true })
console.log('trimmed to', trimmed.info.width + 'x' + trimmed.info.height)

await sharp(trimmed.data).resize({ width: 1000 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/akash-about-cutout.webp`)
await sharp(trimmed.data).resize({ width: 1000 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`${OUT}/akash-about-cutout.png`)

const proof = await sharp(trimmed.data).resize({ width: 900 }).png().toBuffer({ resolveWithObject: true })
await sharp({
  create: { width: proof.info.width, height: proof.info.height, channels: 4, background: { r: 130, g: 25, b: 160, alpha: 1 } },
})
  .composite([{ input: proof.data, top: 0, left: 0 }])
  .jpeg({ quality: 84 })
  .toFile('scripts/about-proof.jpg')

for (const f of ['akash-about-cutout.webp', 'akash-about-cutout.png']) {
  const m = await sharp(`${OUT}/${f}`).metadata()
  console.log(f.padEnd(26), m.width + 'x' + m.height, (fs.statSync(`${OUT}/${f}`).size / 1024).toFixed(0) + ' KB')
}
