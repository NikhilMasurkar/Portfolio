import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

/*
 * The admin panel is a separate application on the same origin.
 *
 * The server sends a bare shell for /admin — no SSR, since the panel is behind
 * a login and has nothing to offer a crawler — so it is mounted fresh rather
 * than hydrated. Loading it dynamically also keeps the Firebase SDK out of the
 * bundle every visitor downloads.
 */
if (window.location.pathname.startsWith("/admin")) {
  import("./AdminApp.jsx").then(({ default: AdminApp }) => {
    createRoot(container).render(<AdminApp />);
  });
} else {
  /*
   * The exact object the server rendered from, inlined by server/index.js.
   * Reading it back rather than refetching is what keeps the first client
   * render identical to the server's markup — a refetch would race hydration
   * and React would discard the server HTML.
   *
   * Absent under `vite dev`, which has no SSR; the fallback content covers it.
   */
  const content = window.__CONTENT__ ?? null;

  if (container.hasChildNodes()) {
    hydrateRoot(container, <App content={content} />);
  } else {
    createRoot(container).render(<App content={content} />);
  }
}
