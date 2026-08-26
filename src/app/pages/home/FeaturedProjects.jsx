import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
    <Box component="section" className="py-24">
      <Container>
        <Stack
          direction="row"
          className="mb-10 flex flex-wrap items-end justify-between gap-6"
        >
          <Box>
            <Typography variant="h2" className="eyebrow">
              Featured work
            </Typography>
            <Typography className="mt-3 font-display text-[30px] font-bold tracking-[-0.02em] text-fg max-[720px]:text-[24px]">
              Products I&apos;ve shipped
            </Typography>
          </Box>
          <Button
            component={Link}
            to={ROUTE_PATH.PROJECTS}
            className="btn shrink-0 !text-sm font-medium text-muted transition-colors hover:text-secondary"
          >
            View All Projects{" "}
            <Box component="span" aria-hidden className="arrow">
              →
            </Box>
          </Button>
        </Stack>

        <Box
          component="ul"
          /*
           * minmax(0, …) ON EVERY TRACK, not decoration.
           *
           * A bare `fr` track is min-width:auto, so it refuses to shrink below
           * its widest unbreakable child. One project arrived with its whole
           * stack pasted into a single 139-character "technology", and that one
           * chip dragged its column to ~950px while the two beside it were
           * crushed to ~190px, wrapping their copy one word per line. The row
           * looked broken because of a value someone typed into a form.
           *
           * Tailwind's grid-cols-2/3 already expand to minmax(0,1fr); only this
           * arbitrary ratio had to say so itself.
           */
          className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,.9fr)_minmax(0,.9fr)] gap-[22px] max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1"
        >
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
                  <Card
                    component="article"
                    elevation={0}
                    className="group surface surface-interactive flex w-full flex-col overflow-hidden"
                  >
                    {/*
                      Image on top for every card, the featured one included.
                      Side-by-side gave the first card a 170px-wide strip of a
                      landscape screenshot — object-cover cropped it to a
                      vertical sliver that showed almost none of the product,
                      and it read as a different component from its neighbours.
                      Taller here, so the featured card still leads the row.
                    */}
                    {/*
                      A fixed height plus object-cover cropped every shot to the
                      same letterbox, and the screenshots are not the same shape:
                      the mobile captures are portrait (691x1536) and the web
                      ones landscape. The phone shots lost everything but a band
                      through the middle.

                      An aspect box with `contain` shows each one whole and keeps
                      the cards aligned. The backdrop makes the space around a
                      portrait shot read as a frame rather than a gap.
                    */}
                    <Box
                      className="aspect-[16/10] w-full shrink-0 overflow-hidden bg-bg/40"
                    >
                      <ProjectShot
                        src={project.image}
                        alt={`${project.name} screenshot`}
                        eager={isLarge}
                        fit="contain"
                        className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                      />
                    </Box>

                    <Box className={`flex flex-1 flex-col ${isLarge ? "p-6" : "p-[22px]"}`}>
                      {isLarge ? (
                        <Chip
                          label="FEATURED"
                          className="mb-4 h-auto self-start rounded-full border border-secondary/35 bg-secondary/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-secondary"
                        />
                      ) : (
                        <Chip
                          label={project.category.toUpperCase()}
                          className="mb-4 h-auto self-start rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-[10.5px] font-semibold tracking-[0.14em] text-accent-text"
                        />
                      )}

                      <Typography
                        variant="h3"
                        className={`m-0 mb-3 font-display font-semibold tracking-[-0.015em] ${
                          isLarge ? "text-[29px]" : "text-[21px]"
                        }`}
                      >
                        {project.name}
                      </Typography>

                      <Typography className="mb-5 text-[13.5px] leading-[1.65] text-muted">
                        {project.summary}
                      </Typography>

                      <Stack component="ul" direction="row" className="mt-auto flex flex-wrap gap-2">
                        {project.tech.slice(0, 4).map((tech) => (
                          <Chip
                            key={tech}
                            component="li"
                            label={tech}
                            className="h-auto max-w-full rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4 [&_.MuiChip-label]:whitespace-normal [&_.MuiChip-label]:break-words"
                          />
                        ))}
                      </Stack>

                      <Button
                        component={Link}
                        to={`${ROUTE_PATH.PROJECTS}${project.slug}/`}
                        className="btn mt-5 flex items-center gap-2 !text-sm text-secondary"
                      >
                        View Case Study{" "}
                        <Box component="span" aria-hidden className="arrow">
                          →
                        </Box>
                      </Button>
                    </Box>
                  </Card>
                </Reveal>
              </li>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
