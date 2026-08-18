import React from "react";

/**
 * The six background recipes from the design sheets, in CSS.
 *
 * The reference PNGs are ~1.5 MB each; these cost a few hundred bytes, scale
 * to any viewport and stay token-driven — change a brand colour and every
 * background follows.
 */

/** Inline SVG noise — a few hundred bytes instead of a texture file. */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")";

/** Brand colours come from tokens; only the alpha varies at the use site. */
const PRIMARY = (a) => `rgb(var(--rgb-primary) / ${a})`;
const SECONDARY = (a) => `rgb(var(--rgb-secondary) / ${a})`;
const ACCENT = (a) => `rgb(var(--rgb-accent) / ${a})`;

const GRID = [
  `repeating-linear-gradient(0deg, ${PRIMARY(0.06)} 0 1px, transparent 1px 64px)`,
  `repeating-linear-gradient(90deg, ${PRIMARY(0.06)} 0 1px, transparent 1px 64px)`,
].join(",");

const ORBS = {
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

const WITH_GRID = ["about", "footer"];
const WITH_NOISE = ["hero", "footer", "case-study"];

export default function SectionBackground({ variant }) {
  const layers = [ORBS[variant]];
  if (WITH_GRID.includes(variant)) layers.push(GRID);
  if (WITH_NOISE.includes(variant)) layers.push(NOISE);

  const mask =
    "radial-gradient(ellipse 100% 80% at 50% 0%, #000 40%, transparent 92%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      style={{
        backgroundImage: layers.join(","),
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
