import { PrismaClient } from "@prisma/client";

export const skillSeeds = [
  // HTML Skills
  {
    slug: "html-basics",
    name: "HTML Basics",
    description: "Understanding HTML document structure, tags, and basic elements",
    category: "html",
    keywords: ["html", "tags", "elements", "structure", "document"],
    iconName: "FileText",
    level: "BEGINNER",
    order: 1,
  },
  {
    slug: "html-semantic",
    name: "Semantic HTML",
    description: "Using meaningful HTML elements for better structure and accessibility",
    category: "html",
    keywords: ["semantic", "accessibility", "structure", "meaningful"],
    iconName: "Layout",
    level: "BEGINNER",
    order: 2,
  },
  {
    slug: "html-forms",
    name: "HTML Forms",
    description: "Creating interactive forms with input elements and validation",
    category: "html",
    keywords: ["forms", "input", "validation", "interactive"],
    iconName: "FileInput",
    level: "INTERMEDIATE",
    order: 3,
  },
  {
    slug: "html-attributes",
    name: "HTML Attributes",
    description: "Working with HTML attributes for styling and functionality",
    category: "html",
    keywords: ["attributes", "properties", "styling"],
    iconName: "Settings",
    level: "BEGINNER",
    order: 4,
  },

  // CSS Skills
  {
    slug: "css-basics",
    name: "CSS Basics",
    description: "Understanding CSS selectors, properties, and basic styling",
    category: "css",
    keywords: ["css", "selectors", "properties", "styling"],
    iconName: "Palette",
    level: "BEGINNER",
    order: 1,
  },
  {
    slug: "css-layout",
    name: "CSS Layout",
    description: "Creating layouts with flexbox, grid, and positioning",
    category: "css",
    keywords: ["layout", "flexbox", "grid", "positioning"],
    iconName: "Grid3x3",
    level: "INTERMEDIATE",
    order: 2,
  },
  {
    slug: "css-responsive",
    name: "Responsive Design",
    description: "Creating responsive designs with media queries and flexible layouts",
    category: "css",
    keywords: ["responsive", "media queries", "mobile", "flexible"],
    iconName: "Smartphone",
    level: "INTERMEDIATE",
    order: 3,
  },

  // JavaScript Fundamentals
  {
    slug: "js-variables",
    name: "JavaScript Variables",
    description: "Understanding variables, data types, and scope",
    category: "fundamentals",
    keywords: ["variables", "data types", "scope", "let", "const", "var"],
    iconName: "Box",
    level: "BEGINNER",
    order: 1,
  },
  {
    slug: "js-functions",
    name: "JavaScript Functions",
    description: "Creating and using functions, parameters, and return values",
    category: "fundamentals",
    keywords: ["functions", "parameters", "return", "arrow functions"],
    iconName: "Code",
    level: "BEGINNER",
    order: 2,
  },
  {
    slug: "js-arrays",
    name: "JavaScript Arrays",
    description: "Working with arrays and array methods",
    category: "fundamentals",
    keywords: ["arrays", "methods", "iteration", "map", "filter"],
    iconName: "List",
    level: "BEGINNER",
    order: 3,
  },
  {
    slug: "js-objects",
    name: "JavaScript Objects",
    description: "Understanding objects, properties, and methods",
    category: "fundamentals",
    keywords: ["objects", "properties", "methods", "object literals"],
    iconName: "Package",
    level: "BEGINNER",
    order: 4,
  },
  {
    slug: "js-control-flow",
    name: "Control Flow",
    description: "Understanding conditionals, loops, and control structures",
    category: "fundamentals",
    keywords: ["control", "conditionals", "loops", "if", "for", "while"],
    iconName: "GitBranch",
    level: "BEGINNER",
    order: 5,
  },

  // DOM Skills
  {
    slug: "dom-manipulation",
    name: "DOM Manipulation",
    description: "Selecting and modifying DOM elements",
    category: "dom",
    keywords: ["dom", "manipulation", "elements", "querySelector"],
    iconName: "MousePointer",
    level: "INTERMEDIATE",
    order: 1,
  },
  {
    slug: "event-handling",
    name: "Event Handling",
    description: "Handling user interactions and browser events",
    category: "dom",
    keywords: ["event", "handling", "click", "interactive", "listeners"],
    iconName: "MousePointer2",
    level: "INTERMEDIATE",
    order: 2,
  },
  {
    slug: "interactive-features",
    name: "Interactive Features",
    description: "Creating dynamic and interactive web features",
    category: "dom",
    keywords: ["interactive", "dynamic", "features", "user interaction"],
    iconName: "Hand",
    level: "INTERMEDIATE",
    order: 3,
  },

  // OOP Skills
  {
    slug: "js-classes",
    name: "JavaScript Classes",
    description: "Understanding ES6 classes and object-oriented programming",
    category: "oop",
    keywords: ["class", "classes", "constructor", "methods"],
    iconName: "Building",
    level: "INTERMEDIATE",
    order: 1,
  },
  {
    slug: "inheritance",
    name: "Inheritance",
    description: "Understanding inheritance and extending classes",
    category: "oop",
    keywords: ["inheritance", "extends", "super", "polymorphism"],
    iconName: "TreePine",
    level: "INTERMEDIATE",
    order: 2,
  },
  {
    slug: "encapsulation",
    name: "Encapsulation",
    description: "Understanding private properties and encapsulation principles",
    category: "oop",
    keywords: ["encapsulation", "private", "protected", "abstraction"],
    iconName: "Lock",
    level: "INTERMEDIATE",
    order: 3,
  },

  // Async Skills
  {
    slug: "async-programming",
    name: "Async Programming",
    description: "Understanding asynchronous programming concepts",
    category: "async",
    keywords: ["async", "asynchronous", "callbacks", "promises"],
    iconName: "Zap",
    level: "INTERMEDIATE",
    order: 1,
  },
  {
    slug: "promises",
    name: "Promises",
    description: "Working with Promises for asynchronous operations",
    category: "async",
    keywords: ["promise", "promises", "then", "catch", "finally"],
    iconName: "Timer",
    level: "INTERMEDIATE",
    order: 2,
  },
  {
    slug: "async-await",
    name: "Async/Await",
    description: "Using async/await for cleaner asynchronous code",
    category: "async",
    keywords: ["async", "await", "promise", "asynchronous"],
    iconName: "Clock",
    level: "INTERMEDIATE",
    order: 3,
  },
  {
    slug: "api-integration",
    name: "API Integration",
    description: "Fetching data from APIs and handling responses",
    category: "async",
    keywords: ["api", "fetch", "http", "rest", "json"],
    iconName: "Globe",
    level: "INTERMEDIATE",
    order: 4,
  },

  // Advanced Skills
  {
    slug: "advanced-functions",
    name: "Advanced Functions",
    description: "Closures, higher-order functions, and functional programming",
    category: "advanced",
    keywords: ["advanced", "closures", "higher-order", "functional"],
    iconName: "Flame",
    level: "ADVANCED",
    order: 1,
  },
  {
    slug: "design-patterns",
    name: "Design Patterns",
    description: "Common JavaScript design patterns and best practices",
    category: "advanced",
    keywords: ["pattern", "patterns", "design", "architecture"],
    iconName: "Puzzle",
    level: "ADVANCED",
    order: 2,
  },
  {
    slug: "performance",
    name: "Performance Optimization",
    description: "Optimizing JavaScript code for better performance",
    category: "advanced",
    keywords: ["performance", "optimization", "speed", "efficiency"],
    iconName: "Gauge",
    level: "ADVANCED",
    order: 3,
  },
  {
    slug: "testing",
    name: "Testing",
    description: "Writing and running tests for JavaScript applications",
    category: "advanced",
    keywords: ["testing", "unit tests", "integration", "jest"],
    iconName: "TestTube",
    level: "ADVANCED",
    order: 4,
  },

  // Data Structures & Algorithms
  {
    slug: "algorithms",
    name: "Algorithms",
    description: "Understanding common algorithms and problem-solving techniques",
    category: "data-structures",
    keywords: ["algorithm", "algorithms", "problem solving", "complexity"],
    iconName: "Database",
    level: "ADVANCED",
    order: 1,
  },
  {
    slug: "data-structures",
    name: "Data Structures",
    description: "Understanding arrays, objects, sets, maps, and other data structures",
    category: "data-structures",
    keywords: ["data", "structures", "array", "object", "set", "map"],
    iconName: "Layers",
    level: "ADVANCED",
    order: 2,
  },
  {
    slug: "sorting",
    name: "Sorting Algorithms",
    description: "Understanding different sorting algorithms and their applications",
    category: "data-structures",
    keywords: ["sorting", "sort", "algorithms", "bubble", "merge", "quick"],
    iconName: "ArrowUpDown",
    level: "ADVANCED",
    order: 3,
  },
  {
    slug: "searching",
    name: "Search Algorithms",
    description: "Understanding search algorithms like binary search",
    category: "data-structures",
    keywords: ["search", "searching", "binary search", "linear search"],
    iconName: "Search",
    level: "ADVANCED",
    order: 4,
  },
];

export async function seedSkills() {
  const prisma = new PrismaClient();
  
  try {
    console.log("🌱 Seeding skills...");

    for (const skill of skillSeeds) {
      await prisma.skill.upsert({
        where: { slug: skill.slug },
        update: skill,
        create: skill,
      });
    }

    console.log(`✅ Seeded ${skillSeeds.length} skills`);
  } catch (error) {
    console.error("❌ Error seeding skills:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}