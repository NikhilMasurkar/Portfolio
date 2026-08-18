import React from "react";
import { Link } from "react-router";
import Container from "../app/widgets/Container.jsx";
import { NAV_ITEMS } from "../app/global/nav.js";
import { useProfile } from "../app/global/ContentContext.jsx";

export default function Footer() {
  // Name and socials come from Firestore now, so editing them in the admin
  // panel updates the footer of every page without a deploy.
  const profile = useProfile();

  return (
    <footer className="relative z-10 border-t border-line-header bg-surface/60">
      <Container className="flex flex-wrap items-center justify-between gap-8 py-8 max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <div className="mb-1.5 font-display text-xl font-bold tracking-tight">
            NM<span className="text-accent-text">.</span>
          </div>
          <p className="text-[12.5px] leading-relaxed text-dim">
            © {new Date().getFullYear()} {profile.name}.
            <br />
            All rights reserved.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className="text-[13px] text-meta transition-colors hover:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="flex gap-2.5">
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
                <span aria-hidden>{social.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
