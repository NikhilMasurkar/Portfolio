import { doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase.js";
import { profile, projects, skills, FEATURED_ORDER } from "./seedData.js";
import {
  resume,
  experience,
  education,
  contactPatch,
} from "./resumeSeedData.js";
import {
  profileSchema,
  projectSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  resumeSchema,
} from "../global/schemas.js";

/**
 * Writes the previous build's content into Firestore.
 *
 * Runs in the browser, in an already-authenticated admin session. There is no
 * service account on this project by design, so a headless script has no way
 * to authenticate — and this is the one operation that genuinely needs write
 * access.
 *
 * Idempotent: every document is written by a fixed id (the slug, or an
 * explicit id), so running twice overwrites rather than duplicating.
 */

/** Document order: featured work first, in FEATURED_ORDER, then newest. */
function orderOf(project) {
  const featuredIndex = FEATURED_ORDER.indexOf(project.slug);
  if (featuredIndex !== -1) return featuredIndex;
  // Push the rest below every featured item, newest first.
  return 100 + (2100 - project.year);
}

/**
 * Validate before writing, using the same schemas the server validates reads
 * with. Seeding a document that the site will later refuse to render is a
 * failure that would only show up as a silently missing project.
 */
function check(schema, value, label) {
  const result = schema.safeParse(value);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    throw new Error(`${label} failed validation — ${issues}`);
  }
  return result.data;
}

export async function seedContent(onProgress = () => {}) {
  const lines = [];
  const log = (line) => {
    lines.push(line);
    onProgress(line);
  };

  const batch = writeBatch(db);

  // Validate everything first, so a bad document aborts before any write
  // rather than leaving Firestore half-seeded.
  // Phone and location come from the resume header, which is the only place
  // they were recorded.
  const fullProfile = { ...profile, ...contactPatch };
  check(profileSchema, fullProfile, "profile/main");
  check(resumeSchema, resume, "resume/main");

  const preparedEducation = education.map((entry) =>
    check(educationSchema, entry, `education/${entry.id}`)
  );

  const preparedProjects = projects.map((project) => {
    const value = {
      ...project,
      published: true,
      order: orderOf(project),
      gallery: project.gallery ?? [],
      caseStudy: project.caseStudy ?? {},
    };
    // slug lives in the document id, not the body — one source, no drift.
    const { slug, ...body } = check(projectSchema, value, `projects/${project.slug}`);
    return { slug, body };
  });

  const preparedExperience = experience.map((entry) =>
    check(experienceSchema, entry, `experience/${entry.id}`)
  );

  const preparedSkills = skills.map((skill, index) => {
    const id = skill.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return check(skillSchema, { id, order: index, ...skill }, `skills/${id}`);
  });

  log("Validated all documents.");

  batch.set(doc(db, "profile", "main"), fullProfile);
  log("profile/main");

  batch.set(doc(db, "resume", "main"), resume);
  log("resume/main");

  for (const { slug, body } of preparedProjects) {
    batch.set(doc(db, "projects", slug), body);
  }
  log(`${preparedProjects.length} projects`);

  for (const { id, ...body } of preparedExperience) {
    batch.set(doc(db, "experience", id), body);
  }
  log(`${preparedExperience.length} experience entries`);

  for (const { id, ...body } of preparedSkills) {
    batch.set(doc(db, "skills", id), body);
  }
  log(`${preparedSkills.length} skills`);

  for (const { id, ...body } of preparedEducation) {
    batch.set(doc(db, "education", id), body);
  }
  log(`${preparedEducation.length} education entries`);

  // One batch, so a permissions failure leaves Firestore untouched rather than
  // partially written.
  await batch.commit();
  log("Committed.");

  return lines;
}
