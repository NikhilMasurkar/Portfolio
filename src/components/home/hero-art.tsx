
/**
 * Decorative right-column composition for the hero: a code window, a phone
 * card and a GitHub-activity card, each floating independently. Pure
 * CSS/DOM — no raster images beyond the one real screenshot.
 *
 * The four literal hex values below (heatmap shades) and the three window-
 * dot colours are the only raw colour literals in this codebase — everything
 * else here goes through design tokens.
 */

const CODE_LINES: { text: string; color: string }[] = [
  { text: "const developer = {", color: "#c792ea" },
  { text: "  name: 'Nikhil Masurkar',", color: "#7fdbca" },
  { text: "  role: 'Frontend Engineer',", color: "#7fdbca" },
  { text: "  stack: ['React', 'React Native'],", color: "#82aaff" },
  { text: "  shipped: true,", color: "#f78c6c" },
  { text: "};", color: "#c792ea" },
  { text: "export default developer;", color: "#546a94" },
];

const HEATMAP_SHADES = ["#111731", "#2a2a6b", "#4b45c9", "#7c76ff"];
const ACTIVITY_COLUMNS = 20;
const ACTIVITY_ROWS = 6;

/**
 * Deterministic shade per cell — a pure function of the index, so the
 * server-rendered grid and the client render always agree. No Math.random(),
 * no Date.now().
 */
function shadeForCell(index: number) {
  return HEATMAP_SHADES[(index * 5 + 3) % HEATMAP_SHADES.length];
}

export function HeroArt() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[520px] max-[900px]:hidden"
    >
      {/* Code window — largest layer, lower-left */}
      <div className="hero-art-float-a absolute bottom-0 left-0 z-20 w-[62%] min-w-[260px] overflow-hidden rounded-2xl border border-line-emphasis bg-[linear-gradient(160deg,var(--color-surface-raised),var(--color-bg))] shadow-card">
        <div className="flex items-center gap-2 border-b border-line-inner px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#ff5f57" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#febc2e" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#28c840" }} />
          <span className="ml-2 font-mono text-[11.5px] text-dim">developer.ts</span>
        </div>
        <div className="px-3 py-3 font-mono text-[11px] leading-[1.95]">
          {CODE_LINES.map((line, index) => (
            <div key={index} className="flex gap-4">
              <span className="w-4 shrink-0 select-none text-right text-dim">
                {index + 1}
              </span>
              <span style={{ color: line.color }}>{line.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Phone card — upper-right, overlapping the code window */}
      <div className="hero-art-float-b absolute right-0 top-0 z-10 w-[40%] max-w-[172px] rounded-[24px] border border-line-emphasis bg-surface-raised p-3 shadow-card">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line-raised" />
        <p className="mb-2 truncate font-display text-[11.5px] font-semibold text-fg-3">
          1FIN by Avinash
        </p>
        {/*
          Deliberately a plain <img>, not next/image.

          Through next/image this decorative shot painted as a thin sliver in
          Chromium — with `fill` and with explicit width/height alike — even
          though the element measured its full 144x258, reported complete, and
          the optimiser served correct, fully-decodable bytes at /_next/image.
          A plain <img> in the identical box paints correctly; that was verified
          directly in the browser before making this change. Root cause not
          established.

          The cost of opting out is small and bounded: one 172px-wide decorative
          image, served at its natural size. Revisit if next/image behaves here
          on a future Next release.
        */}
        <div className="mb-3 aspect-[9/16] w-full overflow-hidden rounded-[14px] border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/projects/indigolearn-app.jpg"
            alt=""
            width={344}
            height={516}
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-line-raised" />
          <div className="h-1.5 w-4/5 rounded-full bg-line-raised" />
          <div className="h-1.5 w-3/5 rounded-full bg-line-raised" />
        </div>
      </div>

      {/* GitHub activity card — lower-right */}
      <div className="hero-art-float-c absolute bottom-6 right-0 z-10 w-[36%] max-w-[210px] max-[1160px]:hidden rounded-2xl border border-line-emphasis bg-surface p-4 shadow-card">
        <p className="mb-3 text-[11.5px] font-semibold tracking-[0.1em] text-dim">
          GitHub Activity
        </p>
        <div
          className="grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${ACTIVITY_COLUMNS}, 1fr)` }}
        >
          {Array.from({ length: ACTIVITY_COLUMNS * ACTIVITY_ROWS }).map((_, index) => (
            <span
              key={index}
              className="aspect-square rounded-[2px]"
              style={{ backgroundColor: shadeForCell(index) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
