import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
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
    <Box component="section" className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.ABOUT} description={profile.aboutSummary} />
      <SectionBackground variant="about" />
      <Container>
        <Typography className="eyebrow mb-4">About</Typography>
        <AboutHero />

        <Box className="mt-24">
          <TechGrid />
        </Box>

        <Box className="mt-24">
          <Typography variant="h2" className="eyebrow mb-8">
            Experience
          </Typography>
          <ExperienceTimeline />
        </Box>
      </Container>
    </Box>
  );
}
