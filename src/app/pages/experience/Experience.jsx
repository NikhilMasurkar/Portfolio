import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import ExperienceTimeline from "../about/ExperienceTimeline.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent } from "../../global/ContentContext.jsx";

/**
 * Career history on its own page.
 *
 * The timeline component is shared with /about rather than duplicated — the
 * two pages frame the same entries differently, they do not hold different
 * data.
 */
export default function Experience() {
  const { experience } = useContent();

  return (
    <section className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.EXPERIENCE} />
      <SectionBackground variant="about" />

      <Container>
        <p className="mb-4 text-xs font-semibold tracking-[0.2em] text-dim">
          EXPERIENCE
        </p>
        <h1 className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]">
          Where I&apos;ve Worked
        </h1>
        <p className="mb-14 max-w-[560px] text-base leading-[1.75] text-muted">
          Three years shipping production React and React Native — learning
          platforms, admin systems and mobile apps with real users behind them.
        </p>

        {experience.length > 0 ? (
          <ExperienceTimeline />
        ) : (
          <p className="text-sm text-muted">Nothing here yet.</p>
        )}
      </Container>
    </section>
  );
}
