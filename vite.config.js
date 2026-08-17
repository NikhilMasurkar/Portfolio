import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// The client build. `base` matters if the host serves assets from a
// sub-path; leave "/" unless your hosting says otherwise.
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  base: process.env.PUBLIC_URL || "/",
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  server: { port: 3000, open: true },
  build: { outDir: "build", sourcemap: false },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      mode === "production" ? "production" : "development"
    ),
  },
}));
