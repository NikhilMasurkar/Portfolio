import React, { useMemo, useState } from "react";
import Reveal from "../../widgets/Reveal.jsx";
import ProjectCard from "../../widgets/ProjectCard.jsx";

/** Stagger cap, so a long grid never makes the last card wait too long. */
const MAX_DELAY = 0.3;

export default function ProjectFilter({ projects }) {
  const [filter, setFilter] = useState("All");

  /*
   * Categories come from the projects themselves rather than the schema's full
   * enum. The schema permits categories nothing is currently tagged with, and
   * offering a tab that can only ever say "no projects here" is a dead end the
   * visitor has to discover by clicking.
   */
  const filters = useMemo(() => {
    const present = [];
    for (const project of projects) {
      if (!present.includes(project.category)) present.push(project.category);
    }
    return ["All", ...present];
  }, [projects]);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) => project.category === filter),
    [projects, filter]
  );

  return (
    <div>
      {filters.length > 2 && (
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mb-12 flex flex-wrap gap-3"
        >
          {filters.map((option) => {
            const selected = option === filter;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(option)}
                className={
                  selected
                    ? "rounded-full bg-[image:var(--gradient-04)] px-4 py-2 text-sm font-semibold text-fg shadow-cta"
                    : "rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-fg"
                }
              >
                {option}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">No projects in this category yet.</p>
      ) : (
        <ul className="grid grid-cols-3 gap-6 max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1">
          {filtered.map((project, index) => (
            <li key={project.slug} className="flex">
              <Reveal
                delay={Math.min(index * 0.06, MAX_DELAY)}
                className="flex w-full"
              >
                <ProjectCard project={project} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
