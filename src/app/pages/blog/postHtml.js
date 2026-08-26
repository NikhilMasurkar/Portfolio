import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

/**
 * What a blog post is allowed to render, and the pipeline that enforces it.
 *
 * Plain .js, not .jsx, ON PURPOSE: this is the security-critical half of the
 * blog and the tests load it with plain Node, which cannot parse JSX. Keeping
 * it out of the component means the rule and its proof stay together, and the
 * component's only remaining job is to pass this through.
 *
 * Post bodies are HTML written in TinyMCE and stored in Firestore. Stored
 * markup replayed to every visitor is the classic stored-XSS shape, so the
 * guarantee has to sit at render time: TinyMCE's allowlist governs only what
 * the editor writes, while this governs what the site shows, whatever ended up
 * in the database and however it got there.
 *
 * rehype-sanitize works on the syntax tree rather than a string, in Node and
 * the browser alike, so the server render and the client render strip exactly
 * the same things. A DOM-based sanitiser would need jsdom on the server.
 */

/**
 * Starts from rehype's default allowlist and adds only what the editor's
 * toolbar can produce.
 *
 * Deliberately absent: script, style, iframe, object, embed, form and every
 * on* handler. They are not in the default schema and are not added here, so a
 * stored payload is dropped rather than rendered. `javascript:` URLs are
 * handled by the default schema's protocol rules.
 */
export const POST_SCHEMA = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    // Syntax-highlighting classes from TinyMCE's codesample plugin.
    code: [...(defaultSchema.attributes?.code || []), ["className", /^language-./]],
    pre: [...(defaultSchema.attributes?.pre || []), ["className", /^language-./]],
    img: [...(defaultSchema.attributes?.img || []), "loading", "width", "height"],
    a: [...(defaultSchema.attributes?.a || []), "target", "rel"],
  },
};

/**
 * ORDER IS LOAD-BEARING. Raw HTML has to be parsed into the tree before it can
 * be sanitised. Reversed, the sanitiser inspects a tree where the HTML is
 * still inert text, finds nothing to strip, and rehype-raw then happily turns
 * the untouched payload into real elements.
 */
export const POST_REHYPE_PLUGINS = [rehypeRaw, [rehypeSanitize, POST_SCHEMA]];
