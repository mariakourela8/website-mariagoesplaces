# Maria Goes Places

A bilingual (EN/ΕΛ) travel journal. Astro + Decap CMS, hosted free on Netlify.

## 1. Run it on your Mac
Requires Node 22.12+ (`node -v`).
```bash
npm install
npm run dev          # → http://localhost:4321
```
To try the editor locally (no login needed), open a second terminal:
```bash
npm run cms          # then visit http://localhost:4321/admin/
```

## 2. GitHub
The code lives at **github.com/mariakourela8/website-mariagoesplaces** (branch `main`).
```bash
git add . && git commit -m "Describe the change" && git push
```

## 3. Deploy on Netlify
Netlify → **Add new site → Import an existing project → GitHub →** pick the repo.
Build settings are read from `netlify.toml` automatically. Every push (and every "Publish" in the CMS) redeploys.

## 4. Connect the domain
Netlify → **Domain management → Add a domain** → `mariagoesplaces.com`, then follow Netlify's DNS instructions at your registrar (Namecheap). HTTPS is automatic.

## 5. Let Maria log in to /admin
The CMS logs in with GitHub (Maria needs a free GitHub account with access to the repo).
1. GitHub → Settings → Developer settings → **OAuth Apps → New**
   - Homepage URL: `https://mariagoesplaces.com`
   - Callback URL: `https://api.netlify.com/auth/done`
2. Copy the Client ID and generate a Client secret.
3. Netlify → your site → **Project configuration → Access & security → OAuth → Install provider → GitHub**, paste both.
4. The repo is on Maria's GitHub account, so she already has access. (To let Dani edit via /admin too: repo → Settings → Collaborators.)
5. Maria goes to `mariagoesplaces.com/admin` → **Login with GitHub**.

## Writing a story (for Maria)
- **Stories → New Story.** Fill in English; switch to **GR** at the top to write the Greek version.
- **Country** always in English (e.g. *Brazil*); the Greek site translates it.
- **Pop-ups:** add an item under *Pop-ups* with a key like `porto-da-barra`, then in the text select a word and link it to `#pop-porto-da-barra`.
- **Map:** in Google Maps right-click the place → click the coordinates to copy → paste the first number into *latitude*, the second into *longitude*.
- Tick **Draft** to save without publishing. Press **Publish** → the site updates in about a minute.

## Change the look
Colours and fonts are all at the top of `src/styles/global.css`.
