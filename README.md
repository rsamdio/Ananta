[![Netlify Status](https://api.netlify.com/api/v1/badges/a48f664d-f88a-44a1-8ca8-dc69fe0a1a6b/deploy-status)](https://app.netlify.com/projects/ananta2026/deploys)

# ANANTA 2026 – RSA MDIO Installation

Static website for the 17th RSA MDIO Installation Ceremony (May 30–31, 2026, Bengaluru).

**No build step.** The site is plain HTML, CSS, and a small `main.js`. Tailwind, Lucide, AOS, and fonts load from CDNs.

## Run locally

From this directory, serve the project root (so `/media`, `/public`, and asset paths resolve):

```bash
python3 -m http.server 3000
```

Or:

```bash
npx serve .
```

Open http://localhost:3000

## Deploy

Point your host’s publish directory at the **repository root** (where `index.html` lives). Netlify picks up `_headers` and `_redirects` from the root.
