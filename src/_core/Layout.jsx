import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

/**
 * Header and footer shared by every page.
 *
 * Load-bearing here: the skip link, the <main id="content"> it targets, and
 * pt-header matching the fixed header's h-header. Both read --spacing-header,
 * so they cannot drift apart and slide content under the header.
 */
export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>

      <Header />

      <main id="content" className="flex-1 pt-header">
        {children}
      </main>

      <Footer />
    </div>
  );
}
