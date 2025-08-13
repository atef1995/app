import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROJECTS = [
  // FUNDAMENTALS CATEGORY
  {
    slug: "fundamentals-portfolio-website",
    title: "Personal Portfolio Website",
    description: "Build a responsive personal portfolio website using HTML, CSS, and JavaScript. Showcase your projects, skills, and experience with a modern, professional design.",
    category: "fundamentals",
    difficulty: 1,
    estimatedHours: 8,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    submissionType: "LINK",
    reviewType: "PEER",
    minReviews: 2,
    requirements: [
      {
        id: "portfolio-responsive",
        title: "Responsive Design",
        description: "Website must be fully responsive and work on desktop, tablet, and mobile devices",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 20,
      },
      {
        id: "portfolio-sections",
        title: "Required Sections",
        description: "Include About, Skills, Projects, and Contact sections",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 30,
      },
      {
        id: "portfolio-interactivity",
        title: "Interactive Elements",
        description: "Add at least 3 interactive elements (smooth scrolling, hover effects, form validation)",
        type: "FEATURE",
        priority: "SHOULD_HAVE",
        points: 25,
      },
      {
        id: "portfolio-styling",
        title: "Professional Styling",
        description: "Clean, modern design with consistent color scheme and typography",
        type: "DESIGN",
        priority: "MUST_HAVE",
        points: 20,
      },
      {
        id: "portfolio-performance",
        title: "Performance Optimization",
        description: "Optimize images and ensure fast loading times",
        type: "TECHNICAL",
        priority: "NICE_TO_HAVE",
        points: 5,
      },
    ],
    resources: [
      {
        id: "mdn-responsive",
        title: "MDN Responsive Design Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design",
        type: "DOCUMENTATION",
        description: "Complete guide to responsive web design",
      },
      {
        id: "flexbox-guide",
        title: "CSS Flexbox Guide",
        url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
        type: "TUTORIAL",
        description: "Master CSS Flexbox for layouts",
      },
      {
        id: "portfolio-examples",
        title: "Portfolio Design Inspiration",
        url: "https://dribbble.com/search/portfolio-website",
        type: "EXAMPLE",
        description: "Design inspiration for portfolio websites",
      },
    ],
    rubric: [
      {
        id: "functionality",
        name: "Functionality",
        description: "All required features work correctly",
        maxPoints: 40,
        weight: 0.4,
      },
      {
        id: "design",
        name: "Design & Usability",
        description: "Visual appeal, user experience, and accessibility",
        maxPoints: 30,
        weight: 0.3,
      },
      {
        id: "code-quality",
        name: "Code Quality",
        description: "Clean, well-organized, and commented code",
        maxPoints: 20,
        weight: 0.2,
      },
      {
        id: "creativity",
        name: "Creativity & Innovation",
        description: "Unique features and creative solutions",
        maxPoints: 10,
        weight: 0.1,
      },
    ],
  },

  {
    slug: "fundamentals-todo-app",
    title: "Interactive Todo List Application",
    description: "Create a fully functional todo list application with local storage persistence. Learn DOM manipulation, event handling, and data persistence fundamentals.",
    category: "fundamentals",
    difficulty: 2,
    estimatedHours: 12,
    order: 2,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    submissionType: "CODE",
    reviewType: "PEER",
    minReviews: 2,
    requirements: [
      {
        id: "todo-crud",
        title: "CRUD Operations",
        description: "Users can create, read, update, and delete todos",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 30,
      },
      {
        id: "todo-persistence",
        title: "Local Storage Persistence",
        description: "Todos persist between browser sessions using localStorage",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 25,
      },
      {
        id: "todo-filtering",
        title: "Filter Options",
        description: "Filter todos by status: All, Active, Completed",
        type: "FEATURE",
        priority: "SHOULD_HAVE",
        points: 20,
      },
      {
        id: "todo-validation",
        title: "Input Validation",
        description: "Prevent empty todos and provide user feedback",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 15,
      },
      {
        id: "todo-ui",
        title: "User-Friendly Interface",
        description: "Intuitive and responsive user interface",
        type: "DESIGN",
        priority: "SHOULD_HAVE",
        points: 10,
      },
    ],
    resources: [
      {
        id: "localstorage-mdn",
        title: "Web Storage API - MDN",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API",
        type: "DOCUMENTATION",
        description: "Complete guide to localStorage and sessionStorage",
      },
      {
        id: "dom-manipulation",
        title: "DOM Manipulation Tutorial",
        url: "https://javascript.info/modifying-document",
        type: "TUTORIAL",
        description: "Learn how to modify the DOM with JavaScript",
      },
      {
        id: "todo-app-tutorial",
        title: "Building a Todo App",
        url: "https://www.freecodecamp.org/news/learn-crud-operations-in-javascript-by-building-todo-app/",
        type: "EXAMPLE",
        description: "Step-by-step tutorial for building a todo app",
      },
    ],
    rubric: [
      {
        id: "functionality",
        name: "Core Functionality",
        description: "All CRUD operations work correctly with persistence",
        maxPoints: 50,
        weight: 0.5,
      },
      {
        id: "user-experience",
        name: "User Experience",
        description: "Intuitive interface with proper feedback and error handling",
        maxPoints: 25,
        weight: 0.25,
      },
      {
        id: "code-organization",
        name: "Code Organization",
        description: "Well-structured, readable, and maintainable code",
        maxPoints: 15,
        weight: 0.15,
      },
      {
        id: "additional-features",
        name: "Additional Features",
        description: "Extra features beyond basic requirements",
        maxPoints: 10,
        weight: 0.1,
      },
    ],
  },

  // OOP CATEGORY
  {
    slug: "oop-library-management",
    title: "Library Management System",
    description: "Build a comprehensive library management system using object-oriented programming principles. Implement classes for books, users, and library operations with proper encapsulation and inheritance.",
    category: "oop",
    difficulty: 3,
    estimatedHours: 15,
    order: 1,
    published: true,
    isPremium: true,
    requiredPlan: "VIBED",
    submissionType: "CODE",
    reviewType: "PEER",
    minReviews: 3,
    requirements: [
      {
        id: "oop-classes",
        title: "Core Classes",
        description: "Implement Book, User, Library classes with proper encapsulation",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 35,
      },
      {
        id: "oop-inheritance",
        title: "Inheritance Implementation",
        description: "Use inheritance for different user types (Student, Faculty, etc.)",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 25,
      },
      {
        id: "oop-operations",
        title: "Library Operations",
        description: "Implement borrow, return, search, and reservation functionality",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 30,
      },
      {
        id: "oop-validation",
        title: "Business Rules",
        description: "Enforce borrowing limits, due dates, and fine calculations",
        type: "TECHNICAL",
        priority: "SHOULD_HAVE",
        points: 10,
      },
    ],
    resources: [
      {
        id: "oop-js-guide",
        title: "OOP in JavaScript Guide",
        url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object-oriented_programming",
        type: "DOCUMENTATION",
        description: "Complete guide to OOP concepts in JavaScript",
      },
      {
        id: "class-syntax",
        title: "JavaScript Classes",
        url: "https://javascript.info/class",
        type: "TUTORIAL",
        description: "Modern class syntax and inheritance in JavaScript",
      },
    ],
    rubric: [
      {
        id: "oop-principles",
        name: "OOP Principles",
        description: "Proper use of encapsulation, inheritance, and polymorphism",
        maxPoints: 40,
        weight: 0.4,
      },
      {
        id: "functionality",
        name: "Feature Implementation",
        description: "All required library operations work correctly",
        maxPoints: 35,
        weight: 0.35,
      },
      {
        id: "code-design",
        name: "Code Design",
        description: "Well-designed class hierarchy and method organization",
        maxPoints: 25,
        weight: 0.25,
      },
    ],
  },

  // ASYNC CATEGORY  
  {
    slug: "async-weather-dashboard",
    title: "Weather Dashboard with API Integration",
    description: "Build a weather dashboard that fetches real-time weather data from APIs. Learn async/await, promise handling, error management, and working with external APIs.",
    category: "async",
    difficulty: 3,
    estimatedHours: 16,
    order: 1,
    published: true,
    isPremium: true,
    requiredPlan: "CRACKED",
    submissionType: "LINK",
    reviewType: "PEER",
    minReviews: 3,
    requirements: [
      {
        id: "async-api-integration",
        title: "Weather API Integration",
        description: "Integrate with OpenWeatherMap or similar API using fetch/async-await",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 30,
      },
      {
        id: "async-location",
        title: "Location-Based Weather",
        description: "Get user location and display weather for current location",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 25,
      },
      {
        id: "async-search",
        title: "City Search",
        description: "Search functionality for weather in different cities",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 20,
      },
      {
        id: "async-error-handling",
        title: "Error Handling",
        description: "Proper error handling for API failures and network issues",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 15,
      },
      {
        id: "async-forecast",
        title: "Weather Forecast",
        description: "Display 5-day weather forecast with detailed information",
        type: "FEATURE",
        priority: "SHOULD_HAVE",
        points: 10,
      },
    ],
    resources: [
      {
        id: "fetch-api",
        title: "Fetch API Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch",
        type: "DOCUMENTATION",
        description: "Complete guide to using the Fetch API",
      },
      {
        id: "async-await",
        title: "Async/Await Tutorial",
        url: "https://javascript.info/async-await",
        type: "TUTORIAL",
        description: "Master async/await syntax and patterns",
      },
      {
        id: "weather-api",
        title: "OpenWeatherMap API",
        url: "https://openweathermap.org/api",
        type: "TOOL",
        description: "Free weather API for your projects",
      },
    ],
    rubric: [
      {
        id: "async-implementation",
        name: "Async Implementation",
        description: "Proper use of async/await, promises, and error handling",
        maxPoints: 40,
        weight: 0.4,
      },
      {
        id: "api-integration",
        name: "API Integration",
        description: "Effective use of weather APIs with data processing",
        maxPoints: 35,
        weight: 0.35,
      },
      {
        id: "user-interface",
        name: "User Interface",
        description: "Intuitive interface with loading states and feedback",
        maxPoints: 25,
        weight: 0.25,
      },
    ],
  },

  // DOM CATEGORY
  {
    slug: "dom-interactive-game",
    title: "Interactive Memory Card Game",
    description: "Create an engaging memory card game with DOM manipulation, animations, and game state management. Features scoring, difficulty levels, and responsive design.",
    category: "dom",
    difficulty: 2,
    estimatedHours: 14,
    order: 1,
    published: true,
    isPremium: false,
    requiredPlan: "FREE",
    submissionType: "CODE",
    reviewType: "PEER",
    minReviews: 2,
    requirements: [
      {
        id: "dom-game-logic",
        title: "Game Logic Implementation",
        description: "Complete memory game mechanics with card matching and win/lose conditions",
        type: "FEATURE",
        priority: "MUST_HAVE",
        points: 35,
      },
      {
        id: "dom-animations",
        title: "Card Animations",
        description: "Smooth card flip animations and visual feedback",
        type: "DESIGN",
        priority: "MUST_HAVE",
        points: 20,
      },
      {
        id: "dom-scoring",
        title: "Scoring System",
        description: "Track moves, time, and high scores with local storage",
        type: "FEATURE",
        priority: "SHOULD_HAVE",
        points: 20,
      },
      {
        id: "dom-difficulty",
        title: "Difficulty Levels",
        description: "Multiple difficulty levels with different grid sizes",
        type: "FEATURE",
        priority: "SHOULD_HAVE",
        points: 15,
      },
      {
        id: "dom-responsive",
        title: "Responsive Design",
        description: "Game works well on different screen sizes",
        type: "TECHNICAL",
        priority: "MUST_HAVE",
        points: 10,
      },
    ],
    resources: [
      {
        id: "dom-events",
        title: "DOM Events Guide",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events",
        type: "DOCUMENTATION",
        description: "Complete guide to DOM event handling",
      },
      {
        id: "css-animations",
        title: "CSS Animations Tutorial",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations",
        type: "TUTORIAL",
        description: "Create smooth animations with CSS",
      },
      {
        id: "game-dev-js",
        title: "JavaScript Game Development",
        url: "https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript",
        type: "EXAMPLE",
        description: "Game development patterns in JavaScript",
      },
    ],
    rubric: [
      {
        id: "game-mechanics",
        name: "Game Mechanics",
        description: "Core game functionality and user interaction",
        maxPoints: 45,
        weight: 0.45,
      },
      {
        id: "visual-design",
        name: "Visual Design",
        description: "Animations, styling, and overall user experience",
        maxPoints: 30,
        weight: 0.3,
      },
      {
        id: "code-structure",
        name: "Code Structure",
        description: "Clean, organized code with proper DOM manipulation",
        maxPoints: 25,
        weight: 0.25,
      },
    ],
  },
];

