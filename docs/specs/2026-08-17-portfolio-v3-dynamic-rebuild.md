# Portfolio v3 — Dynamic Rebuild Spec

**Date:** 2026-08-17
**Status:** Approved, ready for implementation
**Supersedes:** `2026-08-12-portfolio-v3-design.md` §3 (Architecture) and §6 (Milestones).
Sections 4 (content), 5 (design system), 7 (quality gates) of that spec still stand.

---

## 1. What changes and why

The v3 site currently on `main` is Next.js 16 + TypeScript, with all content in
typed TS files. Two requirements invalidate that:

1. **Stack** — production work is Vite + React JSX + MUI + Express SSR
   (`react-ssr-boilerplate`, ACC website, IndigoLearn). Next.js is off-stack.
2. **Dynamic content** — content must be editable from an admin panel backed by
   Firebase, so shipping a project, a blog post or a resume update needs no code
   change and no deploy.

This is a rebuild, not a migration. The Next.js app is replaced by a copy of
`react-ssr-boilerplate` with Firebase behind it.

### What carries over

| Asset | Where it is now |
|---|---|
| **Tailwind classNames** — the entire visual design | `src/components/**/*.tsx` |
| Design tokens, background recipes | `src/app/globals.css` |
| Zod schemas | `src/data/schemas.ts` |
| Real content (projects, experience, about copy, stats) | `src/data/*.ts` → seeds Firestore |
| Project screenshots | `public/projects/**` |
| Design system, content rules, quality gates | prior spec §4, §5, §7 |

The port is mechanical: strip TS types, `next/link` → `react-router` `Link`,
`next/image` → `<img>`, Metadata API → the boilerplate's `<Seo>`.

### What is genuinely lost, and the replacement

| Lost | Replacement |
|---|---|
| `next/image` — AVIF/WebP, resizing, srcset | One-time `sharp` script converts `public/projects/**` to WebP at fixed widths. Admin uploads are resized client-side via canvas before upload. Explicit `width`/`height` + `loading="lazy"` on every `<img>` to hold layout. |
| `next/font` — self-hosting, no layout shift | woff2 files in `public/fonts/` + `@font-face` with `font-display: swap` in CSS. **Not** the Google Fonts CDN — prior spec §5b forbids it. |
| Cache Components / `revalidateTag` | Module-scope content cache with 60s TTL (§4). |

---

## 2. Stack

Vite 8 · React 19 (JSX) · react-router 8 · Tailwind CSS v4 · MUI v9 + Emotion ·
Express 5 via `serverless-http` on Netlify Functions · Firebase (Firestore, Storage, Auth).

Base: a copy of `~/Documents/react-ssr-boilerplate`, which already solves the
sitemap/404/redirect/Emotion-SSR/cache-header plumbing.

### Decisions

| # | Decision | Rationale |
|---|---|---|
| **D1** | Rebuild on `react-ssr-boilerplate`, drop Next.js | Matches production stack. The boilerplate's SEO plumbing is already debugged in production on ACC. |
| **D2** | **Tailwind on the public site, MUI only in `/admin`** | The v3 design is custom-token Tailwind; MUI components would each need restyling to match it. Confining MUI to the admin panel avoids the specificity war entirely, and MUI ships as a lazy chunk that public pages never load. MUI earns its place where it is strong — DataGrid, Dialog, TextField, Snackbar. |
| **D3** | Firestore is the content source; reads go through `firebase-admin` on the server only | Visitors never touch Firestore. Reads stay inside the free tier regardless of traffic, and the rendered HTML is complete for crawlers. |
| **D4** | Writes go browser → Firestore directly, guarded by security rules | No CRUD API to build. Security lives at the database, so `/admin` being discovered grants nothing. Browser → Storage uploads also dodge any request-body size limit on the resume PDF. |
| **D5** | Netlify Functions | Keeps the current host and URL, free. Cost: no long-lived process, so §4's cache is TTL-based rather than realtime, and content edits appear within ~60s rather than instantly. |
| **D6** | Google sign-in, single UID allowlisted in rules | No signup flow, no password to store, nobody else can ever obtain write access. |
| **D7** | Blog body is Markdown, edited in a textarea with live preview | A WYSIWYG is a large dependency and a permanent maintenance cost for a single author. |
| **D8** | Contact submissions are written by a server route, not the browser | Validation, honeypot and rate limiting need a trust boundary. A browser-writable `messages` collection is a spam target regardless of rules. |
| **D9** | Rebuild inside `nikhil-portfolio-v3` on a branch | Keeps git history and the screenshots in `public/`. `main` stays live-able until cutover. |

