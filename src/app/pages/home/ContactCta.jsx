import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "../../widgets/Container.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function ContactCta() {
  const profile = useProfile();

  return (
    <Box component="section" className="relative overflow-hidden pb-28 pt-4">
      <SectionBackground variant="contact" />
      <Container>
        <Reveal className="surface px-8 py-16 text-center max-[720px]:px-6 max-[720px]:py-12">
          <Typography variant="h2" className="m-0 mb-4 font-display text-[46px] font-bold leading-[1.2] tracking-[-0.03em] max-[720px]:text-[32px]">
            Let&apos;s Build Something
            <br />
            <Box component="span" className="bg-[image:var(--gradient-01)] bg-clip-text text-transparent">
              Amazing Together.
            </Box>
          </Typography>
          <Typography className="mx-auto mb-9 max-w-[420px] text-base leading-[1.75] text-muted">
            I&apos;m currently available for freelance work and full-time
            opportunities.
          </Typography>

          {/*
            Falls back to a mailto: until /contact exists. A call to action is
            the one thing on the page that must never be a dead end, so this
            degrades to a working channel rather than being hidden.
          */}
          {ROUTE_PATH.CONTACT ? (
            <Button component={Link} to={ROUTE_PATH.CONTACT} className="btn btn-primary">
              Get In Touch{" "}
              <Box component="span" aria-hidden className="arrow">
                →
              </Box>
            </Button>
          ) : (
            <Button component="a" href={`mailto:${profile.email}`} className="btn btn-primary">
              Get In Touch{" "}
              <Box component="span" aria-hidden className="arrow">
                →
              </Box>
            </Button>
          )}
        </Reveal>
      </Container>
    </Box>
  );
}
