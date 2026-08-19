import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Reveal from "../../widgets/Reveal.jsx";

/**
 * The written case study.
 *
 * Section order follows the design spec's seven-section template, which was
 * trimmed from a fifteen-section one because the extra headings mostly
 * restated each other. Each answers a question a reader actually has: what
 * existed, why it mattered, what you decided, what happened.
 *
 * Every section is optional and an absent one renders nothing — a case study
 * with three filled sections should look deliberate, not like a form someone
 * abandoned. That is also why there are no placeholder headings.
 */

const SECTIONS = [
  ["overview", "Overview"],
  ["problem", "The problem"],
  ["role", "My role"],
  ["architecture", "Architecture"],
  ["decisions", "Key decisions & trade-offs"],
  ["results", "Results"],
  ["lessons", "Lessons"],
];

/**
 * Paragraphs from blank-line-separated text.
 *
 * Not a Markdown renderer. These fields hold prose, and prose needs
 * paragraphs — pulling in a Markdown parser and a sanitiser to get <p> tags
 * would be a dependency for punctuation. Revisit if a case study genuinely
 * needs headings, lists or code blocks; the blog will need one regardless.
 */
function Prose({ text }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <Typography
            key={index}
            className="mb-4 max-w-[70ch] text-[15.5px] leading-[1.8] text-muted last:mb-0"
          >
            {paragraph}
          </Typography>
        ))}
    </>
  );
}

export default function CaseStudy({ caseStudy }) {
  const filled = SECTIONS.filter(([key]) => caseStudy?.[key]?.trim());

  if (filled.length === 0) return null;

  return (
    <Box className="mb-16 grid gap-12">
      {filled.map(([key, title], index) => (
        <Reveal key={key} delay={Math.min(index * 0.05, 0.2)}>
          <Box component="section">
            <Typography variant="h2" className="eyebrow mb-4">
              {title}
            </Typography>
            <Prose text={caseStudy[key]} />
          </Box>
        </Reveal>
      ))}
    </Box>
  );
}
