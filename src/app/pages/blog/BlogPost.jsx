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
import ProjectShot from "../../widgets/ProjectShot.jsx";
import Markdown from "./Markdown.jsx";
import NotFound from "../error/NotFound.jsx";
import { formatDate, readingMinutes } from "./Blog.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent, useProfile } from "../../global/ContentContext.jsx";

export default function BlogPost() {
  const { slug } = useParams();
  const { posts } = useContent();
  const profile = useProfile();

  const index = posts.findIndex((post) => post.slug === slug);

  /*
   * Unknown or unpublished slug. Rendering NotFound matches the 404 the server
   * already returns — knownPaths() is built from this same published list, so
   * the status and the markup cannot disagree.
   */
  if (index === -1) return <NotFound />;

  const post = posts[index];
  // Newest first, so the "next" post is the one published before this.
  const next = posts[index + 1];

  /** Article schema, so a search result can show the date and author. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: { "@type": "Person", name: profile.name },
    ...(post.coverUrl ? { image: post.coverUrl } : {}),
  };

  return (
    <Box component="section" className="relative overflow-hidden py-24">
      <Seo
        path={`${ROUTE_PATH.BLOG}${post.slug}/`}
        title={post.title}
        description={post.summary}
        ogImage={post.coverUrl}
        ogType="article"
        jsonLd={jsonLd}
      />
      <SectionBackground variant="case-study" />

      <Container>
        <Button
          component={Link}
          to={ROUTE_PATH.BLOG}
          className="mb-8 inline-flex items-center gap-2 py-2 text-sm font-semibold text-muted transition-colors hover:text-fg"
        >
          <Box component="span" aria-hidden>
            ←
          </Box>{" "}
          All posts
        </Button>

        <Box component="article" className="max-w-[70ch]">
          <Typography className="flex flex-wrap items-center gap-x-2.5 text-[12.5px] text-meta">
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            <Box component="span" aria-hidden>
              ·
            </Box>
            <Box component="span">{readingMinutes(post)} min read</Box>
          </Typography>

          <Typography
            variant="h1"
            className="m-0 mb-5 mt-4 font-display text-[40px] font-bold leading-[1.15] tracking-[-0.02em] max-[720px]:text-[30px]"
          >
            {post.title}
          </Typography>

          <Typography className="mb-8 text-[17px] leading-[1.7] text-fg-3">
            {post.summary}
          </Typography>

          {post.tags.length > 0 && (
            <Stack component="ul" direction="row" className="mb-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  component="li"
                  label={tag}
                  className="h-auto rounded-lg border border-primary/25 bg-primary/10 px-2.5 py-1.5 text-[11.5px] text-fg-4"
                />
              ))}
            </Stack>
          )}

          {post.coverUrl && (
            <Box className="mb-10 overflow-hidden rounded-2xl border border-line">
              <Box className="aspect-video w-full">
                <ProjectShot src={post.coverUrl} alt="" eager />
              </Box>
            </Box>
          )}

          <Markdown>{post.body}</Markdown>
        </Box>

        {next && (
          <Box className="mt-16 max-w-[70ch] border-t border-line pt-10">
            <Link
              to={`${ROUTE_PATH.BLOG}${next.slug}/`}
              className="group flex items-center justify-between gap-4"
            >
              <Box component="span">
                <Box component="span" className="eyebrow block">
                  Next post
                </Box>
                <Box
                  component="span"
                  className="mt-2 block font-display text-2xl font-semibold tracking-[-0.01em] transition-colors group-hover:text-secondary"
                >
                  {next.title}
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
