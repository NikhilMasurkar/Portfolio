import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";

import { getContent, __resetCache, TTL_MS } from "../server/content.js";
import { FALLBACK_PROFILE } from "../src/app/global/fallbackContent.js";

/**
 * Exercised against a stub Firestore, so the caching, ordering and failure
 * behaviour are covered without credentials or network. The stub only needs
 * the two shapes content.js actually uses: collection().get() and
 * collection().doc().get().
 */

const PROFILE = {
  name: "Nikhil Masurkar",
  role: "Frontend Engineer",
  specialism: "React Native Specialist",
  tagline: "Building Production Software.",
  description: "Frontend Engineer and React Native specialist.",
  email: "nikhildmasurkar@gmail.com",
  aboutHeadline: { lead: "Hi, I'm Nikhil.", statement: "I build products." },
  aboutSummary: "Building high-performance digital experiences.",
};

const project = (slug, extra = {}) => ({
  name: slug,
  category: "Web",
  summary: "A project.",
  image: `/projects/${slug}.jpg`,
  tech: ["React"],
  year: 2026,
  published: true,
  ...extra,
});

function stubDb({ collections = {}, profile = PROFILE, fail = false } = {}) {
  const calls = { count: 0 };

  const db = {
    collection(name) {
      return {
        async get() {
          calls.count += 1;
          if (fail) throw new Error("PERMISSION_DENIED");
          const rows = collections[name] ?? {};
          return {
            docs: Object.entries(rows).map(([id, data]) => ({
              id,
              data: () => data,
            })),
          };
        },
        doc() {
          return {
            async get() {
              calls.count += 1;
              if (fail) throw new Error("PERMISSION_DENIED");
              return { exists: profile !== null, data: () => profile };
            },
          };
        },
      };
    },
  };

  return { db, calls };
}

/** Silence the deliberate error logging; assert on it where it matters. */
function quiet() {
  const original = console.error;
  const lines = [];
  console.error = (...args) => lines.push(args.join(" "));
  return { lines, restore: () => (console.error = original) };
}

beforeEach(() => __resetCache());

test("returns only published projects", async () => {
  const { db } = stubDb({
    collections: {
      projects: {
        "acc-website": project("acc-website"),
        "draft-thing": project("draft-thing", { published: false }),
      },
    },
  });

  const content = await getContent({ db });

  assert.deepEqual(
    content.projects.map((p) => p.slug),
    ["acc-website"]
  );
});

test("the document id becomes the slug", async () => {
  const { db } = stubDb({
    collections: { projects: { "acc-website": project("acc-website") } },
  });

  const content = await getContent({ db });

  // Storing the slug twice would let the id and the field disagree.
  assert.equal(content.projects[0].slug, "acc-website");
});

test("projects sort by order, then newest year first", async () => {
  const { db } = stubDb({
    collections: {
      projects: {
        old: project("old", { order: 0, year: 2024 }),
        newer: project("newer", { order: 0, year: 2026 }),
        pinned: project("pinned", { order: -1, year: 2019 }),
      },
    },
  });

  const content = await getContent({ db });

  assert.deepEqual(
    content.projects.map((p) => p.slug),
    ["pinned", "newer", "old"]
  );
});

test("posts sort newest first", async () => {
  const post = (slug, publishedAt) => ({
    title: slug,
    summary: "s",
    body: "b",
    publishedAt,
    published: true,
  });
  const { db } = stubDb({
    collections: {
      posts: {
        older: post("older", "2026-01-01"),
        newest: post("newest", "2026-08-01"),
        middle: post("middle", "2026-04-01"),
      },
    },
  });

  const content = await getContent({ db });

  assert.deepEqual(
    content.posts.map((p) => p.slug),
    ["newest", "middle", "older"]
  );
});

test("a second read inside the TTL does not hit Firestore", async () => {
  const { db, calls } = stubDb({
    collections: { projects: { a: project("a") } },
  });

  await getContent({ db, now: 1_000 });
  const afterFirst = calls.count;
  await getContent({ db, now: 1_000 + TTL_MS - 1 });

  assert.ok(afterFirst > 0);
  // This is what keeps Firestore reads off the per-visitor path.
  assert.equal(calls.count, afterFirst);
});

test("the cache expires after the TTL", async () => {
  const { db, calls } = stubDb({
    collections: { projects: { a: project("a") } },
  });

  await getContent({ db, now: 1_000 });
  const afterFirst = calls.count;
  await getContent({ db, now: 1_000 + TTL_MS + 1 });

  assert.ok(calls.count > afterFirst);
});

test("a Firestore failure serves stale content rather than nothing", async () => {
  const good = stubDb({ collections: { projects: { a: project("a") } } });
  await getContent({ db: good.db, now: 1_000 });

  const broken = stubDb({ fail: true });
  const log = quiet();
  const content = await getContent({ db: broken.db, now: 1_000 + TTL_MS + 1 });
  log.restore();

  // Throwing would reach the SSR catch, which serves the empty SPA shell —
  // fine in a browser, blank to every crawler.
  assert.deepEqual(
    content.projects.map((p) => p.slug),
    ["a"]
  );
  assert.ok(log.lines.some((l) => /stale cache/.test(l)));
});

test("a failure does not extend the cache window", async () => {
  const good = stubDb({ collections: { projects: { a: project("a") } } });
  await getContent({ db: good.db, now: 1_000 });

  const broken = stubDb({ fail: true });
  const log = quiet();
  await getContent({ db: broken.db, now: 1_000 + TTL_MS + 1 });

  // Recovery must be immediate, not after another full TTL of staleness.
  const recovered = stubDb({ collections: { projects: { b: project("b") } } });
  const content = await getContent({ db: recovered.db, now: 1_000 + TTL_MS + 2 });
  log.restore();

  assert.deepEqual(
    content.projects.map((p) => p.slug),
    ["b"]
  );
});

test("a cold failure falls back to a renderable site", async () => {
  const { db } = stubDb({ fail: true });

  const log = quiet();
  const content = await getContent({ db });
  log.restore();

  assert.equal(content.degraded, true);
  assert.equal(content.profile.name, "Nikhil Masurkar");
  assert.deepEqual(content.projects, []);
});

test("a missing profile document falls back instead of rendering nameless", async () => {
  const { db } = stubDb({ profile: null });

  const log = quiet();
  const content = await getContent({ db });
  log.restore();

  assert.equal(content.profile.email, FALLBACK_PROFILE.email);
});

test("one malformed document does not lose the rest of the collection", async () => {
  const { db } = stubDb({
    collections: {
      projects: {
        good: project("good"),
        bad: project("bad", { year: 1999 }),
        "also-good": project("also-good"),
      },
    },
  });

  const log = quiet();
  const content = await getContent({ db });
  log.restore();

  assert.equal(content.projects.length, 2);
  assert.ok(log.lines.some((l) => /skipping invalid projects document bad/.test(l)));
});
