import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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
    <Box component="ul" className="space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5 text-[13.5px] leading-[1.45]">
          <Box component="span" aria-hidden className="shrink-0">
            •
          </Box>
          <Box component="span" className="flex-1">
            <Text value={item} onChange={onItemChange(index)} />
          </Box>
        </li>
      ))}
    </Box>
  );
}

function SectionHeading({ children }) {
  return (
    <Typography
      variant="h2"
      className="mb-2 mt-6 border-b pb-1 text-[15px] font-bold uppercase tracking-[0.02em]"
      style={{ color: ACCENT, borderColor: ACCENT }}
    >
      {children}
    </Typography>
  );
}

export default function ResumeSheet({
  profile = {},
  resume = {},
  experience = [],
  education = [],
  Text = PlainText,
  // Only edit mode supplies these; read-only never calls them.
  onChangeResume = () => {},
  onChangeExperience = () => {},
  onChangeEducation = () => {},
}) {
  const p = profile || {};
  const fullName = p.fullName || (p.name && p.name !== "Nikhil Masurkar" ? p.name : "Nikhil Dilip Masurkar");
  const phone = p.phone || "+91 7385208601";
  const email = p.email || "nikhildmasurkar@gmail.com";
  const location = (!p.location || p.location === "India") ? "Hinganghat, Wardha, Maharashtra 442301, India" : p.location;
  const linkedin = p.socials?.find((s) => /linkedin/i.test(s.name));
  const linkedinHref = linkedin?.href || "https://www.linkedin.com/in/nikhil-masurkar";
  const headline = resume?.headline ?? "React Developer  |  React Native  |  Mobile Application Development";

  const setResume = (key) => (value) => onChangeResume({ ...resume, [key]: value });

  const setList = (key, index) => (value) => {
    const next = [...(resume?.[key] ?? [])];
    next[index] = value;
    onChangeResume({ ...resume, [key]: next });
  };

  return (
    <Box
      component="article"
      data-print="sheet"
      className="mx-auto max-w-[820px] bg-white px-14 py-12 shadow-card max-[720px]:px-6 max-[720px]:py-8"
      style={{ color: INK, fontFamily: "Arial, Helvetica, sans-serif" }}
      /*
       * Typography inside this sheet inherits the document's face instead of
       * the site's. This is a printed resume, not a page of the site — MUI's
       * variants would quietly swap Arial for Inter and change every line
       * break in the PDF a recruiter receives.
       */
      sx={{ "& .MuiTypography-root": { fontFamily: "inherit" } }}
    >
      <Box data-print="resume-header" className="text-center">
        <Typography variant="h1" className="m-0 text-[26px] font-bold uppercase tracking-[0.02em]">
          {fullName}
        </Typography>

        <Typography className="mt-1 text-[14px]" style={{ color: ACCENT }}>
          <Text value={headline} onChange={setResume("headline")} />
        </Typography>

        <Typography className="mt-1 text-[13px]">
          {phone && <span>{phone}&nbsp; | &nbsp;</span>}
          <a href={`mailto:${email}`} style={{ color: INK }}>
            {email}
          </a>
          {linkedinHref && (
            <>
              <span>&nbsp; | &nbsp;</span>
              <a
                href={linkedinHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
                style={{ color: ACCENT }}
              >
                {linkedinHref.replace(/^https?:\/\/(www\.)?/, "")}
              </a>
            </>
          )}
        </Typography>

        {location && (
          <Typography className="mt-0.5 text-[13px]" style={{ color: MUTED }}>
            {location}
          </Typography>
        )}
      </Box>

      {resume?.summary !== undefined && (
        <>
          <SectionHeading>Professional Summary</SectionHeading>
          <Typography className="text-[13.5px] leading-[1.45]">
            <Text value={resume.summary} onChange={setResume("summary")} multiline />
          </Typography>
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
          {/* Two equal columns (6-6 grid), always side by side in the PDF. */}
          <Box className="grid grid-cols-2 gap-x-8">
            {resume.skillGroups.map((group, index) => (
              <Typography
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
              </Typography>
            ))}
          </Box>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHeading>Professional Experience</SectionHeading>
          {experience.map((entry, entryIndex) => (
            <Box key={entry.id} data-print="entry" className="mb-4 last:mb-0">
              <Box className="flex flex-wrap items-baseline justify-between gap-x-4">
                <Typography variant="h3" className="m-0 text-[14.5px] font-bold">
                  {entry.role}
                </Typography>
                <Typography className="text-[13px] font-bold" style={{ color: ACCENT }}>
                  {entry.period}
                </Typography>
              </Box>
              <Typography className="mb-1.5 text-[13.5px] font-semibold italic">
                {entry.company}
                {entry.location ? `, ${entry.location}` : ""}
              </Typography>
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
                <Typography className="text-[13.5px] leading-[1.45]">
                  {entry.summary}
                </Typography>
              )}
            </Box>
          ))}
        </>
      )}

      {resume?.keyProjects?.length > 0 && (
        <>
          <SectionHeading>Key Projects &amp; Accomplishments</SectionHeading>
          {resume.keyProjects.map((project, projectIndex) => (
            <Box key={projectIndex} data-print="entry" className="mb-3 last:mb-0">
              <Typography variant="h3" className="m-0 mb-1 text-[13.5px] font-bold">
                {project.name}
              </Typography>
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
            </Box>
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHeading>Education</SectionHeading>
          {education.map((entry, entryIndex) => (
            <Box key={entry.id} data-print="entry" className="mb-2.5 last:mb-0">
              <Box className="flex flex-wrap items-baseline justify-between gap-x-4">
                <Typography variant="h3" className="m-0 text-[13.5px] font-bold">
                  <Text
                    value={entry.qualification}
                    onChange={(value) =>
                      onChangeEducation(entryIndex, { ...entry, qualification: value })
                    }
                  />
                </Typography>
                <Typography className="text-[13px]" style={{ color: ACCENT }}>
                  {entry.period}
                </Typography>
              </Box>
              <Typography className="text-[13px] italic" style={{ color: MUTED }}>
                {entry.institution}
                {entry.grade ? `  |  Grade: ${entry.grade}` : ""}
              </Typography>
            </Box>
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
    </Box>
  );
}
