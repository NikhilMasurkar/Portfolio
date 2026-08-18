import { test } from "node:test";
import assert from "node:assert/strict";

import buildSitemap, { collectPages, knownPaths } from "../server/sitemap.js";

/**
 * The sitemap and the 404 list must never disagree.
 *
 * server/index.js sets 200 vs 404 from knownPaths(). A published slug missing
 * from that set renders a perfect-looking page under HTTP 404, which Google
 * drops; a slug in the sitemap with no page renders the 404 component under
 * HTTP 200, which Google indexes as a real page. Both failures are invisible
 * in a browser. This file is the guard.
 */

/** Routes as they will exist once P2 and P5 land. */
const ALL_ROUTES = {
  HOME: "/",
  PROJECT_DETAIL: "/projects/:slug/",
  POST_DETAIL: "/blog/:slug/",
};

const content = ({ projects = [], posts = [] } = {}) => ({
  profile: {},
  projects,
  posts,
  experience: [],
  education: [],
  skills: [],
});

const post = (slug, extra = {}) => ({
  slug,
  title: slug,
  summary: "s",
  body: "b",
  publishedAt: "2026-08-01",
  ...extra,
});

test("static pages are always listed", async () => {
  const paths = await knownPaths({ content: content(), routes: ALL_ROUTES });

  // seoMeta.json currently declares "/" only; it grows as pages are added.
  assert.ok(paths.has("/"));
});

test("a published post becomes a valid URL and appears in the sitemap", async () => {
  const opts = {
    content: content({ posts: [post("offline-video-playback")] }),
    routes: ALL_ROUTES,
  };

  const paths = await knownPaths(opts);
  const xml = await buildSitemap(opts);

  assert.ok(paths.has("/blog/offline-video-playback"));
  assert.match(xml, /<loc>[^<]*\/blog\/offline-video-playback\/<\/loc>/);
});

test("unpublishing removes the URL from both at once", async () => {
  // content.js filters unpublished before this point, so an unpublished post
  // simply is not in the list.
  const opts = { content: content({ posts: [] }), routes: ALL_ROUTES };

  const paths = await knownPaths(opts);
  const xml = await buildSitemap(opts);

  assert.ok(!paths.has("/blog/offline-video-playback"));
  assert.doesNotMatch(xml, /offline-video-playback/);
});

test("the sitemap and the 404 list never disagree", async () => {
  const opts = {
    content: content({
      projects: [{ slug: "acc-website" }, { slug: "mezorder-pos" }],
      posts: [post("a"), post("b")],
    }),
    routes: ALL_ROUTES,
  };

  const pages = await collectPages(opts);
  const paths = await knownPaths(opts);
  const xml = await buildSitemap(opts);

  // Every advertised URL must be routable, and vice versa.
  for (const [loc] of pages) {
    const normalised = loc.replace(/\/$/, "") || "/";
    assert.ok(paths.has(normalised), `${loc} in sitemap but would 404`);
    assert.ok(xml.includes(`<loc>`), "sitemap must contain entries");
  }
  assert.equal(pages.length, paths.size);
});

test("dynamic URLs are withheld until their route exists", async () => {
  const withContent = content({
    projects: [{ slug: "acc-website" }],
    posts: [post("a")],
  });

  // The real state today: content exists, the detail pages do not.
  const paths = await knownPaths({
    content: withContent,
    routes: { HOME: "/" },
  });

  // Listing these before the page is built would advertise URLs that render
  // the 404 component under a 200 — a soft 404, indexed as a real page.
  assert.ok(!paths.has("/projects/acc-website"));
  assert.ok(!paths.has("/blog/a"));
  assert.ok(paths.has("/"));
});

test("each family unlocks independently", async () => {
  const paths = await knownPaths({
    content: content({
      projects: [{ slug: "acc-website" }],
      posts: [post("a")],
    }),
    routes: { HOME: "/", PROJECT_DETAIL: "/projects/:slug/" },
  });

  assert.ok(paths.has("/projects/acc-website"));
  assert.ok(!paths.has("/blog/a"));
});

test("lastmod prefers updatedAt over publishedAt", async () => {
  const xml = await buildSitemap({
    content: content({
      posts: [post("a", { publishedAt: "2026-01-01", updatedAt: "2026-08-14" })],
    }),
    routes: ALL_ROUTES,
  });

  assert.match(xml, /<lastmod>2026-08-14<\/lastmod>/);
  assert.doesNotMatch(xml, /2026-01-01/);
});

test("duplicate paths are collapsed", async () => {
  const pages = await collectPages({
    content: content({ posts: [post("a"), post("a")] }),
    routes: ALL_ROUTES,
  });

  const blogEntries = pages.filter(([loc]) => loc.startsWith("/blog/"));
  // A duplicate <loc> is a sitemap validation error.
  assert.equal(blogEntries.length, 1);
});

test("the sitemap is well-formed with no content at all", async () => {
  const xml = await buildSitemap({ content: content(), routes: ALL_ROUTES });

  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org/);
  assert.match(xml, /<\/urlset>$/);
});
