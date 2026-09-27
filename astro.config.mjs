// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mariagoesplaces.com',
  trailingSlash: 'ignore',
  // Fallback for "/" (Netlify already redirects by browser language — see netlify.toml)
  redirects: { '/': '/en/' },
});
