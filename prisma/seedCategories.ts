import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Category data extracted from the frontend categoryMetadata
const CATEGORIES = [
  {
    slug: "fundamentals",
    title: "Fundamentals",
    description: "Master the essential building blocks of JavaScript programming",
    difficulty: "beginner",
    topics: ["Variables", "Functions", "Arrays", "Objects"],
    duration: "4-6 hours",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-100 dark:bg-blue-900",
    badgeColor: "text-blue-800 dark:text-blue-200",
    dotColor: "bg-blue-600",
    order: 1,
  },
  {
    slug: "html",
    title: "HTML Fundamentals",
    description: "Learn the foundation of web development with HTML",
    difficulty: "beginner",
    topics: ["HTML5", "Elements", "Attributes", "Semantic HTML", "Forms"],
    duration: "2-3 hours",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 dark:bg-orange-900",
    badgeColor: "text-orange-800 dark:text-orange-200",
    dotColor: "bg-orange-600",
    order: 2,
  },
  {
    slug: "css",
    title: "CSS Fundamentals",
    description: "Style your web pages with CSS - colors, layouts, animations and more",
    difficulty: "beginner",
    topics: ["Selectors", "Box Model", "Flexbox", "Grid", "Animations"],
    duration: "3-4 hours",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-100 dark:bg-blue-900",
    badgeColor: "text-blue-800 dark:text-blue-200",
    dotColor: "bg-blue-600",
    order: 3,
  },
  {
    slug: "dom",
    title: "DOM Manipulation",
    description: "Manipulate web pages dynamically using the Document Object Model",
    difficulty: "intermediate",
    topics: ["DOM Selection", "Event Handling", "Element Creation", "Styling"],
    duration: "2-3 hours",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600 dark:text-orange-400",
    badgeBg: "bg-orange-100 dark:bg-orange-900",
    badgeColor: "text-orange-800 dark:text-orange-200",
    dotColor: "bg-orange-600",
    order: 4,
  },
  {
    slug: "oop",
    title: "Object-Oriented Programming",
    description: "Learn object-oriented programming concepts and patterns in JavaScript",
    difficulty: "intermediate",
    topics: ["Objects", "Prototypes", "Classes", "Inheritance"],
    duration: "3-4 hours",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-400",
    badgeBg: "bg-green-100 dark:bg-green-900",
    badgeColor: "text-green-800 dark:text-green-200",
    dotColor: "bg-green-600",
    order: 5,
  },
  {
    slug: "async",
    title: "Asynchronous JavaScript",
    description: "Handle asynchronous operations with promises, async/await, and more",
    difficulty: "intermediate",
    topics: ["Promises", "Async/Await", "Fetch API", "Error Handling"],
    duration: "2-3 hours",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-100 dark:bg-purple-900",
    badgeColor: "text-purple-800 dark:text-purple-200",
    dotColor: "bg-purple-600",
    order: 6,
  },
  {
    slug: "data-structures",
    title: "Data Structures & Algorithms",
    description: "Master fundamental data structures and algorithms in JavaScript",
    difficulty: "intermediate",
    topics: ["Arrays", "Objects", "Sets", "Maps", "Algorithms"],
    duration: "4-6 hours",
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-100 dark:bg-indigo-900",
    badgeColor: "text-indigo-800 dark:text-indigo-200",
    dotColor: "bg-indigo-600",
    order: 7,
  },
  {
    slug: "advanced",
    title: "Advanced JavaScript",
    description: "Explore advanced JavaScript concepts and modern patterns",
    difficulty: "advanced",
    topics: ["Closures", "Modules", "Design Patterns", "Performance"],
    duration: "5-8 hours",
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-400",
    badgeBg: "bg-red-100 dark:bg-red-900",
    badgeColor: "text-red-800 dark:text-red-200",
    dotColor: "bg-red-600",
    order: 8,
  },
];

async function seedCategories() {
  try {
    console.log("🌱 Starting category seeding...");

    for (const categoryData of CATEGORIES) {
      const createdCategory = await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: categoryData,
        create: categoryData,
      });

      console.log(`✅ Category created/updated: ${createdCategory.title} (${createdCategory.slug})`);
    }

    console.log("🎉 Category seeding completed successfully!");
    console.log("📊 Summary:");
    console.log(`   - Total categories: ${CATEGORIES.length}`);
    console.log(`   - Beginner: ${CATEGORIES.filter((c) => c.difficulty === "beginner").length}`);
    console.log(`   - Intermediate: ${CATEGORIES.filter((c) => c.difficulty === "intermediate").length}`);
    console.log(`   - Advanced: ${CATEGORIES.filter((c) => c.difficulty === "advanced").length}`);
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

// Run the seeding
seedCategories().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedCategories, CATEGORIES };