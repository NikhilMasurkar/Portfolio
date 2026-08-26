/**
 * Blog post bodies are HTML now, authored in TinyMCE and stored in Firestore.
 *
 * Stored markup replayed to every visitor is the classic stored-XSS shape, so
 * the guarantee has to be at RENDER time: the editor's allowlist governs only
 * what the editor writes, while this governs what the site shows regardless of
 * how the row got into the database.
 *
 * Rendered through react-markdown with the exact plugin array the blog uses,
 * so a change to the schema or to the plugin order fails here. No JSX, because
 * these run on plain Node.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";

import { POST_REHYPE_PLUGINS } from "../src/app/pages/blog/postHtml.js";

const render = (body) =>
  renderToStaticMarkup(
    createElement(ReactMarkdown, { rehypePlugins: POST_REHYPE_PLUGINS }, body)
  );

test("ordinary editor output survives", () => {
  const html = render(
    "<h2>A heading</h2><p>Some <strong>bold</strong> copy and " +
      '<a href="https://example.com">a link</a>.</p><ul><li>one</li></ul>'
  );

  assert.match(html, /A heading/);
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /href="https:\/\/example\.com"/);
  assert.match(html, /<li>one<\/li>/);
});

test("a stored script tag never reaches the page", () => {
  const html = render("<p>hello</p><script>window.stolen = document.cookie</script>");

  assert.ok(!html.includes("<script"), "a script tag was rendered");
  assert.ok(!html.includes("document.cookie"), "script contents were rendered");
  assert.match(html, /hello/, "the legitimate copy was dropped too");
});

test("event-handler attributes are stripped", () => {
  const html = render('<p onclick="alert(1)">click me</p><img src="x" onerror="alert(2)">');

  assert.ok(!/onclick/i.test(html), "onclick survived");
  assert.ok(!/onerror/i.test(html), "onerror survived");
  assert.match(html, /click me/);
});

test("javascript: URLs are neutralised", () => {
  const html = render('<a href="javascript:alert(1)">tap</a>');
  assert.ok(!/href="javascript:/i.test(html), "a javascript: href survived");
});

test("iframes and object embeds are dropped", () => {
  const html = render('<p>before</p><iframe src="https://evil.example"></iframe><p>after</p>');

  assert.ok(!html.includes("<iframe"), "an iframe was rendered");
  assert.match(html, /before/);
  assert.match(html, /after/);
});

test("Markdown written before the switch to TinyMCE still renders", () => {
  const html = render("## Heading\n\nA paragraph with `code`.\n\n- item");

  assert.match(html, /Heading/);
  assert.match(html, /<code[^>]*>code<\/code>/);
  assert.match(html, /<li>item<\/li>/);
});

test("sanitising before parsing would defeat it — the order is asserted", () => {
  /*
   * rehype-raw must run first. Reversed, the sanitiser walks a tree where the
   * HTML is still inert text, finds nothing to strip, and rehype-raw then
   * turns the untouched payload into real elements. This pins the order so the
   * mistake cannot be made silently.
   */
  const [first] = POST_REHYPE_PLUGINS;
  assert.equal(first.name, "rehypeRaw", "rehype-raw is no longer the first plugin");
});
