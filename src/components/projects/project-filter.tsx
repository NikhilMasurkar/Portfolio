"use client";

import { useMemo, useState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { projectCategories, type Project } from "@/data/schemas";

const FILTERS = ["All", ...projectCategories] as const;
type Filter = (typeof FILTERS)[number];

/** Stagger cap so a long, filtered-down grid never makes the last card wait too long. */
const MAX_DELAY = 0.3;

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) => project.category === filter),
    [projects, filter],
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-12 flex flex-wrap gap-3"
      >
        {FILTERS.map((f) => {
          const selected = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(f)}
              className={
                selected
                  ? "rounded-full bg-[image:var(--gradient-04)] px-4 py-2 text-sm font-semibold text-fg shadow-cta"
                  : "rounded-full border border-line px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-fg"
              }
            >
              {f}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">
          No projects in this category yet.
        </p>
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
