import { ContactCta } from "@/components/home/contact-cta";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { Hero } from "@/components/home/hero";
import { ProofStrip } from "@/components/home/proof-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
      <ContactCta />
    </>
  );
}
