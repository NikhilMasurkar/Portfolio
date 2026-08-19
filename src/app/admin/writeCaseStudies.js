import { doc, writeBatch } from "firebase/firestore";
import { db } from "./firebase.js";
import { caseStudies } from "./caseStudyData.js";

/**
 * Writes the prepared case studies into the projects that already exist.
 *
 * Deliberately NOT part of the main seed. That one rewrites whole documents,
 * so running it again to get case studies would also overwrite the profile,
 * the resume and anything edited since. This touches one field per project
 * and leaves the rest alone — `merge: true` is what makes that true.
 *
 * Skips any slug with no prose rather than writing an empty object, so a
 * project without a case study keeps whatever it has.
 */
export async function writeCaseStudies(onProgress = () => {}) {
  const lines = [];
  const log = (line) => {
    lines.push(line);
    onProgress(line);
  };

  const batch = writeBatch(db);
  let count = 0;

  for (const [slug, caseStudy] of Object.entries(caseStudies)) {
    const filled = Object.entries(caseStudy).filter(([, v]) => v?.trim());
    if (filled.length === 0) continue;

    batch.set(doc(db, "projects", slug), { caseStudy }, { merge: true });
    log(`${slug} — ${filled.length} sections`);
    count += 1;
  }

  if (count === 0) {
    log("Nothing to write.");
    return lines;
  }

  await batch.commit();
  log(`Committed ${count} case studies.`);
  return lines;
}
