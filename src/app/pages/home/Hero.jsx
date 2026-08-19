import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import SocialIcon from "../../widgets/SocialIcon.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

/*
 * The tech marks that float over the hero art.
 *
 * Positions, durations and delays are constants, not generated. Anything
 * derived from Math.random() here would differ between the server render and
 * hydration, and React would throw the whole server-rendered hero away.
 *
 * They sit in the grid's second column, which the layout already leaves open
 * for the artwork — so they overlay the art without a stacking context of
 * their own and without displacing the copy on the left.
 */
const TECH_MARKS = [
  { src: "/tech/react.png", alt: "React", size: 62, top: "10%", left: "4%", duration: "3.6s", delay: "0s" },
  { src: "/tech/mui.png", alt: "Material UI", size: 52, top: "6%", left: "40%", duration: "4.6s", delay: "1.1s" },
  { src: "/tech/react-native.png", alt: "React Native", size: 58, top: "34%", left: "18%", duration: "4.1s", delay: "0.5s" },
  { src: "/tech/app-store.png", alt: "App Store", size: 50, top: "40%", left: "56%", duration: "5s", delay: "0.3s" },
  { src: "/tech/firebase.png", alt: "Firebase", size: 54, top: "64%", left: "6%", duration: "4.8s", delay: "0.8s" },
  { src: "/tech/play-store.png", alt: "Google Play", size: 50, top: "74%", left: "42%", duration: "4.3s", delay: "1.6s" },
];

export default function Hero() {
  const profile = useProfile();

  return (
    <Box
      component="section"
      className="relative flex min-h-[86vh] items-center overflow-hidden px-0 pb-16 pt-24 max-[900px]:min-h-0"
    >
      <Box aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <picture>
          <source media="(max-width: 900px)" srcSet="/bg/home-mobile.jpg" />
          <img
            src="/hero/devices.png"
            alt=""
            width={1600}
            height={1066}
            className="h-full w-full object-cover object-right"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        <Box className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgb(5_8_22/0.82)_0%,rgb(5_8_22/0.6)_32%,rgb(5_8_22/0.12)_58%,rgb(5_8_22/0.18)_100%)] min-[900px]:block" />
        <Box className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_8_22/0.86)_0%,rgb(5_8_22/0.78)_55%,rgb(5_8_22/0.92)_100%)] min-[900px]:hidden" />
        <Box className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-bg))]" />
      </Box>

      <SectionBackground variant="hero" />

      <Container>
        <Box className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-16 max-[900px]:grid-cols-1">
          <Box>
            <Chip
              variant="outlined"
              label={
                <>
                  <Box component="span" aria-hidden sx={{ mr: 1.25 }}>
                    👋
                  </Box>
                  HELLO, I&apos;M
                </>
              }
              className="mb-7 h-auto rounded-full border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted"
            />

            <Typography
              variant="h1"
              className="m-0 font-display text-[76px] font-bold leading-[1.02] tracking-[-0.035em] max-[720px]:text-[44px]"
            >
              {profile.name}
            </Typography>

            <Typography
              variant="h2"
              className="mb-1 bg-[image:var(--gradient-01)] bg-clip-text font-display text-[42px] font-semibold leading-tight tracking-[-0.02em] text-transparent max-[720px]:text-[28px]"
            >
              {profile.role}
            </Typography>

            <Typography
              variant="h3"
              className="mb-7 font-display text-[38px] font-medium leading-[1.2] tracking-[-0.02em] text-fg-2 max-[720px]:text-[24px]"
            >
              {profile.specialism}
            </Typography>

            <Typography className="mb-9 max-w-[480px] text-[16.5px] leading-[1.75] text-muted">
              {profile.aboutSummary}
            </Typography>

            <Stack direction="row" className="mb-11 flex flex-wrap gap-4">
              {ROUTE_PATH.PROJECTS && (
                <Button component={Link} to={ROUTE_PATH.PROJECTS} className="btn btn-primary">
                  Explore My Work{" "}
                  <Box component="span" aria-hidden className="arrow">
                    →
                  </Box>
                </Button>
              )}

              {ROUTE_PATH.RESUME && (
                <Button component={Link} to={ROUTE_PATH.RESUME} className="btn btn-ghost">
                  Download Resume{" "}
                  <Box component="span" aria-hidden className="arrow">
                    ↓
                  </Box>
                </Button>
              )}
            </Stack>

            <Typography className="eyebrow mb-4">Connect with me</Typography>

            <Stack component="ul" direction="row" className="flex gap-3">
              {profile.socials.map((social) => (
                <li key={social.name}>
                  <Box
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="surface surface-interactive flex h-11 w-11 items-center justify-center !rounded-[13px] text-muted hover:text-fg"
                  >
                    <SocialIcon name={social.name} mark={social.label} size={19} />
                  </Box>
                </li>
              ))}
            </Stack>
          </Box>

          {/*
            Hidden below 900px, where the grid collapses to one column: there
            is no art column left to float over, and the badges would push the
            CTAs down the page instead of decorating it.
          */}
          <Box
            component="ul"
            aria-label="Core technologies"
            className="relative h-[440px] w-full max-[900px]:hidden"
          >
            {TECH_MARKS.map((mark) => (
              <Box
                component="li"
                key={mark.src}
                className="tech-bob absolute"
                style={{
                  top: mark.top,
                  left: mark.left,
                  "--bob-duration": mark.duration,
                  "--bob-delay": mark.delay,
                }}
              >
                <img
                  src={mark.src}
                  alt={mark.alt}
                  width={mark.size}
                  height={mark.size}
                  loading="lazy"
                  decoding="async"
                  className="drop-shadow-[0_6px_18px_rgb(0_0_0/0.55)]"
                  style={{ width: mark.size, height: mark.size }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
