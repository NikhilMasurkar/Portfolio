import {
  projectSchema,
  postSchema,
  profileSchema,
  experienceSchema,
  educationSchema,
  skillSchema,
  parseList,
  parseOne,
} from "../src/app/global/schemas.js";
import {
  FALLBACK_PROFILE,
  FALLBACK_CONTENT,
} from "../src/app/global/fallbackContent.js";

/**
 * All published content, cached in module scope.
 *
 * WHY A TTL AND NOT A LISTENER
 * An always-on server would hold Firestore onSnapshot listeners and be exactly
 * fresh. Netlify Functions are ephemeral — there is no process to hold one —
 * so this polls instead. Warm invocations reuse the cache, which means a
 * handful of Firestore reads per minute per warm instance rather than one per
 * visitor, and content edits appear within TTL_MS.
 *
 * THIS MODULE IS THE SEAM. Moving to an always-on Node host later means
 * replacing the body of load() with listeners. Nothing outside this file
 * knows how content arrives, so nothing else changes.
 */

export const TTL_MS = 60_000;

let cache = null;
let cachedAt = 0;

/** Firestore stores the slug as the document id for these. */
const SLUG_KEYED = new Set(["projects", "posts"]);

async function readCollection(db, name, schema) {
  const snapshot = await db.collection(name).get();
  const idField = SLUG_KEYED.has(name) ? "slug" : "id";

  const docs = snapshot.docs.map((doc) => ({
    [idField]: doc.id,
    ...doc.data(),
  }));

  return parseList(schema, docs, name).items;
}

/** Published only, ordered by `order` then by the collection's natural key. */
const publishedProjects = (projects) =>
  projects
    .filter((p) => p.published)
    .sort((a, b) => a.order - b.order || b.year - a.year);

const publishedPosts = (posts) =>
  posts
    .filter((p) => p.published)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

const ordered = (rows) => [...rows].sort((a, b) => a.order - b.order);

async function load(db) {
  const [profileDoc, projects, posts, experience, education, skills] =
    await Promise.all([
      db.collection("profile").doc("main").get(),
      readCollection(db, "projects", projectSchema),
      readCollection(db, "posts", postSchema),
      readCollection(db, "experience", experienceSchema),
      readCollection(db, "education", educationSchema),
      readCollection(db, "skills", skillSchema),
    ]);

  /*
   * A missing or malformed profile falls back rather than being dropped —
   * without it there is no name, email or about copy anywhere on the site.
   *
   * The two cases are logged differently on purpose. "Not seeded yet" is the
   * expected state before the seed script runs; "failed validation" means a
   * real document is wrong and needs fixing. Reporting both as a validation
   * failure sends you looking for a schema bug that is not there.
   */
  let profile;
  if (profileDoc.exists) {
    profile = parseOne(
      profileSchema,
      profileDoc.data(),
      FALLBACK_PROFILE,
      "profile/main"
    );
  } else {
    console.warn("[content] profile/main does not exist; using fallback");
    profile = FALLBACK_PROFILE;
  }

  return {
    profile,
    projects: publishedProjects(projects),
    posts: publishedPosts(posts),
    experience: ordered(experience),
    education: ordered(education),
    skills: ordered(skills),
    degraded: false,
  };
}

/**
 * @param {object}   opts
 * @param {object}   opts.db   Firestore-shaped client. Injected so this module
 *                             is testable without credentials.
 * @param {number}   opts.now  Clock, injected for the same reason.
 */
export async function getContent({ db, now = Date.now() } = {}) {
  if (cache && now - cachedAt < TTL_MS) return cache;

  // Firestore not configured yet. A supported state, distinct from a failure:
  // db.js has already said so once, so this stays quiet rather than logging a
  // stack trace on every render.
  if (!db) return FALLBACK_CONTENT;

  try {
    cache = await load(db);
    cachedAt = now;
    return cache;
  } catch (err) {
    /*
     * Firestore unreachable: bad credentials, quota, network. Serving stale
     * content beats serving none — the alternative is this throwing up into
     * the SSR handler, whose catch returns the empty SPA shell, which is a
     * site that looks fine in a browser and is blank to every crawler.
     *
     * cachedAt is deliberately not advanced, so the next request retries
     * rather than holding stale content for another full TTL.
     */
    console.error("[content] Firestore read failed:", err);
    if (cache) {
      console.error("[content] serving stale cache from", new Date(cachedAt));
      return cache;
    }
    console.error("[content] no cache to fall back on — serving fallback");
    return FALLBACK_CONTENT;
  }
}

/** Test seam. Not used in production. */
export function __resetCache() {
  cache = null;
  cachedAt = 0;
}
