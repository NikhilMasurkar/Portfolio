import React, { useEffect } from "react";

/**
 * Scroll reveal — failure-safe by construction.
 *
 * WHY NOT a motion library's `whileInView`: it renders its `initial` state on
 * the server, so the static HTML ships `opacity: 0` on every wrapped block. If
 * JS fails, is blocked, or hydration breaks, the page is a hero and a footer
 * with nothing between them. That is the exact bug that made the previous
 * portfolio look blank, and it was measurable — five `opacity:0` blocks in the
 * served HTML.
 *
 * The inversion: markup ships VISIBLE. The hidden state is applied only after
 * this effect runs, by which point JS is demonstrably alive and able to
 * un-hide it. Worst case is no animation, never invisible content.
 *
 * That matters more here than it did before. The server now sends real
 * content, and a crawler that runs no JS must see it.
 *
 * Reduced motion is handled in CSS (src/index.css), so it cannot depend on
 * hydration completing either.
 */

const READY_ATTR = "data-reveal-ready";
const REVEALED_ATTR = "data-revealed";

let observer = null;

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
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );
  return observer;
}

export default function Reveal({ children, delay = 0, className }) {
  useEffect(() => {
    // Flag the document only once JS is running. The CSS that hides
    // un-revealed blocks is scoped to this attribute.
    document.documentElement.setAttribute(READY_ATTR, "");
  }, []);

  return (
    <div
      className={className}
      data-reveal=""
      style={delay ? { "--reveal-delay": `${delay}s` } : undefined}
      ref={(node) => {
        if (!node || node.hasAttribute(REVEALED_ATTR)) return;
        getObserver().observe(node);
      }}
    >
      {children}
    </div>
  );
}
