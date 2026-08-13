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

  // MezOrder is a real product Nikhil built, but it is not an employer — it
  // belongs in `projects`, not in the employment timeline. The design
  // prototype listed it as a job, which it never was.
  it("does not list MezOrder as an employer", () => {
    const companies = experience.map((e) => e.company);
    expect(companies).not.toContain("MezOrder");
  });
});

import { featuredProjects, projects } from "@/data/projects";
import { projectSchema } from "@/data/schemas";

describe("projects data", () => {
  it("every project parses", () => {
    for (const project of projects) {
      expect(() => projectSchema.parse(project)).not.toThrow();
    }
  });

  it("slugs are unique", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("rejects an invalid slug", () => {
    expect(() =>
      projectSchema.parse({
        slug: "Not A Slug",
        name: "x",
        category: "Web",
        summary: "x",
        tech: ["x"],
        year: 2026,
        featured: false,
      }),
    ).toThrow();
  });

  it("exposes exactly three featured projects for the home page", () => {
    expect(featuredProjects).toHaveLength(3);
  });

  // MezOrder POS was originally on this list. That was wrong — it is a real
  // product (github.com/NikhilMasurkar/Snapdesk) and now ships as a featured
  // project. The remaining two are still unverified prototype filler; remove a
  // name from this list only when the real work behind it is confirmed.
  it("contains no unverified placeholder projects from the design prototype", () => {
    const names = projects.map((p) => p.name);
    expect(names).not.toContain("TaskManager");
    expect(names).not.toContain("Chat Application");
  });

  it("includes MezOrder POS, which is real", () => {
    expect(projects.map((p) => p.slug)).toContain("mezorder-pos");
  });
});
