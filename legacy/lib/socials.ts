import { siteConfig } from "./site-config";

/** `name` is the accessible name; `label` is the two-character visual mark. */
export const socials = [
  { label: "GH", name: "GitHub", href: "https://github.com/NikhilMasurkar" },
  {
    label: "in",
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/nikhil-masurkar",
  },
  { label: "@", name: "Email", href: `mailto:${siteConfig.email}` },
] as const;
