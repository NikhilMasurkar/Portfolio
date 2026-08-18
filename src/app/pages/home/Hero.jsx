import React from "react";
import { Link } from "react-router";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import HeroArt from "./HeroArt.jsx";
import SocialIcon from "../../widgets/SocialIcon.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function Hero() {
  const profile = useProfile();

  return (
    <section className="relative overflow-hidden px-0 pb-10 pt-24">
      {/*
        Hero backdrop. Two sources so phones never download the 1920px desktop
        plate; <picture> picks one at parse time, before any JS runs.
        Decorative, so alt is empty and it is aria-hidden.

        The gradient scrim is not decoration: the artwork is bright on the
        right, and the headline needs a guaranteed-dark bed on the left to hold
        the 4.5:1 contrast floor the rest of the palette is held to.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <picture>
          <source media="(max-width: 720px)" srcSet="/bg/hero-mobile.jpg" />
          <img
            src="/bg/hero-desktop.jpg"
            alt=""
            className="h-full w-full object-cover object-right"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-[linear-gradient(100deg,var(--color-bg)_0%,rgb(5_8_22/0.92)_38%,rgb(5_8_22/0.55)_70%,rgb(5_8_22/0.75)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-bg))]" />
      </div>

      <SectionBackground variant="hero" />

      <Container>
        <div className="grid grid-cols-[1.05fr_.95fr] items-center gap-16 max-[900px]:grid-cols-1">
          <div>
            <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/80 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-muted">
              <span aria-hidden>👋</span>
              HELLO, I&apos;M
            </p>

            <h1 className="m-0 font-display text-[76px] font-bold leading-[1.02] tracking-[-0.035em] max-[720px]:text-[44px]">
              {profile.name}
            </h1>

            <p className="mb-1 bg-[image:var(--gradient-01)] bg-clip-text font-display text-[42px] font-semibold leading-tight tracking-[-0.02em] text-transparent max-[720px]:text-[28px]">
              {profile.role}
            </p>

            <p className="mb-7 font-display text-[38px] font-medium leading-[1.2] tracking-[-0.02em] text-fg-2 max-[720px]:text-[24px]">
              {profile.specialism}
            </p>

            <p className="mb-9 max-w-[480px] text-[16.5px] leading-[1.75] text-muted">
              {profile.aboutSummary}
            </p>

            {/*
              Both CTAs are gated on their route existing. A hardcoded href to
              a page that has not been built is a 404 shipped in the most
              prominent position on the site — which is exactly what the
              previous build did with /resume.
            */}
            <div className="mb-11 flex flex-wrap gap-4">
              {ROUTE_PATH.PROJECTS && (
                <Link
                  to={ROUTE_PATH.PROJECTS}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-4 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
                >
                  Explore My Work <span aria-hidden>→</span>
                </Link>
              )}
              {/*
                Links to the resume page rather than straight at the PDF: the
                page works on a phone, is indexable, and offers the download
                itself. It also cannot 404 when no PDF has been uploaded.
              */}
              {ROUTE_PATH.RESUME && (
                <Link
                  to={ROUTE_PATH.RESUME}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-line-raised bg-surface/70 px-7 py-4 text-[15px] font-semibold text-fg transition-colors hover:border-primary"
                >
                  Download Resume <span aria-hidden>↓</span>
                </Link>
              )}
            </div>

            <p className="mb-4 text-[11.5px] font-semibold tracking-[0.18em] text-dim">
              CONNECT WITH ME
            </p>
            <ul className="flex gap-3">
              {profile.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-11 w-11 items-center justify-center rounded-[11px] border border-line bg-surface/80 font-mono text-[13px] font-semibold text-muted transition-all hover:-translate-y-0.5 hover:border-primary hover:text-fg"
                  >
                    <SocialIcon name={social.name} mark={social.label} size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <HeroArt />
        </div>
      </Container>
    </section>
  );
}
