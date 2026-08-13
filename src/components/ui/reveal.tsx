"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Scroll reveal — failure-safe by construction.
 *
 * WHY NOT framer-motion's `whileInView`: it server-renders its `initial`
 * state, so the static HTML shipped `opacity:0` on every wrapped block. If JS
 * fails, is blocked, or hydration breaks, the page renders as a hero and a
 * footer with nothing in between. That is the exact bug that made the previous
 * portfolio look blank, and it was measurable here: five `opacity:0` blocks in
 * the served HTML.
 *
 * The inversion: markup ships VISIBLE. The hidden state is applied only after
 * this effect has run, by which point JS is demonstrably alive and able to
 * un-hide it again. Worst case is no animation, never invisible content.
 *
 * Reduced motion is handled in CSS (see globals.css) rather than in JS, so it
 * cannot depend on hydration completing either.
 */

const READY_ATTR = "data-reveal-ready";
const REVEALED_ATTR = "data-revealed";

let observer: IntersectionObserver | null = null;

function getObserver() {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute(REVEALED_ATTR, "");
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  return observer;
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  useEffect(() => {
    // Flag the document only once JS is running. The CSS that hides
    // un-revealed blocks is scoped to this attribute.
    document.documentElement.setAttribute(READY_ATTR, "");
  }, []);

  return (
    <div
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
      ref={(node) => {
        if (!node || node.hasAttribute(REVEALED_ATTR)) return;
        getObserver().observe(node);
      }}
    >
      {children}
    </div>
  );
}
