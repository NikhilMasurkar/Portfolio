import React from "react";
import { Link, useParams } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import DeviceFrame from "../../widgets/DeviceFrame.jsx";
import CaseStudy from "./CaseStudy.jsx";
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
    <Box component="section" className="relative overflow-hidden py-24">
      <Seo
        path={`${ROUTE_PATH.PROJECTS}${project.slug}/`}
        title={project.name}
        description={project.summary}
        ogImage={project.image}
        ogType="article"
      />
      <SectionBackground variant="case-study" />
      <Container>
        <Button
          component={Link}
          to={ROUTE_PATH.PROJECTS}
          className="mb-8 inline-flex items-center gap-2 py-2 text-sm font-semibold text-muted transition-colors hover:text-fg"
        >
          <Box component="span" aria-hidden>
            ←
          </Box>{" "}
          All Projects
        </Button>

        <Reveal>
          <Box>
            <Chip
              label={`${project.category.toUpperCase()} · ${project.year}`}
              className="mb-4 inline-block h-auto self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text"
            />

            <Typography
              variant="h1"
              className="m-0 mb-5 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[30px]"
            >
              {project.name}
            </Typography>

            <Typography className="mb-6 max-w-[640px] text-base leading-[1.75] text-muted">
              {project.summary}
            </Typography>

            <Stack component="ul" direction="row" className="mb-8 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <Chip
                  key={tech}
                  component="li"
                  label={tech}
                  className="h-auto rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
                />
              ))}
            </Stack>

            {(project.liveUrl || project.githubUrl) && (
              <Stack direction="row" className="mb-12 flex flex-wrap gap-4">
                {project.liveUrl && (
                  <Button
                    component="a"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary !py-3 !text-sm"
                  >
                    Live Site <span aria-hidden>↗</span>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    component="a"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost !py-3 !text-sm"
                  >
                    GitHub <span aria-hidden>↗</span>
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </Reveal>

        {/*
          The real screenshot, in a CSS device frame. The presentation is the
          portfolio's; the pixels inside the screen are the product's, exactly
          as captured — a redesigned screenshot would make the whole case study
          untrustworthy.
        */}
        <Reveal delay={0.08} className="mb-16 block">
          <Box className={project.category === "Mobile" ? "mx-auto max-w-[320px]" : ""}>
            <DeviceFrame
              src={project.image}
              alt={`${project.name} — product screenshot`}
              kind={project.category === "Mobile" ? "mobile" : "web"}
              eager
            />
          </Box>
        </Reveal>

        <CaseStudy caseStudy={project.caseStudy} />

        {project.gallery.length > 0 && (
          <Reveal delay={0.12} className="mb-16 block">
            <Typography
              variant="h2"
              className="mb-6 font-display text-2xl font-semibold tracking-[-0.01em]"
            >
              Gallery
            </Typography>
            <ProjectGallery gallery={project.gallery} />
          </Reveal>
        )}

        {next.slug !== project.slug && (
          <Box className="border-t border-line pt-10">
            <Link
              to={`${ROUTE_PATH.PROJECTS}${next.slug}/`}
              className="group flex items-center justify-between gap-4"
            >
              <Box component="span">
                <Box
                  component="span"
                  className="block text-xs font-semibold tracking-[0.2em] text-dim"
                >
                  NEXT PROJECT
                </Box>
                <Box
                  component="span"
                  className="mt-2 block font-display text-2xl font-semibold tracking-[-0.01em] transition-colors group-hover:text-secondary"
                >
                  {next.name}
                </Box>
              </Box>
              <Box
                component="span"
                aria-hidden
                className="text-2xl text-muted transition-colors group-hover:text-secondary"
              >
                →
              </Box>
            </Link>
          </Box>
        )}
      </Container>
    </Box>
  );
}
