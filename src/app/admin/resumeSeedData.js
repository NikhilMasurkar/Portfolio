/**
 * The resume, transcribed from Nikhil_Masurkar_react_native_4Years.pdf.
 *
 * This is the wording that goes to recruiters, so it is copied verbatim rather
 * than paraphrased — every figure in it (100,000+ downloads, 4.3+ rating,
 * 99.8% crash-free, 177 routes, 368 modals, 15 working days) is a claim that
 * gets checked.
 *
 * Written into Firestore once by the seed, after which the admin panel owns
 * it. Delete this file when the resume editor lands.
 *
 * Note the role title here is "Senior Frontend Developer", which is what the
 * PDF says; the earlier seed had "Senior Software Developer". The PDF wins —
 * it is the document already in circulation.
 */

export const resume = {
  headline: "React Developer  |  React Native  |  Mobile Application Development",

  summary:
    "React and React Native Developer with 3.5+ years of experience building scalable mobile and web applications. Experienced in React, React Native, Redux, Material UI, Ant Design, AWS, and REST APIs. Proven track record of delivering high-performance applications with 100,000+ downloads, modernizing enterprise admin platforms, optimizing application performance, and mentoring development teams.",

  achievements: [
    "Spearheaded a flagship React Native app to 100,000+ downloads and 15,000+ active users, sustaining a 4.3+ Play Store rating and a 99.8% crash-free rate across Android and iOS.",
    "Overhauled a large-scale React admin portal of 177 routes and 368 modals into a fully responsive system, completing the redesign in just 15 working days.",
    "Deployed production workloads on AWS ECS and orchestrated end-to-end Android and iOS releases through Google Play Console and Apple App Store Connect.",
  ],

  /*
   * Order matters: these fill two columns top-to-bottom, left column first,
   * matching the PDF's arrangement.
   */
  skillGroups: [
    { label: "Languages", items: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"] },
    { label: "Web Development", items: ["React.js", "Vite", "React Router", "Responsive Web Design"] },
    { label: "Mobile Development", items: ["React Native", "Android", "iOS", "Cross-platform"] },
    { label: "UI Libraries", items: ["Material UI (MUI)", "Ant Design (AntD)"] },
    { label: "State Management", items: ["Redux", "Redux Toolkit", "Context API", "AsyncStorage"] },
    { label: "API Integration", items: ["REST APIs", "Axios", "Fetch API"] },
    { label: "Cloud & DevOps", items: ["AWS", "AWS ECS", "CI/CD"] },
    { label: "App Release", items: ["Google Play Console", "App Store Connect"] },
    { label: "Version Control", items: ["Git", "GitHub", "AWS CodeCommit"] },
    { label: "Testing & Debugging", items: ["Unit & Regression Testing", "Chrome DevTools"] },
    { label: "Tools & Navigation", items: ["React Navigation", "Deep Linking", "Webpack", "VdoCipher SDK"] },
    { label: "Project Management", items: ["JIRA"] },
  ],

  keyProjects: [
    {
      name: "1Fin by Indigolearn (Edu Tech Platform)",
      bullets: [
        "Built an e-learning mobile app with secure, DRM-protected video streaming via the VdoCipher SDK.",
        "Sustained a 4.3+ Play Store rating across 100,000+ downloads through continuous UX refinement.",
        "Boosted retention with targeted user-experience and onboarding optimizations.",
      ],
    },
    {
      name: "Employee Management Dashboard",
      bullets: [
        "Designed a full-featured employee portal with role-based access control.",
        "Integrated monthly calendar scheduling to streamline leave management.",
        "Established approval workflows with real-time status tracking on the leave dashboard.",
        "Secured the portal with authentication and authorization across multiple user roles.",
      ],
    },
    {
      name: "Performance Optimization Initiative",
      bullets: [
        "Reduced mobile app bundle size by 25% through advanced code splitting and lazy loading.",
        "Streamlined image caching and memory management to cut runtime overhead.",
        "Tuned rendering performance for complex, data-heavy UI components.",
      ],
    },
  ],

  professionalDevelopment: [
    "Mobile & Cloud Best Practices: Cross-platform optimization, performance tuning, and scalable deployment.",
    "Leadership & Quality: Team mentoring, code-review ownership, debugging expertise, and automated testing.",
  ],
};

/** Replaces the earlier experience seed — same roles, now with resume bullets. */
export const experience = [
  {
    id: "avinash-2026",
    role: "Senior Frontend Developer",
    company: "Avinash Group of Institute",
    location: "Hyderabad",
    period: "04/2026 - Present",
    summary:
      "Modernised a large-scale React admin portal spanning 177 routes and 368 modals, rebuilt its theme system, and delivered a fully responsive redesign in 15 working days. Also handled production deployments on AWS ECS and end-to-end React Native releases across Android and iOS.",
    bullets: [
      "Rebuilt a large-scale React admin portal of 177 routes and 368 modals into a fully responsive interface and re-architected the complete theme system for visual consistency.",
      "Completed the full UI overhaul and responsive redesign in 15 working days, strengthening maintainability, usability, and design consistency platform-wide.",
      "Migrated React and React Native applications across major releases, resolving dependency conflicts and refactoring legacy architecture to safeguard production stability.",
      "Containerized and deployed production workloads on AWS ECS, improving deployment reliability and streamlining the release pipeline.",
      "Owned end-to-end mobile release management, publishing React Native builds to Google Play Console and Apple App Store Connect across Android and iOS.",
    ],
    order: 0,
  },
  {
    id: "indigolearn-2022",
    role: "React Native Developer | Frontend Developer",
    company: "Indigolearn Edu Tech Pvt Ltd",
    location: "Hyderabad",
    period: "09/2022 - 03/2026",
    summary:
      "Developed and maintained a React Native learning platform with 100,000+ downloads across Android and iOS. Built and maintained a 50+ component reusable UI library that reduced development time by 30%, worked across production debugging and releases, and mentored three junior developers.",
    bullets: [
      "Drove development and maintenance of a React Native app to 100,000+ downloads and 15,000+ active users across Android and iOS.",
      "Mentored 3 junior developers in React Native practices, code review, and debugging, lifting team productivity by 30%.",
      "Engineered a reusable component library of 50+ components, cutting feature development time by 30%.",
      "Architected responsive cross-platform interfaces in React Native, ensuring consistent performance on both Android and iOS.",
      "Launched 3 core learning modules — discussion forums, interactive MCQs, and a study planner — to deepen user engagement.",
      "Created an employee management dashboard with secure authentication and an integrated leave-management workflow.",
      "Configured complex navigation flows and deep linking with React Navigation, simplifying access across the app.",
    ],
    order: 1,
  },
];

export const education = [
  {
    id: "be-mechanical",
    qualification: "Bachelor of Engineering in Mechanical Engineering",
    institution: "Priyadarshini Bhagwati College of Engineering, Nagpur",
    period: "2016 - 2019",
    grade: "A",
    order: 0,
  },
  {
    id: "diploma-mechanical",
    qualification: "Diploma in Mechanical Engineering",
    institution: "Government Polytechnic Bramhapuri (MSBTE)",
    period: "2012 - 2016",
    grade: "A",
    order: 1,
  },
  {
    id: "ssc",
    qualification: "Secondary School Certificate (SSC)",
    institution: "Bharat Vidyalaya, Hinganghat",
    period: "2011 - 2012",
    grade: "A",
    order: 2,
  },
];

/** Header details the PDF carries that the profile did not. */
export const contactPatch = {
  // The PDF header carries the full legal name; the site brands on "Nikhil
  // Masurkar", so this is stored separately rather than overwriting it.
  fullName: "Nikhil Dilip Masurkar",
  phone: "+91 7385208601",
  location: "Hinganghat, Wardha, Maharashtra 442301, India",
};
