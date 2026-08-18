import React from "react";
import { Link } from "react-router";
import ProjectShot from "../../widgets/ProjectShot.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function AboutHero() {
  const profile = useProfile();
  const { aboutHeadline, aboutParagraphs } = profile;

  // The gradient applies to the name only, not the whole greeting. Splitting
  // on the first name keeps that correct if the copy is reworded in the admin
  // panel, rather than hardcoding the sentence structure here.
  const firstName = profile.name.split(" ")[0];
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

          {/* Gated like every other CTA — no link to a page that does not exist. */}
          {ROUTE_PATH.CONTACT ? (
            <Link
              to={ROUTE_PATH.CONTACT}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </Link>
          ) : (
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </a>
          )}
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
              src={profile.avatarUrl || "/about/avatar.png"}
              alt={`Portrait of ${profile.name}`}
              eager
              width={720}
              height={1080}
            />
          </div>
        </div>
      </div>

      {/* 70ch keeps the long-form prose at a readable measure. */}
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
