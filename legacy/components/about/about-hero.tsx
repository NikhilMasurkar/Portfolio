import Link from "next/link";
import { ProjectShot } from "@/components/ui/project-shot";
import { aboutHeadline, aboutParagraphs } from "@/data/about";
import { siteConfig } from "@/lib/site-config";

export function AboutHero() {
  // The gradient treatment applies to the name only, not the whole greeting —
  // split the lead on the first name so this stays correct if the copy ever
  // changes without hardcoding the sentence structure here.
  const firstName = siteConfig.name.split(" ")[0];
  const [before, after] = aboutHeadline.lead.split(firstName);

  return (
    <div>
      <div className="grid grid-cols-[1.05fr_.95fr] items-center gap-16 max-[900px]:grid-cols-1">
        <div>
          <h1 className="m-0 mb-5 font-display text-[46px] font-bold leading-[1.15] tracking-[-0.02em] max-[720px]:text-[32px]">
            {before}
            <span className="bg-[image:var(--gradient-04)] bg-clip-text text-transparent">
              {firstName}
            </span>
            {after}
          </h1>

          <p className="mb-7 font-display text-[26px] font-medium leading-[1.3] tracking-[-0.01em] text-fg-2 max-[720px]:text-[20px]">
            {aboutHeadline.statement}
          </p>

          <div className="mb-9 space-y-5">
            {aboutParagraphs.slice(0, 2).map((paragraph) => (
              <p
                key={paragraph}
                className="max-w-[560px] text-[16px] leading-[1.75] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
          >
            Let&apos;s Talk <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-[360px]">
          {/* Decorative concentric rings and glow, pure CSS. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -inset-7 rounded-full border border-line-raised" />
            <div className="absolute -inset-14 rounded-full border border-line" />
            <div
              className="absolute -inset-20 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--rgb-primary) / 0.35), transparent 70%)",
              }}
            />
          </div>

          <div className="relative aspect-[2/3] overflow-hidden rounded-[28px] border border-line-raised shadow-card">
            <ProjectShot
              src="/about/avatar.png"
              alt={`Portrait of ${siteConfig.name}`}
              eager
            />
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-[70ch] space-y-5">
        {aboutParagraphs.slice(2).map((paragraph) => (
          <p key={paragraph} className="text-[16px] leading-[1.75] text-muted">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
