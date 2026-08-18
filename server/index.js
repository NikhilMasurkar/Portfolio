/**
 * Express SSR app.
 *
 * Social crawlers (WhatsApp, Facebook, LinkedIn, X) do not run JavaScript.
 * Without SSR every shared link shows the same generic title from index.html.
 * This renders each request to HTML so the response already contains the real
 * content and the correct per-page tags.
 *
 *   request → static file?  → yes: serve from build/
 *                           → no:  301 redirect? → yes: send it
 *                                                 → no:  render React
 *
 * Exports the app rather than listening, because it runs two ways:
 *   local        server/listen.cjs        → node, port 8080
 *   production   netlify/functions/ssr.js → wrapped by serverless-http
 */
import express from "express";
import compression from "compression";
import path from "path";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server";

import hoistHeadTags from "./hoistHeadTags";
import ServerRoutes from "./ServerRoutes";
import buildSitemap, { knownPaths } from "./sitemap";
import redirectFor from "./redirects";
import { getContent } from "./content.js";
import { getDb } from "./db.js";
import { SITE } from "../src/app/global/siteConfig.js";
import { verifyIdToken, isAdminClaims } from "./auth.js";
import { presignUpload } from "./upload.js";

/**
 * The client build's index.html, inlined into this bundle at build time.
 *
 * The boilerplate read it from disk at runtime. That cannot work in a
 * serverless function: `cwd` is not the repo root there, so the read throws,
 * the catch below fires, and every page silently serves the empty SPA shell —
 * a site that looks perfect in a browser and is blank to every crawler.
 * Inlining removes the filesystem from the path entirely, so local and
 * production resolve it identically.
 *
 * Requires the client build to run first; `npm run build` already orders them.
 */
import shellHtml from "../build/index.html?raw";

const BUILD_DIR = path.resolve("./build");

// Exact match, not a prefix check: "/blog/anything-at-all" must 404. A prefix
// check reports every junk URL as a real page, which Google indexes.
//
// Async because the set now includes Firestore slugs. It is served from the
// content cache, so this is a map lookup on all but the first request per
// cache window, not a database round trip per page view.
const isKnownRoute = async (url) =>
  (await knownPaths()).has(url.replace(/\/$/, "") || "/");

// index.html's own <title>/description would sit alongside the per-page ones
// that <Seo> renders. Comments are dev notes, not worth sending to visitors.
const SHELL_NOISE =
  /<title>[\s\S]*?<\/title>|<meta\s+name="description"[^>]*>|<!--[\s\S]*?-->/gi;
const strip = (html) => html.replace(SHELL_NOISE, "").replace(/\n\s*\n+/g, "\n");

/**
 * Reuses the index.html Vite produced rather than hand-writing the document,
 * so the hashed <script>/<link> filenames always match the current build.
 * Parsed once at module load — the source is a constant, so there is nothing
 * to invalidate.
 */
const SHELL = {
  head: strip(shellHtml.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || ""),
  bodyExtras: (shellHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "")
    .replace(/<div id="root">\s*<\/div>/i, "")
    .trim(),
};

/**
 * Serialise content for the client so hydration sees the same data the server
 * rendered from. Without it React finds different markup and throws the
 * server's HTML away.
 *
 * The escaping is not optional. Content is admin-authored prose, and a project
 * summary containing "</script>" would otherwise close this tag early and let
 * the remainder parse as markup — a stored XSS through the person's own CMS.
 * Escaping "<" defeats that without needing to know where it appears.
 */
function serialiseContent(content) {
  return JSON.stringify(content ?? null).replace(/</g, "\\u003c");
}

