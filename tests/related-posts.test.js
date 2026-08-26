/**
 * Which posts appear beside an article, and how many.
 *
 * The cap is the point: a sidebar that grows with the blog stops being a
 * sidebar. Asserted here rather than trusted to a slice() someone might widen
 * later without noticing what it does to the page.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { relatedPosts, RELATED_LIMIT } from "../src/app/pages/blog/related.js";

const post = (slug, tags, publishedAt = "2026-01-01") => ({ slug, tags, publishedAt });

test("never shows more than four, however many match", () => {
  const current = post("current", ["react"]);
  const posts = [current, ...Array.from({ length: 12 }, (_, i) => post(`p${i}`, ["react"]))];

  const related = relatedPosts(posts, current);

  assert.equal(RELATED_LIMIT, 4);
  assert.equal(related.length, 4, `showed ${related.length} posts in the sidebar`);
});

test("only posts sharing a tag", () => {
  const current = post("current", ["react", "testing"]);
  const posts = [
    current,
    post("shares-one", ["react"]),
    post("shares-none", ["aws", "docker"]),
    post("shares-other", ["testing"]),
  ];

  const slugs = relatedPosts(posts, current).map((p) => p.slug);

  assert.deepEqual(slugs.sort(), ["shares-one", "shares-other"]);
});

test("the post being read is never in its own sidebar", () => {
  const current = post("current", ["react"]);
  const related = relatedPosts([current, post("other", ["react"])], current);

  assert.ok(!related.some((p) => p.slug === "current"), "the article listed itself");
});

test("more tags in common ranks higher", () => {
  const current = post("current", ["react", "native", "perf"]);
  const posts = [
    current,
    post("one-tag", ["react"]),
    post("three-tags", ["react", "native", "perf"]),
    post("two-tags", ["react", "native"]),
  ];

  const slugs = relatedPosts(posts, current).map((p) => p.slug);

  assert.deepEqual(slugs, ["three-tags", "two-tags", "one-tag"]);
});

test("equally related posts keep the newest-first order they arrived in", () => {
  const current = post("current", ["react"]);
  // content.js sorts newest first; the ranking must not scramble that.
  const posts = [current, post("newer", ["react"], "2026-06-01"), post("older", ["react"], "2025-01-01")];

  assert.deepEqual(
    relatedPosts(posts, current).map((p) => p.slug),
    ["newer", "older"]
  );
});

test("an untagged post gets an empty sidebar rather than filler", () => {
  const current = post("current", []);
  const related = relatedPosts([current, post("other", ["react"])], current);

  assert.deepEqual(related, [], "unrelated posts were padded in");
});

test("posts with no tags field at all do not throw", () => {
  const current = post("current", ["react"]);
  const related = relatedPosts([current, { slug: "legacy", publishedAt: "2026-01-01" }], current);

  assert.deepEqual(related, []);
});