async function seedProjects() {
  try {
    console.log("🌱 Starting project seeding...");

    for (const projectData of PROJECTS) {
      // Create or update project
      const createdProject = await prisma.project.upsert({
        where: { slug: projectData.slug },
        update: {
          ...projectData,
          requirements: projectData.requirements,
          resources: projectData.resources,
          rubric: projectData.rubric,
          published: true, // Ensure all projects are published
        },
        create: {
          ...projectData,
          requirements: projectData.requirements,
          resources: projectData.resources,
          rubric: projectData.rubric,
          published: true,
        },
      });

      console.log(
        `✅ Project created/updated: ${createdProject.title} (Category: ${createdProject.category})`
      );
    }

    console.log("🎉 Project seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total projects: ${PROJECTS.length}`);
    console.log(
      `   - Fundamentals: ${
        PROJECTS.filter((p) => p.category === "fundamentals").length
      }`
    );
    console.log(
      `   - OOP: ${PROJECTS.filter((p) => p.category === "oop").length}`
    );
    console.log(
      `   - Async: ${PROJECTS.filter((p) => p.category === "async").length}`
    );
    console.log(
      `   - DOM: ${PROJECTS.filter((p) => p.category === "dom").length}`
    );
    console.log(
      `   - Free projects: ${PROJECTS.filter((p) => !p.isPremium).length}`
    );
    console.log(
      `   - Premium projects: ${PROJECTS.filter((p) => p.isPremium).length}`
    );
  } catch (error) {
    console.error("❌ Error seeding projects:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedProjects().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedProjects, PROJECTS };