---

## 3. Data model (Firestore)

| Collection / doc | Fields |
|---|---|
| `profile/main` | name, role, specialism, tagline, description, email, location, socials[], stats[], clients[], aboutHeadline, aboutParagraphs[], avatarUrl, resumeUrl, resumeUpdatedAt |
| `projects/{slug}` | prior `projectSchema` + gallery[], liveUrl, githubUrl, caseStudy{overview, problem, role, architecture, decisions, results, lessons} (Markdown), order, published |
| `experience/{id}` | role, company, period, summary, order |
| `education/{id}` | institution, qualification, period, order |
| `skills/{id}` | name, category, order |
| `posts/{slug}` | title, summary, body (Markdown), coverUrl, tags[], publishedAt, updatedAt, published |
| `messages/{id}` | name, email, subject, message, createdAt, ip, read |

**Every document is Zod-parsed on read**, reusing and extending
`src/data/schemas.ts`. Two rules:

- **Lists skip-and-log an invalid document; they never throw.** One malformed
  project must not take down the whole site. This is the main risk of moving
  content out of version control and is designed against explicitly.
- **A singleton (`profile/main`) that fails to parse is fatal** and falls back
  to a checked-in default, so the site renders rather than 500s.

`schemas.ts:30` currently forces images to match `^/projects/[\w-]+\.(png|jpg|webp)$`.
It must accept Firebase Storage HTTPS URLs as well as local paths.

---

## 4. Content caching

Netlify Functions are ephemeral, so there is no process to hold a Firestore
realtime listener. Instead:

```
src/server/content.js
  getContent()  → module-scope cache, 60s TTL
                → on miss: one firebase-admin read per collection
                → Zod-parses, sorts, filters unpublished
```

Warm invocations reuse the cache. Worst case is a handful of Firestore reads per
minute per warm instance — negligible against the free tier. Content edits go
live within ~60s.

**This module is the seam.** Moving to an always-on Node host later means
replacing its body with `onSnapshot` listeners; nothing else changes.

---

## 5. The soft-404 risk

`server/sitemap.js` computes `KNOWN_PATHS` once at module load from a static
`seoMeta.json`, and `server/index.js` uses it to choose 200 vs 404:

```js
res.status(isKnownRoute(req.path) ? 200 : 404);
```

With project and post slugs living in Firestore, a slug absent from that set
renders a perfect-looking page that returns **404 to crawlers**. Both the
boilerplate README and ACC's `generate-blog-modules.mjs` document this exact
failure — ACC shipped four posts as soft 404s once already.

**Fix:** `collectPages()` and `KNOWN_PATHS` are computed from `getContent()`, not
from static JSON, so a published post is a valid route the moment the cache
refreshes. `sitemap.xml` is built from the same call, so a URL can never be
advertised as canonical while returning 404.

This gets a dedicated test: publish a post → its URL returns 200 and appears in
the sitemap; unpublish it → 404 and gone from the sitemap.

---

## 6. Netlify adaptation

The boilerplate assumes a long-lived Express process serving its own static
files. On Netlify:

| Boilerplate | On Netlify |
|---|---|
| `app.use(express.static(BUILD_DIR, staticOptions))` | Dead — Netlify's CDN serves `build/` before the function runs. Cache headers move to `[[headers]]` in `netlify.toml`. |
| `getShell()` reads `build/index.html` from disk | **Inlined at build time** via `import shellHtml from "../build/index.html?raw"`. `included_files` was the first plan; compiling the shell in is better, because it removes the filesystem from the request path entirely and makes local and Lambda resolve identically instead of differing by `cwd`. The SPA-shell fallback also serves this string rather than `sendFile`. |
| `app.listen(8080)` | `server/index.js` exports the app. Two thin entry points consume it: `server/listen.cjs` locally, `netlify/functions/ssr.cjs` in production. Both must unwrap `bundle.default \|\| bundle` — Rollup collapses a lone default export to `module.exports`, then switches shape if a named export is ever added. |
| Function file extension | `.cjs`, not `.js`. `package.json` sets `"type": "module"`, so a `.js` function is parsed as ESM and `require` is undefined at load. |
| `npm run verify` hits `npm run ssr` | Points at `netlify dev`. |
| `Dockerfile`, `scripts/deploy/*` | Unused. Kept working so a move to a Node host stays cheap (D5). |

