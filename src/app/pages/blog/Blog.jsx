import React from "react";
import { Link } from "react-router";
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
    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-meta">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{readingMinutes(post)} min read</span>
    </p>
  );
}

export default function Blog() {
  const { posts } = useContent();

  const [lead, ...rest] = posts;

  return (
    <section className="relative overflow-hidden py-24" data-print="page">
      <Seo path={ROUTE_PATH.BLOG} />
      <SectionBackground variant="projects" />

      <Container>
        <p className="eyebrow mb-4">Blog</p>
        <h1 className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
          Notes from building
        </h1>
        <p className="mb-14 max-w-[560px] text-base leading-[1.75] text-muted">
          Thoughts, technical notes and lessons from shipping production web and
          mobile software.
        </p>

        {posts.length === 0 ? (
          /*
           * Nothing published yet. Said plainly rather than padded with
           * placeholder articles — an invented post is worse than an honest
           * empty page, and the brief forbids it outright.
           */
          <p className="surface px-8 py-14 text-center text-muted">
            No posts published yet. There will be some here soon.
          </p>
        ) : (
          <div className="grid gap-8">
            {/* The newest post gets the wide treatment; the rest sit in a grid
                beneath it, which is the hierarchy the design reference uses. */}
            <Reveal>
              <Link
                to={`${ROUTE_PATH.BLOG}${lead.slug}/`}
                className="surface surface-interactive group grid overflow-hidden min-[900px]:grid-cols-[1.1fr_1fr]"
              >
                {lead.coverUrl && (
                  <div className="h-full min-h-[220px] overflow-hidden">
                    <ProjectShot
                      src={lead.coverUrl}
                      alt=""
                      eager
                      className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  </div>
                )}

                <div className="flex flex-col justify-center p-9 max-[720px]:p-6">
                  <Meta post={lead} />
                  <h2 className="mb-3 mt-3 font-display text-[27px] font-bold leading-[1.25] tracking-[-0.02em] text-fg max-[720px]:text-[22px]">
                    {lead.title}
                  </h2>
                  <p className="mb-5 text-[14.5px] leading-[1.7] text-muted">
                    {lead.summary}
                  </p>
                  <span className="btn !p-0 text-sm font-semibold text-secondary">
                    Read more <span aria-hidden className="arrow">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>

            {rest.length > 0 && (
              <ul className="grid grid-cols-3 gap-6 max-[1160px]:grid-cols-2 max-[720px]:grid-cols-1">
                {rest.map((post, index) => (
                  <li key={post.slug} className="flex">
                    <Reveal delay={Math.min(index * 0.06, 0.3)} className="flex w-full">
                      <Link
                        to={`${ROUTE_PATH.BLOG}${post.slug}/`}
                        className="surface surface-interactive group flex w-full flex-col overflow-hidden"
                      >
                        {post.coverUrl && (
                          <div className="h-[170px] w-full shrink-0 overflow-hidden">
                            <ProjectShot
                              src={post.coverUrl}
                              alt=""
                              className="transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col p-6">
                          <Meta post={post} />
                          <h3 className="mb-2.5 mt-2.5 font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-fg">
                            {post.title}
                          </h3>
                          <p className="mb-5 text-[13.5px] leading-[1.65] text-muted">
                            {post.summary}
                          </p>
                          <span className="btn mt-auto !p-0 text-sm font-semibold text-secondary">
                            Read more <span aria-hidden className="arrow">→</span>
                          </span>
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
