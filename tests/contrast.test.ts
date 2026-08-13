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
