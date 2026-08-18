import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * The colour ramp's WCAG AA guarantee, enforced.
 *
 * AGENTS.md claims every text token clears AA on all three surfaces. That is
 * only true while something checks it — the hex values are parsed straight out
 * of src/index.css, so a future palette edit that breaks contrast fails here
 * rather than shipping. Two values in the original design already had to be
 * corrected because they failed; this is what caught them.
 *
 * The maths lives here rather than in src/ because nothing in the application
 * uses it. Extract it if the admin panel ever needs to warn about a custom
 * colour.
 */

const CSS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/index.css"
);

/** WCAG 2.1 relative luminance. https://www.w3.org/TR/WCAG21/#dfn-relative-luminance */
function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function parseHex(hex) {
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

function relativeLuminance(hex) {
  const [r, g, b] = parseHex(hex);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a, b) {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * AA for normal text needs 4.5:1. Large text only needs 3:1, but nothing here
 * relies on that allowance — every text token clears 4.5:1 on every surface.
 */
const meetsAA = (fg, bg) => contrastRatio(fg, bg) >= 4.5;

/** Read `--color-<name>: <#hex>` out of the @theme block, so nothing is duplicated. */
function readColorTokens() {
  const css = readFileSync(CSS_PATH, "utf-8");
  const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (!themeMatch) throw new Error("Could not find an @theme block in index.css");

  const tokens = {};
  const re = /--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let m;
  while ((m = re.exec(themeMatch[1])) !== null) tokens[m[1]] = m[2];
  return tokens;
}

const TOKENS = readColorTokens();

// Only the hex VALUES come from index.css. Which tokens are *meant* to carry
// text is an intentional classification and stays hand-maintained here.
const TEXT_TOKENS = [
  "fg",
  "fg-2",
  "fg-3",
  "fg-4",
  "muted",
  "meta",
  "dim",
  "primary-text",
  "accent-text",
  "secondary",
];
const SURFACES = ["bg", "surface", "surface-raised"];
const FILL_ONLY = ["primary", "accent"];

describe("contrast maths", () => {
  test("luminance is 0 for black and 1 for white", () => {
    assert.ok(Math.abs(relativeLuminance("#000000")) < 1e-5);
    assert.ok(Math.abs(relativeLuminance("#FFFFFF") - 1) < 1e-5);
  });

  test("black on white is 21:1", () => {
    assert.ok(Math.abs(contrastRatio("#000000", "#FFFFFF") - 21) < 0.01);
  });

  test("ratio is order independent", () => {
    // Literals on purpose: this stays green even if the token parser breaks,
    // so a parser failure is reported by the tests below, not by this one.
    assert.ok(
      Math.abs(
        contrastRatio("#94A3B8", "#050816") - contrastRatio("#050816", "#94A3B8")
      ) < 1e-5
    );
  });
});

describe("the token parser found everything it classifies", () => {
  test("every named token exists in index.css", () => {
    for (const name of [...TEXT_TOKENS, ...SURFACES, ...FILL_ONLY]) {
      assert.ok(TOKENS[name], `expected --color-${name} in the @theme block`);
    }
  });
});

describe("text tokens meet WCAG AA on every surface", () => {
  for (const name of TEXT_TOKENS) {
    for (const surface of SURFACES) {
      test(`${name} (${TOKENS[name]}) on ${surface} (${TOKENS[surface]})`, () => {
        const ratio = contrastRatio(TOKENS[name], TOKENS[surface]);
        assert.ok(
          meetsAA(TOKENS[name], TOKENS[surface]),
          `${ratio.toFixed(2)}:1 is below the 4.5:1 AA floor`
        );
      });
    }
  }
});

describe("fill-only tokens stay excluded from text use", () => {
  // These two exist precisely because they FAIL as text. If a palette change
  // ever makes them pass, the -text variants become redundant and the comments
  // in index.css are wrong — so the failure is the assertion.
  test(`primary (${TOKENS.primary}) fails as text on the card surface`, () => {
    assert.ok(!meetsAA(TOKENS.primary, TOKENS.surface));
  });

  test(`accent (${TOKENS.accent}) fails as text on the raised surface`, () => {
    assert.ok(!meetsAA(TOKENS.accent, TOKENS["surface-raised"]));
  });
});
