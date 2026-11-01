/**
 * Cuts the "A" monogram out of the supplied logo lockup.
 *
 * Two problems make a plain rectangular crop useless here:
 *
 * 1. BLACK IS NOT TRANSPARENT. The artwork was rendered as a glow on a solid
 *    black field, so a colour key would eat the dark edges of the letterform.
 *    What works is the screen-blend identity: alpha = how bright the pixel is,
 *    colour = that pixel un-premultiplied. The result sits correctly on any
 *    background, dark or light.
 *
 * 2. THE SWOOSH TAIL RUNS BEHIND THE "k". No rectangle can contain the whole
 *    monogram without also catching part of the wordmark. So the monogram is
 *    separated by CONNECTED COMPONENTS instead: label every bright blob, keep
 *    the ones that belong to the mark, drop the rest. The kept mask is then
 *    dilated and softened so the artwork keeps its own rim light.
 */
import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'C:/Users/HP/Downloads/file_0000000021ec82119a6f66c8c6361293.png'
const OUT = 'public/images'
fs.mkdirSync(OUT, { recursive: true })

const BRIGHT = 120 // artwork vs. backdrop haze
const FLOOR = 34 // below this a pixel is backdrop haze, not artwork
/* the monogram lives entirely left of the wordmark and above the rule */
const KEEP = (c) => c.x1 <= 725 && c.y1 <= 668 && c.cnt > 60

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const N = W * H

/* ---------- 1. screen-key the whole artwork ---------- */
const rgba = Buffer.alloc(N * 4)
for (let i = 0; i < N; i++) {
  const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2]
  const mx = Math.max(r, g, b)
  const mn = Math.min(r, g, b)
  const sat = mx ? (mx - mn) / mx : 0

  /* The artwork carries a soft grey drop shadow. Screen-keying keeps it,
     because it is lighter than the black field, and it reads as a smudge
     once the mark sits on the page. A grey pixel is only kept if it is
     genuinely bright (the silver face of the A); dark greys ramp to nothing.
     Saturated pixels are the blue swoosh and are never touched. */
  let a = mx
  if (sat < 0.28) a = Math.round(a * Math.min(1, Math.max(0, (mx - 118) / 74)))

  const o = i * 4
  if (a <= FLOOR) continue
  const k = 255 / mx
  rgba[o] = Math.min(255, Math.round(r * k))
  rgba[o + 1] = Math.min(255, Math.round(g * k))
  rgba[o + 2] = Math.min(255, Math.round(b * k))
  rgba[o + 3] = a
}

/* ---------- 2. label the bright blobs ---------- */
const bright = new Uint8Array(N)
for (let i = 0; i < N; i++) bright[i] = rgba[i * 4 + 3] > BRIGHT ? 1 : 0

const lab = new Int32Array(N).fill(-1)
const stack = new Int32Array(N)
const comps = []
for (let s = 0; s < N; s++) {
  if (!bright[s] || lab[s] !== -1) continue
  const id = comps.length
  let sp = 0
  stack[sp++] = s
  lab[s] = id
  let cnt = 0, x0 = W, x1 = 0, y0 = H, y1 = 0
  while (sp) {
    const p = stack[--sp]
    cnt++
    const px = p % W
    const py = (p / W) | 0
    if (px < x0) x0 = px
    if (px > x1) x1 = px
    if (py < y0) y0 = py
    if (py > y1) y1 = py
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = px + dx, ny = py + dy
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
        const q = ny * W + nx
        if (bright[q] && lab[q] === -1) {
          lab[q] = id
          stack[sp++] = q
        }
      }
    }
  }
  comps.push({ id, cnt, x0, y0, x1, y1 })
}
const keep = new Uint8Array(comps.length)
comps.filter(KEEP).forEach((c) => (keep[c.id] = 1))
console.log('kept', comps.filter(KEEP).length, 'of', comps.length, 'blobs')

/* ---------- 3. dilate + soften that mask so the rim light survives ---------- */
const hard = Buffer.alloc(N)
for (let i = 0; i < N; i++) hard[i] = lab[i] >= 0 && keep[lab[i]] ? 255 : 0

const soft = await sharp(hard, { raw: { width: W, height: H, channels: 1 } })
  .blur(5)
  .linear(4.6, 0) // tight dilate with a fast falloff: keeps the rim light,
                  // drops the wide haze that made the mark look smudged
  .toColourspace('b-w') // sharp would hand back 3 channels otherwise
  .raw()
  .toBuffer()

/* ---------- 4. apply, then crop to what is left ---------- */
let x0 = W, y0 = H, x1 = 0, y1 = 0
for (let i = 0; i < N; i++) {
  const a = Math.round((rgba[i * 4 + 3] * soft[i]) / 255)
  rgba[i * 4 + 3] = a
  if (a > 8) {
    const x = i % W, y = (i / W) | 0
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
}
const pad = Math.round((x1 - x0) * 0.02)
const box = {
  left: Math.max(0, x0 - pad),
  top: Math.max(0, y0 - pad),
  width: Math.min(W - 1, x1 + pad) - Math.max(0, x0 - pad),
  height: Math.min(H - 1, y1 + pad) - Math.max(0, y0 - pad),
}
console.log('mark box', box)

const mark = sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).extract(box)

await mark.clone().resize({ width: 640, withoutEnlargement: true })
  .webp({ quality: 95, alphaQuality: 100, effort: 6 }).toFile(OUT + '/akash-mark.webp')
await mark.clone().resize({ width: 640, withoutEnlargement: true })
  .png({ compressionLevel: 9 }).toFile(OUT + '/akash-mark.png')

/* ---------- 5. icons ---------- */
const pngSquare = (size, inner) =>
  mark.clone().resize({ width: inner, height: inner, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()

await sharp({ create: { width: 512, height: 512, channels: 4, background: { r: 7, g: 11, b: 20, alpha: 1 } } })
  .composite([{ input: await pngSquare(512, 404), gravity: 'center' }])
  .png()
  .toFile('public/apple-touch-icon.png')

await sharp({ create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: await pngSquare(64, 62), gravity: 'center' }])
  .png()
  .toFile('public/favicon.png')

const m = await sharp(OUT + '/akash-mark.webp').metadata()
console.log('akash-mark', m.width + 'x' + m.height)
