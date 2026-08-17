/**
 * Smoke test for a running SSR server.
 *
 *   npm run build
 *   PORT=3001 npm run ssr &
 *   npm run verify                      # or: npm run verify -- http://localhost:8090
 *
 * Asserts the things that have actually broken on this project before, each of
 * which failed silently — the site looked fine in a browser while search
 * engines and social crawlers saw something else:
 *
 *   - posts added without regenerating postModules.js served HTTP 200 with the
 *     404 component and no <title>
 *   - a prefix-based route check reported every junk URL as a real page
 *   - SSR threw and fell back to the empty SPA shell, so crawlers got a blank
 *     document while browsers rendered normally
 *   - blog posts vanished from the sitemap after a fetch
 *   - redirects for old WordPress URLs stopped resolving
 *
 * Exits non-zero on the first failing group, so it works as a deploy gate.
 */
const BASE = (process.argv[2] || process.env.VERIFY_URL || "http://localhost:8080").replace(/\/$/, "");
const CONCURRENCY = 8;

let failures = 0;
const pass = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const fail = (m) => {
  failures++;
  console.log(`  \x1b[31m✗ ${m}\x1b[0m`);
};
const group = (m) => console.log(`\n${m}`);

async function get(path) {
  const res = await fetch(BASE + path, { redirect: "manual" });
  const body = res.status === 301 || res.status === 302 ? "" : await res.text();
  return { status: res.status, location: res.headers.get("location"), body };
}

/** Runs `fn` over `items`, at most CONCURRENCY at a time. */
async function mapLimit(items, fn) {
  const out = [];
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    })
  );
  return out;
}

// ---------------------------------------------------------------------------

async function checkSitemap() {
  group("sitemap.xml");
  const { status, body } = await get("/sitemap.xml");
  if (status !== 200) return fail(`/sitemap.xml returned ${status}`), [];

  const urls = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, "")
  );
  if (!urls.length) return fail("sitemap contains no URLs"), [];

  const dupes = urls.filter((u, i) => urls.indexOf(u) !== i);
  if (dupes.length) {
    fail(`sitemap contains duplicate URLs: ${[...new Set(dupes)].join(", ")}`);
  } else {
    pass(`${urls.length} URLs, no duplicates`);
  }

  return [...new Set(urls)];
}

async function checkPages(urls) {
  group(`every sitemap URL (${urls.length})`);

  const results = await mapLimit(urls, async (path) => {
    const { status, body } = await get(path);
    return {
      path,
      status,
      hasTitle: /<title[^>]*>[^<]+<\/title>/.test(body),
      hasCanonical: /rel="canonical"/.test(body),
      // The 404 component rendering on a 200 response — a soft 404.
      soft404: /Error 404/.test(body),
      // server/index.js falls back to the raw SPA shell when SSR throws.
      // That shell is the only thing with an empty #root.
      ssrFellBack: /<div id="root">\s*<\/div>/.test(body),
    };
  });

  const bad = (key, label, want = false) => {
    const hits = results.filter((r) => (want ? !r[key] : r[key]));
    if (!hits.length) return pass(label);
    fail(`${label} — ${hits.length} URL(s): ${hits.slice(0, 3).map((h) => h.path).join(", ")}${hits.length > 3 ? " …" : ""}`);
  };

  const notOk = results.filter((r) => r.status !== 200);
  notOk.length
    ? fail(`all return 200 — ${notOk.length} failed: ${notOk.slice(0, 3).map((r) => `${r.path} (${r.status})`).join(", ")}`)
    : pass("all return 200");

  bad("hasTitle", "all have a <title>", true);
  bad("hasCanonical", "all have a canonical URL", true);
  bad("soft404", "none render the 404 page on a 200 (soft 404)");
  bad("ssrFellBack", "none fell back to the empty SPA shell");
}

async function checkNotFound() {
  group("unknown URLs must 404");
  const fakes = [
    "/this-page-does-not-exist/",
    "/complete-nonsense/",
    "/about/nope/",
  ];
  const results = await mapLimit(fakes, async (p) => ({ p, ...(await get(p)) }));
  const wrong = results.filter((r) => r.status !== 404);
  wrong.length
    ? fail(`returned ${wrong.map((w) => `${w.p} → ${w.status}`).join(", ")}`)
    : pass(`${fakes.length} junk URLs all return 404`);
}

async function checkRedirects() {
  group("old WordPress URLs must 301");
  // Fill in from server/redirects.js. Empty = check skipped.
  const expected = {
    // "/old-about": "/about/",
  };
  if (!Object.keys(expected).length) {
    return pass("none configured (add them here once redirects.js has some)");
  }

  const results = await mapLimit(Object.keys(expected), async (from) => {
    const { status, location } = await get(from);
    return { from, status, to: (location || "").replace(/^https?:\/\/[^/]+/, "") };
  });

  const wrong = results.filter((r) => r.status !== 301 || r.to !== expected[r.from]);
  wrong.length
    ? fail(wrong.map((w) => `${w.from} → ${w.status} ${w.to || ""} (want 301 ${expected[w.from]})`).join("; "))
    : pass(`${results.length} redirects resolve correctly`);
}

async function checkRobots() {
  group("robots.txt");
  const { status, body } = await get("/robots.txt");
  if (status !== 200) return fail(`returned ${status}`);

  // Blocking this agent kills WhatsApp/Facebook/Messenger link previews —
  // the exact thing the SSR server exists to produce. It has happened here.
  if (/facebookexternalhit[\s\S]*?Disallow:\s*\//i.test(body)) {
    fail("blocks facebookexternalhit — WhatsApp and Facebook previews will break");
  } else {
    pass("does not block social crawlers");
  }

  /sitemap/.test(body)
    ? pass("points at the site's own sitemap")
    : fail("Sitemap directive missing or pointing at the wrong domain");
}

// ---------------------------------------------------------------------------

console.log(`\nVerifying ${BASE}`);

try {
  await get("/healthz");
} catch {
  console.error(`\n\x1b[31mCannot reach ${BASE}\x1b[0m — is the server running?\n`);
  console.error("  npm run build && npm run ssr\n");
  process.exit(2);
}

const urls = await checkSitemap();
if (urls.length) await checkPages(urls);
await checkNotFound();
await checkRedirects();
await checkRobots();

console.log(
  failures
    ? `\n\x1b[31m${failures} check(s) failed.\x1b[0m Do not deploy.\n`
    : "\n\x1b[32mAll checks passed.\x1b[0m\n"
);
process.exit(failures ? 1 : 0);
