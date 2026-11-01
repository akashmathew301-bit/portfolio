/**
 * Prepares the seated-pose cut-out for the second banner.
 * The source already has a clean alpha channel, so this only trims the empty
 * margin, drops a hard 8-bit alpha cut (the edges carry a faint 1-20 alpha
 * haze that glows on a dark background) and writes webp + png.
 */
import sharp from 'sharp'
import fs from 'node:fs'

const SRC = 'C:/Users/HP/Downloads/Seated Man and Chair Cutout.png'
const OUT = 'public/images'
fs.mkdirSync(OUT, { recursive: true })

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const { width: W, height: H, channels: C } = info

// clear near-transparent haze so no grey halo shows over the glow
for (let i = 0; i < W * H; i++) {
  const a = data[i * C + 3]
  if (a < 24) data[i * C + 3] = 0
}

const base = sharp(data, { raw: { width: W, height: H, channels: C } })
  .trim({ threshold: 1 })
  .resize({ width: 900, withoutEnlargement: true })

await base.clone().webp({ quality: 92, alphaQuality: 100, effort: 6 }).toFile(OUT + '/akash-seated-cutout.webp')
await base.clone().png({ compressionLevel: 9, palette: false }).toFile(OUT + '/akash-seated-cutout.png')

const m = await sharp(OUT + '/akash-seated-cutout.webp').metadata()
console.log('written', m.width + 'x' + m.height)
