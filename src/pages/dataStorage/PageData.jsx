import { Linkedin, Mail, MapPin, Phone } from "lucide-react";

const experienceData = [
  {
    title: "React/React Native Developer",
    company: "Indigolearn Edu Tech Pvt Ltd, Hyderabad",
    duration: "22 Sept 2022 - Present",
    points: [
      "Led end-to-end frontend development and maintenance for 1FIN by IndigoLearn across the admin panel, user-facing website, and mobile apps (Android & iOS) using React and React Native, ensuring consistent UI/UX across platforms.",
      "Built responsive and interactive interfaces using React, Material UI, and tss-react, significantly improving user engagement and accessibility.",
      "Implemented scalable state management with Redux and seamless routing with React Router.",
      "Collaborated closely with backend and design teams to plan and deliver new features, optimize performance, and streamline the development process.",
      "Integrated secure authentication using Firebase and Google OAuth, along with DRM-protected video streaming via the VdoCipher SDK.",
      "Utilized Chart.js to build dynamic dashboards and visualize key learning and user activity metrics.",
      "Refactored and upgraded legacy frontend codebases to follow modern, modular architectures and best practices.",
      "Managed stable release cycles by maintaining dependencies, resolving conflicts, and conducting thorough QA testing.",
      "Designed and deployed the ForumUI — a responsive web-based forum for real-time discussion and user-generated content using React and Material UI.",
      "Integrated AI-powered tools into the development workflow (e.g., Copilot, ChatGPT, AI-assisted testing), increasing productivity and code delivery efficiency by approximately 25–30%.",
      "Participated actively in sprint planning, technical discussions, and code reviews, while mentoring junior developers on React architecture and debugging practices.",
    ],
  },
];

const educationData = [
  {
    title: "Bachelor of Engineering in Mechanical",
    institution: "Priyadarshini Bhagwati College of Engineering, Nagpur",
    duration: "2016 - 2019",
    grade: "Grade : A",
  },
  {
    title: "Diploma In Mechanical Engineering",
    institution: "Government College of Engineering, Bramhapuri, Nagpur",
    duration: "2012 - 2019",
    grade: "Grade : A",
  },
];

const skillsData = [
  {
    title: "Frontend Development",
    skills: [
      "React.js & React Native",
      "JavaScript (ES6+)",
      "Redux",
      "Material UI & Styled Components",
    ],
    delay: 100,
  },
  {
    title: "Tools & Others",
    skills: [
      "Git & GitHub",
      "JIRA & Agile Methodologies",
      "Postman & API Testing",
      "AWS Deployment",
    ],
    delay: 200,
  },
];

const projects = [
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
    title: "E-Commerce Dashboard (Admin Panel)",
    description:
      "A comprehensive admin dashboard for e-commerce platforms with analytics, order management, and inventory tracking.",
    image:
      "https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React", "Material UI", "Chart.js", "antdesign"],
    demoUrl: "https://admin-e-commerce-dashboard.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/E-commerce-Dashboard",
    category: "react",
  },
  {
    id: 4,
    title: "Medical Professional Website (Dr Sarah Mitchell)",
    description:
      "A modern website for a medical professional, built with React and Material UI, featuring a clean design, service pages, and blog integration.",
    image: "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/dr_image.png",
    technologies: ["React", "Material UI",],
    demoUrl: "https://dr-sarah-mitchell.netlify.app/",
    githubUrl: "https://github.com/NikhilMasurkar/Dr-Sarah-Mitchell",
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
  {
    id: 7,
    title: "Nirva (Fitness Tracker App)",
    description:
      "A mobile application that helps users track their workouts, set fitness goals, and monitor progress over time. This app is built with React Native and Expo, and uses Firebase for authentication and data storage.",
    image:
      "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/Nirva+(Application)/Nirva_Login_page.png",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
    demoUrl: "",
    githubUrl: "https://github.com/NikhilMasurkar/Nirva",
    category: "reactNative",
  },

  {
    id: 8,
    title: "Food Delivery App",
    description:
      "A mobile app for food ordering with restaurant listings, menu browsing, cart management, and order tracking.",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React Native", "Redux", "Google Maps API", "Stripe"],
    demoUrl: "",
    githubUrl: "",
    category: "reactNative",
  },
  {
    id: 9,
    title: "Task Management System",
    description:
      "A project management tool with task assignment, progress tracking, and team collaboration features.",
    image:
      "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React", "TypeScript", "Material UI", "Firebase"],
    demoUrl: "",
    githubUrl: "",
    category: "react",
  },
  {
    id: 10,
    title: "Travel Companion App",
    description:
      "A mobile application for travelers with features like trip planning, itinerary management, and location-based recommendations.",
    image:
      "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React Native", "Expo", "Google Places API", "AsyncStorage"],
    demoUrl: "",
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
    content: "Mumbai, India",
    link: null,
  },
];

const aboutUsData = [
  "I'm a React and React Native developer with 2.5+ years of experience crafting responsive, high-performance applications for both web and mobile platforms. I specialize in building seamless, cross-platform user experiences that are fast, intuitive, and reliable.",
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
