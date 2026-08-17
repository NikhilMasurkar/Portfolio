import React from "react";
import { BrowserRouter } from "react-router";
import { PageRoutes } from "./app/router/Routes";

/**
 * No MUI ThemeProvider or CssBaseline here, unlike the boilerplate.
 *
 * The public site is styled entirely with Tailwind tokens (src/index.css);
 * MUI is confined to the admin panel, which mounts its own provider inside
 * its lazy chunk. Wrapping the whole app would pull MUI and its Emotion
 * runtime into the bundle every visitor downloads, for pages that never
 * render a single MUI component. Tailwind's preflight covers what
 * CssBaseline was doing.
 */
export default function App() {
  return (
    <BrowserRouter>
      <PageRoutes />
    </BrowserRouter>
  );
}
