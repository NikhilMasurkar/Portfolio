/**
 * Moves React 19's metadata out of the rendered body and into <head>.
 *
 * React hoists <title>/<meta>/<link> automatically in streaming SSR, but
 * renderToString leaves them inline where they appear in the tree — and a
 * crawler ignores a <title> sitting in the middle of the body.
 */
const HEAD_TAGS =
  /<(title|meta|link|script)\b[^>]*(?:\/>|>[\s\S]*?<\/\1>)/gi;

const IS_HEAD_TAG = (tag) =>
  /^<title/i.test(tag) ||
  /^<meta/i.test(tag) ||
  /^<link/i.test(tag) ||
  /^<script[^>]+type="application\/ld\+json"/i.test(tag);

export default function hoistHeadTags(html) {
  const head = [];
  const body = html.replace(HEAD_TAGS, (tag) => {
    if (!IS_HEAD_TAG(tag)) return tag;
    head.push(tag);
    return "";
  });
  return { head: head.join("\n    "), body };
}
