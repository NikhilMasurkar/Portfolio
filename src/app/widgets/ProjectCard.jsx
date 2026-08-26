import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProjectShot from "./ProjectShot.jsx";
import { ROUTE_PATH } from "../global/RoutePath.js";

/** A project card for the listing grid — sibling of the home page's featured card. */
export default function ProjectCard({ project }) {
  return (
    <Card
      component="article"
      elevation={0}
      className="group surface surface-interactive flex h-full w-full flex-col overflow-hidden"
    >
      {/* Zoom lives on the image, not the card, so the card's own border and
          radius stay put while the artwork moves under them. */}
      {/* Whole screenshot, not a crop — see the note in FeaturedProjects.jsx.
          These shots are a mix of portrait and landscape. */}
      <Box className="aspect-[16/10] w-full shrink-0 overflow-hidden bg-bg/40">
        <ProjectShot
          src={project.image}
          alt={`${project.name} screenshot`}
          fit="contain"
          className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
        />
      </Box>

      <Box className="flex flex-1 flex-col p-6">
        <Chip
          label={project.category.toUpperCase()}
          className="mb-4 h-auto self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text"
        />

        <Typography
          variant="h3"
          className="m-0 mb-3 font-display text-[21px] font-semibold tracking-[-0.015em]"
        >
          {project.name}
        </Typography>

        <Typography className="mb-5 text-[13.5px] leading-[1.65] text-muted">
          {project.summary}
        </Typography>

        <Stack component="ul" direction="row" className="mb-5 flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((tech) => (
            <Chip
              key={tech}
              component="li"
              label={tech}
              className="h-auto max-w-full rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4 [&_.MuiChip-label]:whitespace-normal [&_.MuiChip-label]:break-words"
            />
          ))}
        </Stack>

        <Stack
          direction="row"
          className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-secondary"
        >
          {project.liveUrl && (
            <Box
              component="a"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              Live <span aria-hidden>↗</span>
            </Box>
          )}
          {project.githubUrl && (
            <Box
              component="a"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-fg"
            >
              GitHub <span aria-hidden>↗</span>
            </Box>
          )}
          <Button
            component={Link}
            to={`${ROUTE_PATH.PROJECTS}${project.slug}/`}
            className="btn flex items-center gap-1.5 !text-sm transition-colors hover:text-fg"
          >
            Case Study{" "}
            <Box component="span" aria-hidden className="arrow">
              →
            </Box>
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
