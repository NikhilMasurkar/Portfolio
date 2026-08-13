import type { Project } from "./schemas";

/** The eight real projects. Prototype filler is deliberately absent. */
export const projects: Project[] = [
  {
    slug: "mezorder-pos",
    image: "/projects/mezorder.png",
    name: "MezOrder POS",
    category: "Web",
    summary:
      "A multi-tenant restaurant POS platform built as four Next.js applications — customer menu, business dashboard, super-admin console and marketing site — on a shared Supabase backend. Covers table and menu management, dine-in and takeaway orders, a kitchen display, GST-compliant billing with UPI QR codes, analytics and subscription billing.",
    tech: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Tailwind CSS",
      "shadcn/ui",
      "pdf-lib",
    ],
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
    image: "/projects/acc.png",
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
    image: "/projects/indigolearn-app.png",
    name: "1FIN by IndigoLearn",
    category: "Mobile",
    summary:
      "A learning app for CA, CMA and ACCA aspirants with expert-led video courses and practice tools, serving 100,000+ downloads across Android and iOS.",
    tech: ["React Native", "Firebase", "Redux", "VdoCipher", "Razorpay"],
    year: 2025,
    featured: true,
    liveUrl:
      "https://play.google.com/store/apps/details?id=com.indigolearn.fin1",
  },
  {
    slug: "nucleus-admin",
    image: "/projects/nucleus.png",
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
    image: "/projects/budgetiq.png",
    name: "BudgetIQ",
    category: "Web",
    summary:
      "A personal finance dashboard using Google Sheets as its database via OAuth 2.0, with interactive trends and custom Excel parsing.",
    tech: ["React", "Vite", "Google Sheets API", "Chart.js", "ExcelJS"],
    year: 2026,
    featured: false,
    liveUrl: "https://budgetiqnik.netlify.app",
    githubUrl:
      "https://github.com/NikhilMasurkar/Budget-Intelligence-Dashboard",
  },
  {
    slug: "indigolearn-web",
    image: "/projects/indigolearn-web.png",
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
    image: "/projects/sky-events.png",
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
    image: "/projects/forum-ui.png",
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

/**
 * Order the home page shows featured work in — deliberate, not array order,
 * so reordering the source list cannot silently reshuffle the home page.
 * A test asserts this stays in sync with the `featured` flags.
 */
export const FEATURED_ORDER = [
  "indigolearn-app",
  "mezorder-pos",
  "acc-website",
] as const;

export const featuredProjects: Project[] = FEATURED_ORDER.map((slug) => {
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    throw new Error(`FEATURED_ORDER references unknown project slug "${slug}"`);
  }
  return project;
});
