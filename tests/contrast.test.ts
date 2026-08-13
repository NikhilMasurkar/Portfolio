import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, meetsAA, relativeLuminance } from "@/lib/contrast";

const GLOBALS_CSS_PATH = path.resolve(__dirname, "../src/app/globals.css");

/**
 * Parse `--color-<name>: <#hex>;` declarations out of the `@theme` block in
 * globals.css into a { name: hex } map. This keeps the test in lockstep with
 * the real design tokens instead of duplicating hex literals by hand — a
 * future palette edit that breaks contrast fails this suite immediately.
 */
function readColorTokens(): Record<string, string> {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf-8");
  const themeMatch = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (!themeMatch) {
    throw new Error("Could not find an @theme block in globals.css");
  }
  const tokens: Record<string, string> = {};
  const re = /--color-([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(themeMatch[1])) !== null) {
    tokens[m[1]] = m[2];
  }
  return tokens;
}

const TOKENS = readColorTokens();

// Token NAMES that render as text vs. those that are surfaces/fills. Only the
// hex VALUES come from globals.css — these lists are the intentional
// classification and stay hand-maintained.
const TEXT_TOKEN_NAMES = [
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
const SURFACE_TOKEN_NAMES = ["bg", "surface", "surface-raised"];
const FILL_ONLY_TOKEN_NAMES = ["primary", "accent"];

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

  // Pure maths — deliberately uses literals so it stays green even if the
  // token parser or the globals.css path breaks. Those are failures of the
  // token tests below, not of this one.
  it("is order independent", () => {
    expect(contrastRatio("#94A3B8", "#050816")).toBeCloseTo(
      contrastRatio("#050816", "#94A3B8"),
      5,
    );
  });
});

describe("token parser found every expected token", () => {
  it("has every expected text, surface, and fill-only token name", () => {
    for (const name of [
      ...TEXT_TOKEN_NAMES,
      ...SURFACE_TOKEN_NAMES,
      ...FILL_ONLY_TOKEN_NAMES,
    ]) {
      expect(TOKENS, `expected --color-${name} in globals.css @theme block`).toHaveProperty(name);
    }
  });
});

describe("text tokens meet WCAG AA on every surface", () => {
  for (const name of TEXT_TOKEN_NAMES) {
    for (const surfaceName of SURFACE_TOKEN_NAMES) {
      it(`${name} (${TOKENS[name]}) on ${surfaceName} (${TOKENS[surfaceName]})`, () => {
        expect(meetsAA(TOKENS[name], TOKENS[surfaceName])).toBe(true);
      });
    }
  }
});

describe("fill-only tokens are correctly excluded from text use", () => {
  it(`${TOKENS["primary"]} fails as text on the card surface`, () => {
    expect(meetsAA(TOKENS["primary"], TOKENS["surface"])).toBe(false);
  });

  it(`${TOKENS["accent"]} fails as text on the raised surface`, () => {
    expect(meetsAA(TOKENS["accent"], TOKENS["surface-raised"])).toBe(false);
  });
});
