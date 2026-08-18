import React from "react";
import Reveal from "../../widgets/Reveal.jsx";
import { useContent } from "../../global/ContentContext.jsx";

export default function ExperienceTimeline() {
  const { experience } = useContent();

  if (experience.length === 0) return null;

  return (
    <ol className="relative border-l border-line pl-10 max-[720px]:pl-7">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-px bg-[image:var(--gradient-01)]"
      />

      {experience.map((entry, index) => (
        <li key={entry.id} className="relative pb-12 last:pb-0">
          <span
            aria-hidden
            className="absolute -left-[45px] top-1 h-3 w-3 rounded-full border-2 border-bg bg-secondary shadow-[0_0_10px_var(--color-secondary)] max-[720px]:-left-[32px]"
          />

          <Reveal delay={index * 0.08}>
            <div className="rounded-2xl border border-line bg-surface/85 p-7 shadow-card">
              <p className="mb-2 font-mono text-[12.5px] text-dim">{entry.period}</p>
              <h3 className="m-0 mb-1 font-display text-[21px] font-semibold tracking-[-0.01em]">
                {entry.role}
              </h3>
              <p className="mb-4 text-[14px] font-medium text-secondary">
                {entry.company}
              </p>
              <p className="text-[14.5px] leading-[1.75] text-muted">
                {entry.summary}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
