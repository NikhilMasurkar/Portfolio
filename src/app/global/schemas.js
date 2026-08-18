import { z } from "zod";

/**
 * The shape of everything in Firestore.
 *
 * Content used to live in version control, where a typo was a failed build.
 * It now comes from a database an admin panel writes to, so malformed data is
 * an expected runtime condition rather than a bug — every read is validated
 * here before it reaches a component.
 *
 * Ported from the previous build's schemas.ts. Two things changed: images may
 * now be S3 URLs as well as local paths, and every collection carries
 * `published` and `order` so the admin panel can stage and reorder content.
 */

/** Local asset shipped in public/, or an uploaded file on S3. */
const assetUrl = z
  .string()
  .refine(
    (v) => v.startsWith("/") || v.startsWith("https://"),
    "must be a local path starting with / or an https:// URL"
  );

const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters, digits and hyphens");

export const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const clientSchema = z.object({
  name: z.string().min(1),
  mark: z.string().length(2),
});

export const socialSchema = z.object({
  name: z.string().min(1), // accessible name
  label: z.string().min(1), // short visual mark
  href: z.string().min(1),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string().optional(),
  period: z.string().min(1),
  /** Prose, for the narrative timeline on /about. */
  summary: z.string().min(1),
  /** The same role as resume bullets. One record, two presentations. */
  bullets: z.array(z.string().min(1)).default([]),
  order: z.number().int().default(0),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  institution: z.string().min(1),
  qualification: z.string().min(1),
  period: z.string().min(1),
  grade: z.string().optional(),
  order: z.number().int().default(0),
});

/**
 * Resume-only content: the sections that exist on a CV and nowhere else.
 *
 * Separate from `profile` because the audiences differ. The site's about copy
 * is written to be read; this is written to be scanned by a recruiter and
 * parsed by an ATS. Experience and education stay in their own collections so
 * the resume and /about cannot disagree about where you worked.
 */
export const resumeSchema = z.object({
  headline: z.string().min(1),
  summary: z.string().min(1),
  achievements: z.array(z.string().min(1)).default([]),
  /** Rendered as "Label: a, b, c", two columns, in this order. */
  skillGroups: z
    .array(
      z.object({
        label: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
      })
    )
    .default([]),
  keyProjects: z
    .array(
      z.object({
        name: z.string().min(1),
        bullets: z.array(z.string().min(1)).min(1),
      })
    )
    .default([]),
  professionalDevelopment: z.array(z.string().min(1)).default([]),
});

export const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  mark: z.string().min(1).max(2),
  category: z.string().min(1).default("Core"),
  order: z.number().int().default(0),
});

export const projectCategories = ["Web", "Mobile", "Full Stack"];

/** The seven-section case study. All optional — a project may be card-only. */
const caseStudySchema = z
  .object({
    overview: z.string().optional(),
    problem: z.string().optional(),
    role: z.string().optional(),
    architecture: z.string().optional(),
    decisions: z.string().optional(),
    results: z.string().optional(),
    lessons: z.string().optional(),
  })
  .partial();

export const projectSchema = z.object({
  slug,
  name: z.string().min(1),
  category: z.enum(projectCategories),
  summary: z.string().min(1),
  image: assetUrl,
  tech: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(2018).max(2100),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  gallery: z
    .array(z.object({ src: assetUrl, caption: z.string().min(1) }))
    .default([]),
  caseStudy: caseStudySchema.default({}),
  liveUrl: z.url().optional(),
  githubUrl: z.url().optional(),
});

export const postSchema = z.object({
  slug,
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1), // Markdown
  coverUrl: assetUrl.optional(),
  tags: z.array(z.string().min(1)).default([]),
  readingMinutes: z.number().int().positive().optional(),
  publishedAt: z.string().min(1), // ISO date
  updatedAt: z.string().optional(),
  published: z.boolean().default(false),
});

export const profileSchema = z.object({
  name: z.string().min(1),
  /** Full legal name for the resume header; the site uses `name`. */
  fullName: z.string().optional(),
  role: z.string().min(1),
  specialism: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  email: z.email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  socials: z.array(socialSchema).default([]),
  stats: z.array(statSchema).default([]),
  clients: z.array(clientSchema).default([]),
  aboutHeadline: z.object({
    lead: z.string().min(1),
    statement: z.string().min(1),
  }),
  aboutParagraphs: z.array(z.string().min(1)).default([]),
  aboutSummary: z.string().min(1),
  avatarUrl: assetUrl.optional(),
  resumeUrl: assetUrl.optional(),
  resumeUpdatedAt: z.string().optional(),
});

/** Contact submissions. Written by the server only — never by the browser. */
export const messageSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email().max(200),
  subject: z.string().min(1).max(150),
  message: z.string().min(1).max(5000),
});

/* -------------------------------------------------------------------------
 * Parsing helpers
 *
 * The asymmetry between these two is deliberate and is the whole point.
 * ---------------------------------------------------------------------- */

/**
 * Parse a collection, dropping documents that fail.
 *
 * One malformed project must not take down the entire site, so a bad
 * document is skipped and logged rather than thrown. That trade is only
 * acceptable because it is loud: the log line names the collection, the
 * document and the failing fields, so the admin panel can surface it.
 *
 * @returns {{ items: object[], errors: {id: string, issues: string[]}[] }}
 */
export function parseList(schema, docs, label = "collection") {
  const items = [];
  const errors = [];

  for (const doc of docs) {
    const result = schema.safeParse(doc);
    if (result.success) {
      items.push(result.data);
      continue;
    }
    const issues = result.error.issues.map(
      (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
    );
    errors.push({ id: doc?.id ?? doc?.slug ?? "(unknown)", issues });
    console.error(
      `[content] skipping invalid ${label} document ${
        doc?.id ?? doc?.slug ?? "(unknown)"
      }: ${issues.join("; ")}`
    );
  }

  return { items, errors };
}

/**
 * Parse a singleton, falling back rather than skipping.
 *
 * There is no "skip" for the profile: dropping it would render a site with no
 * name, no email and no about copy. A validation failure here returns the
 * checked-in fallback so the page is wrong-but-working instead of broken.
 */
export function parseOne(schema, doc, fallback, label = "document") {
  const result = schema.safeParse(doc);
  if (result.success) return result.data;

  const issues = result.error.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`
  );
  console.error(
    `[content] ${label} failed validation, using fallback: ${issues.join("; ")}`
  );
  return fallback;
}
