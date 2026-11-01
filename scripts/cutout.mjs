/**
 * Turns the black-background promo shot into a true transparent-background PNG.
 *
 * Three things make this work where a naive key fails:
 *
 * 1. FLOOD FILL FROM THE BORDER, not a global darkness threshold. Akash wears
 *    black trousers and black shoes; keying on darkness alone punches holes
 *    straight through him. Only black reachable from the frame edge is backdrop.
 *
 * 2. A GRADED (soft) MATTE, not a binary one. The backdrop is not uniformly
 *    #000, there is a dark grey vignette around the subject (luma 20-46, which
 *    overlaps his hair). A hard cut-off there left a ragged grey slab beside his
 *    leg: invisible on pure black, obvious once a glow sat behind it. Instead
 *    alpha ramps from 0 at HARD_BLACK to 255 at SOFT_MAX, so the vignette fades
 *    out naturally and every edge gets proper anti-aliasing.
 *
 * 3. SPECKLE CLEANUP. Tiny opaque islands and tiny transparent pockets left by
 *    JPEG noise are removed/filled so nothing shimmers at the edges.
 */
import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'C:/Users/HP/Downloads/WhatsApp Image 2026-10-31 at 7.04.04 PM.jpeg'
const OUT = 'public/images'
fs.mkdirSync(OUT, { recursive: true })

const HARD_BLACK = 10
const SOFT_MAX = 14      // conservative: the fill must not leak into dark clothing
const POCKET_MAX = 36    // vignette pockets the fill cannot reach are this dark
const POCKET_NEUTRAL = 16 // ...and neutral grey, unlike the navy UI cards
const POCKET_MIN_SIZE = 9000
const FEATHER = 0.9
const MIN_ISLAND = 150
const MIN_HOLE = 1200

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info
const N = W * H

const lum = new Uint8Array(N)
for (let i = 0, p = 0; p < N; p++, i += C) {
  lum[p] = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000
}

/* ---- 1. flood fill the border-reachable backdrop corridor ---------------- */
const reach = new Uint8Array(N)
const stack = new Int32Array(N)
let top = 0
const push = (p) => {
  if (!reach[p] && lum[p] <= SOFT_MAX) {
    reach[p] = 1
    stack[top++] = p
  }
}
for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x) }
for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1) }
while (top > 0) {
  const p = stack[--top]
  const x = p % W
  if (x > 0) push(p - 1)
  if (x < W - 1) push(p + 1)
  if (p >= W) push(p - W)
  if (p < N - W) push(p + W)
}

/* ---- 2. enclosed vignette pockets ---------------------------------------
   The backdrop is not uniformly #000: a soft grey vignette wraps the subject.
   Where that vignette is sealed off from the frame edge (e.g. between his leg,
   the chair and the plant pot) the border fill never reaches it, and it was
   left behind as a ragged grey slab, invisible on pure black but obvious once
   a glow sits behind it.
   Those pockets are NEUTRAL grey. The other dark things in the frame, the UI
   cards, the laptop screen, are navy. So: unreachable + dark + neutral + big
   enough to be a region rather than a crease = backdrop.                      */
const pocket = new Uint8Array(N)
{
  const isPocket = (p) => {
    if (reach[p] || lum[p] > POCKET_MAX) return false
    const i = p * C
    const r = data[i], g = data[i + 1], b = data[i + 2]
    return Math.abs(b - r) <= POCKET_NEUTRAL && Math.abs(g - r) <= POCKET_NEUTRAL
  }
  let found = 0
  for (const cells of components(isPocket)) {
    if (cells.length >= POCKET_MIN_SIZE) {
      for (const p of cells) pocket[p] = 1
      found++
    }
  }
  console.log('vignette pockets cleared:', found)
}

/* ---- 3. graded alpha ----------------------------------------------------- */
const alpha = new Uint8Array(N)
for (let p = 0; p < N; p++) {
  const isBack = reach[p] || pocket[p]
  if (!isBack) {
    alpha[p] = 255
    continue
  }
  const ceiling = pocket[p] ? POCKET_MAX : SOFT_MAX
  if (lum[p] <= HARD_BLACK) alpha[p] = 0
  else alpha[p] = Math.round(Math.min(1, (lum[p] - HARD_BLACK) / (ceiling - HARD_BLACK)) * 255)
}

