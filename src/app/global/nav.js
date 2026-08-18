import { ROUTE_PATH } from "./RoutePath.js";

/**
 * Main navigation, derived from the routes that actually exist.
 *
 * Not a hand-kept list. The previous build's nav linked to /resume and
 * /contact for weeks before either page was written, so both were live 404s
 * in the header of every page. Reading ROUTE_PATH and dropping the undefined
 * entries means an item cannot appear until its page does, and it appears
 * automatically when it does.
 */
const CANDIDATES = [
  ["Home", ROUTE_PATH.HOME],
  ["About", ROUTE_PATH.ABOUT],
  ["Projects", ROUTE_PATH.PROJECTS],
  ["Experience", ROUTE_PATH.EXPERIENCE],
  ["Blog", ROUTE_PATH.BLOG],
  ["Contact", ROUTE_PATH.CONTACT],
];

export const NAV_ITEMS = CANDIDATES.filter(([, href]) => Boolean(href)).map(
  ([label, href]) => ({ label, href })
);

/**
 * Whether a nav item should read as current.
 *
 * "/" has to match exactly — a prefix test would mark Home active on every
 * page. Everything else matches its own descendants too, so /projects stays
 * highlighted while reading /projects/acc-website/.
 */
export function isActivePath(pathname, href) {
  if (href === "/") return pathname === "/";
  const clean = href.replace(/\/$/, "");
  return pathname === href || pathname === clean || pathname.startsWith(`${clean}/`);
}
