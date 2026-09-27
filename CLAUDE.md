# Maria Goes Places — project guide for Claude Code

A bilingual (English / Greek) editorial travel journal for Maria, built by Dani (her partner).
Stack: **Astro 7 (static) → GitHub → Netlify (free) + Decap CMS at /admin**. Only cost is the domain.

## Status (handoff from Cowork, 27 Sep 2026)
- 27 Sep 2026: installed, upgraded Astro 5 → 7.3.5 (0 audit vulns), `npm run build` + `npx astro check` clean.
  Reviewed EN/GR desktop + mobile (390px) — no horizontal overflow. Fixed: `.section` was wiping `.wrap`'s side gutter;
  drop cap was also hitting the first `<p>` inside blockquotes. Needs Node ≥ 22.12.
- Content in `content/` is **sample/placeholder** (Salvador + Rio, EN + GR). Images are SVG placeholders.

## How the pieces connect
```
Maria ── writes in browser ──> /admin (Decap CMS, public/admin/)
                                   │ commits Markdown + images via GitHub API
                                   ▼
                           GitHub repo (main)
                                   │ push triggers build
                                   ▼
                  Netlify: `npm run build` → dist/ → mariagoesplaces.com
                                   ▲
content/en/*.md, content/gr/*.md ──┘  read by src/content.config.ts (glob loader)
```

## File map
| Path | What it is |
|---|---|
| `content/en/<slug>.md`, `content/gr/<slug>.md` | Stories. **Same filename in both folders = translations of each other.** |
| `content/pages/{en,gr}/about.md` | About page (also feeds the homepage "About me" band) |
| `src/content.config.ts` | Zod schema for stories/pages — must stay in sync with `public/admin/config.yml` |
| `public/admin/config.yml` | Decap CMS fields (i18n `multiple_folders`, locales en/gr) |
| `src/i18n/ui.ts` | All UI strings in EN + GR, country-name translations, `slugify`, `formatDate` |
| `src/lib/content.ts` | `getStories(lang)`, `groupByCountry`, URL helpers. Story id = `en/salvador-part-1` |
| `src/layouts/Base.astro` | HTML shell, Google Fonts, SEO/hreflang, header/footer |
| `src/pages/[lang]/…` | Every page exists at `/en/…` and `/gr/…` (`getStaticPaths` over `langs`) |
| `src/styles/global.css` | **Design tokens** (colours, fonts) + shared classes |
| `src/site.ts` | Instagram link, email |
| `originals/` | Full-size originals of site photos (git-ignored). Web copies in `public/images/site/` are resized to ≤2560px (hero) / 1400px (about) with sharp. |
| `public/images/site/` | Fixed photos found by name, any extension: `hero`, `about-1`, `about-2` (`src/lib/siteImages.ts`). Real photo beats `.svg` placeholder; a photo set in the CMS About page beats both. Hero falls back to the featured story's cover. |
| `netlify.toml` | Build settings + `/` → `/gr/` for Greek browsers, else `/en/` |

## Routes
`/en/` home · `/en/journal/` · `/en/journal/<slug>/` · `/en/destinations/` (+ map) · `/en/destinations/<country>/` · `/en/food/` (category `food` or tag `food`) · `/en/about/` · `/en/search/` (+ `/en/search.json` index) · same under `/gr/` · `/admin/`

## Features & how they work
- **Language switch**: header swaps `/en/`↔`/gr/`. On articles it links to the same slug if a translation exists, else to the journal.
- **Pop-ups**: in Markdown write `[Porto da Barra](#pop-porto-da-barra)`; the story's `highlights` list needs `key: porto-da-barra`. `Highlights.astro` renders `<dialog>`s and wires links.
- **Gallery**: `gallery` list → grid + lightbox `<dialog>` with arrows (`Gallery.astro`).
- **Map**: Leaflet 1.9.4 + CARTO light tiles from unpkg CDN (no npm dep). Points come from story `lat`/`lng`.
- **Search**: static JSON per language + client-side filter (accent-insensitive). No dependency. Could swap for Pagefind later.
- **Drafts**: `draft: true` hides a story in production, shows it in `npm run dev`.
- **Series**: stories with the same `series` value show "In this series" at the bottom, ordered by `part`.

## Design direction (from Maria's two Pinterest references)
1. "watch jane go" blog: centred script logo, top utility bar (search, links, socials), left/right nav, split hero (big image + title on light grey), "TRAVEL TO: CALIFORNIA" block (big overlay card + 3 small rows), "Hi, I'm Jane!" with two portrait photos, "Travel guides" rows per country.
2. "Travel blogger" template: full-bleed hero with huge serif CAPS, warm cream/beige palette, "ABOUT ME" big caps + italic subtitle, sand-coloured quote band "COLLECT *moments, not things.*", outlined pill buttons.

Rules: cream `--paper` background, white/sand alternating sections, big serif caps (`.display`) with italic accents (`<em>`),
light serif for story titles (`.title-serif`), tiny letter-spaced sans labels (`.label`), "READ MORE →" links (`.label.more`),
generous white space, square-cornered photos. Fonts have Greek fallbacks (GFS Didot, EB Garamond, Commissioner) — **always check Greek pages render nicely.**

## Conventions
- **No em dashes (—) anywhere on the site** (UI strings, content, CMS labels, page titles). Use a comma, colon or full stop; `|` or `·` as a separator.
- Never hard-code UI text in components; add EN + GR strings to `src/i18n/ui.ts`.
- Country is always stored in **English** (grouping key); add its Greek name to `countryGr` in `ui.ts`.
- If you add a frontmatter field, add it to **both** `content.config.ts` and `public/admin/config.yml`.
- Decap 3 rejects `i18n: duplicate` on list widgets, so **tags are `i18n: false`** (saved on the English file only); `getStories()` copies them to translations that have none.
- Decap writes empty optional fields as `""` — schema uses `optString`/`optNumber` preprocessors for that.
- Images: Decap uploads to `public/images/uploads/`. Hand-organised photos may live in `public/images/<country>/<city>/`.
  Consider converting to Astro `<Image>` / `astro:assets` later for automatic resizing (photos from phones are large).

## Commands
- `npm run dev` — local site at http://localhost:4321
- `npm run cms` (in a second terminal) + open http://localhost:4321/admin/ — edit content locally without logging in
- `npm run build` / `npm run preview`

## To-do (suggested order)
1. ~~Install, build, fix errors; review EN/GR desktop + mobile.~~ Done.
2. Polish against the two reference designs (see above); replace placeholder SVGs with real photos.
3. ~~GitHub repo~~: `mariakourela8/website-mariagoesplaces` (SSH remote `origin`, branch `main`); set in `public/admin/config.yml`.
4. Netlify: import repo → deploy. Set up GitHub OAuth for Decap (see README step 5).
5. Buy domain, connect in Netlify, confirm HTTPS.
6. Nice-to-haves: image optimisation, RSS feed, sitemap (`@astrojs/sitemap`), newsletter signup, Instagram strip, "Brazil intro" guide page type, Pagefind search.
