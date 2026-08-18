import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import ProjectFilter from "./ProjectFilter.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProjects } from "../../global/ContentContext.jsx";

export default function Projects() {
  const projects = useProjects();

  return (
    <section className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.PROJECTS} />
      <SectionBackground variant="projects" />
      <Container>
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-dim">
          PROJECTS
        </p>
        <h1 className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
          Projects
        </h1>
        <p className="mb-12 max-w-[560px] text-base leading-[1.75] text-muted">
          A selection of web and mobile work, from production platforms to admin
          tools and client sites.
        </p>

        <ProjectFilter projects={projects} />
      </Container>
    </section>
  );
}
