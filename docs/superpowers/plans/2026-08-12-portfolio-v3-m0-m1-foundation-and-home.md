# Portfolio v3 — M0 Foundation + M1 Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a new Next.js repo with the v3 design tokens, layout shell and a complete, deployed Home page.

**Architecture:** Next.js App Router, statically generated. Tailwind v4 CSS-first tokens drive every colour and size — no raw hex in components. Page backgrounds are pure CSS (gradients + inline SVG noise), never raster. Scroll reveals use one `<Reveal>` primitive that reads `prefers-reduced-motion` once. Content lives in typed data modules validated by Zod, so bad content fails the build.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript (strict), Tailwind CSS 4.3, motion 13.1 (Framer Motion), Zod 4.4, Vitest 4.1, Vercel.

**Spec:** `docs/superpowers/specs/2026-08-12-portfolio-v3-design.md`

**Plan 1 of 6.** Covers M0 and M1. M2–M6 get their own plans.

## Global Constraints

Every task's requirements implicitly include this section.

- **Repo root:** `/Users/nikhilmasurkar/Documents/nikhil-portfolio-v3`
- **TypeScript strict mode on.** Build fails on type errors.
- **No raw hex values in components.** Every colour comes from a token.
- **Fills vs text.** `#6C63FF` and `#A855F7` are fills only (buttons, borders, glows). Coloured *text* uses `#827AFF` / `#B166F8`. Both originals fail WCAG AA on card surfaces.
- **Container:** `max-width: 1240px`, `padding: 0 32px`.
- **Breakpoints:** 1160 / 900 / 720, verified additionally at 390.
- **Backgrounds in CSS only.** No raster background images.
- **Fonts via `next/font`.** Never a Google Fonts `<link>`.
- **Real routes and real elements.** Navigation uses `next/link`; anything clickable is `<a>` or `<button>`. Never a `<div onClick>`.
- **`prefers-reduced-motion` handled once** in the `<Reveal>` primitive, never per-component.
- **Content is real.** Only data from spec §4. Never the DC prototype's `renderVals()` — it contradicts real work history.
- **Commit after every task.**

### Deviations from the PRD, deliberate

1. **Next.js 16.3, not 15.** 16 is current stable; a greenfield repo should not start a major behind.
2. **`motion` package, not `framer-motion`.** Same library, current name.
3. **shadcn/ui deferred to M5.** Home needs no dialogs, dropdowns or comboboxes. Installing a component library before a component needs it is speculative. M5's contact form is the first real use.

---

# M0 — Foundation

### Task 1: Initialise the repository

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: a running dev server at `http://localhost:3000`

- [ ] **Step 1: Scaffold the project**

```bash
cd /Users/nikhilmasurkar/Documents
npx create-next-app@16.3.0 nikhil-portfolio-v3 \
  --typescript --tailwind --app --src-dir --no-eslint \
  --import-alias "@/*" --use-npm --no-turbopack
```

Answer `No` if asked about anything not covered by the flags.

- [ ] **Step 2: Verify the dev server runs**

```bash
cd /Users/nikhilmasurkar/Documents/nikhil-portfolio-v3 && npm run dev
```

Expected: `Ready in ...` and `http://localhost:3000` serves the starter page. Stop the server with Ctrl-C.

- [ ] **Step 3: Enable strict TypeScript**

Confirm `tsconfig.json` contains `"strict": true` under `compilerOptions`. If absent, add it.

- [ ] **Step 4: Verify the production build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`, exit code 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 16 + TypeScript + Tailwind 4"
```

---

### Task 2: Contrast utility and the accessibility guard test

This task exists because two colours in the supplied brand sheets fail WCAG AA. The test makes that finding executable, so a future palette edit cannot silently break accessibility.

**Files:**
- Create: `src/lib/contrast.ts`
- Create: `tests/contrast.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Consumes: nothing
- Produces: `relativeLuminance(hex: string): number`, `contrastRatio(a: string, b: string): number`, `meetsAA(fg: string, bg: string, large?: boolean): boolean`

- [ ] **Step 1: Install Vitest**

```bash
npm install -D vitest@4.1.10
```

- [ ] **Step 2: Add the Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Add the test script**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run"
```

- [ ] **Step 4: Write the failing test**

