import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent, useProfile } from "../../global/ContentContext.jsx";

/**
 * The resume, rendered from Firestore rather than embedded as a PDF viewer.
 *
 * A PDF in an <iframe> is unreadable on a phone, invisible to search engines
 * and unusable with a screen reader. The page is the resume; the PDF is a
 * download for anyone who needs to file it.
 */
function Section({ title, children }) {
  return (
    <section className="mt-16">
      <h2 className="mb-8 text-xs font-semibold tracking-[0.2em] text-dim">
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
    <section className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.RESUME} />
      <SectionBackground variant="about" />

      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-dim">
              RESUME
            </p>
            <h1 className="m-0 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
              {profile.name}
            </h1>
            <p className="mt-2 text-base text-muted">
              {profile.role} · {profile.specialism}
            </p>
            <p className="mt-1 text-sm text-meta">
              <a
                href={`mailto:${profile.email}`}
                className="transition-colors hover:text-secondary"
              >
                {profile.email}
              </a>
              {profile.location ? ` · ${profile.location}` : ""}
            </p>
          </div>

          {/*
            Only offered when a PDF has actually been uploaded. A download
            button that 404s is worse than no button — it reads as a broken
            site at the exact moment someone is trying to take you seriously.
          */}
          {profile.resumeUrl && (
            <div className="text-right">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-3.5 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
              >
                Download PDF <span aria-hidden>↓</span>
              </a>
              {profile.resumeUpdatedAt && (
                <p className="mt-2 text-xs text-meta">
                  Updated {profile.resumeUpdatedAt}
                </p>
              )}
            </div>
          )}
        </div>

        {experience.length > 0 && (
          <Section title="EXPERIENCE">
            <ol className="space-y-6">
              {experience.map((entry, index) => (
                <li key={entry.id}>
                  <Reveal delay={index * 0.06}>
                    <article className="rounded-2xl border border-line bg-surface/85 p-7">
                      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
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
            <Reveal>
              <div className="grid gap-6 rounded-[22px] border border-line bg-surface/85 p-8 sm:grid-cols-2 min-[900px]:grid-cols-3">
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
            </Reveal>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="EDUCATION">
            <ol className="space-y-4">
              {education.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-line bg-surface/85 p-6"
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
