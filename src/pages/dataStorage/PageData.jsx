import { Linkedin, Mail, MapPin, Phone } from "lucide-react";

const experienceData = [
  {
    title: "React/React Native Developer",
    company: "Indigolearn Edu Tech Pvt Ltd, Hyderabad",
    duration: "22 Sept 2022 - Present",
    points: [
      "Developed and maintained performant, cross-platform mobile apps using React Native, ensuring responsive UIs across Android and iOS.",
      "Collaborated with backend teams to integrate RESTful APIs and enable smooth data flow throughout the app.",
      "Optimized rendering, reduced load times, and improved memory usage to enhance overall app performance.",
      "Built reusable UI components and implemented adaptive designs for consistent user experience on various devices.",
      "Guided junior developers on architecture, best practices, and debugging through code reviews and mentorship.",
      "Led planning, estimations, and contributed to technical discussions for new features and enhancements.",
      "Utilized React Navigation, Redux, Axios, and AsyncStorage for scalable state management, routing, and storage solutions.",
      "Implemented Firebase features, push notifications, and AppCenter OTA updates to improve app engagement and release flexibility.",
      "Integrated VdoCipher SDK for secure, DRM-enabled video streaming within the app.",
      "Maintained up-to-date dependencies and ensured compatibility with the latest OS versions.",
      "Managed stable and versioned release cycles with thorough pre-launch testing and QA practices.",
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
    title: "React Forum App",
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
    id: 2,
    title: "E-Commerce Dashboard",
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
    id: 3,
    title: "Social Media Platform",
    description:
      "A responsive web application with features like user authentication, post creation, comments, and real-time notifications.",
    image:
      "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io"],
    demoUrl: "https://example.com/demo3",
    githubUrl: "https://github.com/example/project3",
    category: "react",
  },
  {
    id: 4,
    title: "Food Delivery App",
    description:
      "A mobile app for food ordering with restaurant listings, menu browsing, cart management, and order tracking.",
    image:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React Native", "Redux", "Google Maps API", "Stripe"],
    demoUrl: "https://example.com/demo4",
    githubUrl: "https://github.com/example/project4",
    category: "reactNative",
  },
  {
    id: 5,
    title: "Task Management System",
    description:
      "A project management tool with task assignment, progress tracking, and team collaboration features.",
    image:
      "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React", "TypeScript", "Material UI", "Firebase"],
    demoUrl: "https://example.com/demo5",
    githubUrl: "https://github.com/example/project5",
    category: "react",
  },
  {
    id: 6,
    title: "Travel Companion App",
    description:
      "A mobile application for travelers with features like trip planning, itinerary management, and location-based recommendations.",
    image:
      "https://images.pexels.com/photos/3935702/pexels-photo-3935702.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React Native", "Expo", "Google Places API", "AsyncStorage"],
    demoUrl: "https://example.com/demo6",
    githubUrl: "https://github.com/example/project6",
    category: "reactNative",
  },
  {
    id: 7,
    title: "Fitness Tracker App",
    description:
      "A mobile application that helps users track their workouts, set fitness goals, and monitor progress over time.",
    image:
      "https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    technologies: ["React Native", "Firebase", "Redux", "Expo"],
    demoUrl: "https://example.com/demo2",
    githubUrl: "https://github.com/example/project2",
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
