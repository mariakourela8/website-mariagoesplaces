import fs from 'node:fs';
import path from 'node:path';

/**
 * Fixed site photos live in public/images/site/ and are found by name, whatever the extension:
 *   hero.jpg · about-1.jpg · about-2.jpg
 * A real photo (jpg/png/webp/avif) wins over an .svg placeholder with the same name.
 */
const dir = path.join(process.cwd(), 'public/images/site');
const order = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.svg'];

export function siteImage(name: string): string | undefined {
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
  const matches = files.filter((f) => path.parse(f).name.toLowerCase() === name);
  const rank = (f: string) => {
    const i = order.indexOf(path.extname(f).toLowerCase());
    return i === -1 ? Infinity : i;
  };
  const best = matches.sort((a, b) => rank(a) - rank(b)).find((f) => rank(f) !== Infinity);
  return best ? `/images/site/${encodeURIComponent(best)}` : undefined;
}
