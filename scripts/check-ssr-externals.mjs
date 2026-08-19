
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const BUNDLE = "build-server/index.cjs";

if (!existsSync(BUNDLE)) {
  console.error(`check-ssr-externals: ${BUNDLE} missing — run the server build first.`);
  process.exit(1);
}

const source = readFileSync(BUNDLE, "utf8");

const required = [
  ...new Set(
    [...source.matchAll(/require\("([^"]+)"\)/g)]
      .map((match) => match[1])
      .filter((name) => !name.startsWith(".") && !name.startsWith("node:"))
  ),
];

const packageOf = (specifier) =>
  specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];

const esmOnly = required.filter((specifier) => {
  try {
    return require(`${packageOf(specifier)}/package.json`).type === "module";
  } catch {
    return false;
  }
});

if (esmOnly.length > 0) {
  console.error(
    [
      "",
      `check-ssr-externals: ${BUNDLE} require()s ${esmOnly.length} ESM-only package(s):`,
      ...esmOnly.map((name) => `  - ${name}`),
      "",
      "That throws ERR_REQUIRE_ESM on Node < 22.12, which is what Netlify's",
      "function runtime uses. It will work locally and 502 in production.",
      "",
      "Fix: add each one to `ssr.noExternal` in vite.config.server.js so it is",
      "bundled rather than required at runtime.",
      "",
    ].join("\n")
  );
  process.exit(1);
}

console.log(`check-ssr-externals: ok — ${required.length} runtime requires, none ESM-only.`);
