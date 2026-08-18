import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

/*
 * The exact object the server rendered from, inlined by server/index.js.
 * Reading it back rather than refetching is what keeps the first client render
 * identical to the server's markup — a refetch would race hydration and React
 * would discard the server HTML.
 *
 * Absent under `vite dev`, which has no SSR; the fallback content covers that.
 */
const content = window.__CONTENT__ ?? null;

if (container.hasChildNodes()) {
  hydrateRoot(container, <App content={content} />);
} else {
  createRoot(container).render(<App content={content} />);
}
