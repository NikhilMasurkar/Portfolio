export const siteConfig = {
  name: "Nikhil Masurkar",
  role: "Frontend Engineer",
  specialism: "React Native Specialist",
  tagline: "Building Production Software.",
  description:
    "Frontend Engineer and React Native specialist building high-performance web and mobile applications.",
  /** Single source of truth for every canonical, OG and sitemap URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: "nikhildmasurkar@gmail.com",
} as const;
