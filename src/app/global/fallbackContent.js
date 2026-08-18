/**
 * What the site renders when Firestore cannot be read or `profile/main` fails
 * validation.
 *
 * Scope is deliberate: the profile only. It exists so the site degrades to
 * "correct identity, no content" rather than to a 500 or a blank page — the
 * header, footer, contact details and about copy all read from it. The lists
 * fall back to empty because an out-of-date copy of every project shipped in
 * the bundle would be a second source of truth that silently rots, which is
 * the exact problem moving content to Firestore was meant to solve.
 *
 * A visitor hitting this sees a real page with no projects. Loud in the logs,
 * survivable for a visitor, and impossible to mistake for working.
 */
export const FALLBACK_PROFILE = {
  name: "Nikhil Masurkar",
  role: "Frontend Engineer",
  specialism: "React Native Specialist",
  tagline: "Building Production Software.",
  description:
    "Frontend Engineer and React Native specialist building high-performance web and mobile applications.",
  email: "nikhildmasurkar@gmail.com",
  location: "India",
  socials: [
    { name: "GitHub", label: "GH", href: "https://github.com/NikhilMasurkar" },
    {
      name: "LinkedIn",
      label: "in",
      href: "https://www.linkedin.com/in/nikhil-masurkar",
    },
    { name: "Email", label: "@", href: "mailto:nikhildmasurkar@gmail.com" },
  ],
  stats: [],
  clients: [],
  aboutHeadline: {
    lead: "Hi, I'm Nikhil.",
    statement: "I build products, not just websites.",
  },
  aboutParagraphs: [],
  aboutSummary:
    "Building high-performance digital experiences for web and mobile. I enjoy solving complex problems and turning ideas into production software.",
};

export const FALLBACK_CONTENT = {
  profile: FALLBACK_PROFILE,
  projects: [],
  posts: [],
  experience: [],
  education: [],
  skills: [],
  degraded: true,
};
