import React from "react";
import { Link, useParams } from "react-router";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import ProjectShot from "../../widgets/ProjectShot.jsx";
import ProjectGallery from "./ProjectGallery.jsx";
import NotFound from "../error/NotFound.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProjects } from "../../global/ContentContext.jsx";

export default function ProjectDetail() {
  const { slug } = useParams();
  const projects = useProjects();

  const index = projects.findIndex((project) => project.slug === slug);

  /*
   * Unknown or unpublished slug. Rendering NotFound here matches the 404 the
   * server already returns for it — knownPaths() is built from this same
   * published list, so the status and the markup cannot disagree.
   */
  if (index === -1) return <NotFound />;

  const project = projects[index];
  // Wraps, so the last project leads back to the first rather than dead-ending.
  const next = projects[(index + 1) % projects.length];

  return (
    <section className="relative overflow-hidden py-24">
      <Seo
        path={`${ROUTE_PATH.PROJECTS}${project.slug}/`}
        title={project.name}
        description={project.summary}
        ogImage={project.image}
        ogType="article"
      />
      <SectionBackground variant="case-study" />
      <Container>
        <Link
          to={ROUTE_PATH.PROJECTS}
          className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-fg"
        >
          <span aria-hidden>←</span> All Projects
        </Link>

        <Reveal>
          <div>
            <p className="mb-4 inline-block self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text">
              {project.category.toUpperCase()} · {project.year}
            </p>

            <h1 className="m-0 mb-5 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[30px]">
              {project.name}
            </h1>

            <p className="mb-6 max-w-[640px] text-base leading-[1.75] text-muted">
              {project.summary}
            </p>

            <ul className="mb-8 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <li
                  key={tech}
                  className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
                >
                  {tech}
                </li>
              ))}
            </ul>

            {(project.liveUrl || project.githubUrl) && (
              <div className="mb-12 flex flex-wrap gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-6 py-3 text-sm font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
                  >
                    Live Site <span aria-hidden>↗</span>
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-xl border border-line px-6 py-3 text-sm font-semibold text-fg transition-colors hover:border-primary"
                  >
                    GitHub <span aria-hidden>↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal
          delay={0.08}
          className="mb-16 block overflow-hidden rounded-2xl border border-line"
        >
          <div className="aspect-video w-full">
            <ProjectShot
              src={project.image}
              alt={`${project.name} screenshot`}
              eager
            />
          </div>
        </Reveal>

        {project.gallery.length > 0 && (
          <Reveal delay={0.12} className="mb-16 block">
            <h2 className="mb-6 font-display text-2xl font-semibold tracking-[-0.01em]">
              Gallery
            </h2>
            <ProjectGallery gallery={project.gallery} />
          </Reveal>
        )}

        {next.slug !== project.slug && (
          <div className="border-t border-line pt-10">
            <Link
              to={`${ROUTE_PATH.PROJECTS}${next.slug}/`}
              className="group flex items-center justify-between gap-4"
            >
              <span>
                <span className="block text-xs font-semibold tracking-[0.2em] text-dim">
                  NEXT PROJECT
                </span>
                <span className="mt-2 block font-display text-2xl font-semibold tracking-[-0.01em] transition-colors group-hover:text-secondary">
                  {next.name}
                </span>
              </span>
              <span
                aria-hidden
                className="text-2xl text-muted transition-colors group-hover:text-secondary"
              >
                →
              </span>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
