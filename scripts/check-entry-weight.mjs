/**
 * Fails the build if the public entry bundle grows past its budget, or if an
 * admin-only vendor ends up in it.
 *
 * WHY THIS EXISTS. Adding TinyMCE — used by nothing but the posts editor —
 * changed how the bundler grouped shared vendor code, and the reshuffle pulled
 * the Firebase SDK into a chunk the entry statically imports. The public entry
 * went from 134KB to 268KB gzipped: every visitor to the home page downloading
 * Firestore so the admin could have a rich text editor.
 *
 * Nothing about that is visible. The site works, the tests pass, the pages
 * render; it just costs twice as much to load, on the slow connections the
 * whole design was tuned for. The only symptom is a number nobody was looking
 * at, which is exactly what a build check is for.
 *
 * Run automatically by `npm run build`.
 */
import { readFileSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
import path from "node:path";

const INDEX = "build/index.html";

/**
 * Headroom over the current weight, not a target to grow into. Raise it only
 * with a reason — every kilobyte here is paid by every visitor on every cold
 * load, before anything renders.
 */
const BUDGET_KB = 160;

/**
 * Vendors that must never be reachable from the entry's static graph. Each is
 * used exclusively behind the lazily loaded admin panel.
 */
const ADMIN_ONLY = ["tinymce", "firebase", "index.esm"];

if (!existsSync(INDEX)) {
  console.error(`check-entry-weight: ${INDEX} missing — run the client build first.`);
  process.exit(1);
}

const html = readFileSync(INDEX, "utf8");

// Scripts and modulepreloads in index.html are the entry's static graph: the
// browser fetches every one of them before the page can render.
const chunks = [...html.matchAll(/<(?:script|link)[^>]*\/assets\/([^"]+\.js)/g)].map(
  (match) => match[1]
);

if (chunks.length === 0) {
  console.error("check-entry-weight: no entry chunks found — has the build layout changed?");
  process.exit(1);
}

let total = 0;
const offenders = [];

for (const chunk of chunks) {
  total += gzipSync(readFileSync(path.join("build/assets", chunk))).length;
  if (ADMIN_ONLY.some((name) => chunk.includes(name))) offenders.push(chunk);
}

const totalKb = Math.round(total / 1024);
const problems = [];

if (offenders.length > 0) {
  problems.push(
    `admin-only code reached the public entry: ${offenders.join(", ")}.\n` +
      "  Something statically imports it from the public graph, or the chunker\n" +
      "  regrouped it. Load it through a dynamic import() instead."
  );
}

if (totalKb > BUDGET_KB) {
  problems.push(
    `the entry is ${totalKb}KB gzipped, over the ${BUDGET_KB}KB budget.\n` +
      "  Every visitor pays this before the page renders. Move what is not\n" +
      "  needed for first paint behind a dynamic import."
  );
}

if (problems.length > 0) {
  console.error(`\ncheck-entry-weight: ${problems.join("\n\ncheck-entry-weight: ")}\n`);
  process.exit(1);
}

console.log(
  `check-entry-weight: ok — ${totalKb}KB gzipped across ${chunks.length} entry chunks (budget ${BUDGET_KB}KB).`
);
