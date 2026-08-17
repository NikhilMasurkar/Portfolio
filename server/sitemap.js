import seoMeta from "../src/app/global/seoMeta.json";
import { SITE } from "../src/app/global/siteConfig";
import { REDIRECT_PATHS } from "./redirects";

/**
 * The sitemap and the "is this a real page?" list come from ONE source, so a
 * URL can never be advertised as canonical while also returning 404.
 *
 * Add dynamic URLs (blog posts, products) to collectPages().
 */
function collectPages() {
  const pages = Object.keys(seoMeta)
    .filter((p) => !REDIRECT_PATHS.has(p.replace(/\/$/, "")))
    .sort()
    .map((p) => [p, null]);

  // Example — read a content directory and append its URLs:
  //
  //   const posts = fs.readdirSync(POSTS_DIR)
  //     .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  //     .map((f) => {
  //       const post = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
  //       return [`/blog/${post.slug}/`, post.modified || post.date];
  //     });
  //   return dedupe([...pages, ...posts]);

  const seen = new Set();
  return pages.filter(([loc]) => {
    if (seen.has(loc)) return false;
    seen.add(loc);
    return true;
  });
}

/** Valid URLs, trailing slash stripped, for the 404 check. */
export const KNOWN_PATHS = new Set(
  collectPages().map(([p]) => p.replace(/\/$/, "") || "/")
);

export default function buildSitemap() {
  const urls = collectPages()
    .map(
      ([loc, lastmod]) =>
        `  <url>\n    <loc>${SITE.domain}${loc}</loc>` +
        (lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : "") +
        `\n  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
