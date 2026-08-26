/**
 * Which posts to show alongside the one being read.
 *
 * Plain .js so the tests can load it with plain Node, and separate from the
 * component because the ranking is the part worth pinning down: what appears
 * next to an article is an editorial decision, not a layout detail.
 *
 * Matched on shared tags only. A post with nothing in common is not
 * "related", and filling the space with recent posts to make the column look
 * full would put that word over a list it does not describe. If nothing
 * matches, this returns an empty array and the caller renders nothing — the
 * same position the blog index takes when there are no posts.
 */

/** More than four turns a sidebar into a second index and crowds the article. */
export const RELATED_LIMIT = 4;

/**
 * @param {Array}  posts   every published post, newest first
 * @param {object} current the post being read
 * @param {number} limit
 * @returns {Array} at most `limit` posts sharing a tag with `current`
 */
export function relatedPosts(posts, current, limit = RELATED_LIMIT) {
  const tags = new Set(current?.tags ?? []);
  if (tags.size === 0) return [];

  return (
    posts
      // Never the article you are already reading.
      .filter((post) => post.slug !== current.slug)
      .map((post) => ({
        post,
        shared: (post.tags ?? []).filter((tag) => tags.has(tag)).length,
      }))
      .filter((entry) => entry.shared > 0)
      /*
       * Most tags in common first, and `posts` arrives newest-first from
       * content.js, so sort() being stable keeps the newer of two equally
       * related posts ahead. Sorting on the date again here would duplicate a
       * rule that already lives in one place.
       */
      .sort((a, b) => b.shared - a.shared)
      .slice(0, limit)
      .map((entry) => entry.post)
  );
}
