import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Google Fonts
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap";
document.head.appendChild(linkElement);

// Update title
document.title = "Nikhil Masurkar | React Developer";
const container = document.getElementById("root");
const root = createRoot(container);
const PUBLIC_URL = import.meta.env.PUBLIC_URL || "/";
root.render(<App basename={PUBLIC_URL} />);
