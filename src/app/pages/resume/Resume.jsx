import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Container from "../../widgets/Container.jsx";
import SectionBackground from "../../widgets/SectionBackground.jsx";
import DownloadResume from "./DownloadResume.jsx";
import ResumeSheet from "./ResumeSheet.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useContent, useProfile } from "../../global/ContentContext.jsx";

/**
 * The resume, read-only.
 *
 * The document itself lives in ResumeSheet, shared with /resume/edit so the
 * page people read and the page you edit cannot drift. This file only adds
 * the site chrome around it.
 *
 * The download is this page printed, so what is on screen is what comes out.
 */
export default function Resume() {
  const profile = useProfile();
  const { resume, experience, education } = useContent();

  return (
    <section
      className="relative overflow-hidden py-16 max-[720px]:py-8"
      data-print="page"
    >
      <Seo path={ROUTE_PATH.RESUME} />
      {/* aria-hidden already, and the print rules drop it — a resume PDF has
          no business carrying a nebula. */}
      <SectionBackground variant="resume" />

      <Container>
        {/* Excluded from the PDF — a printed resume should not carry its own
            download button. */}
        <div
          data-print="hide"
          className="mx-auto mb-6 flex max-w-[820px] flex-wrap items-center justify-between gap-4"
        >
          <p className="text-sm text-muted">
            Generated from this page — always matches the site.
          </p>
          <DownloadResume name={profile.name} />
        </div>

        <ResumeSheet
          profile={profile}
          resume={resume}
          experience={experience}
          education={education}
        />
      </Container>
    </section>
  );
}
