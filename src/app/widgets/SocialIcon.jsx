import React from "react";
import SvgIcon from "@mui/material/SvgIcon";

/**
 * Brand glyphs for the social links.
 *
 * Inline SVG rather than an icon package: five paths against a dependency
 * that ships thousands. They inherit currentColor so the existing hover
 * states keep working untouched.
 *
 * Matched on the social's `name`, which comes from Firestore — so adding a
 * link in the admin panel with an unrecognised name still renders, falling
 * back to the two-letter mark it already had.
 */

const PATHS = {
  github:
    "M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.38-3.37-1.38-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z",
  linkedin:
    "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.9h3.1V21H3.4V8.9Zm5.06 0h2.97v1.65h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-3.1V8.9Z",
  x: "M17.53 3h3.02l-6.6 7.54L21.75 21h-6.06l-4.75-6.2L5.5 21H2.48l7.06-8.07L2.25 3h6.21l4.29 5.67L17.53 3Zm-1.06 16.2h1.67L7.62 4.71H5.83L16.47 19.2Z",
  twitter:
    "M17.53 3h3.02l-6.6 7.54L21.75 21h-6.06l-4.75-6.2L5.5 21H2.48l7.06-8.07L2.25 3h6.21l4.29 5.67L17.53 3Zm-1.06 16.2h1.67L7.62 4.71H5.83L16.47 19.2Z",
  email:
    "M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm1.4 2L12 12.3 19.6 7H4.4ZM20 8.6l-7.44 5.2a1 1 0 0 1-1.12 0L4 8.6V17h16V8.6Z",
};

/** `name` is the social's display name; the mark is the fallback. */
export default function SocialIcon({ name, mark, size = 18 }) {
  const path = PATHS[String(name).toLowerCase().replace(/[^a-z]/g, "")];

  if (!path) {
    // Unrecognised network — the two-letter mark still communicates.
    return <span aria-hidden>{mark}</span>;
  }

  return (
    // fontSize drives an SvgIcon's box, so the caller's `size` goes there —
    // width/height props would be overridden by the component's own styles.
    <SvgIcon
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      sx={{ fontSize: size, fill: "currentColor" }}
    >
      <path d={path} />
    </SvgIcon>
  );
}
