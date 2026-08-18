import seoMeta from "../src/app/global/seoMeta.json" with { type: "json" };
import { SITE } from "../src/app/global/siteConfig.js";
import { ROUTE_PATH } from "../src/app/global/RoutePath.js";
import { REDIRECT_PATHS } from "./redirects.js";
import { getContent } from "./content.js";
import { getDb } from "./db.js";

/**
 * The sitemap and the "is this a real page?" list come from ONE source, so a
 * URL can never be advertised as canonical while also returning 404.
 *
 * Static pages come from seoMeta.json. Project and post URLs come from
 * Firestore, which is the part that makes this dangerous: server/index.js
 * decides 200 vs 404 from KNOWN_PATHS, so a published slug missing from this
 * set renders a perfect-looking page that returns 404 to every crawler. The
 * ACC site shipped four blog posts that way before anyone noticed.
 *
 * Because content is now async, so is everything here. That is the trade for
 * publishing a post without a deploy.
 */

const normalise = (p) => p.replace(/\/$/, "") || "/";

/**
 * URLs for content that lives in Firestore.
 *
 * Each family is gated on its route existing in RoutePath. Without that gate
 * there is a window — content published before its page is built — where this
 * would advertise URLs that render the 404 component under a 200, which is
 * precisely the soft 404 the rest of this file exists to prevent. The gate
 * closes automatically as each page is added.
 */
function dynamicPages(content, routes) {
  const pages = [];

  if (routes.PROJECT_DETAIL) {
    for (const project of content.projects) {
      pages.push([`/projects/${project.slug}/`, null]);
    }
  }

  if (routes.POST_DETAIL) {
    for (const post of content.posts) {
      pages.push([`/blog/${post.slug}/`, post.updatedAt || post.publishedAt]);
    }
  }

  return pages;
}

/**
 * @param {object} opts
 * @param {object} opts.content  Injected in tests; fetched otherwise.
 * @param {object} opts.routes   Route map; injected to test the family gate.
 * @returns {Promise<[string, string|null][]>} [path, lastmod]
 */
export async function collectPages({ content, routes = ROUTE_PATH } = {}) {
  const resolved = content ?? (await getContent({ db: getDb() }));

  const staticPages = Object.keys(seoMeta)
    .filter((p) => !REDIRECT_PATHS.has(normalise(p)))
    .sort()
    .map((p) => [p, null]);

  const seen = new Set();
  return [...staticPages, ...dynamicPages(resolved, routes)].filter(([loc]) => {
    const key = normalise(loc);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Valid URLs, trailing slash stripped, for the 404 check. */
export async function knownPaths(opts) {
  const pages = await collectPages(opts);
  return new Set(pages.map(([p]) => normalise(p)));
}

export default async function buildSitemap(opts) {
  const pages = await collectPages(opts);

  const urls = pages
    .map(
      ([loc, lastmod]) =>
        `  <url>\n    <loc>${SITE.domain}${loc}</loc>` +
        (lastmod ? `\n    <lastmod>${String(lastmod).slice(0, 10)}</lastmod>` : "") +
        `\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