Create `tests/contrast.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA, relativeLuminance } from "@/lib/contrast";

const BG = "#050816";
const SURFACE = "#0F1224";
const SURFACE_RAISED = "#1A1F2E";
const SURFACES = [BG, SURFACE, SURFACE_RAISED];

// Every token that renders as TEXT must clear AA on every surface it can land on.
const TEXT_TOKENS = {
  text: "#FFFFFF",
  text2: "#E6E9F5",
  text3: "#C9D0E8",
  text4: "#B6BFE0",
  muted: "#94A3B8",
  meta: "#7C869E",
  dim: "#757D94",
  primaryText: "#827AFF",
  accentText: "#B166F8",
  secondary: "#00D4FF",
};

describe("relativeLuminance", () => {
  it("returns 0 for black and 1 for white", () => {
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
  });
});

describe("contrastRatio", () => {
  it("returns 21 for black on white", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 2);
  });

  it("is order independent", () => {
    expect(contrastRatio("#94A3B8", BG)).toBeCloseTo(contrastRatio(BG, "#94A3B8"), 5);
  });
});

describe("text tokens meet WCAG AA on every surface", () => {
  for (const [name, hex] of Object.entries(TEXT_TOKENS)) {
    for (const surface of SURFACES) {
      it(`${name} (${hex}) on ${surface}`, () => {
        expect(meetsAA(hex, surface)).toBe(true);
      });
    }
  }
});

describe("fill-only tokens are correctly excluded from text use", () => {
  // These are the two that fail. They are fills only; the guard documents why.
  it("#6C63FF fails as text on the card surface", () => {
    expect(meetsAA("#6C63FF", SURFACE)).toBe(false);
  });

  it("#A855F7 fails as text on the raised surface", () => {
    expect(meetsAA("#A855F7", SURFACE_RAISED)).toBe(false);
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "@/lib/contrast"`.

- [ ] **Step 6: Implement the utility**

Create `src/lib/contrast.ts`:

```ts
/**
 * WCAG 2.1 relative luminance and contrast ratio.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function parseHex(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) {
    throw new Error(`Expected a 6-digit hex colour, received "${hex}"`);
  }
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/** AA needs 4.5:1 for normal text, 3:1 for large text (>=18.66px bold or >=24px). */
export function meetsAA(fg: string, bg: string, large = false): boolean {
  return contrastRatio(fg, bg) >= (large ? 3 : 4.5);
}
```

- [ ] **Step 7: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS, 35 tests.

- [ ] **Step 8: Commit**

```bash
git add src/lib/contrast.ts tests/contrast.test.ts vitest.config.ts package.json package-lock.json
git commit -m "feat: add contrast utility with WCAG AA guard test"
```

---

### Task 3: Design tokens

**Files:**
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: nothing
- Produces: Tailwind utilities `bg-bg`, `bg-surface`, `bg-surface-raised`, `border-line`, `text-fg`, `text-muted`, `text-meta`, `text-dim`, `text-primary-text`, `text-accent-text`, `text-secondary`, plus `--gradient-01`…`--gradient-04`

- [ ] **Step 1: Replace globals.css with the token layer**

Replace the entire contents of `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  /* Surfaces */
  --color-bg: #050816;
  --color-surface: #0f1224;
  --color-surface-raised: #1a1f2e;

  /* Borders */
  --color-line-header: #12172c;
  --color-line-inner: #161c33;
  --color-line: #1e2238;
  --color-line-raised: #262c47;
  --color-line-emphasis: #2a3154;

  /* Text ramp — every value verified >= 4.5:1 on all three surfaces */
  --color-fg: #ffffff;
  --color-fg-2: #e6e9f5;
  --color-fg-3: #c9d0e8;
  --color-fg-4: #b6bfe0;
  --color-muted: #94a3b8;
  --color-meta: #7c869e;
  --color-dim: #757d94;

  /* Brand — FILLS ONLY. Use the -text variants for text. */
  --color-primary: #6c63ff;
  --color-accent: #a855f7;
  --color-secondary: #00d4ff;
  --color-pink: #ff4fd8;

  /* Brand text-safe tints */
  --color-primary-text: #827aff;
  --color-accent-text: #b166f8;

  /* Type */
  --font-display: var(--font-space-grotesk), sans-serif;
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;

  /* Layout — generates the `max-w-page` utility */
  --container-page: 1240px;

  /* Elevation */
  --shadow-card: 0 30px 80px rgb(0 0 0 / 0.4);
  --shadow-cta: 0 10px 34px rgb(var(--rgb-primary) / 0.42);
}

:root {
  /*
   * Brand colours as RGB triplets so any alpha can be applied at the use
   * site: rgb(var(--rgb-primary) / 0.42). This is what keeps decorative
   * glows and gradients token-driven instead of hardcoded rgba().
   */
  --rgb-primary: 108 99 255;
  --rgb-secondary: 0 212 255;
  --rgb-accent: 168 85 247;

  --gradient-01: linear-gradient(135deg, #6c63ff, #00d4ff);
  --gradient-02: linear-gradient(135deg, #a855f7, #ff4fd8);
  --gradient-03: linear-gradient(135deg, #00d4ff, #0072ff);
  --gradient-04: linear-gradient(135deg, #6c63ff, #a855f7);
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--color-bg);
  color: var(--color-fg);
}

body {
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

/* Visible focus for keyboard users — required by the accessibility target. */
:focus-visible {
  outline: 2px solid var(--color-secondary);
  outline-offset: 3px;
  border-radius: 4px;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: var(--color-bg);
}
::-webkit-scrollbar-thumb {
  background: var(--color-line);
  border-radius: 8px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-line-emphasis);
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add design tokens"
```

---

