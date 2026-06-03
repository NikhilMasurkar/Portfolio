import { Linkedin, Mail, MapPin, Phone } from "lucide-react";

const experienceData = [
  {
    title: "Senior Frontend Developer",
    company: "Avinash Group of Institute, Hyderabad",
    duration: "04/2026 - Present",
    points: [
      "Modernized and made fully responsive a large-scale React admin portal spanning 177 routes and 368 modal implementations, while redesigning the complete theme system.",
      "Delivered a complete UI modernization and responsive redesign in 15 working days, improving maintainability, user experience, and design consistency across the platform.",
      "Upgraded React and React Native applications across major versions, resolving dependency conflicts, modernizing architecture, and ensuring production stability.",
      "Deployed and managed production workloads on AWS ECS, improving deployment reliability and streamlining release processes.",
      "Managed end-to-end mobile release cycles, publishing React Native builds to the Google Play Console and Apple App Store Connect for both Android and iOS.",
    ],
  },
  {
    title: "React Native Developer | Frontend Developer",
    company: "Indigolearn Edu Tech Pvt Ltd, Hyderabad",
    duration: "09/2022 - 03/2026",
    points: [
      "Led development and maintenance of a React Native mobile application with 100,000+ downloads and 15,000+ active users across Android and iOS platforms.",
      "Mentored 3 junior developers in React Native best practices, code reviews, and debugging methodologies, improving team productivity by 30%.",
      "Built a reusable component library with 50+ components, reducing development time by 30%.",
      "Architected and developed responsive cross-platform mobile applications using the React Native framework.",
      "Developed comprehensive features including discussion forums, interactive MCQs, and study planner modules.",
      "Built an employee management dashboard with secure login/logout, user authentication, and a leave management system.",
      "Configured React Navigation for complex navigation flows and deep linking capabilities.",
    ],
  },
];

const educationData = [
  {
    title: "Bachelor of Engineering in Mechanical Engineering",
    institution: "Priyadarshini Bhagwati College of Engineering, Nagpur",
    duration: "2016 - 2019",
    grade: "Grade: A",
  },
  {
    title: "Diploma in Mechanical Engineering",
    institution: "Government Polytechnic Bramhapuri (MSBTE)",
    duration: "2012 - 2016",
    grade: "Grade: A",
  },
  {
    title: "Secondary School Certificate (SSC)",
    institution: "Bharat Vidyalaya, Hinganghat",
    duration: "2011 - 2012",
    grade: "Grade: A",
  },
];

const skillsData = [
  {
    title: "Languages",
    skills: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3"],
    delay: 100,
  },
  {
    title: "Web Development",
    skills: ["React.js", "Vite", "React Router", "Responsive Web Design"],
    delay: 150,
  },
  {
    title: "Mobile Development",
    skills: ["React Native", "Android", "iOS", "Cross-platform"],
    delay: 200,
  },
  {
    title: "UI Libraries",
    skills: ["Material UI (MUI)", "Ant Design (AntD)"],
    delay: 250,
  },
  {
    title: "State Management",
    skills: ["Redux", "Redux Toolkit", "Context API", "AsyncStorage"],
    delay: 300,
  },
  {
    title: "API Integration",
    skills: ["REST APIs", "Axios", "Fetch API"],
    delay: 350,
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS", "AWS ECS", "CI/CD"],
    delay: 400,
  },
  {
    title: "App Release",
    skills: ["Google Play Console", "App Store Connect"],
    delay: 450,
  },
  {
    title: "Version Control",
    skills: ["Git", "GitHub", "AWS CodeCommit"],
    delay: 500,
  },
  {
    title: "Testing & Debugging",
    skills: ["Unit & Regression Testing", "Chrome DevTools"],
    delay: 550,
  },
  {
    title: "Tools & Navigation",
    skills: ["React Navigation", "Deep Linking", "Webpack", "VdoCipher SDK"],
    delay: 600,
  },
  {
    title: "Project Management",
    skills: ["JIRA"],
    delay: 650,
  },
];

