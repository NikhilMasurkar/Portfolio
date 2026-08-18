import React from "react";
import seoMeta from "../global/seoMeta.json" with { type: "json" };
import { SITE } from "../global/siteConfig";

/**
 * All SEO tags for a page, from one component.
 *
 *   <Seo path="/about/" />                       normal page
 *   <Seo path={p} jsonLd={schema} />             page with its own schema
 *   <Seo path={p} title="…" description="…" />   values not in seoMeta.json
 *
 * React 19 renders <title>/<meta> natively — no react-helmet, do not add one.
 * Canonical is COMPUTED from `path`, never stored, so it cannot drift.
 */
const mimeOf = (src) =>
  /\.png$/i.test(src) ? "image/png" : /\.webp$/i.test(src) ? "image/webp" : "image/jpeg";

const breadcrumbSchema = (path, title) => {
  const parts = path.split("/").filter(Boolean);
  const items = [{ name: "Home", url: `${SITE.domain}/` }];
  parts.forEach((part, i) => {
    items.push({
      name:
        i === parts.length - 1
          ? title
          : part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      url: `${SITE.domain}/${parts.slice(0, i + 1).join("/")}/`,
    });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

export default function Seo({
  path,
  title,
  description,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogType = "website",
  jsonLd,
}) {
  const meta = seoMeta[path] || {};
  const finalTitle = title || meta.title || SITE.name;
  const finalDescription = description || meta.description || SITE.description;

  const usingDefault = !ogImage && !meta.ogImage;
  const imagePath = ogImage || meta.ogImage || SITE.defaultOgImage;
  const finalImage = `${SITE.domain}${imagePath}`;

  // Declaring dimensions lets a crawler lay out the preview card before the
  // image downloads — the difference between a thumbnail on the first share
  // and only on the second.
  const [width, height] = usingDefault
    ? [SITE.defaultOgImageWidth, SITE.defaultOgImageHeight]
    : [ogImageWidth || meta.ogImageWidth, ogImageHeight || meta.ogImageHeight];

  const canonical = `${SITE.domain}${path}`;

  return (
    <>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:image" content={finalImage} />
      {width && <meta property="og:image:width" content={String(width)} />}
      {height && <meta property="og:image:height" content={String(height)} />}
      <meta property="og:image:type" content={mimeOf(imagePath)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={finalImage} />
      {SITE.twitterHandle && <meta name="twitter:site" content={SITE.twitterHandle} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      {/* Fallback so no page ships without structured data. */}
      {path !== "/" && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema(path, finalTitle))}
        </script>
      )}
    </>
  );
}
