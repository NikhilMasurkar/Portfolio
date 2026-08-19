import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
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
    <Box>
      <Box className="grid grid-cols-[1.05fr_.95fr] items-center gap-16 max-[900px]:grid-cols-1">
        <Box>
          <Typography
            variant="h1"
            className="m-0 mb-5 font-display text-[46px] font-bold leading-[1.15] tracking-[-0.02em] max-[720px]:text-[32px]"
          >
            {before}
            <Box component="span" className="bg-[image:var(--gradient-04)] bg-clip-text text-transparent">
              {firstName}
            </Box>
            {after}
          </Typography>

          <Typography
            variant="h2"
            className="mb-7 font-display text-[26px] font-medium leading-[1.3] tracking-[-0.01em] text-fg-2 max-[720px]:text-[20px]"
          >
            {aboutHeadline.statement}
          </Typography>

          <Box className="mb-9 space-y-5">
            {aboutParagraphs.slice(0, 2).map((paragraph) => (
              <Typography
                key={paragraph}
                className="max-w-[560px] text-[16px] leading-[1.75] text-muted"
              >
                {paragraph}
              </Typography>
            ))}
          </Box>

          {/* Gated like every other CTA — no link to a page that does not exist. */}
          {ROUTE_PATH.CONTACT ? (
            <Button
              component={Link}
              to={ROUTE_PATH.CONTACT}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </Button>
          ) : (
            <Button
              component="a"
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </Button>
          )}
        </Box>

        <Box className="relative mx-auto w-full max-w-[360px]">
          {/* Decorative concentric rings and glow, pure CSS. */}
          <Box aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <Box className="absolute -inset-7 rounded-full border border-line-raised" />
            <Box className="absolute -inset-14 rounded-full border border-line" />
            <Box
              className="absolute -inset-20 rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgb(var(--rgb-primary) / 0.35), transparent 70%)",
              }}
            />
          </Box>

          <Box className="relative aspect-[2/3] overflow-hidden rounded-[28px] border border-line-raised shadow-card">
            <ProjectShot
              src={profile.avatarUrl || "/about/avatar.png"}
              alt={`Portrait of ${profile.name}`}
              eager
              width={720}
              height={1080}
            />
          </Box>
        </Box>
      </Box>

      {/* 70ch keeps the long-form prose at a readable measure. */}
      <Box className="mt-16 max-w-[70ch] space-y-5">
        {aboutParagraphs.slice(2).map((paragraph) => (
          <Typography key={paragraph} className="text-[16px] leading-[1.75] text-muted">
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}
