import { describe, expect, it } from "vitest";
import { CAREER_START, yearsOfExperience } from "@/lib/experience";

describe("yearsOfExperience", () => {
  it("is 0 on the first day", () => {
    expect(yearsOfExperience(CAREER_START)).toBe(0);
  });

  it("is still 3 the day before the fourth anniversary", () => {
    expect(yearsOfExperience(new Date(2026, 7, 31))).toBe(3);
  });

  it("becomes 4 on the fourth anniversary", () => {
    expect(yearsOfExperience(new Date(2026, 8, 1))).toBe(4);
  });

  it("never rounds up to a year not yet worked", () => {
    // 11 months and 30 days in is still year 0.
    expect(yearsOfExperience(new Date(2023, 7, 31))).toBe(0);
    expect(yearsOfExperience(new Date(2023, 8, 1))).toBe(1);
  });

  it("never returns a negative number for dates before the start", () => {
    expect(yearsOfExperience(new Date(2020, 0, 1))).toBe(0);
  });
});
