# Portfolio v3 — Design Spec

**Date:** 2026-08-12
**Status:** Approved, ready for implementation planning
**Supersedes:** the current Vite + MUI portfolio at `nikhilmasurkar.netlify.app`

> This spec governs a **new repository**. It lives here because the new repo does not
> exist yet; move it to `docs/specs/` in the v3 repo once that repo is created.

---

## 1. Overview

Rebuild the portfolio as a premium, dark, product-grade site that reads as
"this developer builds production software" within ten seconds. Source material:
the Portfolio v3 PRD and the design sheets in `~/Documents/portfolio/resourses/`
(`theme.png`, `brandtheme.png`, `colropallet.png`, `gradients.png`,
`website_represtations.png`). Copy these into the v3 repo under
`design/reference/` so the spec does not depend on a path outside version
control.

### Goals

- Impress recruiters fast; convert founders and clients into leads.
- Show engineering *thinking* through case studies, not a list of technologies.
- Lighthouse: Performance > 95, Accessibility 100, SEO 100, Best Practices 100.

### Non-goals for v1

Explicitly deferred so v1 can ship: `/blog`, `/services`, `/uses`, `/now`,
`/changelog`, `/playground`, `/reading`, AI-powered search, multi-language,
pagination, light theme, GSAP, Lenis.

---

## 2. Decisions

| # | Decision | Rationale |
|---|---|---|
| D1 | UI rebuild first, Firebase counters after | The redesign restructures project cards; building counter UI into the old MUI cards then rebuilding would be double work. |
| D2 | New Next.js repo; old site stays live | Nothing breaks and there is no pressure to rush. Cutover is a deliberate switch, not a big bang. |
| D3 | Full new visual identity | Per PRD and the supplied brand sheets. |
| D4 | v1 = Home, Projects + 2–3 case studies, About/Experience, Contact, Resume | Case studies are the stated differentiator, so v1 must prove the format — but 3 flagship ones, not 7. |
| D5 | Vertical slice build order | Validates the visual direction on Home before it is baked into ten pages; every milestone ends showable. Components extracted on second use, not designed speculatively. |
| D6 | Vercel free subdomain now, custom domain later | Site URL is a single env var so the swap is one change. |
| D7 | Dark theme only in v1 | Two themes double the design surface for every glass surface, glow and gradient. Tokens are structured so light is a token swap later. |
| D8 | Framer Motion only | GSAP overlaps almost entirely for this work; Lenis hijacks native scroll, the most common cause of "feels laggy", and it fights the a11y goals. |
| D9 | Case studies in MDX; structured lists in typed TS | Prose belongs in MDX with per-file frontmatter for SEO; experience/skills/testimonials are rendered lists, where MDX is the wrong tool. |
| D10 | Backgrounds in CSS, not raster | The reference PNGs are ~1.5 MB each; the same effects cost a few KB in CSS and are animatable. |
| D11 | Case study template trimmed 15 → 7 sections | The PRD's §28 content questions are what make case studies good; the 15-section template largely restated them. |

---

## 3. Architecture

### Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS ·
shadcn/ui · Framer Motion · MDX · React Hook Form + Zod · Resend · Vercel.

### Rendering