const projects = [
  {
    id: 11, 
    title: "BudgetIQ",
    description:
      "A sleek, responsive personal finance and budget intelligence dashboard. Connects securely to Google Sheets as a database using Google OAuth 2.0, providing interactive financial trends (Chart.js), custom Excel (.xlsx) parsing/generation (ExcelJS), and dynamic multi-select bulk copy features.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/portfolio/Screenshot+2026-05-25+at+11.50.57%E2%80%AFAM.png",
    technologies: [
      "React",
      "Vite",
      "Google Sheets API",
      "Google OAuth 2.0",
      "Chart.js",
      "ExcelJS",
      "Netlify",
    ],
    demoUrl: "https://budgetiqnik.netlify.app",
    githubUrl: "https://github.com/NikhilMasurkar/Budget-Intelligence-Dashboard",
    category: "react",
  },
  {
    id: 1,
    title: "Website for 1FIN by IndigoLearn",
    description:
      "A modern, responsive educational website built with React and Material UI for 1FIN by IndigoLearn. Showcases courses for CA, CMA & ACCA with smooth navigation and real-time interaction features.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/portfolio/indigolearn-web_page.png",
    technologies: [
      "React",
      "Redux",
      "React Router",
      "Axios",
      "Firebase",
      "VdoCipher",
      "Material UI",
      "tss-react",
      "chart.js",
      "react-oauth/google",
    ],
    demoUrl: "https://indigolearn.com",
    githubUrl: "",
    category: "react",
  },

  {
    id: 2,
    title: "Forum Landing Page (ForumUI)",
    description:
      "A responsive web-based forum built with React, allowing users to create posts, join discussions, and interact on various topics in real-time.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/Screenshot+2025-06-16+at+3.05.46%E2%80%AFPM.png",
    technologies: ["React", "material UI"],
    demoUrl: "https://forumui.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/ForumUI/tree/main",
    category: "react",
  },
  {
    id: 3,
    title: "MAYA (Admin Panel)",
    description:
      "A comprehensive admin portal for 1Fin By Avinash platforms with analytics, purchased, order management, and plan management, employee management, revenue, leads and etc.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/adminpanel.png",
    technologies: ["React", "Material UI", "Chart.js", "antdesign"],
    demoUrl: "https://admin.indigolearn.com",
    githubUrl: "https://github.com/NikhilMasurkar/E-commerce-Dashboard",
    category: "react",
  },
  {
    id: 5,
    title: "The Sky Events (Event Management Compony)",
    description:
      "A modern website for a Events professional, built with React,TypeScript,tailwind css and Material UI, featuring a clean design, service pages.",
    image: "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/theSkyEvents.png",
    technologies: ["React", "TypeScript","tailwind-CSS","Material UI",],
    demoUrl: "https://theskyevents.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/theSkyEvents",
    category: "react",
  },
  {
    id: 6,
    title: "App for 1FIN by Indigolearn",
    description:
      "1FIN by IndigoLearn is a leading learning app for CA, CMA, and ACCA aspirants, offering expert-led video courses and practice tools Trusted by 1,00,000+ users, it’s your go-to app for exam success in finance and accounting.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/indigolearn-min.png",
    technologies: [
      "React Native",
      "Firebase",
      "Redux",
      "VdoCipher",
      "Payment Gateway(Razorpay)",
      "gifted-charts",
    ],
    demoUrl:
      "https://play.google.com/store/apps/details?id=com.indigolearn.fin1",
    githubUrl: "",
    category: "reactNative",
  },
];

const contactInfo = [
  {
    icon: <Phone size={24} />,
    title: "Phone",
    content: "7385208601",
    link: "tel:7385208601",
  },
  {
    icon: <Mail size={24} />,
    title: "Email",
    content: "nikhildmasurkar@gmail.com",
    link: "mailto:nikhildmasurkar@gmail.com",
  },
  {
    icon: <Linkedin size={24} />,
    title: "LinkedIn",
    content: "linkedin.com/in/nikhil-masurkar",
    link: "https://www.linkedin.com/in/nikhil-masurkar",
  },
  {
    icon: <MapPin size={24} />,
    title: "Location",
    content: "Hinganghat, Wardha, Maharashtra 442301, India",
    link: null,
  },
];

const aboutUsData = [
  "I'm a React and React Native developer with 3.5+ years of experience crafting responsive, high-performance applications for both web and mobile platforms. I specialize in building seamless, cross-platform user experiences that are fast, intuitive, and reliable.",
  "With a strong focus on clean code, reusability, and performance optimization, I bring a design-aware mindset to every project. I enjoy translating complex problems into elegant UI solutions, keeping usability and maintainability at the core.",
  "Outside of work, I actively explore new technologies, contribute to open-source projects, and continuously grow my skills to stay current in the fast-paced world of frontend and mobile development.",
];

export {
  experienceData,
  skillsData,
  projects,
  contactInfo,
  educationData,
  aboutUsData,
};
