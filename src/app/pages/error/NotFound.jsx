import React from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "../../global/RoutePath";
import { SITE } from "../../global/siteConfig";

/**
 * Rendered for unknown URLs. The HTTP status is set by the server
 * (see server/index.js) — this component only supplies the markup.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-page px-8 py-24 text-center">
      <title>{`Page not found | ${SITE.name}`}</title>
      <meta name="robots" content="noindex" />
      <h1 className="font-display text-5xl font-bold text-fg">Page not found</h1>
      <p className="mt-4 text-muted">
        The page you are looking for does not exist.
      </p>
      <Link
        to={ROUTE_PATH.HOME}
        className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-medium text-fg"
      >
        Back to home
      </Link>
    </div>
  );
}
