import Link from "next/link";
import { ProjectShot } from "@/components/ui/project-shot";
import type { Project } from "@/data/schemas";

/** A project card for the listing grid — a sibling of the home page's featured card. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-[20px] border border-line bg-surface/90 transition-all hover:-translate-y-1 hover:border-primary">
      <div className="h-[180px] w-full shrink-0 overflow-hidden">
        <ProjectShot src={project.image} alt={`${project.name} screenshot`} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-4 self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text">
          {project.category.toUpperCase()}
        </p>

        <h3 className="m-0 mb-3 font-display text-[21px] font-semibold tracking-[-0.015em]">
          {project.name}
        </h3>

        <p className="mb-5 text-[13.5px] leading-[1.65] text-muted">
          {project.summary}
        </p>

        <ul className="mb-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <li
              key={tech}
              className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-secondary">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              Live <span aria-hidden>↗</span>
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              GitHub <span aria-hidden>↗</span>
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            Case Study <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
