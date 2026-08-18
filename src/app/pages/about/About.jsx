import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import AboutHero from "./AboutHero.jsx";
import TechGrid from "./TechGrid.jsx";
import ExperienceTimeline from "./ExperienceTimeline.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function About() {
  const profile = useProfile();

  return (
    <section className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.ABOUT} description={profile.aboutSummary} />
      <SectionBackground variant="about" />
      <Container>
        <AboutHero />

        <div className="mt-24">
          <TechGrid />
        </div>

        <div className="mt-24">
          <h2 className="mb-8 text-xs font-semibold tracking-[0.2em] text-dim">
            EXPERIENCE
          </h2>
          <ExperienceTimeline />
        </div>
      </Container>
    </section>
  );
}
