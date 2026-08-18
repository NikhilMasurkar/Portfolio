import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import DownloadResume from "./DownloadResume.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent, useProfile } from "../../global/ContentContext.jsx";

/**
 * The resume — and the PDF.
 *
 * There is no uploaded PDF to keep in step, because this page *is* the
 * download: the button prints it, styled by the @media print block in
 * index.css. Everything comes from Firestore, so editing experience or skills
 * in the admin panel changes both what visitors read and what they download.
 *
 * This also absorbs what /experience was going to be. Two pages listing the
 * same roles differently is two things to keep current, and the timeline still
 * lives on /about for the narrative version.
 */
function Section({ title, children }) {
  return (
    <section className="mt-14">
      <h2 className="mb-6 border-b border-line pb-2 text-xs font-semibold tracking-[0.2em] text-dim">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Resume() {
  const profile = useProfile();
  const { experience, education, skills } = useContent();

  // Grouped so related skills read together instead of as one long wall.
  const byCategory = skills.reduce((groups, skill) => {
    (groups[skill.category] ??= []).push(skill);
    return groups;
  }, {});

  return (
    <section className="relative overflow-hidden py-24" data-print="page">
      <Seo path={ROUTE_PATH.RESUME} />
      <SectionBackground variant="about" />

      <Container>
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="m-0 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
              {profile.name}
            </h1>
            <p className="mt-2 text-base text-muted">
              {profile.role} · {profile.specialism}
            </p>
            <p className="mt-2 text-sm text-meta">
              <a
                href={`mailto:${profile.email}`}
                className="transition-colors hover:text-secondary"
              >
                {profile.email}
              </a>
              {profile.phone ? ` · ${profile.phone}` : ""}
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </div>

          {/* Hidden in the PDF — a print of a page should not show its own
              download button. */}
          <div data-print="hide">
            <DownloadResume name={profile.name} />
            <p className="mt-2 max-w-[220px] text-right text-xs text-meta">
              Generated from this page, so it is always current.
            </p>
          </div>
        </header>

        {/* Only in the PDF: a printed resume needs the links spelled out,
            since the reader cannot click a chip. */}
        <p className="hidden text-sm print:mt-4 print:block">
          {profile.socials
            .filter((social) => social.href.startsWith("http"))
            .map((social) => social.href.replace(/^https?:\/\/(www\.)?/, ""))
            .join(" · ")}
        </p>

        {profile.aboutSummary && (
          <p className="mt-8 max-w-[70ch] text-[15.5px] leading-[1.75] text-muted">
            {profile.aboutSummary}
          </p>
        )}

        {experience.length > 0 && (
          <Section title="EXPERIENCE">
            <ol className="space-y-5">
              {experience.map((entry, index) => (
                <li key={entry.id} data-print="entry">
                  <Reveal delay={index * 0.06}>
                    <article className="rounded-2xl border border-line bg-surface/85 p-7 max-[720px]:p-5">
                      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-3">
                        <h3 className="m-0 font-display text-[20px] font-semibold tracking-[-0.01em]">
                          {entry.role}
                        </h3>
                        <p className="font-mono text-[12.5px] text-dim">
                          {entry.period}
                        </p>
                      </div>
                      <p className="mb-3 text-[14px] font-medium text-secondary">
                        {entry.company}
                      </p>
                      <p className="text-[14.5px] leading-[1.75] text-muted">
                        {entry.summary}
                      </p>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="SKILLS">
            <div
              data-print="entry"
              className="grid gap-6 rounded-[22px] border border-line bg-surface/85 p-8 sm:grid-cols-2 min-[900px]:grid-cols-3 max-[720px]:p-5"
            >
              {Object.entries(byCategory).map(([category, items]) => (
                <div key={category}>
                  <h3 className="mb-3 font-display text-[15px] font-semibold text-fg-2">
                    {category}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {items.map((skill) => (
                      <li
                        key={skill.id}
                        className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[12px] text-fg-4"
                      >
                        {skill.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="EDUCATION">
            <ol className="space-y-4">
              {education.map((entry) => (
                <li
                  key={entry.id}
                  data-print="entry"
                  className="rounded-2xl border border-line bg-surface/85 p-6 max-[720px]:p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="m-0 font-display text-[17px] font-semibold">
                      {entry.qualification}
                    </h3>
                    <p className="font-mono text-[12.5px] text-dim">{entry.period}</p>
                  </div>
                  <p className="mt-1 text-[14px] text-muted">{entry.institution}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}
      </Container>
    </section>
  );
}
