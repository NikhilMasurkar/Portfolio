import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import Reveal from "../../widgets/Reveal.jsx";
import ContactForm from "./ContactForm.jsx";
import SocialIcon from "../../widgets/SocialIcon.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

/**
 * Contact details and a form, carried over from the previous site's Contact
 * page and rebuilt against the current tokens.
 *
 * The details come from Firestore, so the email, phone and location shown here
 * are the same values the footer and structured data use — there is no second
 * copy to fall out of date.
 */
export default function Contact() {
  const profile = useProfile();

  const details = [
    profile.phone && {
      title: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
      mark: "☎",
    },
    {
      title: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      mark: "@",
    },
    ...profile.socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => ({
        title: social.name,
        value: social.href.replace(/^https?:\/\/(www\.)?/, ""),
        href: social.href,
        mark: social.label,
        external: true,
      })),
    profile.location && {
      title: "Location",
      value: profile.location,
      href: null,
      mark: "◎",
    },
  ].filter(Boolean);

  return (
    <Box component="section" className="relative overflow-hidden py-24">
      <Seo path={ROUTE_PATH.CONTACT} />
      <SectionBackground variant="contact" />

      <Container>
        <Typography className="mb-4 text-xs font-semibold tracking-[0.2em] text-dim">
          CONTACT
        </Typography>
        <Typography
          variant="h1"
          className="m-0 mb-4 font-display text-[42px] font-bold tracking-[-0.02em] max-[720px]:text-[32px]"
        >
          Let&apos;s Talk
        </Typography>
        <Typography className="mb-14 max-w-[560px] text-base leading-[1.75] text-muted">
          I&apos;m open to full-time roles and freelance work. Questions,
          feedback and suggestions are all welcome — I read everything that
          comes through here.
        </Typography>

        <Box className="grid gap-8 min-[900px]:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <Typography variant="h2" className="mb-6 text-xs font-semibold tracking-[0.2em] text-dim">
              CONTACT INFORMATION
            </Typography>

            <Box component="ul" className="grid gap-4">
              {details.map((detail) => (
                <li
                  key={detail.title}
                  className="flex items-start gap-4 rounded-[18px] border border-line bg-surface/85 p-5 transition-colors hover:border-primary"
                >
                  <Box
                    component="span"
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-raised bg-surface-raised font-mono text-[13px] text-primary-text"
                  >
                    <SocialIcon name={detail.title} mark={detail.mark} size={17} />
                  </Box>

                  <Box className="min-w-0">
                    <Typography className="font-display text-[15px] font-semibold text-fg-2">
                      {detail.title}
                    </Typography>
                    {detail.href ? (
                      <Box
                        component="a"
                        href={detail.href}
                        {...(detail.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="mt-0.5 block break-words text-sm text-muted transition-colors hover:text-secondary"
                      >
                        {detail.value}
                      </Box>
                    ) : (
                      <Typography className="mt-0.5 break-words text-sm text-muted">
                        {detail.value}
                      </Typography>
                    )}
                  </Box>
                </li>
              ))}
            </Box>
          </Reveal>

          <Reveal delay={0.08}>
            <Paper
              elevation={0}
              className="rounded-[22px] border border-line bg-surface/85 p-8 shadow-card max-[720px]:p-6"
            >
              <Typography
                variant="h2"
                className="mb-6 font-display text-[22px] font-semibold tracking-[-0.01em]"
              >
                Send me a message
              </Typography>
              <ContactForm email={profile.email} />
            </Paper>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}
