import React from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
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
  /*
   * No background colour on this wrapper. html and body already carry the
   * page colour, and an opaque background here paints over every
   * negative-z-index layer beneath it — block backgrounds paint *after*
   * negative z-index children in the same stacking context. That is what
   * silently hid the hero backdrop and the section background plates: the
   * images loaded, sized and positioned correctly, and were covered.
   */
  return (
    <Box className="flex min-h-screen flex-col text-fg">
      <Link
        href="#content"
        underline="none"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-surface-raised focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </Link>

      <Header />

      <Box component="main" id="content" className="flex-1 pt-header">
        {children}
      </Box>

      <Footer />
    </Box>
  );
}
