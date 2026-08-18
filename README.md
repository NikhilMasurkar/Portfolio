# Portfolio v3

Personal site of Nikhil Masurkar — Frontend Engineer, React Native specialist.

React 19 · Vite · Tailwind v4 · Express SSR · Firebase · Netlify Functions.

## Run it

```bash
npm install
npm run build
npm run ssr          # http://localhost:8080
```

`npm run dev` gives a fast dev server on :3000 **without SSR** — fine for
styling, wrong for anything SEO-related. Use `build` + `ssr` for that.

With the server running, in another shell:

```bash
npm run verify
```

That is the check that matters. It catches the failure this stack is prone
to: SSR throwing, falling back to the empty SPA shell, and serving a site that
looks perfect in a browser while being blank to every crawler.

```bash
npm test             # exercises the Netlify Function entry point
npm run lint
```

## Why SSR

Social crawlers — WhatsApp, LinkedIn, Facebook, X — do not run JavaScript. A
client-rendered site shares as a generic title and no preview. Redirects,
`sitemap.xml` and real 404s are Express routes, so a static host cannot serve
this correctly.

## Adding a page

Five files, and the fifth is the one people forget:

1. `src/app/pages/<area>/<Page>.jsx` — include `<Seo path="..." />`
2. `src/app/global/RoutePath.js`
3. `src/app/global/seoMeta.json`
4. `src/app/router/routeTable.js`
5. `src/app/router/Routes.jsx` **and** `server/ServerRoutes.jsx`

Miss the server one and the app refuses to start rather than serving a page
that is invisible to Google. That guard is deliberate.

## Layout

```
src/app/pages/      one folder per page
src/app/widgets/    Seo and shared bits
src/app/global/     RoutePath, seoMeta.json, siteConfig
src/app/router/     routeTable (shared), Routes (lazy, client)
src/_core/          Layout
src/index.css       design tokens — no raw hex anywhere else
server/             Express SSR, sitemap, redirects
netlify/functions/  serverless-http wrapper around the same app
legacy/             previous Next.js build; port source only
```

## Docs

`docs/specs/2026-08-17-portfolio-v3-dynamic-rebuild.md` — decisions, data
model, phase plan. Read before changing architecture.

`project.config.json` is the only file to edit for site identity: name,
domain, description, OG defaults.