Everything is statically generated. A portfolio has no per-request state, and SSG
is what buys the Lighthouse and SEO targets. The single exception is the contact
form, which needs a Route Handler so the Resend API key stays server-side. (The
current site's EmailJS runs client-side; this is a genuine improvement.)

### Routes (v1)

```
/                    Home
/about               Story + career timeline + skills + testimonials
/projects            Grid + category filter
/projects/[slug]     Case study, statically generated from MDX
/resume              Interactive resume + PDF download
/contact             Form + direct channels
/not-found           404
```

Experience is merged into `/about` for v1 — separately both pages would be thin,
and recruiters read them as one story. Split later if `/about` grows.

### Site URL

A single `NEXT_PUBLIC_SITE_URL` env var feeds canonical tags, OG URLs, the
sitemap and JSON-LD. No hardcoded origins anywhere. Buying a domain later is one
env change plus a redirect left on the Netlify site.

### Folder structure

```
src/
  app/                 routes, layouts, route handlers
  components/
    ui/                shadcn primitives + brand-level primitives
    layout/            nav, footer, section shells
    home/ about/ projects/ contact/
    shared/
  content/projects/    *.mdx case studies
  data/                experience.ts, skills.ts, testimonials.ts, projects.ts
  lib/                 mdx loading, schemas, seo helpers
  styles/              tokens.css, globals.css
  types/
```

---

## 4. Content model

### Case studies — MDX

`content/projects/<slug>.mdx`, frontmatter validated by a **Zod schema at build
time**, so a bad slug or missing cover fails the build rather than shipping
broken. That schema is also the source of truth for the `Project` type.

```ts
{
  title: string
  slug: string
  summary: string          // used on cards and as meta description
  cover: string
  tech: string[]
  role: string
  year: number
  featured: boolean
  metrics?: { label: string; value: string }[]
  links?: { live?: string; github?: string; play?: string }
}
```

### Case study template (7 sections)

Overview · Problem · My Role · Architecture · Key Decisions & Trade-offs ·
Results · Lessons.

Each should answer the PRD §28 questions: what problem existed, why it mattered,
what constraints applied, what decisions and trade-offs were made, what the
measurable outcome was, what was learned.

### Structured data — typed TS

`src/data/` holds experience, education, skills and testimonials as typed arrays.
Migrated from the current `PageData.jsx`.

### Content inventory for v1

- **7 real projects** — ACC, BudgetIQ, IndigoLearn web, ForumUI, MAYA, The Sky
  Events, IndigoLearn app.
- **3 flagship case studies** — ACC (freshest), IndigoLearn app, MAYA.
- The reference mockups show MezOrder, TaskManager, Portfolio v2, Chat
  Application and three blog posts. **These are mockup filler and do not ship.**

### Truthfulness constraints

These are load-bearing; recruiters verify.

- Stats must be sourceable (Play Store downloads, the 177 routes / 368 modals
  from the ACC work, years of experience).
- Company logos: IndigoLearn and Avinash/ACC are employers, so framing must be
  "Worked with", not "Trusted by", unless a genuine client relationship exists.
- Testimonials require explicit permission to publish name and role. No
  testimonial ships without it; omit the section rather than invent quotes.

---

## 5. Design system

### Colour tokens

Base palette from `colropallet.png` / `theme.png`. Two corrections were made
after measuring contrast — both original values failed WCAG AA as text.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#050816` | page background |
| `--surface` | `#0F1224` | default card |
| `--surface-raised` | `#1A1F2E` | hover / elevated only |
| `--border` | `#1E2238` | borders, dividers |
| `--text` | `#FFFFFF` | primary text |
| `--muted` | `#94A3B8` | secondary text |
| `--primary` | `#6C63FF` | **fills only** — buttons, borders, glows |
| `--primary-text` | `#827AFF` | primary-coloured **text** |
| `--accent` | `#A855F7` | **fills only** |
| `--accent-text` | `#B166F8` | accent-coloured **text** |
| `--secondary` | `#00D4FF` | highlights, links |
| `--pink` | `#FF4FD8` | Gradient 02 only |

**Measured contrast (AA needs 4.5 for normal text):**

| Colour | on `#050816` | on `#0F1224` | on `#1A1F2E` |
|---|---|---|---|
| `#FFFFFF` | 19.95 | 18.55 | 16.41 |
| `#94A3B8` | 7.78 | 7.23 | 6.40 |
| `#00D4FF` | 11.27 | 10.48 | 9.27 |
| `#FF4FD8` | 6.99 | 6.50 | — |
| `#6C63FF` *(fill)* | 4.62 | **4.30 ✗** | **3.80 ✗** |
| `#827AFF` *(text)* | 5.87 | 5.46 | 4.83 ✓ |
| `#A855F7` *(fill)* | 5.04 | 4.69 | **4.15 ✗** |
| `#B166F8` *(text)* | 5.82 | 5.41 | 4.79 ✓ |

Tokens are CSS custom properties mapped into the Tailwind theme. No raw hex in
components.

### Gradients

```
Gradient 01  #6C63FF → #00D4FF     Gradient 03  #00D4FF → #0072FF
Gradient 02  #A855F7 → #FF4FD8     Gradient 04  #6C63FF → #A855F7
```

### Typography

`next/font`, self-hosted at build time — no external request, no layout shift.

| Role | Font | Size / line-height |
|---|---|---|
| H1 | Space Grotesk Bold | 64 / 72 |
| H2 | Space Grotesk Medium | 40 / 52 |
| H3 | Inter SemiBold | 24 / 32 |
| Body | Inter Regular | 16 / 28 |
| Code | JetBrains Mono | — |

Sizes are desktop; they scale down fluidly at the breakpoints in §7.

### Backgrounds

A `<SectionBackground variant="...">` component encodes the six recipes from
`gradients.png`, all in CSS:

| Variant | Recipe |
|---|---|
| `hero` | Aurora + Orbs + Noise |
| `about` | Gradient 01 + Grid |
| `projects` | Gradient 02 + Light Streaks |
| `contact` | Gradient 03 + Orbs |
| `footer` | Gradient 04 + Noise + Grid |
| `case-study` | Noise + Glass + Streaks |

Implementation: glows/orbs as `radial-gradient`, aurora as layered gradients,
grid as `repeating-linear-gradient`, noise as inline SVG `feTurbulence`.

### Glass surfaces

`--surface` fill, `--border` border, backdrop blur. Applied to cards and the nav
bar only — `backdrop-filter` is expensive at scale.

### Motion

Framer Motion only. Fade-in on scroll, staggered card reveals, smooth hover,
page transitions, image zoom, hero cursor spotlight.

`prefers-reduced-motion` is handled once at the provider level, not per
component — that is precisely the mistake the current site's animation setup
made, which left content permanently invisible.

---

## 6. Milestones

Each ends deployed to the Vercel preview URL and responsive at all breakpoints.

| | Milestone | Done when |
|---|---|---|
| **M0** | Next.js + TS + Tailwind + shadcn, `next/font`, tokens, nav/footer shell, Vercel deploy | A styled empty page is live at a URL |
| **M1** | **Home** — nav, hero, logo row, stats, featured projects, tech stack, CTA, footer | Identity proven; first Lighthouse run |
| **M2** | Projects + case-study pipeline — MDX, Zod frontmatter, grid + filter, `[slug]` template, **ACC case study written** | One real case study reads end to end |
| **M3** | IndigoLearn app + MAYA case studies | 3 case studies live |
| **M4** | About — story, timeline, skills, testimonials — plus Resume + PDF | |
| **M5** | Contact — RHF + Zod + Resend handler, honeypot + rate limit | Form delivers, validates, fails gracefully |
| **M6** | Polish & cutover — a11y audit, Lighthouse, JSON-LD, sitemap, robots, 404, redirect from Netlify | v3 is the live portfolio |
| **M7** | *(separate spec)* Firebase public counters | — |

M1 matters most: it is where the visual direction is validated while changing it
is still cheap.

Case-study writing is interleaved with the milestone that displays it, so prose
never becomes one blocking wall at the end.

---

## 7. Quality gates

### Responsive

Every page verified at **390 / 768 / 1280 / 1440**.

### Accessibility (target: 100)

WCAG AA contrast (see §5 table), full keyboard navigation, visible focus states,
semantic HTML, correct ARIA labels, skip-to-content link, axe clean,
`prefers-reduced-motion` honoured.

### Performance (target: > 95)

Self-hosted fonts, CSS backgrounds instead of raster, `next/image` with AVIF/WebP
for real photography, one motion library. The hero desk render (2.5 MB source)
must be compressed and served through `next/image` if used at all.

### SEO (target: 100)

Per-page metadata via the Metadata API, OpenGraph, Twitter cards, JSON-LD,
canonical URLs, sitemap, robots.txt — all origins derived from
`NEXT_PUBLIC_SITE_URL`.

---

## 8. Error handling

- **Contact form** — field validation via Zod; network failure, Resend failure and
  rate-limit rejection all produce distinct user-visible messages. No silent
  failures.
- **Unknown case study slug** — `not-found`.
- **Malformed frontmatter** — fails the build.
- **Spam** — honeypot field plus per-IP rate limiting on the route handler.

---

## 9. Testing

This is a static content site. Two things carry real logic and get tested; the
rest would be ceremony that rots.

1. **Content schema** — malformed frontmatter (bad slug, missing cover, bad year)
   fails the build.
2. **Contact form** — validation rules and the route handler's failure paths,
   including the spam guard.

No component snapshot tests, no E2E suite for v1. TypeScript strict mode plus a
build that refuses bad content covers the realistic failure modes.

---

## 10. Post-v1 backlog

In rough priority order: Firebase public counters (M7, own spec), MDX blog
reusing the case-study pipeline, Services page, custom domain, remaining four
case studies, testimonials expansion, command menu, the hidden pages
(`/uses`, `/now`, `/changelog`, `/playground`, `/reading`), light theme.

---

## 11. Open items

- **Domain** — deferred by choice; free `*.vercel.app` until purchased.
- **Hero imagery** — the supplied desk render is an AI image and reads as generic
  to developer audiences. Recommendation is to lead with real product UI; the
  real portrait from the About mock is the stronger human asset. Decision can be
  made during M1 without affecting the plan.
- **Logo assets** — `theme.png` defines the NM wordmark, favicon set (512→16) and
  app icon. These need exporting as real SVG/PNG files before M0 completes.
