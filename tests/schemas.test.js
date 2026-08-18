import { test } from "node:test";
import assert from "node:assert/strict";

import {
  projectSchema,
  postSchema,
  profileSchema,
  parseList,
  parseOne,
} from "../src/app/global/schemas.js";

/**
 * These helpers decide what a bad Firestore document does to the live site,
 * which is the main risk of moving content out of version control. The
 * asymmetry is the thing under test: a bad item in a list is skipped, a bad
 * singleton falls back.
 */

/** parseList/parseOne log on failure by design; keep test output readable. */
function quiet(fn) {
  const original = console.error;
  const lines = [];
  console.error = (...args) => lines.push(args.join(" "));
  try {
    return { result: fn(), lines };
  } finally {
    console.error = original;
  }
}

const validProject = {
  slug: "mezorder-pos",
  name: "MezOrder POS",
  category: "Web",
  summary: "A multi-tenant restaurant POS platform.",
  image: "/projects/mezorder.jpg",
  tech: ["Next.js", "Supabase"],
  year: 2026,
};

test("parseList keeps valid documents and drops invalid ones", () => {
  const { result } = quiet(() =>
    parseList(
      projectSchema,
      [
        validProject,
        { ...validProject, slug: "acc-website", year: 1999 }, // year too early
        { ...validProject, slug: "nucleus" },
      ],
      "projects"
    )
  );

  assert.deepEqual(
    result.items.map((p) => p.slug),
    ["mezorder-pos", "nucleus"]
  );
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].id, "acc-website");
});

test("a single bad document cannot take down the whole collection", () => {
  const { result } = quiet(() =>
    parseList(projectSchema, [{ totally: "wrong" }, validProject], "projects")
  );

  // The valid one still renders — this is the entire point.
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].slug, "mezorder-pos");
});

test("skipping a document logs what failed and why", () => {
  const { lines } = quiet(() =>
    parseList(projectSchema, [{ ...validProject, tech: [] }], "projects")
  );

  assert.equal(lines.length, 1);
  // Naming the collection, the document and the field is what makes the
  // silent skip acceptable.
  assert.match(lines[0], /projects/);
  assert.match(lines[0], /mezorder-pos/);
  assert.match(lines[0], /tech/);
});

test("defaults are applied so components need no fallbacks", () => {
  const { result } = quiet(() => parseList(projectSchema, [validProject]));
  const project = result.items[0];

  assert.equal(project.featured, false);
  assert.equal(project.published, false);
  assert.equal(project.order, 0);
  assert.deepEqual(project.gallery, []);
  assert.deepEqual(project.caseStudy, {});
});

test("images accept local paths and S3 URLs, reject anything else", () => {
  const ok = (image) => projectSchema.safeParse({ ...validProject, image }).success;

  assert.ok(ok("/projects/acc.jpg"));
  assert.ok(ok("https://bucket.s3.ap-south-1.amazonaws.com/public/a1b2.jpg"));
  // A bare filename would render as a relative URL and 404 on nested routes.
  assert.ok(!ok("acc.jpg"));
  // http:// would be mixed content on an https site.
  assert.ok(!ok("http://example.com/a.jpg"));
  assert.ok(!ok("javascript:alert(1)"));
});

test("slugs are restricted to URL-safe characters", () => {
  const ok = (slug) => projectSchema.safeParse({ ...validProject, slug }).success;

  assert.ok(ok("acc-website"));
  assert.ok(!ok("ACC-Website"));
  assert.ok(!ok("acc website"));
  assert.ok(!ok("../../etc/passwd"));
});

test("parseOne falls back rather than dropping the profile", () => {
  const fallback = { name: "Nikhil Masurkar" };

  const { result } = quiet(() =>
    parseOne(profileSchema, { email: "not-an-email" }, fallback, "profile/main")
  );

  // Skipping would render a site with no name, email or about copy.
  assert.equal(result, fallback);
});

test("parseOne returns parsed data when the document is valid", () => {
  const profile = {
    name: "Nikhil Masurkar",
    role: "Frontend Engineer",
    specialism: "React Native Specialist",
    tagline: "Building Production Software.",
    description: "Frontend Engineer and React Native specialist.",
    email: "nikhildmasurkar@gmail.com",
    aboutHeadline: { lead: "Hi, I'm Nikhil.", statement: "I build products." },
    aboutSummary: "Building high-performance digital experiences.",
  };

  const { result } = quiet(() => parseOne(profileSchema, profile, null));

  assert.equal(result.name, "Nikhil Masurkar");
  assert.deepEqual(result.socials, []);
  assert.deepEqual(result.aboutParagraphs, []);
});

test("posts require a body, so an empty draft cannot publish as a blank page", () => {
  const base = {
    slug: "offline-video-playback",
    title: "Offline Video Playback in React Native",
    summary: "How the download pipeline works.",
    publishedAt: "2026-08-01",
  };

  assert.ok(!postSchema.safeParse({ ...base, body: "" }).success);
  assert.ok(postSchema.safeParse({ ...base, body: "# Heading" }).success);
});