### Task 4: Fonts and root layout

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/lib/site-config.ts`

**Interfaces:**
- Consumes: `src/app/globals.css`
- Produces: `siteConfig: { name, role, tagline, description, url, email }`; CSS variables `--font-space-grotesk`, `--font-inter`, `--font-jetbrains-mono` on `<html>`

- [ ] **Step 1: Create the site config**

Create `src/lib/site-config.ts`:

```ts
export const siteConfig = {
  name: "Nikhil Masurkar",
  role: "Frontend Engineer",
  specialism: "React Native Specialist",
  tagline: "Building Production Software.",
  description:
    "Frontend Engineer and React Native specialist building high-performance web and mobile applications.",
  /** Single source of truth for every canonical, OG and sitemap URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "nikhildmasurkar@gmail.com",
} as const;
```

Note the email is `nikhildmasurkar@gmail.com` — the address in the DC prototype is wrong.

- [ ] **Step 2: Replace the root layout**

Replace the entire contents of `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.role}`,
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/lib/site-config.ts
git commit -m "feat: add fonts, site config and base metadata"
```

---

### Task 5: Container and navigation data

**Files:**
- Create: `src/components/ui/container.tsx`
- Create: `src/lib/nav.ts`

**Interfaces:**
- Consumes: tokens from Task 3
- Produces: `<Container>` component; `navItems: { label: string; href: string }[]`

- [ ] **Step 1: Create the Container**

Create `src/components/ui/container.tsx`:

```tsx
import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-page px-8 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create the nav data**

Create `src/lib/nav.ts`:

```ts
/** Routes that exist in v1. Blog and Services are deferred past cutover. */
export const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;

export type NavItem = (typeof navItems)[number];
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/container.tsx src/lib/nav.ts
git commit -m "feat: add container and nav data"
```

---

### Task 6: Header, footer and skip link

Everything clickable here is a real `<Link>` or `<a>`. The DC prototype used `<div onClick>`, which is not focusable and produces no crawlable URL.

**Files:**
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-footer.tsx`
- Create: `src/lib/socials.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `Container`, `navItems`, `siteConfig`
- Produces: `<SiteHeader />`, `<SiteFooter />`, `socials: { label: string; href: string; name: string }[]`

- [ ] **Step 1: Create the socials data**

Create `src/lib/socials.ts`:

```ts
import { siteConfig } from "./site-config";

/** `name` is the accessible name; `label` is the two-character visual mark. */
export const socials = [
  { label: "GH", name: "GitHub", href: "https://github.com/NikhilMasurkar" },
  {
    label: "in",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nikhil-masurkar",
  },
  { label: "@", name: "Email", href: `mailto:${siteConfig.email}` },
] as const;
```

- [ ] **Step 2: Create the header**

Create `src/components/layout/site-header.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/nav";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line-header bg-bg/70 backdrop-blur-[18px]">
      <Container className="flex h-[74px] items-center justify-between gap-8">
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-fg"
        >
          NM<span className="text-accent-text">.</span>
        </Link>

        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-[34px] gap-y-3">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-1 text-[14.5px] font-medium transition-colors hover:text-fg ${
                      active ? "text-fg" : "text-muted"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[image:var(--gradient-01)]"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 3: Create the footer**

Create `src/components/layout/site-footer.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navItems } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";
import { socials } from "@/lib/socials";

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-line-header bg-surface/60">
      <Container className="flex flex-wrap items-center justify-between gap-8 py-8 max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <div className="mb-1.5 font-display text-xl font-bold tracking-tight">
            NM<span className="text-accent-text">.</span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-dim">
            © {new Date().getFullYear()} {siteConfig.name}.
            <br />
            All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[13px] text-meta transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2.5">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line font-mono text-[11px] text-meta transition-colors hover:border-primary hover:text-fg"
              >
                <span aria-hidden>{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 4: Wire the shell into the layout**

In `src/app/layout.tsx`, add the imports below the existing ones:

```tsx
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
```

Then replace the `<body>` element with:

```tsx
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-fg"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="relative z-10 pt-[74px]">
          {children}
        </main>
        <SiteFooter />
      </body>
```

- [ ] **Step 5: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 6: Verify keyboard access manually**

```bash
npm run dev
```

Load `http://localhost:3000`, press Tab. Expected: "Skip to content" appears first with a visible cyan focus ring, then each nav link receives focus in order. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout src/lib/socials.ts src/app/layout.tsx
git commit -m "feat: add header, footer and skip link"
```

---

### Task 7: SectionBackground

Encodes the six background recipes from `gradients.png` in pure CSS. Raster versions of these are ~1.5 MB each and would sink the performance target.

**Files:**
- Create: `src/components/ui/section-background.tsx`

**Interfaces:**
- Consumes: tokens from Task 3
- Produces: `<SectionBackground variant="hero" | "about" | "projects" | "contact" | "footer" | "case-study" />`

- [ ] **Step 1: Create the component**

Create `src/components/ui/section-background.tsx`:

```tsx
export type BackgroundVariant =
  | "hero"
  | "about"
  | "projects"
  | "contact"
  | "footer"
  | "case-study";

/** Inline SVG noise — a few hundred bytes instead of a texture file. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")";

/** Brand colours come from tokens; only the alpha varies at the use site. */
const PRIMARY = (a: number) => `rgb(var(--rgb-primary) / ${a})`;
const SECONDARY = (a: number) => `rgb(var(--rgb-secondary) / ${a})`;
const ACCENT = (a: number) => `rgb(var(--rgb-accent) / ${a})`;

const GRID = [
  `repeating-linear-gradient(0deg, ${PRIMARY(0.06)} 0 1px, transparent 1px 64px)`,
  `repeating-linear-gradient(90deg, ${PRIMARY(0.06)} 0 1px, transparent 1px 64px)`,
].join(",");

const ORBS: Record<BackgroundVariant, string> = {
  hero: [
    `radial-gradient(620px 620px at 8% -10%, ${PRIMARY(0.42)}, transparent 62%)`,
    `radial-gradient(680px 680px at 96% 12%, ${SECONDARY(0.24)}, transparent 62%)`,
    `radial-gradient(520px 520px at 46% 108%, ${ACCENT(0.28)}, transparent 65%)`,
  ].join(","),
  about: `radial-gradient(560px 560px at 92% -8%, ${PRIMARY(0.3)}, transparent 65%)`,
  projects: `radial-gradient(640px 520px at 30% -12%, ${ACCENT(0.24)}, transparent 65%)`,
  contact: `radial-gradient(600px 520px at 88% 108%, ${SECONDARY(0.22)}, transparent 66%)`,
  footer: `radial-gradient(700px 400px at 50% 120%, ${PRIMARY(0.18)}, transparent 70%)`,
  "case-study": `radial-gradient(620px 520px at 100% -8%, ${PRIMARY(0.3)}, transparent 65%)`,
};

const WITH_GRID: BackgroundVariant[] = ["about", "footer"];
const WITH_NOISE: BackgroundVariant[] = ["hero", "footer", "case-study"];

export function SectionBackground({ variant }: { variant: BackgroundVariant }) {
  const layers = [ORBS[variant]];
  if (WITH_GRID.includes(variant)) layers.push(GRID);
  if (WITH_NOISE.includes(variant)) layers.push(NOISE);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        backgroundImage: layers.join(","),
        maskImage:
          "radial-gradient(ellipse 100% 80% at 50% 0%, #000 40%, transparent 92%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 100% 80% at 50% 0%, #000 40%, transparent 92%)",
      }}
    />
  );
}
```

- [ ] **Step 2: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/section-background.tsx
git commit -m "feat: add CSS section backgrounds"
```