function renderDocument({ head, pageHead, appHtml, state, bodyEnd }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${head}
    ${pageHead}
  </head>
  <body>
    <div id="root">${appHtml}</div>
    <script>window.__CONTENT__=${state}</script>
    ${bodyEnd}
  </body>
</html>`;
}

async function handleRender(req, res) {
  try {
    /*
     * No Emotion critical-CSS extraction here, unlike the boilerplate.
     *
     * That step exists to inline MUI's runtime styles into server-rendered
     * HTML. This site styles its public pages with Tailwind, whose CSS is a
     * static file already linked from shell.head, and confines MUI to the
     * client-rendered admin panel — so extraction would run on every request
     * to collect nothing. Do not add it back without first putting an MUI
     * component on a server-rendered page.
     */
    // Fetched once per render and shared with knownPaths() below via the
    // content cache, so this is not two round trips.
    const content = await getContent({ db: getDb() });

    const rendered = ReactDOMServer.renderToString(
      createElement(ServerRoutes, { location: req.originalUrl, content })
    );

    const { head: pageHead, body: appHtml } = hoistHeadTags(rendered);

    res.status((await isKnownRoute(req.path)) ? 200 : 404);
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(
      renderDocument({
        head: SHELL.head,
        pageHead,
        appHtml,
        state: serialiseContent(content),
        bodyEnd: SHELL.bodyExtras,
      })
    );
  } catch (err) {
    // Fall back to the plain SPA shell so visitors still get a working page.
    // WATCH OUT: this is silent by design, so an SSR failure looks fine in a
    // browser while every crawler gets an empty document. `npm run verify`
    // detects it; if pages are blank in curl but fine in a browser, this
    // catch is firing — check the log below.
    console.error(`SSR failed for ${req.originalUrl}:`, err);
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(shellHtml);
  }
}

const app = express();
app.use(compression());

/**
 * Static files and their cache headers — LOCAL ONLY.
 *
 * In production Netlify's CDN serves everything in `build/` before the
 * function is ever invoked, so this middleware never runs there and its
 * headers have no effect. The production equivalents live in netlify.toml
 * under [[headers]]; the two must be changed together.
 *
 * express.static sends `max-age=0` by default, so a browser re-checks every
 * file on every page view — 50 images means 50 round trips, which is why
 * images appear to reload on each visit.
 *
 *   /assets/*  content-hashed by Vite, so the bytes at a URL never change:
 *              cache for a year, immutable.
 *   media      not hashed — a replacement keeps its filename. One day fresh,
 *              then stale-while-revalidate paints instantly from cache and
 *              refetches in the background.
 *
 * HTML is deliberately absent: it is rendered per request.
 */
const HASHED_ASSET = /\/assets\/[^/]+-[A-Za-z0-9_-]{6,}\.[a-z0-9]+$/;
const CACHEABLE_MEDIA = /\.(jpe?g|png|webp|gif|svg|ico|avif|pdf|woff2?|ttf)$/i;

const staticOptions = {
  index: false,
  setHeaders(res, filePath) {
    if (HASHED_ASSET.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else if (CACHEABLE_MEDIA.test(filePath)) {
      res.setHeader(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=604800"
      );
    }
  },
};

app.use(express.static(BUILD_DIR, staticOptions));

// Load-balancer probe. Cheaper than "/", which renders a full page.
app.get("/healthz", (_req, res) => res.json({ ok: true }));

app.get("/sitemap.xml", async (_req, res) => {
  res.set("Content-Type", "application/xml; charset=utf-8");
  res.send(await buildSitemap());
});

/**
 * robots.txt, generated rather than stored.
 *
 * It shipped as a static file carrying the boilerplate's example.com sitemap
 * URL — a stored copy of the domain is a second source of truth, and it rotted
 * immediately. Building it from SITE.domain means it cannot.
 *
 * Do NOT add a Disallow for facebookexternalhit: that is the crawler Facebook,
 * Messenger and WhatsApp use to build link previews, and blocking it defeats
 * the entire reason this server renders HTML.
 */
app.get("/robots.txt", (_req, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(
    [
      "User-agent: *",
      "Allow: /",
      // Behind a login and served as a bare shell — nothing to index, and no
      // reason to advertise it.
      "Disallow: /admin",
      "",
      `Sitemap: ${SITE.domain}/sitemap.xml`,
      "",
    ].join("\n")
  );
});

/**
 * Mints a presigned S3 upload for the admin panel.
 *
 * This is the trust boundary for uploads. The browser talks to S3 directly
 * afterwards — which is the point, since a resume PDF never has to fit through
 * a function's request body — so every constraint has to be baked into the
 * signature here rather than checked later.
 *
 * Two gates, in order: a valid Firebase ID token, then that token belonging to
 * the admin. A valid token from any other Google account gets 403, not 401,
 * because the difference matters when debugging.
 */
app.post("/api/upload-url", express.json({ limit: "4kb" }), async (req, res) => {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  let claims;
  try {
    claims = await verifyIdToken(token);
  } catch (err) {
    console.warn("[upload] rejected token:", err.message);
    return res.status(401).json({ error: "Not signed in" });
  }

  if (!isAdminClaims(claims)) {
    console.warn(`[upload] non-admin attempt by ${claims.email ?? "unknown"}`);
    return res.status(403).json({ error: "Not authorised" });
  }

  try {
    const { contentType, kind } = req.body ?? {};
    res.json(await presignUpload({ contentType, kind }));
  } catch (err) {
    const status = err.status ?? 500;
    if (status >= 500) console.error("[upload] presign failed:", err);
    res.status(status).json({ error: err.message });
  }
});

/**
 * The admin panel: shell only, never server-rendered.
 *
 * It sits behind a login, so there is nothing for a crawler to read, and its
 * Firebase and MUI dependencies have no business in the server bundle. Serving
 * the plain shell lets the client mount it fresh — see src/index.jsx.
 *
 * Answers 200 rather than going through isKnownRoute(), which would 404 it for
 * not being in the sitemap. It stays out of the sitemap on purpose, and
 * robots.txt disallows it.
 */
app.get("/{*splat}", (req, res, next) => {
  if (!req.path.startsWith("/admin")) return next();
  res.status(200).set("Content-Type", "text/html; charset=utf-8").send(shellHtml);
});

// Must sit before the catch-all, or these would render as pages.
app.get("/{*splat}", (req, res, next) => {
  const target = redirectFor(req.path);
  return target ? res.redirect(301, target) : next();
});

app.get("/{*splat}", handleRender);

export default app;
