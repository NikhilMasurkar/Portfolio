import React from "react";
import ReactMarkdown from "react-markdown";
import { POST_REHYPE_PLUGINS } from "./postHtml.js";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

/**
 * Post bodies, rendered.
 *
 * Bodies are HTML now, because the admin editor is TinyMCE. Markdown still
 * parses, so anything written before the switch keeps working — react-markdown
 * passes HTML through rehype-raw and renders both.
 *
 * SANITISING HAPPENS HERE, ON READ, AND THAT IS THE POINT. TinyMCE's own
 * allowlist already refuses to emit a script tag, but that only governs what
 * the editor writes. This governs what the site renders, whatever ends up in
 * the database and however it got there — which is the only guarantee worth
 * having for content that is stored and replayed to every visitor.
 *
 * rehype-sanitize runs on the syntax tree rather than a string, in Node and in
 * the browser alike, so the server render and the client render strip exactly
 * the same things. A DOM-based sanitiser would need jsdom on the server.
 *
 * Element styling is supplied here rather than through a typography plugin —
 * the palette is token-driven and a plugin would bring its own colours.
 */

const COMPONENTS = {
  h2: (props) => (
    <Typography
      variant="h2"
      className="mt-12 mb-4 font-display text-[28px] font-bold tracking-[-0.02em] text-fg first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <Typography
      variant="h3"
      className="mt-9 mb-3 font-display text-[21px] font-semibold tracking-[-0.01em] text-fg-2"
      {...props}
    />
  ),
  p: (props) => (
    <Typography className="mb-5 text-[16.5px] leading-[1.8] text-muted" {...props} />
  ),
  a: (props) => (
    <Link
      className="text-secondary underline underline-offset-2 transition-colors hover:text-fg"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      // noreferrer alongside noopener: an external link should not leak the
      // referring URL either.
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <Box
      component="ul"
      className="mb-5 list-disc space-y-2 pl-6 text-[16.5px] leading-[1.8] text-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <Box
      component="ol"
      className="mb-5 list-decimal space-y-2 pl-6 text-[16.5px] leading-[1.8] text-muted"
      {...props}
    />
  ),
  blockquote: (props) => (
    <Box
      component="blockquote"
      className="mb-5 border-l-2 border-primary/50 pl-5 text-[16.5px] italic leading-[1.8] text-fg-3"
      {...props}
    />
  ),
  code: ({ inline, ...props }) =>
    inline ? (
      <code
        className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[13.5px] text-fg-3"
        {...props}
      />
    ) : (
      <code className="font-mono text-[13.5px] leading-relaxed text-fg-3" {...props} />
    ),
  pre: (props) => (
    // overflow-x on the block, so a long line scrolls itself instead of
    // widening the page.
    <Box
      component="pre"
      className="mb-6 overflow-x-auto rounded-xl border border-line bg-bg p-5"
      {...props}
    />
  ),
  hr: () => <Divider className="my-10 border-line" />,
  img: (props) => (
    <img className="mb-6 w-full rounded-xl border border-line" loading="lazy" {...props} />
  ),
};

export default function Markdown({ children }) {
  return (
    <ReactMarkdown
      // The allowlist and the plugin order live in postHtml.js, next to the
      // tests that prove them. This file only styles what survives.
      rehypePlugins={POST_REHYPE_PLUGINS}
      components={COMPONENTS}
    >
      {children}
    </ReactMarkdown>
  );
}
