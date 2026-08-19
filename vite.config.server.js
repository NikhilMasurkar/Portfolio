import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Bundles the SSR server into one CommonJS file so production runs plain
 * `node` — no Babel at runtime, and `npm ci --omit=dev` is safe.
 *
 *   npm run build:server  ->  build-server/index.cjs
 */
export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  build: {
    ssr: "server/index.js",
    outDir: "build-server",
    emptyOutDir: true,
    minify: false, // readable stack traces in production logs
    rollupOptions: {
      output: { entryFileNames: "index.cjs", format: "cjs" },
    },
  },
  ssr: {
    target: "node",
    noExternal: true,
    external: [
      "express",
      "compression",
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-presigned-post",
      "react",
      "react-dom",
      "react-dom/server",
      "react/jsx-runtime",
    ],
  },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
});
