import React from "react";
import Seo from "../../widgets/Seo.jsx";
import Hero from "./Hero.jsx";
import ProofStrip from "./ProofStrip.jsx";
import FeaturedProjects from "./FeaturedProjects.jsx";
import ContactCta from "./ContactCta.jsx";
import { ROUTE_PATH } from "../../global/RoutePath.js";
import { useProfile } from "../../global/ContentContext.jsx";

export default function Home() {
  const profile = useProfile();

  /**
   * Person schema, so search results can show the role and links rather than
   * just a title. Built from Firestore, so editing the profile updates the
   * structured data too.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    description: profile.description,
    sameAs: profile.socials
      .filter((social) => social.href.startsWith("http"))
      .map((social) => social.href),
  };

  return (
    <>
      <Seo path={ROUTE_PATH.HOME} jsonLd={jsonLd} />
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
      <ContactCta />
    </>
  );
}
