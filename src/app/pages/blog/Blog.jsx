import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import ProjectShot from "../../widgets/ProjectShot.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent } from "../../global/ContentContext.jsx";

/** Long dates read better than ISO on a card; ISO stays in <time datetime>. */
export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Estimated from the body at render time rather than stored.
 *
 * A stored figure goes stale the moment a post is edited, and nobody ever
 * remembers to update it. 200 wpm is the usual reading estimate.
 */
export function readingMinutes(post) {
  if (post.readingMinutes) return post.readingMinutes;
  const words = String(post.body ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function Meta({ post }) {
  return (
    <Typography className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-meta">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <Box component="span" aria-hidden>
        ·
      </Box>
      <Box component="span">{readingMinutes(post)} min read</Box>
    </Typography>
  );
}

export default function Blog() {
  const { posts } = useContent();

  const [lead, ...rest] = posts;

  return (
    <Box component="section" className="relative overflow-hidden py-24" data-print="page">
      <Seo path={ROUTE_PATH.BLOG} />
      <SectionBackground variant="projects" />

      <Container>
        <Typography className="eyebrow mb-4">Blog</Typography>
        <Typography
          variant="h1"
          className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]"
        >
          Notes from building
        </Typography>
        <Typography className="mb-14 max-w-[560px] text-base leading-[1.75] text-muted">
          Thoughts, technical notes and lessons from shipping production web and
          mobile software.
        </Typography>

        {posts.length === 0 ? (
          /*
           * Nothing published yet. Said plainly rather than padded with
           * placeholder articles — an invented post is worse than an honest
           * empty page, and the brief forbids it outright.
           */
          <Typography className="surface px-8 py-14 text-center text-muted">
            No posts published yet. There will be some here soon.
          </Typography>
        ) : (
          <Box className="grid gap-8">
            {/* The newest post gets the wide treatment; the rest sit in a grid
                beneath it, which is the hierarchy the design reference uses. */}
            <Reveal>
              <Card
                component={Link}
                elevation={0}
                to={`${ROUTE_PATH.BLOG}${lead.slug}/`}
                className="surface surface-interactive group grid overflow-hidden min-[900px]:grid-cols-[1.1fr_1fr]"
              >
                {lead.coverUrl && (
                  <Box className="h-full min-h-[220px] overflow-hidden">
                    <ProjectShot
                      src={lead.coverUrl}
                      alt=""
                      eager
                      className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  </Box>
                )}

                <Box className="flex flex-col justify-center p-9 max-[720px]:p-6">
                  <Meta post={lead} />
                  <Typography
                    variant="h2"
                    className="mb-3 mt-3 font-display text-[27px] font-bold leading-[1.25] tracking-[-0.02em] text-fg max-[720px]:text-[22px]"
                  >
                    {lead.title}
                  </Typography>
                  <Typography className="mb-5 text-[14.5px] leading-[1.7] text-muted">
                    {lead.summary}
                  </Typography>
                  <Box component="span" className="btn !p-0 text-sm font-semibold text-secondary">
                    Read more{" "}
                    <Box component="span" aria-hidden className="arrow">
                      →
                    </Box>
                  </Box>
                </Box>
              </Card>
            </Reveal>

            {rest.length > 0 && (
              <Box
                component="ul"
                className="grid grid-cols-3 gap-6 max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1"
              >
                {rest.map((post, index) => (
                  <li key={post.slug} className="flex">
                    <Reveal delay={Math.min(index * 0.06, 0.3)} className="flex w-full">
                      <Card
                        component={Link}
                        elevation={0}
                        to={`${ROUTE_PATH.BLOG}${post.slug}/`}
                        className="surface surface-interactive group flex w-full flex-col overflow-hidden"
                      >
                        {post.coverUrl && (
                          <Box className="h-[170px] w-full shrink-0 overflow-hidden">
                            <ProjectShot
                              src={post.coverUrl}
                              alt=""
                              className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                            />
                          </Box>
                        )}
                        <Box className="flex flex-1 flex-col p-6">
                          <Meta post={post} />
                          <Typography
                            variant="h3"
                            className="mb-2.5 mt-2.5 font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-fg"
                          >
                            {post.title}
                          </Typography>
                          <Typography className="mb-5 text-[13.5px] leading-[1.65] text-muted">
                            {post.summary}
                          </Typography>
                          <Box
                            component="span"
                            className="btn mt-auto !p-0 text-sm font-semibold text-secondary"
                          >
                            Read more{" "}
                            <Box component="span" aria-hidden className="arrow">
                              →
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Reveal>
                  </li>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}
