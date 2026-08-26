import React from "react";

/**
 * A project screenshot.
 *
 * Plain <img>, and there is no framework image component to reach for now that
 * Next.js is gone. What next/image would have bought is recovered statically:
 * every screenshot under public/projects is pre-compressed to JPEG at ~1400px,
 * which took the set from 6.6 MB to 2.8 MB. Uploads through the admin panel are
 * resized in the browser before they ever reach S3, so the same ceiling applies
 * to new images.
 *
 * `width`/`height` are the intrinsic pixel size and exist to reserve layout
 * space before the bytes arrive. Without them the page reflows as each image
 * lands, which is the single largest contributor to a bad CLS score.
 */
export default function ProjectShot({
  src,
  alt,
  className = "",
  eager = false,
  fit = "cover",
  width = 1400,
  height = 875,
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      // Above-the-fold images should not queue behind lazy ones.
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      /*
       * `fit` is a prop rather than something the caller passes in className,
       * because object-cover and object-contain are the same CSS property:
       * both classes exist, so which one wins depends on their order in the
       * stylesheet, not on the order they are written in the attribute. A
       * caller "overriding" it that way would work or not work by accident.
       *
       * cover fills the frame and crops; contain shows the whole image and
       * letterboxes. The project screenshots are not one shape — the mobile
       * captures are portrait and the web ones landscape — so anywhere they
       * share a frame, contain is the only way to show all of them intact.
       */
      className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}