---

### Task 8: Deploy to Vercel

**Files:**
- Create: `.env.example`

**Interfaces:**
- Consumes: everything from M0
- Produces: a live preview URL; `NEXT_PUBLIC_SITE_URL` set in Vercel

- [ ] **Step 1: Document the env var**

Create `.env.example`:

```bash
# Origin used for canonical tags, OpenGraph URLs, sitemap and JSON-LD.
# Set this in Vercel to the deployment URL. Change it once a custom domain is bought.
NEXT_PUBLIC_SITE_URL=https://example.vercel.app
```

- [ ] **Step 2: Deploy**

```bash
npx vercel@latest --yes
```

This requires an interactive Vercel login on first run. Accept the defaults; the framework is detected automatically.

- [ ] **Step 3: Set the site URL**

Copy the deployment URL printed by the previous step, then:

```bash
npx vercel@latest env add NEXT_PUBLIC_SITE_URL production
```

Paste the deployment URL when prompted.

- [ ] **Step 4: Promote to production**

```bash
npx vercel@latest --prod --yes
```

Expected: a production URL. Open it — a dark page with a working header and footer.

- [ ] **Step 5: Commit**

```bash
git add .env.example
git commit -m "chore: document NEXT_PUBLIC_SITE_URL and deploy"
```

**M0 is complete.** A styled shell is live at a URL.

---

# M1 — Home

### Task 9: Content schemas and site data

**Files:**
- Create: `src/data/schemas.ts`
- Create: `src/data/profile.ts`
- Create: `tests/data.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `statSchema`, `experienceSchema`, `clientSchema`; `stats: Stat[]`, `clients: Client[]`, `experience: Experience[]`; types `Stat`, `Client`, `Experience`

- [ ] **Step 1: Install Zod**

```bash
npm install zod@4.4.3
```

- [ ] **Step 2: Write the failing test**

Create `tests/data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clients, experience, stats } from "@/data/profile";
import { clientSchema, experienceSchema, statSchema } from "@/data/schemas";

