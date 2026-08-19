/**
 * A stable React key for an editable row.
 *
 * THE BUG THIS EXISTS TO PREVENT. The editors used to key their accordions on
 * a field the form edits — `key={row.slug || index}`, and `key={row.id ||
 * index}` where the id is itself an input. A React key is an identity claim:
 * change it and React does not re-render the element, it throws the old one
 * away and mounts a new one. So every keystroke in the slug field destroyed
 * the accordion mid-edit, which collapsed it and took the focus with it. You
 * could type exactly one character per click.
 *
 * The key has to be fixed for the lifetime of the row, which rules out every
 * field on the row, because all of them are editable. So it is assigned once —
 * when a row is loaded or added — and never derived from content again.
 *
 * Not the array index either: deleting a row shifts every index after it, and
 * React would then match each surviving row against its neighbour's state.
 *
 * `_key` is stripped by the Zod schemas on save (they are plain z.object, which
 * drops unknown keys), so it never reaches Firestore. tests/schemas.test.js
 * covers that, because a leaked key would be silent.
 */

let counter = 0;

export const DRAFT_KEY = "_key";

/** Tags one row. Call when rows arrive from Firestore or a blank row is added. */
export function withDraftKey(row) {
  return { ...row, [DRAFT_KEY]: `draft-${(counter += 1)}` };
}
