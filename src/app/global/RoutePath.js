/**
 * Every URL in the site, in one place. Import from here — never hardcode a
 * path in a component, or renaming a page means hunting through the codebase.
 *
 * Paths are added as their pages are built, not ahead of time: a path here
 * with no page behind it is a link that 404s. That is exactly the state the
 * previous build shipped in, where the nav linked to /resume and /contact
 * before either page was written.
 *
 * Adding a key here also opens a gate elsewhere — nav.js starts rendering the
 * link, and server/sitemap.js starts advertising that family's URLs.
 */
export const ROUTE_PATH = {
  HOME: "/",
  ABOUT: "/about/",
  PROJECTS: "/projects/",
  /** Pattern, not a URL. Its presence is what lets the sitemap list slugs. */
  PROJECT_DETAIL: "/projects/:slug/",
};
