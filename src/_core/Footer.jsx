import React from "react";
import { Link } from "react-router";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Container from "../app/widgets/Container.jsx";
import SocialIcon from "../app/widgets/SocialIcon.jsx";
import { NAV_ITEMS } from "../app/global/nav.js";
import { useProfile } from "../app/global/ContentContext.jsx";

export default function Footer() {
  // Name and socials come from Firestore now, so editing them in the admin
  // panel updates the footer of every page without a deploy.
  const profile = useProfile();

  return (
    <Box component="footer" className="relative z-10 border-t border-line-header bg-surface/60">
      <Container className="flex flex-wrap items-center justify-between gap-8 py-8 max-[720px]:flex-col max-[720px]:items-start">
        <Box>
          <Box className="mb-1.5 font-display text-xl font-bold tracking-tight">
            NM<Box component="span" className="text-accent-text">.</Box>
          </Box>
          <Typography className="text-[12.5px] leading-relaxed text-dim">
            © {new Date().getFullYear()} {profile.name}.
            <br />
            All rights reserved.
          </Typography>
        </Box>

        <Box component="nav" aria-label="Footer">
          <Stack component="ul" direction="row" className="flex flex-wrap gap-x-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="inline-block py-2 text-[13px] text-meta transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </Stack>
        </Box>

        <Stack component="ul" direction="row" className="gap-2.5">
          {profile.socials.map((social) => (
            <li key={social.name}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                // The two-letter mark is decorative; screen readers get the
                // real name from here instead.
                aria-label={social.name}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line font-mono text-[11px] text-meta transition-colors hover:border-primary hover:text-fg"
              >
                <SocialIcon name={social.name} mark={social.label} size={16} />
              </a>
            </li>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
