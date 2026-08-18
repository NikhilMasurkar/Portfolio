import React from "react";
import Reveal from "../../widgets/Reveal.jsx";
import { useContent } from "../../global/ContentContext.jsx";

export default function TechGrid() {
  const { skills } = useContent();

  if (skills.length === 0) return null;

  return (
    <Reveal className="surface">
      <h2 className="eyebrow px-8 pt-8 text-center">Tech I work with</h2>

      <ul className="grid grid-cols-6 gap-6 p-8 max-[1160px]:grid-cols-4 max-[900px]:grid-cols-3 max-[720px]:grid-cols-2">
        {skills.map((item) => (
          <li key={item.id} className="flex flex-col items-center gap-3 text-center">
            {/* The two-letter mark is decorative; the name below carries it. */}
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-line-raised bg-surface-raised font-mono text-[15px] font-semibold text-primary-text"
            >
              {item.mark}
            </span>
            <span className="text-[12.5px] text-meta">{item.name}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
