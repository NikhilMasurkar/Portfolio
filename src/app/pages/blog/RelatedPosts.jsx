import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ProjectShot from "../../widgets/ProjectShot.jsx";
import { formatDate, readingMinutes } from "./Blog.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";

/**
 * The related-posts column beside an article.
 *
 * Renders nothing when there is nothing to relate to, rather than an empty
 * bordered box — the caller decides what to show, this does not invent
 * filler. See related.js for how the list is chosen and why it is capped.
 *
 * `sticky` keeps it beside the reader on a long article. It is scoped to the
 * wide breakpoint because below that the column sits under the article, where
 * sticking would pin it over the footer.
 */
export default function RelatedPosts({ posts }) {
  if (posts.length === 0) return null;

  return (
    <Box
      component="aside"
      aria-labelledby="related-heading"
      className="min-[1100px]:sticky min-[1100px]:top-[calc(var(--spacing-header)+2rem)]"
    >
      <Typography
        id="related-heading"
        variant="h2"
        className="eyebrow mb-5"
      >
        More on this
      </Typography>

      <Box component="ul" className="grid gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <Card
              component={Link}
              elevation={0}
              to={`${ROUTE_PATH.BLOG}${post.slug}/`}
              className="surface surface-interactive group flex w-full gap-4 overflow-hidden p-3"
            >
              {post.coverUrl && (
                <Box className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <ProjectShot
                    src={post.coverUrl}
                    alt=""
                    className="transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:transform-none"
                  />
                </Box>
              )}

              <Box className="min-w-0">
                <Typography className="text-[14px] font-semibold leading-snug text-fg-2">
                  {post.title}
                </Typography>
                <Typography className="mt-1 text-[11.5px] text-meta">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  {" · "}
                  {readingMinutes(post)} min read
                </Typography>
              </Box>
            </Card>
          </li>
        ))}
      </Box>
    </Box>
  );
}
