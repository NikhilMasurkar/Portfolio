import React from "react";
import { Link } from "react-router";
import { ROUTE_PATH } from "../app/global/RoutePath";
import { SITE } from "../app/global/siteConfig";

/**
 * Header and footer shared by every page.
 *
 * Placeholder shell for P0 — the real header, mobile nav and footer are
 * ported from the previous build in P2. What is load-bearing here and must
 * survive that port: the skip link, the <main id="content"> target, and
 * pt-header matching the fixed header's h-header (both read --spacing-header,
 * so they cannot drift apart and slide content under the header).
 */
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-40 h-header border-b border-line-header bg-bg/70 backdrop-blur-[18px]">
        <div className="mx-auto flex h-full max-w-page items-center px-8">
          <Link
            to={ROUTE_PATH.HOME}
            className="font-display text-xl font-bold text-fg"
          >
            {SITE.shortName}
            <span className="text-primary-text">.</span>
          </Link>
        </div>
      </header>

      <main id="content" className="flex-1 pt-header">
        {children}
      </main>

      <footer className="border-t border-line-inner">
        <div className="mx-auto max-w-page px-8 py-8">
          <small className="text-meta">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </small>
        </div>
      </footer>
    </div>
  );
}
