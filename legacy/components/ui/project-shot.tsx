/**
 * A project screenshot.
 *
 * Deliberately a plain <img> rather than next/image.
 *
 * next/image failed the same way twice in this codebase — with `fill` and with
 * explicit width/height alike — painting only a thin sliver of the image even
 * though the element measured its full box, reported `complete`, and
 * /_next/image served correct, fully-decodable bytes. A plain <img> in the
 * identical container renders correctly; that was verified in the browser both
 * times. Root cause was not established.
 *
 * The optimisation next/image would have provided is recovered statically
 * instead: every screenshot under /public/projects is pre-compressed to JPEG
 * at ~1400px, which took the set from 6.6 MB to 2.8 MB. Revisit if a future
 * Next release behaves here.
 */
export function ProjectShot({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
