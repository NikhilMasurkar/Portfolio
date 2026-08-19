/**
 * Loads the built server bundle the way Netlify's function runtime will, and
 * fails the build if it throws.
 *
 * WHY THIS EXISTS. build-server/index.cjs is CommonJS. `require()` of an ESM
 * module is allowed on Node >= 22.12 and throws ERR_REQUIRE_ESM on anything
 * older, and Netlify's function runtime is older. So an externalised ESM-only
 * dependency runs perfectly in local development and 502s every route in
 * production — while "/" keeps working, because a real build/index.html can be
 * served by the CDN. The site looks up while everything but the home page is
 * broken.
 *
 * `--no-experimental-require-module` turns off require(esm) on a modern Node,
 * which reproduces the old runtime exactly. That matters: the first version of
 * this check compared package.json "type" fields instead, passed happily, and
 * the very next deploy crashed on @babel/runtime/helpers/esm/extends.js — an
 * ESM file inside a package that is not itself type: module. Loading the real
 * bundle is the only check that cannot be fooled by packaging shape.
 *
 * Run automatically by `npm run build`.
 */
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const BUNDLE = "build-server/index.cjs";

if (!existsSync(BUNDLE)) {
  console.error(`check-ssr-externals: ${BUNDLE} missing — run the server build first.`);
  process.exit(1);
}

const probe = spawnSync(
  process.execPath,
  ["--no-experimental-require-module", "-e", `require("./${BUNDLE}")`],
  { encoding: "utf8" }
);

// If this Node no longer understands the flag there is nothing to stand on:
// say so rather than reporting a pass nobody verified.
if (probe.stderr.includes("bad option")) {
  console.error(
    "check-ssr-externals: this Node does not support --no-experimental-require-module,\n" +
      "so the production runtime cannot be simulated. Update this check before trusting it."
  );
  process.exit(1);
}

if (probe.status !== 0) {
  const offender = probe.stderr.match(/require\(\) of ES Module (\S+)/)?.[1] ?? "(see above)";
  console.error(
    [
      "",
      "check-ssr-externals: the server bundle cannot be loaded without require(esm).",
      "",
      probe.stderr.trim().split("\n").slice(0, 6).join("\n"),
      "",
      `The offending module is ESM: ${offender}`,
      "",
      "It is externalised, so the function require()s it at runtime and Netlify's",
      "runtime throws ERR_REQUIRE_ESM — every route 502s, while / still serves the",
      "static shell and hides it.",
      "",
      "Fix: remove it from `ssr.external` in vite.config.server.js so it gets",
      "bundled. Only keep a package external when it is certainly CommonJS.",
      "",
    ].join("\n")
  );
  process.exit(1);
}

console.log("check-ssr-externals: ok — bundle loads with require(esm) disabled.");
