import React from "react";
import { Link } from "react-router";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import SocialIcon from "../../widgets/SocialIcon.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function Hero() {
  const profile = useProfile();

  return (
    <section className="relative flex min-h-[86vh] items-center overflow-hidden px-0 pb-16 pt-24 max-[900px]:min-h-0">
      {/*
        Hero backdrop — the commissioned device render, used as the scene the
        copy sits inside rather than as a picture beside it.

        That is what the composition is built for: the laptop and phone occupy
        the right of the frame and the left is open space, so the headline
        lands in the gap the artwork already leaves. Placing it in a column
        instead put a second rectangle on the page and fought the layout.

        Two sources, so phones never download the wide desktop plate —
        <picture> chooses at parse time, before any JS runs. Decorative, so the
        alt is empty and the whole layer is aria-hidden.

        The scrim is load-bearing, not decoration: the render is bright on the
        right, and the headline needs a guaranteed-dark bed on the left to hold
        the 4.5:1 floor the rest of the palette is held to. Weakening the first
        two stops is what would break it.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <picture>
          <source media="(max-width: 900px)" srcSet="/bg/home-mobile.jpg" />
          <img
            src="/hero/devices.jpg"
            alt=""
            width={1500}
            height={1000}
            className="h-full w-full object-cover object-[68%_center]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        {/*
          Two scrims, because the copy sits somewhere different at each size.

          Desktop is asymmetric: sampling the render shows its mid-tones are
          already near-black (rgb(0,4,26) around the laptop), so an even scrim
          buries it — earlier values did exactly that. The left stays fully
          covered because the headline is there and has to hold 4.5:1; the
          right is barely touched so the artwork can be seen at all.

          Below 900px the copy spans the full width, so a left-to-right scrim
          protects nothing on the right and the paragraph runs over the bright
          part of the plate. The mobile one is vertical and even instead.
        */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(100deg,var(--color-bg)_0%,rgb(5_8_22/0.88)_30%,rgb(5_8_22/0.22)_56%,rgb(5_8_22/0.3)_100%)] min-[900px]:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(5_8_22/0.86)_0%,rgb(5_8_22/0.78)_55%,rgb(5_8_22/0.92)_100%)] min-[900px]:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-bg))]" />
      </div>

      <SectionBackground variant="hero" />

      <Container>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-16 max-[900px]:grid-cols-1">
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
                  className="btn btn-primary"
                >
                  Explore My Work <span aria-hidden className="arrow">→</span>
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
                  className="btn btn-ghost"
                >
                  Download Resume <span aria-hidden className="arrow">↓</span>
                </Link>
              )}
            </div>

            <p className="eyebrow mb-4">
              Connect with me
            </p>
            <ul className="flex gap-3">
              {profile.socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="surface surface-interactive flex h-11 w-11 items-center justify-center !rounded-[13px] text-muted hover:text-fg"
                  >
                    <SocialIcon name={social.name} mark={social.label} size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </Container>
    </section>
  );
}
