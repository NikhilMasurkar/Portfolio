import React from "react";

/**
 * The resume document itself — one layout, used twice.
 *
 * /resume renders it read-only; /resume/edit renders the same component with
 * an editable `Text`. Keeping a single copy is the whole point: two layouts
 * would drift, and the one people send to recruiters is the one that would
 * quietly fall behind.
 *
 * `Text` is injected rather than imported so the editing implementation —
 * and everything it drags in — stays out of the public bundle.
 *
 * Raw hex on purpose: the site's tokens describe a dark UI, this is a print
 * document with its own palette.
 */

const INK = "#1a1a1a";
const ACCENT = "#3e5f8a";
const MUTED = "#555";

/** Read-only default. Edit mode swaps in something that writes back. */
const PlainText = ({ value }) => <>{value}</>;

/**
 * Defined at module scope, not inside ResumeSheet. A component created during
 * render gets a new identity every time, so React remounts every bullet — and
 * a remount while typing destroys the caret.
 */
function Bullets({ items, onItemChange, Text }) {
  return (
    <ul className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[13.5px] leading-[1.45]">
          <span aria-hidden className="shrink-0">
            •
          </span>
          <span className="flex-1">
            <Text value={item} onChange={onItemChange(index)} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function SectionHeading({ children }) {
  return (
    <h2
      className="mb-2 mt-6 border-b pb-1 text-[15px] font-bold uppercase tracking-[0.02em]"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </h2>
  );
}

export default function ResumeSheet({
  profile,
  resume,
  experience,
  education,
  Text = PlainText,
  // Only edit mode supplies these; read-only never calls them.
  onChangeResume = () => {},
  onChangeExperience = () => {},
  onChangeEducation = () => {},
}) {
  const linkedin = profile.socials?.find((s) => /linkedin/i.test(s.name));

  const setResume = (key) => (value) => onChangeResume({ ...resume, [key]: value });

  const setList = (key, index) => (value) => {
    const next = [...(resume?.[key] ?? [])];
    next[index] = value;
    onChangeResume({ ...resume, [key]: next });
  };

  return (
    <article
      data-print="sheet"
      className="mx-auto max-w-[820px] bg-white px-14 py-12 shadow-card max-[720px]:px-6 max-[720px]:py-8"
      style={{ color: INK, fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <header className="text-center">
        <h1 className="m-0 text-[26px] font-bold uppercase tracking-[0.02em]">
          {profile.fullName || profile.name}
        </h1>

        {resume?.headline !== undefined && (
          <p className="mt-1 text-[14px]" style={{ color: ACCENT }}>
            <Text value={resume.headline} onChange={setResume("headline")} />
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

      {resume?.summary !== undefined && (
        <>
          <SectionHeading>Professional Summary</SectionHeading>
          <p className="text-[13.5px] leading-[1.45]">
            <Text value={resume.summary} onChange={setResume("summary")} multiline />
          </p>
        </>
      )}

      {resume?.achievements?.length > 0 && (
        <>
          <SectionHeading>Key Achievements</SectionHeading>
          <Bullets
            Text={Text}
            items={resume.achievements}
            onItemChange={(i) => setList("achievements", i)}
          />
        </>
      )}

      {resume?.skillGroups?.length > 0 && (
        <>
          <SectionHeading>Technical Skills</SectionHeading>
          {/* Two columns filling top to bottom, as the PDF does. */}
          <div className="gap-x-8 min-[720px]:columns-2">
            {resume.skillGroups.map((group, index) => (
              <p
                key={index}
                className="mb-1.5 break-inside-avoid text-[13.5px] leading-[1.45]"
              >
                <strong>{group.label}:</strong>{" "}
                <Text
                  value={group.items.join(", ")}
                  onChange={(value) => {
                    const next = [...resume.skillGroups];
                    next[index] = {
                      ...group,
                      items: value.split(",").map((s) => s.trim()).filter(Boolean),
                    };
                    onChangeResume({ ...resume, skillGroups: next });
                  }}
                />
              </p>
            ))}
          </div>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHeading>Professional Experience</SectionHeading>
          {experience.map((entry, entryIndex) => (
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
              {entry.bullets.length > 0 ? (
                <Bullets
                  Text={Text}
                  items={entry.bullets}
                  onItemChange={(bulletIndex) => (value) => {
                    const bullets = [...entry.bullets];
                    bullets[bulletIndex] = value;
                    onChangeExperience(entryIndex, { ...entry, bullets });
                  }}
                />
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
          {resume.keyProjects.map((project, projectIndex) => (
            <div key={projectIndex} data-print="entry" className="mb-3 last:mb-0">
              <h3 className="m-0 mb-1 text-[13.5px] font-bold">{project.name}</h3>
              <Bullets
                Text={Text}
                items={project.bullets}
                onItemChange={(bulletIndex) => (value) => {
                  const next = [...resume.keyProjects];
                  const bullets = [...project.bullets];
                  bullets[bulletIndex] = value;
                  next[projectIndex] = { ...project, bullets };
                  onChangeResume({ ...resume, keyProjects: next });
                }}
              />
            </div>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHeading>Education</SectionHeading>
          {education.map((entry, entryIndex) => (
            <div key={entry.id} data-print="entry" className="mb-2.5 last:mb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="m-0 text-[13.5px] font-bold">
                  <Text
                    value={entry.qualification}
                    onChange={(value) =>
                      onChangeEducation(entryIndex, { ...entry, qualification: value })
                    }
                  />
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
          <Bullets
            Text={Text}
            items={resume.professionalDevelopment}
            onItemChange={(i) => setList("professionalDevelopment", i)}
          />
        </>
      )}
    </article>
  );
}