describe("profile data conforms to its schema", () => {
  it("every stat parses", () => {
    for (const stat of stats) {
      expect(() => statSchema.parse(stat)).not.toThrow();
    }
  });

  it("every client parses", () => {
    for (const client of clients) {
      expect(() => clientSchema.parse(client)).not.toThrow();
    }
  });

  it("every experience entry parses", () => {
    for (const entry of experience) {
      expect(() => experienceSchema.parse(entry)).not.toThrow();
    }
  });
});

describe("schemas reject malformed content", () => {
  it("rejects a stat with an empty label", () => {
    expect(() => statSchema.parse({ value: "4+", label: "" })).toThrow();
  });

  it("rejects an experience entry with no company", () => {
    expect(() =>
      experienceSchema.parse({
        role: "Engineer",
        company: "",
        period: "2022 — 2024",
        summary: "Did things.",
      }),
    ).toThrow();
  });
});

describe("content matches real history", () => {
  it("lists the current employer first", () => {
    expect(experience[0].company).toBe("Avinash Group of Institute");
  });

  it("contains no placeholder companies from the design prototype", () => {
    const companies = experience.map((e) => e.company);
    expect(companies).not.toContain("MezOrder");
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "@/data/profile"`.

- [ ] **Step 4: Create the schemas**

Create `src/data/schemas.ts`:

```ts
import { z } from "zod";

export const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const clientSchema = z.object({
  name: z.string().min(1),
  mark: z.string().length(2),
});

export const experienceSchema = z.object({
  role: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  summary: z.string().min(1),
});

export type Stat = z.infer<typeof statSchema>;
export type Client = z.infer<typeof clientSchema>;
export type Experience = z.infer<typeof experienceSchema>;
```

- [ ] **Step 5: Create the profile data**

Create `src/data/profile.ts`. Every value here is real — taken from the existing portfolio's resume data, not the design prototype.

```ts
import type { Client, Experience, Stat } from "./schemas";

/**
 * Only claims that can be evidenced belong here. "Worked with", not
 * "Trusted by" — these are employers, not clients.
 */
export const clients: Client[] = [
  { name: "Avinash Group", mark: "AG" },
  { name: "IndigoLearn", mark: "IL" },
];

export const stats: Stat[] = [
  { value: "4+", label: "Years Experience" },
  { value: "100K+", label: "App Downloads" },
  { value: "177", label: "Routes Modernised" },
  { value: "50+", label: "Components Shipped" },
];

export const experience: Experience[] = [
  {
    role: "Senior Frontend Developer",
    company: "Avinash Group of Institute",
    period: "04/2026 — Present",
    summary:
      "Modernised a React admin portal spanning 177 routes and 368 modals, rebuilt the theme system, and shipped a full responsive redesign in 15 working days. Deployed production workloads on AWS ECS and ran end-to-end React Native releases to both stores.",
  },
  {
    role: "React Native Developer | Frontend Developer",
    company: "IndigoLearn Edu Tech Pvt Ltd",
    period: "09/2022 — 03/2026",
    summary:
      "Led development of a React Native app with 100,000+ downloads across Android and iOS. Built a 50+ component library that cut development time by 30%, and mentored three junior developers.",
  },
];
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/data tests/data.test.ts package.json package-lock.json
git commit -m "feat: add validated profile data"
```

---

### Task 10: Projects data

**Files:**
- Create: `src/data/projects.ts`
- Modify: `src/data/schemas.ts`
- Modify: `tests/data.test.ts`

**Interfaces:**
- Consumes: `src/data/schemas.ts`
- Produces: `projects: Project[]`, `featuredProjects: Project[]`, type `Project`, `projectCategories: readonly string[]`

- [ ] **Step 1: Add the project schema**

Append to `src/data/schemas.ts`:

```ts
export const projectCategories = ["Web", "Mobile"] as const;

export const projectSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase, digits and hyphens only"),
  name: z.string().min(1),
  category: z.enum(projectCategories),
  summary: z.string().min(1),
  tech: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(2018).max(2100),
  featured: z.boolean(),
  liveUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
});

export type Project = z.infer<typeof projectSchema>;
```

- [ ] **Step 2: Add the failing tests**

Append to `tests/data.test.ts`:

```ts
import { featuredProjects, projects } from "@/data/projects";
import { projectSchema } from "@/data/schemas";

describe("projects data", () => {
  it("every project parses", () => {
    for (const project of projects) {
      expect(() => projectSchema.parse(project)).not.toThrow();
    }
  });

  it("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("rejects an invalid slug", () => {
    expect(() =>
      projectSchema.parse({
        slug: "Not A Slug",
        name: "x",
        category: "Web",
        summary: "x",
        tech: ["x"],
        year: 2026,
        featured: false,
      }),
    ).toThrow();
  });

  it("exposes exactly three featured projects for the home page", () => {
    expect(featuredProjects).toHaveLength(3);
  });

  it("contains no placeholder projects from the design prototype", () => {
    const names = projects.map((p) => p.name);
    expect(names).not.toContain("MezOrder POS");
    expect(names).not.toContain("TaskManager");
    expect(names).not.toContain("Chat Application");
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `Failed to resolve import "@/data/projects"`.

- [ ] **Step 4: Create the projects data**

Create `src/data/projects.ts`:

```ts
import type { Project } from "./schemas";

/** The seven real projects. Prototype filler is deliberately absent. */
export const projects: Project[] = [
  {
    slug: "acc-website",
    name: "Avinash College of Commerce",
    category: "Web",
    summary:
      "A full rebuild of the college's WordPress site as a server-side rendered React 19 application — 36 routes, custom Express SSR, build-time sitemap and blog generation.",
    tech: ["React 19", "Vite", "Express (SSR)", "Material UI", "Swiper"],
    year: 2026,
    featured: true,
    liveUrl: "https://acc.edu.in/",
  },
  {
    slug: "indigolearn-app",
    name: "1FIN by IndigoLearn",
    category: "Mobile",
    summary:
      "A learning app for CA, CMA and ACCA aspirants with expert-led video courses and practice tools, serving 100,000+ downloads across Android and iOS.",
    tech: ["React Native", "Firebase", "Redux", "VdoCipher", "Razorpay"],
    year: 2025,
    featured: true,
    liveUrl:
      "https://play.google.com/store/apps/details?id=com.indigolearn.fin1",
  },
  {
    slug: "maya-admin",
    name: "MAYA Admin Panel",
    category: "Web",
    summary:
      "An admin portal for the 1FIN platform covering analytics, order and plan management, employee management, revenue and leads.",
    tech: ["React", "Material UI", "Chart.js", "Ant Design"],
    year: 2025,
    featured: true,
    liveUrl: "https://admin.indigolearn.com",
  },
  {
    slug: "budgetiq",
    name: "BudgetIQ",
    category: "Web",
    summary:
      "A personal finance dashboard using Google Sheets as its database via OAuth 2.0, with interactive trends and custom Excel parsing.",
    tech: ["React", "Vite", "Google Sheets API", "Chart.js", "ExcelJS"],
    year: 2026,
    featured: false,
    liveUrl: "https://budgetiqnik.netlify.app",
    githubUrl:
      "https://github.com/NikhilMasurkar/Budget-Intelligence-Dashboard",
  },
  {
    slug: "indigolearn-web",
    name: "IndigoLearn Website",
    category: "Web",
    summary:
      "A responsive educational website showcasing CA, CMA and ACCA courses, with smooth navigation and real-time interaction features.",
    tech: ["React", "Redux", "Firebase", "Material UI", "Chart.js"],
    year: 2024,
    featured: false,
    liveUrl: "https://indigolearn.com",
  },
  {
    slug: "the-sky-events",
    name: "The Sky Events",
    category: "Web",
    summary:
      "A website for an event management company with a clean design and dedicated service pages.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Material UI"],
    year: 2025,
    featured: false,
    liveUrl: "https://theskyevents.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/theSkyEvents",
  },
  {
    slug: "forum-ui",
    name: "ForumUI",
    category: "Web",
    summary:
      "A responsive web forum where users create posts, join discussions and interact on topics in real time.",
    tech: ["React", "Material UI"],
    year: 2025,
    featured: false,
    liveUrl: "https://forumui.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/ForumUI/tree/main",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/projects.ts src/data/schemas.ts tests/data.test.ts
git commit -m "feat: add validated projects data"
```

---

### Task 11: Reveal primitive

One component owns scroll reveals and `prefers-reduced-motion`. Handling reduced motion per-component is how the previous portfolio ended up with permanently invisible content.

**Files:**
- Create: `src/components/ui/reveal.tsx`

**Interfaces:**
- Consumes: nothing
- Produces: `<Reveal delay?: number>` wrapping any children

- [ ] **Step 1: Install motion**

```bash
npm install motion@13.1.0
```

- [ ] **Step 2: Create the component**

Create `src/components/ui/reveal.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Scroll reveal. Timing matches the design prototype:
 * translateY(26px), 0.75s, cubic-bezier(.2,.7,.3,1).
 *
 * Reduced motion is resolved HERE, once. When it is on, children render
 * fully visible with no transform — never hidden.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.75, ease: [0.2, 0.7, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/reveal.tsx package.json package-lock.json
git commit -m "feat: add reveal primitive with reduced-motion handling"
```

---

### Task 12: Hero section

**Files:**
- Create: `src/components/home/hero.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `SectionBackground`, `siteConfig`, `socials`
- Produces: `<Hero />`

- [ ] **Step 1: Create the Hero**

Create `src/components/home/hero.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/ui/section-background";
import { siteConfig } from "@/lib/site-config";
import { socials } from "@/lib/socials";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-0 pb-10 pt-24">
      <SectionBackground variant="hero" />
      <Container>
        <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_var(--color-secondary)]" />
          HELLO, I&apos;M
        </p>

        <h1 className="m-0 font-display text-[76px] font-bold leading-[1.02] tracking-[-0.035em] max-[720px]:text-[44px]">
          {siteConfig.name}
        </h1>

        <p className="mb-1 bg-[image:var(--gradient-01)] bg-clip-text font-display text-[42px] font-semibold leading-tight tracking-[-0.02em] text-transparent max-[720px]:text-[28px]">
          {siteConfig.role}
        </p>

        <p className="mb-7 font-display text-[38px] font-medium leading-[1.2] tracking-[-0.02em] text-fg-2 max-[720px]:text-[24px]">
          {siteConfig.specialism}
        </p>

        <p className="mb-9 max-w-[480px] text-[16.5px] leading-[1.75] text-muted">
          Building high-performance digital experiences for web and mobile. I
          enjoy solving complex problems and turning ideas into production
          software.
        </p>

        <div className="mb-11 flex flex-wrap gap-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
          >
            Explore My Work <span aria-hidden>→</span>
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center gap-2.5 rounded-xl border border-line-raised bg-surface/70 px-7 py-4 text-[15px] font-semibold text-fg transition-colors hover:border-primary"
          >
            View Resume <span aria-hidden>↓</span>
          </Link>
        </div>

        <p className="mb-4 text-[11.5px] font-semibold tracking-[0.18em] text-dim">
          CONNECT WITH ME
        </p>
        <ul className="flex gap-3">
          {socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-line bg-surface/80 font-mono text-[13px] font-semibold text-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:text-fg"
              >
                <span aria-hidden>{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Render it on the home page**

Replace the entire contents of `src/app/page.tsx`:

```tsx
import { Hero } from "@/components/home/hero";

export default function HomePage() {
  return <Hero />;
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Check it renders**

```bash
npm run dev
```

Load `http://localhost:3000`. Expected: the name at 76px, gradient role text, two CTAs, three social links. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/hero.tsx src/app/page.tsx
git commit -m "feat: add hero section"
```

---

### Task 13: Worked-with row and stats strip

**Files:**
- Create: `src/components/home/proof-strip.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Reveal`, `clients`, `stats`
- Produces: `<ProofStrip />`

- [ ] **Step 1: Create the component**

Create `src/components/home/proof-strip.tsx`:

```tsx
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { clients, stats } from "@/data/profile";

export function ProofStrip() {
  return (
    <section className="pt-5">
      <Container>
        <Reveal className="rounded-[22px] border border-line bg-surface/85 shadow-card">
          <h2 className="px-8 pt-8 text-center text-[11.5px] font-semibold tracking-[0.2em] text-dim">
            WORKED WITH
          </h2>

          <ul className="grid grid-cols-2 gap-6 px-8 py-7">
            {clients.map((client) => (
              <li
                key={client.name}
                className="flex items-center justify-center gap-3 font-display text-[19px] font-semibold text-meta"
              >
                <span
                  aria-hidden
                  className="flex h-6.5 w-6.5 items-center justify-center rounded-[7px] border border-line-raised p-1 font-mono text-[11px] text-primary-text"
                >
                  {client.mark}
                </span>
                {client.name}
              </li>
            ))}
          </ul>

          <dl className="grid grid-cols-4 border-t border-line-inner px-8 py-8 max-[900px]:grid-cols-2 max-[900px]:gap-y-7">
            {stats.map((stat) => (
              <div key={stat.label} className="px-2 text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="m-0">
                  <span className="block bg-[image:var(--gradient-01)] bg-clip-text font-display text-[34px] font-bold tracking-[-0.02em] text-transparent">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[12.5px] text-meta">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Render it**

Replace `src/app/page.tsx`:

```tsx
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
    </>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/proof-strip.tsx src/app/page.tsx
git commit -m "feat: add worked-with row and stats strip"
```

---

### Task 14: Featured projects

**Files:**
- Create: `src/components/home/featured-projects.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Reveal`, `featuredProjects`
- Produces: `<FeaturedProjects />`

- [ ] **Step 1: Create the component**

Create `src/components/home/featured-projects.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { featuredProjects } from "@/data/projects";

export function FeaturedProjects() {
  return (
    <section className="py-24">
      <Container>
        <div className="mb-8 flex items-center justify-between gap-6">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-dim">
            FEATURED PROJECTS
          </h2>
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-secondary"
          >
            View All Projects <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="grid grid-cols-3 gap-[22px] max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1">
          {featuredProjects.map((project, index) => (
            <li key={project.slug} className="flex">
              <Reveal delay={index * 0.08} className="flex w-full">
                <article className="flex w-full flex-col rounded-[20px] border border-line bg-surface/90 p-[22px] transition-all hover:-translate-y-1 hover:border-primary">
                  <p className="mb-4 self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text">
                    {project.category.toUpperCase()}
                  </p>

                  <h3 className="m-0 mb-3 font-display text-[21px] font-semibold tracking-[-0.015em]">
                    {project.name}
                  </h3>

                  <p className="mb-5 text-[13.5px] leading-[1.65] text-muted">
                    {project.summary}
                  </p>

                  <ul className="mt-auto flex flex-wrap gap-2">
                    {project.tech.slice(0, 4).map((tech) => (
                      <li
                        key={tech}
                        className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-5 flex items-center gap-2 text-sm font-semibold text-secondary"
                  >
                    View Case Study <span aria-hidden>→</span>
                  </Link>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Render it**

Replace `src/app/page.tsx`:

```tsx
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
    </>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

Note: the `/projects/[slug]` links 404 until M2. That is expected at this milestone.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/featured-projects.tsx src/app/page.tsx
git commit -m "feat: add featured projects section"
```

---

### Task 15: Contact CTA

**Files:**
- Create: `src/components/home/contact-cta.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Reveal`, `SectionBackground`
- Produces: `<ContactCta />`

- [ ] **Step 1: Create the component**

Create `src/components/home/contact-cta.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionBackground } from "@/components/ui/section-background";

export function ContactCta() {
  return (
    <section className="relative overflow-hidden pb-28 pt-4">
      <SectionBackground variant="contact" />
      <Container>
        <Reveal className="rounded-[22px] border border-line bg-surface/85 px-8 py-14 text-center">
          <h2 className="m-0 mb-4 font-display text-[46px] font-bold leading-[1.2] tracking-[-0.03em] max-[720px]:text-[32px]">
            Let&apos;s Build Something
            <br />
            <span className="bg-[image:var(--gradient-01)] bg-clip-text text-transparent">
              Amazing Together.
            </span>
          </h2>
          <p className="mx-auto mb-9 max-w-[420px] text-base leading-[1.75] text-muted">
            I&apos;m currently available for freelance work and full-time
            opportunities.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-8 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
          >
            Get In Touch <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Render it**

Replace `src/app/page.tsx`:

```tsx
import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
      <ContactCta />
    </>
  );
}
```

- [ ] **Step 3: Verify the build**

```bash
npm run build
```

Expected: `✓ Compiled successfully`.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/contact-cta.tsx src/app/page.tsx
git commit -m "feat: add contact CTA section"
```

---

### Task 16: Responsive and accessibility verification

**Files:**
- Modify: whichever component files the checks reveal problems in

**Interfaces:**
- Consumes: the complete Home page
- Produces: a verified, deployed Home page

- [ ] **Step 1: Run the full test suite**

```bash
npm test
```

Expected: PASS, all tests.

- [ ] **Step 2: Check every breakpoint**

```bash
npm run dev
```

In the browser devtools device toolbar, load `http://localhost:3000` at widths **1440, 1280, 1160, 900, 720, 390**.

At each width confirm: no horizontal scrollbar on `<body>`; the hero headline does not overflow; the stats grid reflows (4 columns above 900, 2 below); project cards reflow (3 → 2 → 1).

Fix any width that fails before continuing.

- [ ] **Step 3: Check keyboard navigation**

With the page focused, press Tab from the top. Expected order: Skip to content → logo → 5 nav links → hero CTAs → social links → project links → CTA → footer links → footer socials. Every focused element must show the cyan focus ring. No element may be skipped or trap focus.

- [ ] **Step 4: Check reduced motion**

In devtools, open the command menu (Cmd+Shift+P) and run "Emulate CSS prefers-reduced-motion: reduce", then reload.

Expected: **all content is immediately visible** with no fade or slide. Nothing is stuck invisible.

- [ ] **Step 5: Run Lighthouse**

```bash
npm run build && npm run start
```

In Chrome devtools, run Lighthouse against `http://localhost:3000` in **Desktop** mode with all four categories.

Expected: Performance > 95, Accessibility 100, Best Practices 100, SEO 100.

Record any category that misses and fix before continuing. Stop the server.

- [ ] **Step 6: Deploy**

```bash
npx vercel@latest --prod --yes
```

Open the production URL and confirm the Home page renders identically to local.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "fix: responsive and accessibility corrections for home page"
```

**M1 is complete.** A finished Home page is live.

---

## Self-Review

**Spec coverage.** M0 §: repo (T1), tokens (T3), fonts (T4), shell (T6), backgrounds (T7), deploy (T8). M1 §: data + schemas (T9, T10), motion primitive (T11), hero (T12), proof (T13), featured (T14), CTA (T15), quality gates (T16). The spec's tech-stack section also lists a tech-stack display block on Home; it is folded into the About page in M2's plan rather than duplicated on Home, since the same data serves both — noted here so it is not lost.

**Placeholder scan.** No TBD, TODO, "handle edge cases", or "similar to Task N". Every code step shows complete code.

**Type consistency.** `Stat`, `Client`, `Experience` defined in T9 and consumed in T13. `Project` defined in T10, consumed in T14. `BackgroundVariant` defined in T7, consumed in T12 and T15. `Reveal` props (`children`, `delay`, `className`) defined in T11 and used consistently in T13, T14, T15. `siteConfig` fields (`name`, `role`, `specialism`, `description`, `url`, `email`) defined in T4 and consumed in T4, T6, T12.

**Known gap, deliberate.** T14's `/projects/[slug]` links 404 until M2 creates those routes. Called out in the task.
