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
