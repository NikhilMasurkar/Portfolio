import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/ui/section-background";
import { ProjectFilter } from "@/components/projects/project-filter";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Web and mobile projects — POS platforms, admin consoles, learning apps and client sites.",
};

export default function ProjectsPage() {
  return (
    <section className="relative overflow-hidden py-24">
      <SectionBackground variant="projects" />
      <Container>
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-dim">
          PROJECTS
        </p>
        <h1 className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
          Projects
        </h1>
        <p className="mb-12 max-w-[560px] text-base leading-[1.75] text-muted">
          A selection of web and mobile work, from production platforms to
          admin tools and client sites.
        </p>

        <ProjectFilter projects={projects} />
      </Container>
    </section>
  );
}
