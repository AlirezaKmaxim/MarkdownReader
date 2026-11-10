import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
// Usage: node scripts/update-icon.mjs [source-image]  (defaults to build/icon.svg)
const src = path.resolve(process.argv[2] || path.join(root, 'build', 'icon.svg'))

if (!fs.existsSync(src)) {
  console.error('Source icon not found:', src)
  process.exit(1)
}

const buildDir = path.join(root, 'build')
const resourcesDir = path.join(root, 'resources')

await sharp(src).resize(1024, 1024, { fit: 'cover' }).png().toFile(path.join(buildDir, 'icon.png'))
await sharp(src).resize(512, 512, { fit: 'cover' }).png().toFile(path.join(resourcesDir, 'icon.png'))

const sizes = [16, 24, 32, 48, 64, 128, 256]
const buffers = []
for (const size of sizes) {
  buffers.push(await sharp(src).resize(size, size, { fit: 'cover' }).png().toBuffer())
}

fs.writeFileSync(path.join(buildDir, 'icon.ico'), await pngToIco(buffers))
console.log('Icons updated successfully')
