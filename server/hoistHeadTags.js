/**
 * Moves React 19's metadata out of the rendered body and into <head>.
 *
 * React hoists <title>/<meta>/<link> automatically in streaming SSR, but
 * renderToString leaves them inline where they appear in the tree — and a
 * crawler ignores a <title> sitting in the middle of the body.
 *
 * JSON-LD IS DELIBERATELY NOT HOISTED. React 19 hoists title/meta/link on the
 * client too, so moving those server-side keeps both sides agreeing that the
 * body has no such nodes. It does not hoist arbitrary <script> tags — so
 * lifting JSON-LD out of the body leaves the client rendering a script the
 * server omitted, and hydration fails at the next sibling. That cost the
 * whole page its server-rendered markup, silently, in a browser that looked
 * completely fine.
 *
 * Leaving it in the body is correct regardless: JSON-LD is valid anywhere in
 * the document, and search engines read it from the body.
 */
const HEAD_TAGS = /<(title|meta|link)\b[^>]*(?:\/>|>[\s\S]*?<\/\1>)/gi;

const IS_HEAD_TAG = (tag) =>
  /^<title/i.test(tag) || /^<meta/i.test(tag) || /^<link/i.test(tag);

export default function hoistHeadTags(html) {
  const head = [];
  const body = html.replace(HEAD_TAGS, (tag) => {
    if (!IS_HEAD_TAG(tag)) return tag;
    head.push(tag);
    return "";
  });
  return { head: head.join("\n    "), body };
}
