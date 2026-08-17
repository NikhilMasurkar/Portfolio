import { ROUTE_PATH } from "../src/app/global/RoutePath";

/**
 * Permanent redirects, served as real 301s.
 *
 * React Router can redirect client-side, but a crawler reads that as
 * "200 OK plus some JavaScript" and the old URL's ranking never transfers.
 * Only a real 301 moves it. Put every legacy URL here.
 */
const REDIRECTS = {
  // "/old-about": ROUTE_PATH.ABOUT,
  // "/company":   ROUTE_PATH.ABOUT,
};

/** Patterns, for legacy URLs that carry a value in the path. */
const PATTERNS = [
  // [/^\/category\/([a-z0-9-]+)$/i, (m) => `/blog/?category=${m[1]}`],
];

const TABLE = new Map(
  Object.entries(REDIRECTS).map(([from, to]) => [from.replace(/\/$/, ""), to])
);

/** Used by sitemap.js so redirect sources are never listed as real pages. */
export const REDIRECT_PATHS = new Set(TABLE.keys());

export default function redirectFor(pathname) {
  const clean = pathname.replace(/\/$/, "");
  const exact = TABLE.get(clean);
  if (exact) return exact;
  for (const [re, to] of PATTERNS) {
    const m = clean.match(re);
    if (m) return to(m);
  }
  return null;
}
