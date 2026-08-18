/**
 * The real content, carried over from the previous build.
 *
 * This file exists to be written into Firestore once and then deleted. It is
 * NOT a runtime source — after seeding, Firestore is the only source of truth,
 * and leaving a second copy in the bundle would be exactly the drift the move
 * to a database was meant to end.
 *
 * Truthfulness rules from the design spec apply and are load-bearing, because
 * recruiters verify: stats must be sourceable, and company framing is "Worked
 * with", not "Trusted by", because these are employers rather than clients.
 */

/** First day of the first professional role: IndigoLearn, September 2022. */
const CAREER_START = new Date(2022, 8, 1);

/** Completed years only — never rounds up to a year not yet worked. */
export function yearsOfExperience(now = new Date()) {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const monthDelta = now.getMonth() - CAREER_START.getMonth();
  if (
    monthDelta < 0 ||
    (monthDelta === 0 && now.getDate() < CAREER_START.getDate())
  ) {
    years -= 1;
  }
  return Math.max(0, years);
}

export const profile = {
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
  clients: [
    { name: "Avinash Group", mark: "AG" },
    { name: "IndigoLearn", mark: "IL" },
    { name: "Freelance Clients", mark: "FC" },
  ],
  /*
   * The years figure was derived at build time in the previous build so it
   * could not go stale. Stored content cannot derive itself, so this is a
   * snapshot taken when the seed runs — update it in the admin panel on the
   * anniversary, or it quietly understates your experience.
   */
  stats: [
    { value: `${yearsOfExperience()}+`, label: "Years Experience" },
    { value: "8", label: "Projects Shipped" },
    { value: "100K+", label: "App Downloads" },
    { value: "177", label: "Routes Modernised" },
    { value: "50+", label: "Components Shipped" },
  ],
  aboutHeadline: {
    lead: "Hi, I'm Nikhil.",
    statement: "I build products, not just websites.",
  },
  /*
   * The author's own words. Do not rewrite, summarise or "improve" this — it
   * is a personal statement, not marketing copy.
   */
  aboutParagraphs: [
    "I'm a Senior Software Engineer specialising in React and React Native, with a rather unconventional journey into software. I started out as a Mechanical Engineer and discovered my passion for technology while preparing for a TCS assessment. That curiosity led me to Newton School, where I transitioned from a non-tech background into software development.",
    "Since then, I've spent 3+ years building and shipping production-grade web applications, mobile apps, admin platforms, and reusable component systems. At IndigoLearn, I joined as a fresher and eventually took ownership of the frontend ecosystem, working across React, React Native, production debugging, releases, and integrations.",
    "I enjoy turning ideas and designs into fast, polished, maintainable products. I'm particularly strong at taking ownership, solving difficult production problems, building reusable architecture, and moving quickly from an idea to something users can actually use.",
    "Beyond my primary engineering work, I explore freelance projects, build websites and businesses, and experiment with creative work. I'm constantly learning and looking for better ways to build.",
    "My long-term goal is simple: become an exceptional frontend architect, build products of my own, and eventually start a company.",
  ],
  aboutSummary:
    "Building high-performance digital experiences for web and mobile. I enjoy solving complex problems and turning ideas into production software.",
};

export const skills = [
  { name: "React", mark: "Re", category: "Core" },
  { name: "React Native", mark: "RN", category: "Core" },
  { name: "Next.js", mark: "Nx", category: "Core" },
  { name: "TypeScript", mark: "TS", category: "Core" },
  { name: "JavaScript (ES6+)", mark: "JS", category: "Core" },
  { name: "Redux / Redux Toolkit", mark: "Rx", category: "State" },
  { name: "Material UI", mark: "MU", category: "UI" },
  { name: "Tailwind CSS", mark: "TW", category: "UI" },
  { name: "Firebase", mark: "Fb", category: "Backend" },
  { name: "Supabase", mark: "Sb", category: "Backend" },
  { name: "Node.js REST APIs", mark: "Nd", category: "Backend" },
  { name: "AWS (ECS)", mark: "AW", category: "Infra" },
  { name: "Git", mark: "Gt", category: "Tools" },
  { name: "Jira", mark: "Ji", category: "Tools" },
];

/**
 * Home-page order for featured work. Deliberate rather than array order, so
 * reordering the list below cannot silently reshuffle the home page.
 */
export const FEATURED_ORDER = ["indigolearn-app", "mezorder-pos", "acc-website"];

