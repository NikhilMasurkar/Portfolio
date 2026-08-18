import React from "react";
import ReactMarkdown from "react-markdown";

/**
 * Post bodies, rendered.
 *
 * react-markdown rather than a Markdown-to-HTML library because it builds
 * React elements instead of an HTML string — so there is no
 * dangerouslySetInnerHTML and no separate sanitiser to keep configured. Raw
 * HTML in a post is escaped rather than executed, which matters even for a
 * single-author blog: the body is stored in a database, and anything that can
 * write there could otherwise write script into a page.
 *
 * This is the one place in the codebase a Markdown dependency earns its keep.
 * Case-study prose splits on blank lines instead, which is all it needs.
 *
 * Element styling is supplied here rather than through a typography plugin —
 * the palette is token-driven and a plugin would bring its own colours.
 */
const COMPONENTS = {
  h2: (props) => (
    <h2
      className="mt-12 mb-4 font-display text-[28px] font-bold tracking-[-0.02em] text-fg first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-9 mb-3 font-display text-[21px] font-semibold tracking-[-0.01em] text-fg-2"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-5 text-[16.5px] leading-[1.8] text-muted" {...props} />
  ),
  a: (props) => (
    <a
      className="text-secondary underline underline-offset-2 transition-colors hover:text-fg"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      // noreferrer alongside noopener: an external link should not leak the
      // referring URL either.
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mb-5 list-disc space-y-2 pl-6 text-[16.5px] leading-[1.8] text-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6 text-[16.5px] leading-[1.8] text-muted" {...props} />
  ),
  blockquote: (props) => (
    <blockquote
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
    <pre
      className="mb-6 overflow-x-auto rounded-xl border border-line bg-bg p-5"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-line" />,
  img: (props) => (
    <img className="mb-6 w-full rounded-xl border border-line" loading="lazy" {...props} />
  ),
};

export default function Markdown({ children }) {
  return <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>;
}
