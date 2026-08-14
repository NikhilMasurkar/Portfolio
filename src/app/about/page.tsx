import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionBackground } from "@/components/ui/section-background";
import { Reveal } from "@/components/ui/reveal";
import { AboutHero } from "@/components/about/about-hero";
import { TechGrid } from "@/components/about/tech-grid";
import { ExperienceTimeline } from "@/components/about/experience-timeline";
import { aboutSummary } from "@/data/about";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description: aboutSummary,
  openGraph: {
    title: "About",
    description: aboutSummary,
    url: new URL("/about", siteConfig.url).toString(),
  },
};

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden py-24">
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
