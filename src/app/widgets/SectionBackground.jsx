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

/**
 * Photographic plates, one per page, from the design resources.
 *
 * Only where a real plate exists — the CSS recipes above still carry every
 * other section. A page without one is not missing anything; the gradients
 * were always the baseline.
 */
const PLATES = {
  /*
   * `position` is the crop anchor, and it matters because these two plates
   * put their light in completely different places: the About nebula's vortex
   * sits right of centre, while the Contact horizon glows across the lower
   * third. A single anchor would show the dark sky of one or the dead centre
   * of the other.
   */
  about: { src: "/bg/about.jpg", position: "62% 45%" },
  contact: { src: "/bg/contact.jpg", position: "center 78%" },
};

/**
 * How far the plate is knocked back.
 *
 * These images are dramatic — a nebula and a horizon — and the brief is clear
 * that the background must never compete with the content. At 0.5 opacity
 * under a scrim, they read as atmosphere rather than as a photograph someone
 * put text on. This is also what keeps body copy above the 4.5:1 floor the
 * rest of the palette is held to; raising it will quietly break that.
 */
const PLATE_OPACITY = 0.9;

/**
 * The scrim over the plate.
 *
 * Tuned by looking, not by taste: at 0.5 opacity under a 0.92 scrim the first
 * attempt rendered the plate completely invisible — all the cost of loading it
 * and none of the effect. These values keep it clearly present while holding
 * body copy above the 4.5:1 floor. Lightening the top stop is what would break
 * that first, since headings sit there.
 */
const SCRIM =
  "linear-gradient(180deg, rgb(5 8 22 / 0.74) 0%, rgb(5 8 22 / 0.58) 40%, rgb(5 8 22 / 0.86) 78%, rgb(5 8 22 / 1) 100%)";

export default function SectionBackground({ variant }) {
  const layers = [ORBS[variant]];
  if (WITH_GRID.includes(variant)) layers.push(GRID);
  if (WITH_NOISE.includes(variant)) layers.push(NOISE);

  const mask =
    "radial-gradient(ellipse 100% 80% at 50% 0%, #000 40%, transparent 92%)";

  const plate = PLATES[variant];

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {plate && (
        /*
         * A band at the top, not a full-page cover.
         *
         * These plates are landscape (1800x1200) and a page runs well over
         * 2000px tall, so object-cover across the whole height crops to a
         * narrow vertical slice through the middle — which for the About
         * nebula is the black hole's dark centre. It rendered perfectly and
         * showed nothing. Bounding the height keeps the composition intact and
         * lets the plate fade out before the content gets dense.
         */
        <div className="absolute inset-x-0 top-0 h-[820px]">
          {/* Decorative: empty alt, inside an aria-hidden container. Lazy
              because the heading above it is the largest contentful paint. */}
          <img
            src={plate.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            style={{ opacity: PLATE_OPACITY, objectPosition: plate.position }}
          />
          {/* Darkest where headings sit, and fading to the page colour at the
              bottom so the band has no visible edge. */}
          <div className="absolute inset-0" style={{ background: SCRIM }} />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: layers.join(","),
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  );
}
