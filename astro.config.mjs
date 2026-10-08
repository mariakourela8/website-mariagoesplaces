// @ts-check
import { defineConfig } from 'astro/config';
import optimizeImages from './integrations/optimize-images.mjs';

export default defineConfig({
  site: 'https://mariagoesplaces.com',
  trailingSlash: 'ignore',
  // Fallback for "/" (Netlify already redirects by browser language, see netlify.toml)
  redirects: { '/': '/en/' },
  // Shrinks photos in the built site and strips their metadata (incl. GPS)
  integrations: [optimizeImages()],
});
