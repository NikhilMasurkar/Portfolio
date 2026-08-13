import { yearsOfExperience } from "@/lib/experience";
import type { Client, Experience, Stat } from "./schemas";

/**
 * Only claims that can be evidenced belong here. "Worked with", not
 * "Trusted by" — these are employers, not clients.
 */
export const clients: Client[] = [
  { name: "Avinash Group", mark: "AG" },
  { name: "IndigoLearn", mark: "IL" },
  { name: "Freelance Clients", mark: "FC" },
];

export const stats: Stat[] = [
  // Derived from the 09/2022 start date so it cannot go stale.
  { value: `${yearsOfExperience()}+`, label: "Years Experience" },
  { value: "8", label: "Projects Shipped" },
  { value: "100K+", label: "App Downloads" },
  { value: "177", label: "Routes Modernised" },
  { value: "50+", label: "Components Shipped" },
];

export const experience: Experience[] = [
  {
    role: "Senior Software Developer",
    company: "Avinash Group of Institute",
    period: "04/2026 — Present",
    summary:
      "Modernised a large-scale React admin portal spanning 177 routes and 368 modals, rebuilt its theme system, and delivered a fully responsive redesign in 15 working days. Also handled production deployments on AWS ECS and end-to-end React Native releases across Android and iOS.",
  },
  {
    role: "Frontend Developer | React Native Developer",
    company: "IndigoLearn Edu Tech Pvt Ltd",
    period: "09/2022 — 03/2026",
    summary:
      "Developed and maintained a React Native learning platform with 100,000+ downloads across Android and iOS. Built and maintained a 50+ component reusable UI library that reduced development time by 30%, worked across production debugging and releases, and mentored three junior developers.",
  },
];