Routing: `/*` → `/.netlify/functions/ssr` with `status = 200`, non-forced, so
existing static files win.

Netlify env vars: the six `VITE_FIREBASE_*` public keys, plus
`FIREBASE_SERVICE_ACCOUNT` (base64 JSON) and `ADMIN_UID`, which are
server-only and must never reach the client bundle. Vite only exposes
`VITE_`-prefixed vars, which is the guard.

---

## 7. Routes

```
/                     Home
/about/               Story, timeline, tech
/projects/            Grid + filter
/projects/:slug/      Case study
/experience/          Career timeline (own page — the mockup nav shows it)
/blog/                Post listing
/blog/:slug/          Post
/resume/              Interactive resume + PDF download
/contact/             Form + direct channels
*                     404

/admin                Login (Google)
/admin/projects       List + editor
/admin/experience     List + editor
/admin/education      List + editor
/admin/skills         List + editor
/admin/posts          List + Markdown editor
/admin/profile        Identity, stats, socials, about copy, avatar, resume PDF
/admin/messages       Contact inbox
```

`src/lib/nav.ts:5-6` currently links to `/resume` and `/contact`, which do not
exist — those are live 404s on `main` today, fixed in Phase 4.

`/admin` is excluded from the sitemap, `noindex`, and client-rendered only —
SSR skips it and returns the plain shell.

---

## 8. Security

- **Firestore rules:** public read where `published == true`; all writes require
  `request.auth.uid == ADMIN_UID`. `messages` allows no client read or write —
  it is written by the server with the Admin SDK.
- **Storage rules:** public read; writes require the same UID; uploads capped at
  10 MB and restricted to image and PDF content types.
- **Contact route:** Zod validation, honeypot field, per-IP rate limit, size cap.
  Distinct user-visible messages for validation failure, rate limit and server
  error. No silent failures.
- **Service account** never in the client bundle; verified by grepping the built
  assets in `npm run verify`.

---

## 9. Phases

Each phase ends deployable and demonstrable.

| | Phase | Done when |
|---|---|---|
| **P0** | Branch, boilerplate copied in, Tailwind v4 + tokens + fonts wired, Next.js files removed | `npm run build && npm run ssr` serves a styled empty page; `curl` shows real HTML |
| **P1** | Firebase project, SDK modules, security rules, env plumbing, `content.js` cache | A script reads and writes a doc; the function renders from Firestore |
| **P2** | Schemas extended, seed script migrates `src/data/*.ts` into Firestore, Home/About/Projects/detail ported to JSX and reading from `content.js` | Those four pages match the current site, sourced from Firestore |
| **P3** | Dynamic sitemap + `KNOWN_PATHS` from `getContent()` | Publish/unpublish test passes (§5) |
| **P4** | Admin panel — login, and editors for every collection, image + PDF upload | Edit About in the panel, public page updates within 60s |
| **P5** | Missing pages — `/resume`, `/contact` (+ route handler), `/blog`, `/blog/:slug`, `/experience` | No nav link 404s; a form submission lands in the inbox and emails you |
| **P6** | Polish + cutover — images to WebP, a11y audit, Lighthouse at 390/768/1280/1440, OG images, `npm run verify` green, merge and deploy | v3 is the live portfolio |

---

## 10. Testing

Node's built-in test runner (matching the boilerplate's `node --test`), not
Vitest — the existing `vitest.config.mts` goes with the Next.js app.

1. **Schema parsing** — a malformed document is skipped and logged, not thrown;
   a malformed `profile/main` falls back to the default.
2. **Sitemap / KNOWN_PATHS** — §5's publish/unpublish test.
3. **Contact route** — validation, honeypot, rate limit, and the failure paths.
4. **`npm run verify`** — SSR is real (content present in `curl`), 404s are
   exact, no service-account key in the client bundle.

No component snapshot tests, no E2E suite.

---

## 11. Open items

- **Contact email notification.** Recommended: Resend, ~15 lines in the route
  handler, free tier. Without it, leads sit unread in an admin inbox nobody
  checks. Needs a Resend account and a verified sender.
- **Domain.** Still `nikhilmasurkar.netlify.app`. `SITE.domain` in
  `siteConfig.js` is the single value to change.
- **Analytics.** Not currently planned. Netlify Analytics or Plausible if wanted.
