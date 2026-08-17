import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");

// The server sends fully rendered HTML, so hydrate it rather than throwing it
// away. createRoot is only the fallback for a container the server left empty.
if (container.hasChildNodes()) {
  hydrateRoot(container, <App />);
} else {
  createRoot(container).render(<App />);
}
