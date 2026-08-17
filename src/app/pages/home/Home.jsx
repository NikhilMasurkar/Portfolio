import React from "react";
import Seo from "../../widgets/Seo";
import { ROUTE_PATH } from "../../global/RoutePath";

/**
 * P0 placeholder. Its job is to prove the design system survived the move off
 * Next.js: every class below reads a token from src/index.css, so if the
 * Tailwind v4 @theme block failed to load, this page renders unstyled and the
 * failure is obvious rather than subtle.
 *
 * Replaced in P2 by the real hero, ported from the previous build.
 */
export default function Home() {
  return (
    <>
      <Seo path={ROUTE_PATH.HOME} />

      <section className="mx-auto max-w-page px-8 py-24">
        <p className="font-mono text-sm uppercase tracking-widest text-dim">
          Portfolio v3 — rebuild in progress
        </p>

        <h1 className="mt-6 font-display text-6xl font-bold leading-tight text-fg">
          Nikhil Masurkar
        </h1>

        <p className="mt-3 font-display text-3xl font-medium text-primary-text">
          Frontend Engineer
        </p>

        <p className="mt-6 max-w-xl text-muted">
          Building high-performance digital experiences for web and mobile. I
          enjoy solving complex problems and turning ideas into production
          software.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            ["Server-rendered", "Express SSR, real HTML for crawlers"],
            ["Token-driven", "Every colour clears WCAG AA"],
            ["Dynamic next", "Firestore-backed content in P1"],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-[20px] border border-line bg-surface p-6"
            >
              <h2 className="font-display text-lg font-medium text-fg-2">
                {title}
              </h2>
              <p className="mt-2 text-sm text-meta">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