/* ---- 4. speckle cleanup -------------------------------------------------- */
function components(test) {
  const seen = new Uint8Array(N)
  const q = new Int32Array(N)
  const out = []
  for (let s = 0; s < N; s++) {
    if (seen[s] || !test(s)) continue
    let head = 0, tail = 0
    q[tail++] = s
    seen[s] = 1
    const cells = []
    while (head < tail) {
      const p = q[head++]
      cells.push(p)
      const x = p % W
      if (x > 0 && !seen[p - 1] && test(p - 1)) { seen[p - 1] = 1; q[tail++] = p - 1 }
      if (x < W - 1 && !seen[p + 1] && test(p + 1)) { seen[p + 1] = 1; q[tail++] = p + 1 }
      if (p >= W && !seen[p - W] && test(p - W)) { seen[p - W] = 1; q[tail++] = p - W }
      if (p < N - W && !seen[p + W] && test(p + W)) { seen[p + W] = 1; q[tail++] = p + W }
    }
    out.push(cells)
  }
  return out
}

let islands = 0
for (const cells of components((p) => alpha[p] > 160)) {
  if (cells.length < MIN_ISLAND) { for (const p of cells) alpha[p] = 0; islands++ }
}
let holes = 0
for (const cells of components((p) => alpha[p] < 40)) {
  const edge = cells.some((p) => {
    const x = p % W, y = (p / W) | 0
    return x === 0 || y === 0 || x === W - 1 || y === H - 1
  })
  if (!edge && cells.length < MIN_HOLE) { for (const p of cells) alpha[p] = 255; holes++ }
}
let opaque = 0
for (let p = 0; p < N; p++) if (alpha[p] > 127) opaque++
console.log(`islands removed: ${islands}, holes filled: ${holes}`)
console.log('foreground coverage:', ((opaque / N) * 100).toFixed(1) + '%')

/* ---- 5. feather + compose ------------------------------------------------ */
const softBuf = await sharp(Buffer.from(alpha), { raw: { width: W, height: H, channels: 1 } })
  .blur(FEATHER).toColourspace('b-w').raw().toBuffer()
const aStride = softBuf.length / N
if (!Number.isInteger(aStride)) throw new Error('unexpected alpha buffer length ' + softBuf.length)

/* The studio backdrop has a soft grey vignette that is genuinely the same
   brightness and texture as his black trousers and the chair, so no automatic
   key can separate the two down there. Rather than leave a ragged edge, the
   bottom of the frame is faded out, the figure dissolves into the page and
   the chair base, the shoes and the blue floor swoosh go with it. */
const FADE_START = 0.84
const FADE_END = 1.0
const rgba = Buffer.alloc(N * 4)
for (let p = 0, i = 0, j = 0; p < N; p++, i += C, j += 4) {
  const yFrac = ((p / W) | 0) / H
  let fade = 1
  if (yFrac > FADE_START) fade = Math.max(0, 1 - (yFrac - FADE_START) / (FADE_END - FADE_START))
  rgba[j] = data[i]
  rgba[j + 1] = data[i + 1]
  rgba[j + 2] = data[i + 2]
  rgba[j + 3] = Math.round(softBuf[p * aStride] * fade)
}
const mkBase = () => sharp(Buffer.from(rgba), { raw: { width: W, height: H, channels: 4 } })

/* ---- 6. export ----------------------------------------------------------- */
const trimmed = await mkBase().trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true })
console.log('trimmed to', trimmed.info.width + 'x' + trimmed.info.height)

await sharp(trimmed.data).resize({ width: 1600 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`${OUT}/akash-cutout.png`)
await sharp(trimmed.data).resize({ width: 1600 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/akash-cutout.webp`)

// sharp runs trim() before extract(), so the portrait crop needs two passes
const portraitRaw = await mkBase().extract({ left: 430, top: 0, width: 700, height: 1024 }).png().toBuffer()
const portrait = await sharp(portraitRaw).trim({ threshold: 1 }).png().toBuffer()
await sharp(portrait).resize({ width: 760 }).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(`${OUT}/akash-portrait-cutout.png`)
await sharp(portrait).resize({ width: 760 }).webp({ quality: 92, alphaQuality: 100 }).toFile(`${OUT}/akash-portrait-cutout.webp`)

const proof = await sharp(trimmed.data).resize({ width: 1400 }).png().toBuffer({ resolveWithObject: true })
await sharp({ create: { width: proof.info.width, height: proof.info.height, channels: 4, background: { r: 120, g: 30, b: 160, alpha: 1 } } })
  .composite([{ input: proof.data, top: 0, left: 0 }]).jpeg({ quality: 82 }).toFile('scripts/cutout-proof.jpg')

for (const f of ['akash-cutout.png', 'akash-cutout.webp', 'akash-portrait-cutout.png', 'akash-portrait-cutout.webp']) {
  const m = await sharp(`${OUT}/${f}`).metadata()
  console.log(f.padEnd(30), m.width + 'x' + m.height, (fs.statSync(`${OUT}/${f}`).size / 1024).toFixed(0) + ' KB')
}
