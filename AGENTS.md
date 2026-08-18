# Portfolio v3

Vite · React 19 (JSX) · react-router · Tailwind v4 · Express SSR · Firebase.

Read `docs/specs/2026-08-17-portfolio-v3-dynamic-rebuild.md` before changing
anything. It carries the decisions and the phase plan.

> The Next.js rules that used to live in this file are gone with Next.js
> itself. If `next dev` ever re-adds them, the file is stale — delete the block.

## Rules that are load-bearing

**Adding a page touches five files.** `pages/`, `RoutePath.js`,
`seoMeta.json`, `routeTable.js`, and **both** `Routes.jsx` and
`ServerRoutes.jsx`. Miss the server one and the page works in a browser while
being blank to Google. `assertRoutesResolvable` turns that into a startup
crash instead of a silent blank 200 — do not weaken it.

**A path in `RoutePath.js` with no page behind it is a 404 waiting to
ship.** Add paths as pages are built, not ahead of time.

**`knownPaths()` decides 200 vs 404**, and it now includes Firestore slugs.
A published item missing from that set renders a perfect page that returns
404 to crawlers; a set entry with no page renders the 404 component under a
200, which gets indexed. Both are invisible in a browser. `server/sitemap.js`
is the single source for the sitemap and the 404 list, and each dynamic
family is gated on its route existing in `RoutePath.js` — that gate is what
stops content published before its page from advertising soft 404s.

**Server files need explicit import extensions** (`./content.js`, not
`./content`) and cannot be `.jsx`. Vite resolves both; the tests load these
modules with plain Node, which resolves neither. JSON imports need
`with { type: "json" }` for the same reason.

**MUI is admin-only.** The public site is Tailwind against the tokens in
`src/index.css`. There is no Emotion SSR path — see the note in
`server/index.js` before adding an MUI component to a server-rendered page.

**No raw hex in components.** Every colour is a token; the ramp is verified
against WCAG AA on all three surfaces.

**Verify before pushing:** `npm run build && npm run ssr`, then
`npm run verify` in another shell. `verify` is what catches SSR silently
falling back to the empty SPA shell.

## Layout

```
src/app/pages/      one folder per page
src/app/widgets/    Seo, Reveal, shared bits
src/app/global/     RoutePath, seoMeta.json, siteConfig
src/app/router/     routeTable (shared), Routes (lazy, client)
src/_core/          Layout
server/             Express SSR, sitemap, redirects
legacy/             previous Next.js build — port source only, delete when empty
```
