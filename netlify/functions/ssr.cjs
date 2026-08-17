/**
 * Netlify Function wrapping the Express app.
 *
 * Kept to three lines on purpose: it requires the bundle Vite already built,
 * so nothing in this file's import graph contains JSX, path aliases or any
 * other Vite-specific syntax that Netlify's own bundler would have to
 * understand. `npm run build` must therefore run before functions are
 * bundled — netlify.toml's build command ensures that ordering.
 */
const serverless = require("serverless-http");

// See server/listen.cjs — Rollup's export shape depends on whether
// server/index.js has named exports, so accept either.
const bundle = require("../../build-server/index.cjs");
const app = bundle.default || bundle;

exports.handler = serverless(app);