/** The eight real projects. Prototype filler is deliberately absent. */
export const projects = [
  {
    slug: "mezorder-pos",
    image: "/projects/mezorder.jpg",
    name: "MezOrder POS",
    category: "Web",
    summary:
      "A multi-tenant restaurant POS platform built as four Next.js applications — customer menu, business dashboard, super-admin console and marketing site — on a shared Supabase backend. Covers table and menu management, dine-in and takeaway orders, a kitchen display, GST-compliant billing with UPI QR codes, analytics and subscription billing.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui", "pdf-lib"],
    year: 2026,
    featured: true,
    gallery: [
      { src: "/projects/mezorder/dashboard.jpg", caption: "Business dashboard — live orders, revenue and table state at a glance" },
      { src: "/projects/mezorder/live-dashboard.jpg", caption: "Order mix by type and top-selling items" },
      { src: "/projects/mezorder/tables.jpg", caption: "Table management across floors, with occupancy and reservations" },
      { src: "/projects/mezorder/menu-management.jpg", caption: "Menu editor with categories, modifiers and per-channel availability" },
      { src: "/projects/mezorder/orders.jpg", caption: "Order management filtered by type and status" },
      { src: "/projects/mezorder/gst-bill.jpg", caption: "GST-compliant bill with CGST/SGST breakdown and a UPI QR code" },
      { src: "/projects/mezorder/analytics.jpg", caption: "Sales reporting and analytics" },
      { src: "/projects/mezorder/customer-menu.jpg", caption: "Customer-facing menu, opened by scanning the table QR" },
    ],
    liveUrl: "https://snapdeskbusinessdashboard-chi.vercel.app/",
    githubUrl: "https://github.com/NikhilMasurkar/Snapdesk",
  },
  {
    slug: "acc-website",
    image: "/projects/acc.jpg",
    name: "Avinash College of Commerce",
    category: "Web",
    summary:
      "A full rebuild of the college's WordPress site as a server-side rendered React 19 application — 36 routes, custom Express SSR, build-time sitemap and blog generation.",
    tech: ["React 19", "Vite", "Express (SSR)", "Material UI", "Swiper"],
    year: 2026,
    featured: true,
    liveUrl: "https://acc.edu.in/",
  },
  {
    slug: "indigolearn-app",
    image: "/projects/indigolearn-app.jpg",
    name: "1FIN by Avinash",
    category: "Mobile",
    summary:
      "A learning app for CA, CMA and ACCA aspirants with expert-led video courses and practice tools, serving 100,000+ downloads across Android and iOS.",
    tech: ["React Native", "Firebase", "Redux", "VdoCipher", "Razorpay"],
    year: 2025,
    featured: true,
    liveUrl: "https://play.google.com/store/apps/details?id=com.indigolearn.fin1",
  },
  {
    slug: "nucleus-admin",
    image: "/projects/nucleus.jpg",
    name: "Nucleus",
    category: "Web",
    summary:
      "A secure admin portal for the 1FIN platform — Google-authenticated, covering analytics, order and plan management, employee management, revenue and leads. Previously shipped as MAYA.",
    tech: ["React", "Material UI", "Chart.js", "Ant Design"],
    year: 2025,
    featured: false,
    liveUrl: "https://admin.indigolearn.com",
  },
  {
    slug: "budgetiq",
    image: "/projects/budgetiq.jpg",
    name: "BudgetIQ",
    category: "Web",
    summary:
      "A personal finance dashboard using Google Sheets as its database via OAuth 2.0, with interactive trends and custom Excel parsing.",
    tech: ["React", "Vite", "Google Sheets API", "Chart.js", "ExcelJS"],
    year: 2026,
    featured: false,
    liveUrl: "https://budgetiqnik.netlify.app",
    githubUrl: "https://github.com/NikhilMasurkar/Budget-Intelligence-Dashboard",
  },
  {
    slug: "indigolearn-web",
    image: "/projects/indigolearn-web.jpg",
    name: "IndigoLearn Website",
    category: "Web",
    summary:
      "A responsive educational website showcasing CA, CMA and ACCA courses, with smooth navigation and real-time interaction features.",
    tech: ["React", "Redux", "Firebase", "Material UI", "Chart.js"],
    year: 2024,
    featured: false,
    liveUrl: "https://indigolearn.com",
  },
  {
    slug: "the-sky-events",
    image: "/projects/sky-events.jpg",
    name: "The Sky Events",
    category: "Web",
    summary:
      "A website for an event management company with a clean design and dedicated service pages.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Material UI"],
    year: 2025,
    featured: false,
    liveUrl: "https://theskyevents.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/theSkyEvents",
  },
  {
    slug: "forum-ui",
    image: "/projects/forum-ui.jpg",
    name: "ForumUI",
    category: "Web",
    summary:
      "A responsive web forum where users create posts, join discussions and interact on topics in real time.",
    tech: ["React", "Material UI"],
    year: 2025,
    featured: false,
    liveUrl: "https://forumui.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/ForumUI/tree/main",
  },
];
