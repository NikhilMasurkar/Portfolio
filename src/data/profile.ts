import type { Client, Experience, Stat } from "./schemas";

/**
 * Only claims that can be evidenced belong here. "Worked with", not
 * "Trusted by" — these are employers, not clients.
 */
export const clients: Client[] = [
  { name: "Avinash Group", mark: "AG" },
  { name: "IndigoLearn", mark: "IL" },
];

export const stats: Stat[] = [
  { value: "4+", label: "Years Experience" },
  { value: "100K+", label: "App Downloads" },
  { value: "177", label: "Routes Modernised" },
  { value: "50+", label: "Components Shipped" },
];

export const experience: Experience[] = [
  {
    role: "Senior Frontend Developer",
    company: "Avinash Group of Institute",
    period: "04/2026 — Present",
    summary:
      "Modernised a React admin portal spanning 177 routes and 368 modals, rebuilt the theme system, and shipped a full responsive redesign in 15 working days. Deployed production workloads on AWS ECS and ran end-to-end React Native releases to both stores.",
  },
  {
    role: "React Native Developer | Frontend Developer",
    company: "IndigoLearn Edu Tech Pvt Ltd",
    period: "09/2022 — 03/2026",
    summary:
      "Led development of a React Native app with 100,000+ downloads across Android and iOS. Built a 50+ component library that cut development time by 30%, and mentored three junior developers.",
  },
];
