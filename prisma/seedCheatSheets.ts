import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CheatSheetSeed {
  slug: string;
  title: string;
  topic: string;
  category: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  fileFormat: "PDF" | "PNG" | "SVG";
  fileSize: string;
  downloadUrl: string;
  previewUrl?: string;
  tags: string[];
  isPremium: boolean;
  requiredPlan?: "VIBED" | "CRACKED";
  keywords?: string;
  order: number;
}

const CHEAT_SHEETS: CheatSheetSeed[] = [
  // EXAMPLE TEMPLATE - Replace with real cheat sheets when ready
  {
    slug: "javascript-array-methods",
    title: "JavaScript Array Methods",
    topic: "Arrays",
    category: "JavaScript Basics",
    description:
      "Complete reference for all JavaScript array methods with examples and use cases",
    difficulty: "beginner",
    fileFormat: "PDF",
    fileSize: "2.4 MB",
    downloadUrl: "/downloads/cheat-sheets/javascript-array-methods.pdf",
    previewUrl: "/previews/cheat-sheets/javascript-array-methods.png",
    tags: ["arrays", "methods", "reference"],
    isPremium: false,
    keywords:
      "array methods, map, filter, reduce, forEach, find, slice, splice",
    order: 1,
  },
  {
    slug: "es6-features-guide",
    title: "ES6+ Features Guide",
    topic: "Modern JavaScript",
    category: "JavaScript Advanced",
    description:
      "Quick reference for ES6, ES7, and ES8+ features with syntax examples",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "3.1 MB",
    downloadUrl: "/downloads/cheat-sheets/es6-features-guide.pdf",
    previewUrl: "/previews/cheat-sheets/es6-features-guide.png",
    tags: ["es6", "arrow functions", "destructuring", "promises", "async"],
    isPremium: true,
    requiredPlan: "VIBED",
    keywords:
      "ES6, arrow functions, destructuring, spread operator, classes, promises",
    order: 2,
  },
  {
    slug: "async-await-patterns",
    title: "Async/Await Patterns",
    topic: "Asynchronous Programming",
    category: "JavaScript Advanced",
    description:
      "Master async/await with practical patterns and error handling strategies",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "1.8 MB",
    downloadUrl: "/downloads/cheat-sheets/async-await-patterns.pdf",
    previewUrl: "/previews/cheat-sheets/async-await-patterns.png",
    tags: ["async", "await", "promises", "error-handling", "callbacks"],
    isPremium: false,
    keywords: "async, await, promises, error handling, try-catch",
    order: 3,
  },
  {
    slug: "data-structures-quick-reference",
    title: "Data Structures Quick Reference",
    topic: "Data Structures",
    category: "DSA",
    description:
      "Visual guide to all major data structures with time/space complexity",
    difficulty: "advanced",
    fileFormat: "PDF",
    fileSize: "4.2 MB",
    downloadUrl: "/downloads/cheat-sheets/data-structures-quick-reference.pdf",
    previewUrl: "/previews/cheat-sheets/data-structures-quick-reference.png",
    tags: ["dsa", "arrays", "linked-lists", "trees", "graphs", "complexity"],
    isPremium: true,
    requiredPlan: "CRACKED",
    keywords:
      "data structures, arrays, linked lists, trees, graphs, hash tables",
    order: 4,
  },
  {
    slug: "algorithm-complexity-analysis",
    title: "Algorithm Complexity Analysis",
    topic: "Algorithm Analysis",
    category: "DSA",
    description:
      "Big O notation guide with common algorithm complexities and examples",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "2.8 MB",
    downloadUrl: "/downloads/cheat-sheets/algorithm-complexity-analysis.pdf",
    previewUrl: "/previews/cheat-sheets/algorithm-complexity-analysis.png",
    tags: ["big-o", "complexity", "time", "space", "algorithms"],
    isPremium: false,
    keywords: "Big O, time complexity, space complexity, O(n), O(log n)",
    order: 5,
  },
  {
    slug: "typescript-types-guide",
    title: "TypeScript Types Guide",
    topic: "TypeScript",
    category: "TypeScript",
    description:
      "Complete reference for TypeScript types, interfaces, and generics",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "3.5 MB",
    downloadUrl: "/downloads/cheat-sheets/typescript-types-guide.pdf",
    previewUrl: "/previews/cheat-sheets/typescript-types-guide.png",
    tags: ["typescript", "types", "interfaces", "generics", "decorators"],
    isPremium: true,
    requiredPlan: "VIBED",
    keywords:
      "TypeScript, types, interfaces, generics, enums, decorators, unions",
    order: 6,
  },
  {
    slug: "css-flexbox-reference",
    title: "CSS Flexbox Reference",
    topic: "CSS Layouts",
    category: "CSS",
    description:
      "Complete flexbox properties guide with visual examples and use cases",
    difficulty: "beginner",
    fileFormat: "PDF",
    fileSize: "2.2 MB",
    downloadUrl: "/downloads/cheat-sheets/css-flexbox-reference.pdf",
    previewUrl: "/previews/cheat-sheets/css-flexbox-reference.png",
    tags: ["css", "flexbox", "layout", "responsive", "alignment"],
    isPremium: false,
    keywords:
      "flexbox, flex-direction, justify-content, align-items, flex-grow",
    order: 7,
  },
  {
    slug: "css-grid-layout",
    title: "CSS Grid Layout",
    topic: "CSS Layouts",
    category: "CSS",
    description:
      "Master CSS Grid with detailed property reference and examples",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "2.9 MB",
    downloadUrl: "/downloads/cheat-sheets/css-grid-layout.pdf",
    previewUrl: "/previews/cheat-sheets/css-grid-layout.png",
    tags: ["css", "grid", "layout", "responsive", "2d-layout"],
    isPremium: true,
    requiredPlan: "VIBED",
    keywords: "grid, grid-template, grid-column, grid-row, gap, auto-fit",
    order: 8,
  },
  {
    slug: "react-hooks-reference",
    title: "React Hooks Reference",
    topic: "React",
    category: "Frontend Frameworks",
    description:
      "Complete guide to React Hooks with practical examples and best practices",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "3.6 MB",
    downloadUrl: "/downloads/cheat-sheets/react-hooks-reference.pdf",
    previewUrl: "/previews/cheat-sheets/react-hooks-reference.png",
    tags: ["react", "hooks", "usestate", "useeffect", "custom-hooks"],
    isPremium: true,
    requiredPlan: "CRACKED",
    keywords:
      "React Hooks, useState, useEffect, useContext, useReducer, custom hooks",
    order: 9,
  },
  {
    slug: "git-commands-reference",
    title: "Git Commands Reference",
    topic: "Version Control",
    category: "Git & GitHub",
    description:
      "Essential Git commands for everyday development and collaboration",
    difficulty: "beginner",
    fileFormat: "PDF",
    fileSize: "2.1 MB",
    downloadUrl: "/downloads/cheat-sheets/git-commands-reference.pdf",
    previewUrl: "/previews/cheat-sheets/git-commands-reference.png",
    tags: ["git", "version-control", "commands", "branches", "merging"],
    isPremium: false,
    keywords: "git, commit, branch, merge, push, pull, rebase",
    order: 10,
  },
  {
    slug: "nodejs-api-patterns",
    title: "Node.js API Patterns",
    topic: "Backend Development",
    category: "Node.js",
    description: "Common patterns and best practices for building Node.js APIs",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "3.3 MB",
    downloadUrl: "/downloads/cheat-sheets/nodejs-api-patterns.pdf",
    previewUrl: "/previews/cheat-sheets/nodejs-api-patterns.png",
    tags: ["nodejs", "api", "patterns", "express", "rest"],
    isPremium: true,
    requiredPlan: "CRACKED",
    keywords: "Node.js, Express, REST API, middleware, error handling",
    order: 11,
  },
  {
    slug: "sql-queries-reference",
    title: "SQL Queries Reference",
    topic: "Databases",
    category: "Databases",
    description: "Quick reference for common SQL queries and operations",
    difficulty: "intermediate",
    fileFormat: "PDF",
    fileSize: "2.7 MB",
    downloadUrl: "/downloads/cheat-sheets/sql-queries-reference.pdf",
    previewUrl: "/previews/cheat-sheets/sql-queries-reference.png",
    tags: ["sql", "database", "queries", "joins", "aggregations"],
    isPremium: true,
    requiredPlan: "VIBED",
    keywords: "SQL, SELECT, JOIN, WHERE, GROUP BY, subqueries",
    order: 12,
  },
];

async function seedCheatSheets() {
  try {
    console.log("🌱 Seeding cheat sheets...");

    // Clear existing cheat sheets
    await prisma.cheatSheet.deleteMany({});
    console.log("✨ Cleared existing cheat sheets");

    // Seed new cheat sheets
    for (const sheet of CHEAT_SHEETS) {
      await prisma.cheatSheet.create({
        data: {
          slug: sheet.slug,
          title: sheet.title,
          topic: sheet.topic,
          category: sheet.category,
          description: sheet.description,
          difficulty: sheet.difficulty,
          fileFormat: sheet.fileFormat,
          fileSize: sheet.fileSize,
          downloadUrl: sheet.downloadUrl,
          previewUrl: sheet.previewUrl,
          tags: sheet.tags,
          isPremium: sheet.isPremium,
          requiredPlan: sheet.requiredPlan,
          keywords: sheet.keywords,
          order: sheet.order,
          published: true,
        },
      });
    }

    console.log(`✅ Successfully seeded ${CHEAT_SHEETS.length} cheat sheets`);
  } catch (error) {
    console.error("❌ Error seeding cheat sheets:", error);
    throw error;
  }
}

seedCheatSheets()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
