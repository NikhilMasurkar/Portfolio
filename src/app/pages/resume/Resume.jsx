import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import DownloadResume from "./DownloadResume.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent, useProfile } from "../../global/ContentContext.jsx";

/**
 * The resume, rendered as the document itself.
 *
 * This page is deliberately NOT in the site's dark theme. It is a white sheet
 * on the dark page, laid out to match the PDF that already circulates with
 * recruiters — because the download is this page printed, so what is on screen
 * has to be what comes out. A dark-themed page with a separate print
 * stylesheet would mean two layouts and no way to see the real one before
 * sending it.
 *
 * The colours below are raw hex on purpose. The design tokens describe a dark
 * UI; this is a print document with its own palette, and the AGENTS.md rule
 * about tokens is about the site's own surfaces.
 */

const INK = "#1a1a1a";
const ACCENT = "#3e5f8a"; // section headings, dates, links
const MUTED = "#555";

function SectionHeading({ children }) {
  return (
    <h2
      className="mb-2 mt-6 border-b pb-1 text-[15px] font-bold uppercase tracking-[0.02em] first:mt-0"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </h2>
  );
}

/** The PDF's bullet: a round marker with a hanging indent. */
function Bullets({ items, className = "" }) {
  return (
    <ul className={`space-y-1 ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[13.5px] leading-[1.45]">
          <span aria-hidden className="shrink-0">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Resume() {
  const profile = useProfile();
  const { resume, experience, education } = useContent();

  const linkedin = profile.socials.find((s) => /linkedin/i.test(s.name));

  return (
    <section className="py-16 max-[720px]:py-8" data-print="page">
      <Seo path={ROUTE_PATH.RESUME} />

      <Container>
        {/* Excluded from the PDF — a printed resume should not carry its own
            download button. */}
        <div
          data-print="hide"
          className="mx-auto mb-6 flex max-w-[820px] flex-wrap items-center justify-between gap-4"
        >
          <p className="text-sm text-muted">
            Generated from this page — always matches the site.
          </p>
          <DownloadResume name={profile.name} />
        </div>

        {/*
          The sheet. 820px is A4 at roughly 96dpi, so the on-screen line breaks
          are close to the printed ones.
        */}
        <article
          data-print="sheet"
          className="mx-auto max-w-[820px] bg-white px-14 py-12 shadow-card max-[720px]:px-6 max-[720px]:py-8"
          style={{ color: INK, fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <header className="text-center">
            <h1 className="m-0 text-[26px] font-bold uppercase tracking-[0.02em]">
              {profile.fullName || profile.name}
            </h1>

            {resume?.headline && (
              <p className="mt-1 text-[14px]" style={{ color: ACCENT }}>
                {resume.headline}
              </p>
            )}

            <p className="mt-1 text-[13px]">
              {profile.phone && <span>{profile.phone}&nbsp; | &nbsp;</span>}
              <a href={`mailto:${profile.email}`} style={{ color: INK }}>
                {profile.email}
              </a>
              {linkedin && (
                <>
                  <span>&nbsp; | &nbsp;</span>
                  <a
                    href={linkedin.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    style={{ color: ACCENT }}
                  >
                    {linkedin.href.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </>
              )}
            </p>

            {profile.location && (
              <p className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
                {profile.location}
              </p>
            )}
          </header>

          {resume?.summary && (
            <>
              <SectionHeading>Professional Summary</SectionHeading>
              <p className="text-[13.5px] leading-[1.45]">{resume.summary}</p>
            </>
          )}

          {resume?.achievements?.length > 0 && (
            <>
              <SectionHeading>Key Achievements</SectionHeading>
              <Bullets items={resume.achievements} />
            </>
          )}

          {resume?.skillGroups?.length > 0 && (
            <>
              <SectionHeading>Technical Skills</SectionHeading>
              {/* Two columns that fill top-to-bottom, as the PDF does. */}
              <div className="gap-x-8 min-[720px]:columns-2">
                {resume.skillGroups.map((group) => (
                  <p
                    key={group.label}
                    className="mb-1.5 break-inside-avoid text-[13.5px] leading-[1.45]"
                  >
                    <strong>{group.label}:</strong> {group.items.join(", ")}
                  </p>
                ))}
              </div>
            </>
          )}

          {experience.length > 0 && (
            <>
              <SectionHeading>Professional Experience</SectionHeading>
              {experience.map((entry) => (
                <div key={entry.id} data-print="entry" className="mb-4 last:mb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="m-0 text-[14.5px] font-bold">{entry.role}</h3>
                    <p className="text-[13px] font-bold" style={{ color: ACCENT }}>
                      {entry.period}
                    </p>
                  </div>
                  <p className="mb-1.5 text-[13.5px] font-semibold italic">
                    {entry.company}
                    {entry.location ? `, ${entry.location}` : ""}
                  </p>
                  {/* Falls back to the prose summary if a role has no bullets
                      yet, so an entry added in the admin panel is never blank. */}
                  {entry.bullets.length > 0 ? (
                    <Bullets items={entry.bullets} />
                  ) : (
                    <p className="text-[13.5px] leading-[1.45]">{entry.summary}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {resume?.keyProjects?.length > 0 && (
            <>
              <SectionHeading>Key Projects &amp; Accomplishments</SectionHeading>
              {resume.keyProjects.map((project) => (
                <div key={project.name} data-print="entry" className="mb-3 last:mb-0">
                  <h3 className="m-0 mb-1 text-[13.5px] font-bold">{project.name}</h3>
                  <Bullets items={project.bullets} />
                </div>
              ))}
            </>
          )}

          {education.length > 0 && (
            <>
              <SectionHeading>Education</SectionHeading>
              {education.map((entry) => (
                <div key={entry.id} data-print="entry" className="mb-2.5 last:mb-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="m-0 text-[13.5px] font-bold">
                      {entry.qualification}
                    </h3>
                    <p className="text-[13px]" style={{ color: ACCENT }}>
                      {entry.period}
                    </p>
                  </div>
                  <p className="text-[13px] italic" style={{ color: MUTED }}>
                    {entry.institution}
                    {entry.grade ? `  |  Grade: ${entry.grade}` : ""}
                  </p>
                </div>
              ))}
            </>
          )}

          {resume?.professionalDevelopment?.length > 0 && (
            <>
              <SectionHeading>Professional Development</SectionHeading>
              <Bullets items={resume.professionalDevelopment} />
            </>
          )}
        </article>
      </Container>
    </section>
  );
}
