import React from "react";
import { Link } from "react-router";
import Container from "../../widgets/Container.jsx";
import ProjectShot from "../../widgets/ProjectShot.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProjects } from "../../global/ContentContext.jsx";

export default function FeaturedProjects() {
  // Already ordered: content.js sorts by `order`, and the seed puts the
  // flagship three at 0-2. Reordering is an admin edit, not a code change.
  const featured = useProjects().filter((project) => project.featured);

  if (featured.length === 0) return null;

  return (
    <section className="py-24">
      <Container>
        <div className="mb-8 flex items-center justify-between gap-6">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-dim">
            FEATURED PROJECTS
          </h2>
          <Link
            to={ROUTE_PATH.PROJECTS}
            className="flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-secondary"
          >
            View All Projects <span aria-hidden>→</span>
          </Link>
        </div>

        <ul className="grid grid-cols-[1.15fr_.9fr_.9fr] gap-[22px] max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1">
          {featured.map((project, index) => {
            // The first card is the hero of this row: wider, horizontal, and
            // its image loads eagerly because it is usually above the fold.
            const isLarge = index === 0;
            return (
              <li
                key={project.slug}
                className={`flex ${isLarge ? "max-[1160px]:col-span-2 max-[720px]:col-span-1" : ""}`}
              >
                <Reveal delay={index * 0.08} className="flex w-full">
                  <article
                    className={`flex w-full overflow-hidden rounded-[20px] border border-line bg-surface/90 transition-all hover:-translate-y-1 hover:border-primary ${
                      isLarge ? "flex-row max-[720px]:flex-col" : "flex-col"
                    }`}
                  >
                    <div
                      className={`shrink-0 overflow-hidden ${
                        isLarge
                          ? "w-[170px] self-stretch max-[720px]:h-[180px] max-[720px]:w-full"
                          : "h-[132px] w-full"
                      }`}
                    >
                      <ProjectShot
                        src={project.image}
                        alt={`${project.name} screenshot`}
                        eager={isLarge}
                      />
                    </div>

                    <div className={`flex flex-1 flex-col ${isLarge ? "p-6" : "p-[22px]"}`}>
                      {isLarge ? (
                        <p className="mb-4 self-start rounded-full border border-secondary/35 bg-secondary/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-secondary">
                          FEATURED
                        </p>
                      ) : (
                        <p className="mb-4 self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text">
                          {project.category.toUpperCase()}
                        </p>
                      )}

                      <h3
                        className={`m-0 mb-3 font-display font-semibold tracking-[-0.015em] ${
                          isLarge ? "text-[29px]" : "text-[21px]"
                        }`}
                      >
                        {project.name}
                      </h3>

                      <p className="mb-5 text-[13.5px] leading-[1.65] text-muted">
                        {project.summary}
                      </p>

                      <ul className="mt-auto flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((tech) => (
                          <li
                            key={tech}
                            className="rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={`${ROUTE_PATH.PROJECTS}${project.slug}/`}
                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-secondary"
                      >
                        View Case Study <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
