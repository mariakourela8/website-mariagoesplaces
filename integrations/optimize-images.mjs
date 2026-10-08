// @ts-check
/**
 * After `astro build`, shrink every photo in dist/ in place:
 *   - fit inside MAX_SIZE x MAX_SIZE (never enlarges)
 *   - apply the phone's rotation tag, then strip all metadata (EXIF, GPS location)
 *   - recompress (JPEG q80 mozjpeg, PNG palette-compressed, WebP q80)
 * File names and paths stay the same, so content written in the CMS needs no changes.
 * The originals in public/ (and on GitHub) are never touched.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const MAX_SIZE = 2200;
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const CONCURRENCY = 4;

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (EXTS.has(path.extname(entry.name).toLowerCase())) yield full;
  }
}

async function optimize(file) {
  const input = await fs.readFile(file);
  const ext = path.extname(file).toLowerCase();
  let img = sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width: MAX_SIZE, height: MAX_SIZE, fit: 'inside', withoutEnlargement: true });
  if (ext === '.png') img = img.png({ compressionLevel: 9, palette: true, quality: 85 });
  else if (ext === '.webp') img = img.webp({ quality: 80 });
  else img = img.jpeg({ quality: 80, mozjpeg: true });
  const output = await img.toBuffer();
  // Keep the original if re-encoding didn't help (e.g. an already-small web image),
  // unless it still carries metadata such as GPS that must not be published.
  const meta = await sharp(input).metadata();
  if (output.length >= input.length && !meta.exif) return { before: input.length, after: input.length };
  await fs.writeFile(file, output);
  return { before: input.length, after: output.length };
}

export default function optimizeImages() {
  return {
    name: 'optimize-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = [];
        for await (const f of walk(root)) files.push(f);
        let before = 0, after = 0, failed = 0;
        for (let i = 0; i < files.length; i += CONCURRENCY) {
          await Promise.all(
            files.slice(i, i + CONCURRENCY).map(async (f) => {
              try {
                const r = await optimize(f);
                before += r.before;
                after += r.after;
              } catch (e) {
                failed++;
                logger.warn(`Could not optimise ${path.relative(root, f)}: ${e instanceof Error ? e.message : e}`);
              }
            }),
          );
        }
        const mb = (n) => (n / 1024 / 1024).toFixed(1);
        logger.info(`${files.length} images: ${mb(before)} MB → ${mb(after)} MB${failed ? ` (${failed} skipped)` : ''}`);
      },
    },
  };
}
