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
import createEmotionCache, { emotionServer } from "./createEmotionCache.js";

import hoistHeadTags from "./hoistHeadTags";
import ServerRoutes from "./ServerRoutes";
import buildSitemap, { knownPaths } from "./sitemap";
import redirectFor from "./redirects";
import { getContent } from "./content.js";
import { getDb } from "./db.js";
import { SITE } from "../src/app/global/siteConfig.js";
import { verifyIdToken, isAdminClaims } from "./auth.js";
import { presignUpload } from "./upload.js";

import shellHtml from "../build/index.html?raw";

const BUILD_DIR = path.resolve("./build");

const isKnownRoute = async (url) =>
  (await knownPaths()).has(url.replace(/\/$/, "") || "/");
const SHELL_NOISE =
  /<title>[\s\S]*?<\/title>|<meta\s+name="description"[^>]*>|<!--[\s\S]*?-->/gi;
const strip = (html) => html.replace(SHELL_NOISE, "").replace(/\n\s*\n+/g, "\n");
const SHELL = {
  head: strip(shellHtml.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || ""),
  bodyExtras: (shellHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || "")
    .replace(/<div id="root">\s*<\/div>/i, "")
    .trim(),
};


function serialiseContent(content) {
  return JSON.stringify(content ?? null).replace(/</g, "\\u003c");
}
const withStyles = (head, styleTags) =>
  head.includes('<link rel="stylesheet"')
    ? head.replace('<link rel="stylesheet"', `${styleTags}\n    <link rel="stylesheet"`)
    : head + styleTags;

function renderDocument({ head, pageHead, styleTags, appHtml, state, bodyEnd }) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    ${withStyles(head, styleTags)}
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
 
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      emotionServer(cache);

    const content = await getContent({ db: getDb() });

    const rendered = ReactDOMServer.renderToString(
      createElement(ServerRoutes, { location: req.originalUrl, content, cache })
    );

    const { head: pageHead, body: appHtml } = hoistHeadTags(rendered);

    res.status((await isKnownRoute(req.path)) ? 200 : 404);
    res.set("Content-Type", "text/html; charset=utf-8");
    res.send(
      renderDocument({
        head: SHELL.head,
        pageHead,
        appHtml,
        styleTags: constructStyleTagsFromChunks(extractCriticalToChunks(rendered)),
        state: serialiseContent(content),
        bodyEnd: SHELL.bodyExtras,
      })
    );
  } catch (err) {

    console.error(`SSR failed for ${req.originalUrl}:`, err);
    res.status(200).set("Content-Type", "text/html; charset=utf-8").send(shellHtml);
  }
}

const app = express();
app.use(compression());


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

app.get("/robots.txt", (_req, res) => {
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send(
    [
      "User-agent: *",
      "Allow: /",

      "Disallow: /admin",
      "Disallow: /resume/edit",
      "",
      `Sitemap: ${SITE.domain}/sitemap.xml`,
      "",
    ].join("\n")
  );
});


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

const CLIENT_ONLY = ["/admin", "/resume/edit"];

app.get("/{*splat}", (req, res, next) => {
  if (!CLIENT_ONLY.some((prefix) => req.path.startsWith(prefix))) return next();
  res.status(200).set("Content-Type", "text/html; charset=utf-8").send(shellHtml);
});

app.get("/{*splat}", (req, res, next) => {
  const target = redirectFor(req.path);
  return target ? res.redirect(301, target) : next();
});

app.get("/{*splat}", handleRender);

export default app;
