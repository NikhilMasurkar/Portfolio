import React from "react";
import { experienceSchema, educationSchema } from "../../global/schemas.js";
import CollectionEditor from "./CollectionEditor.jsx";

/**
 * Admin navigation, organised by the site page each section feeds.
 *
 * Grouped this way on purpose. The underlying storage is by data type —
 * profile, resume, experience — but nobody sits down to "edit the experience
 * collection"; they sit down to fix something they saw on a page. Every entry
 * therefore names where its changes show up, and anything appearing in more
 * than one place says so, because that is the surprise worth warning about.
 */

export function ExperienceEditor() {
  return (
    <CollectionEditor
      collection="experience"
      schema={experienceSchema}
      hint="Each role appears twice: the summary is the narrative version on /about, the bullets are the resume version. One record, so the two can never disagree about where you worked."
      titleOf={(row) => `${row.role || "New role"} — ${row.company || ""}`}
      blank={{ role: "", company: "", location: "", period: "", summary: "", bullets: [] }}
      fields={[
        { key: "id", label: "ID", hint: "Document key, e.g. avinash-2026. Lowercase and hyphens." },
        { key: "role", label: "Role" },
        { key: "company", label: "Company" },
        { key: "location", label: "Location", hint: "Shown on the resume after the company." },
        { key: "period", label: "Period", hint: "e.g. 04/2026 - Present" },
        {
          key: "summary",
          label: "Summary (prose)",
          type: "text",
          hint: "Used by the timeline on /about.",
        },
        {
          key: "bullets",
          label: "Bullets (resume)",
          type: "list",
          addLabel: "Add bullet",
          hint: "Used by /resume and the PDF. A role with no bullets falls back to the summary.",
        },
      ]}
    />
  );
}

export function EducationEditor() {
  return (
    <CollectionEditor
      collection="education"
      schema={educationSchema}
      hint="Shown in the Education section of /resume and the PDF."
      titleOf={(row) => row.qualification || "New qualification"}
      blank={{ qualification: "", institution: "", period: "", grade: "" }}
      fields={[
        { key: "id", label: "ID", hint: "Document key, e.g. be-mechanical." },
        { key: "qualification", label: "Qualification" },
        { key: "institution", label: "Institution" },
        { key: "period", label: "Period", hint: "e.g. 2016 - 2019" },
        { key: "grade", label: "Grade", hint: "Optional." },
      ]}
    />
  );
}

/**
 * The nav. `page` names the public URL each section drives, so it is obvious
 * which edit lands where.
 */
export const SECTIONS = [
  { label: "Overview", path: "/admin", page: null },
  { label: "Profile", path: "/admin/profile", page: "Home · About · Contact · footer" },
  { label: "Projects", path: "/admin/projects", page: "Home · /projects · case studies" },
  { label: "Resume", path: "/admin/resume", page: "/resume + the PDF" },
  { label: "Experience", path: "/admin/experience", page: "/about · /resume" },
  { label: "Education", path: "/admin/education", page: "/resume" },
];
