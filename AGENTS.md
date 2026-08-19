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

**The server and client React trees must be structurally identical.**
`Routes.jsx` and `ServerRoutes.jsx` differ only in lazy vs eager imports —
every wrapper, including the `<Suspense>` boundary and its fallback, has to
match. A boundary present on one side only emits different SSR markers, and
hydration fails at the first child of `<main>`, discarding the whole server
render. The page still looks perfect in a browser; only `curl` and crawlers
see the damage.

**JSON-LD goes through `<JsonLd>` in `Seo.jsx`**, never a `<script>` with a
text child, and `hoistHeadTags` deliberately leaves it in the body. React 19
hoists `title`/`meta`/`link` on the client but not scripts, so moving it
server-side desynchronises the two trees.

**Anything rendered from `Date`, `Math.random()` or locale formatting will
break hydration.** See `shadeForCell` in `HeroArt.jsx` for the pattern:
derive from the index, not from entropy.

**Server files need explicit import extensions** (`./content.js`, not
`./content`) and cannot be `.jsx`. Vite resolves both; the tests load these
modules with plain Node, which resolves neither. JSON imports need
`with { type: "json" }` for the same reason.

**MUI styles the whole site, Tailwind still owns the design.** Components
come from MUI; the look comes from the Tailwind classes on them and the
tokens in `src/index.css`. Both are needed — MUI supplies behaviour
(`Drawer`'s focus trap, `TextField`'s label wiring), Tailwind supplies the
audited palette and spacing.

**CSS layer order is load-bearing, and it is decided in `index.html`.**
Emotion's output is wrapped in `@layer mui` by
`src/app/global/emotionCache.js`, and `index.html` declares
`@layer theme, base, mui, components, utilities` before any stylesheet. Three
things depend on that exact arrangement:
  - Emotion's styles must be *layered at all*, because unlayered CSS beats
    every layer no matter the order — otherwise MUI's defaults silently
    outrank the Tailwind class beside them.
  - `mui` must come *after* `base`, or Tailwind's Preflight `*{padding:0}`
    strips MUI's own input padding and text fields collapse to a sliver.
  - `mui` must come *before* `components`/`utilities`, so `.surface`, `.btn`
    and every utility still win.
A layer's position is fixed the first time the browser sees its name, so the
declaration has to be parsed before any Emotion tag. That is also why the
cache must not use `prepend: true`.

**Emotion critical CSS is extracted per request** in `server/index.js`.
Without it, server-rendered pages arrive unstyled to anything that does not
run JS. `@emotion/server` and `@emotion/cache` are CommonJS and need the
default unwrap in `server/createEmotionCache.js`; MUI is bundled rather than
externalised (`ssr.noExternal` in `vite.config.server.js`) because node-mode
interop otherwise hands back a module namespace where a component is
expected. Every one of these failures is caught by the `try/catch` in
`handleRender` and served as the empty SPA shell — fine in a browser, blank
to crawlers. `npm run verify` is what catches it.

**No raw hex in components.** Every colour is a token; the ramp is verified
against WCAG AA on all three surfaces. Two deliberate exceptions:
`src/app/global/muiTheme.js`, because MUI needs concrete colours to derive
hover and disabled shades and cannot do arithmetic on a CSS variable; and
`ResumeSheet.jsx`, which is a print document with its own palette.

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
(legacy/ is gone — the port is complete)
```
