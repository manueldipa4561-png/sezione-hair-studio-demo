import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const inputDir = path.resolve('assets-source');
const outputDir = path.resolve('assets/generated');
if (!fs.existsSync(inputDir)) {
  console.log('No assets-source directory. Nothing to optimize.');
  process.exit(0);
}
fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(file => /\.(png|jpe?g|webp|tiff?)$/i.test(file));
const widths = [720, 1280, 1920];

for (const file of files) {
  const src = path.join(inputDir, file);
  const base = path.parse(file).name.replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
  for (const width of widths) {
    const pipeline = sharp(src).rotate().resize({ width, withoutEnlargement: true });
    await pipeline.clone().webp({ quality: 82, effort: 5 }).toFile(path.join(outputDir, `${base}-${width}.webp`));
    await pipeline.clone().avif({ quality: 55, effort: 5 }).toFile(path.join(outputDir, `${base}-${width}.avif`));
  }
}
console.log(`Optimized ${files.length} source image(s) into responsive WebP/AVIF variants.`);
