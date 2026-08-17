import { test, before } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Exercises the deployed path: the Netlify Function wrapper, not the local
 * Express listener. These are different entry points into the same app, and
 * only this one runs in production.
 *
 * The cwd change below is the point of the test. A Lambda's working directory
 * is not the repo root, so anything reading `./build` at runtime throws there
 * and Express's catch serves the empty SPA shell — a site that looks perfect
 * in a browser and is blank to every crawler. Running from "/" proves the
 * shell is compiled in rather than read from disk.
 */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);

let handler;

before(() => {
  const bundle = path.join(ROOT, "build-server/index.cjs");
  assert.ok(
    existsSync(bundle),
    `${bundle} missing — run \`npm run build\` before \`npm test\`.`
  );
  process.chdir("/");
  handler = require(path.join(ROOT, "netlify/functions/ssr.cjs")).handler;
});

const invoke = (rawPath) =>
  handler(
    {
      httpMethod: "GET",
      path: rawPath,
      headers: { host: "nikhilmasurkar.netlify.app" },
      queryStringParameters: null,
      body: null,
      isBase64Encoded: false,
    },
    {}
  );

test("renders real content, not the empty SPA shell", async () => {
  const res = await invoke("/");

  assert.equal(res.statusCode, 200);
  // Content only present if React actually rendered on the server.
  assert.match(res.body, /Nikhil Masurkar/);
  assert.match(res.body, /Skip to content/);
  // #root must not be empty — that is exactly what the fallback returns.
  assert.doesNotMatch(res.body, /<div id="root">\s*<\/div>/);
});

test("serves per-page SEO tags from <Seo>", async () => {
  const res = await invoke("/");

  assert.match(res.body, /<link rel="canonical" href="https:\/\/[^"]+\/"/);
  assert.match(res.body, /<meta name="description"/);
  // The stylesheet link comes from the inlined shell; losing it means the
  // page renders unstyled in production.
  assert.match(res.body, /<link rel="stylesheet"[^>]+assets\/index-[^"]+\.css/);
});

test("unknown URLs return a hard 404", async () => {
  const res = await invoke("/definitely-not-a-page");

  // A soft 404 (200 + the not-found component) gets the junk URL indexed.
  assert.equal(res.statusCode, 404);
});

test("sitemap.xml is served by the function", async () => {
  const res = await invoke("/sitemap.xml");

  assert.equal(res.statusCode, 200);
  assert.match(res.body, /<urlset/);
});
