import { ROUTE_PATH } from "../global/RoutePath.js";

/**
 * Every route, declared once.
 *
 * The browser wants React.lazy() so each page is its own chunk; the server
 * needs eager imports because renderToString() cannot resolve lazy components.
 * That difference is the only reason two files exist — the PATHS live here so
 * they cannot drift. Adding a page and forgetting the server copy used to
 * produce a page that worked in a browser and was invisible to Google.
 */
export const ROUTES = [
  { path: ROUTE_PATH.HOME, component: "Home" },
  { path: ROUTE_PATH.ABOUT, component: "About" },
  { path: ROUTE_PATH.PROJECTS, component: "Projects" },
  // Must come after the listing, or "/projects/" would match :slug as "".
  { path: ROUTE_PATH.PROJECT_DETAIL, component: "ProjectDetail" },
  { path: ROUTE_PATH.CONTACT, component: "Contact" },
];

/** Client-side redirects. Real 301s live in server/redirects.js. */
export const REDIRECT_ROUTES = [];

/**
 * Fails loudly if a component map is missing something the table declares.
 * On the server a missing entry renders `undefined` — a blank page served
 * with HTTP 200, which no monitoring would catch.
 */
export function assertRoutesResolvable(components, label) {
  const missing = [...new Set(ROUTES.map((r) => r.component))].filter(
    (name) => !components[name]
  );
  if (missing.length) {
    throw new Error(
      `${label} is missing component(s): ${missing.join(", ")}. ` +
        `Every "component" in src/app/router/routeTable.js needs an entry here.`
    );
  }
}
