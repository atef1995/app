import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Mapping of tutorial slugs/patterns to category slugs
const TUTORIAL_CATEGORY_MAPPING: Record<string, string> = {
  // Fundamentals
  "variables-and-data-types": "fundamentals",
  "functions-basics": "fundamentals",
  "arrays-and-objects": "fundamentals",
  "control-structures": "fundamentals",
  "scope-and-hoisting": "fundamentals",

  // OOP
  "object-oriented-programming": "oop",
  "classes-and-inheritance": "oop",
  prototypes: "oop",

  // Async
  promises: "async",
  "async-await": "async",
  "fetch-api": "async",

  // DOM
  "dom-manipulation": "dom",
  "event-handling": "dom",
  "document-queries": "dom",

  // Advanced
  closures: "advanced",
  modules: "advanced",
  "design-patterns": "advanced",

  // Data structures
  "data-structures": "data-structures",
  algorithms: "data-structures",

  // HTML
  html: "html",
  html5: "html",
  "semantic-html": "html",

  // CSS
  css: "css",
  flexbox: "css",
  grid: "css",
  animations: "css",
};

async function migrateTutorialCategories() {
  try {
    console.log("🚀 Starting tutorial category migration...");

    // First, ensure categories exist
    console.log("1️⃣ Checking categories...");
    const categoriesCount = await prisma.category.count();
    if (categoriesCount === 0) {
      console.log("❌ No categories found. Please run category seeding first:");
      console.log("   npm run ts-node prisma/seedCategories.ts");
      process.exit(1);
    }
    console.log(`✅ Found ${categoriesCount} categories`);

    // Get all categories for lookup
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(categories.map((cat) => [cat.slug, cat.id]));

    // Get all existing tutorials
    console.log("2️⃣ Fetching existing tutorials...");
    const tutorials = await prisma.tutorial.findMany({
      select: { id: true, slug: true, title: true },
    });
    console.log(`📚 Found ${tutorials.length} tutorials to migrate`);

    // Migrate tutorials to categories
    console.log("3️⃣ Assigning categories to tutorials...");
    let migratedCount = 0;
    const unmappedTutorials: string[] = [];

    for (const tutorial of tutorials) {
      let categorySlug = "fundamentals"; // Default fallback

      // Try to match based on slug first
      for (const [pattern, catSlug] of Object.entries(
        TUTORIAL_CATEGORY_MAPPING
      )) {
        if (
          tutorial.slug.includes(pattern) ||
          tutorial.title.toLowerCase().includes(pattern.toLowerCase())
        ) {
          categorySlug = catSlug;
          break;
        }
      }

      // Additional intelligent matching based on title/content keywords
      const titleLower = tutorial.title.toLowerCase();
      if (titleLower.includes("html")) categorySlug = "html";
      else if (titleLower.includes("css")) categorySlug = "css";
      else if (titleLower.includes("dom")) categorySlug = "dom";
      else if (titleLower.includes("async") || titleLower.includes("promise"))
        categorySlug = "async";
      else if (titleLower.includes("class") || titleLower.includes("object"))
        categorySlug = "oop";
      else if (
        titleLower.includes("algorithm") ||
        titleLower.includes("data structure")
      )
        categorySlug = "data-structures";
      else if (
        titleLower.includes("advanced") ||
        titleLower.includes("closure") ||
        titleLower.includes("module")
      )
        categorySlug = "advanced";

      const categoryId = categoryMap.get(categorySlug);
      if (!categoryId) {
        console.log(
          `⚠️  Category '${categorySlug}' not found for tutorial '${tutorial.title}'`
        );
        unmappedTutorials.push(tutorial.title);
        continue;
      }

      // Update tutorial with categoryId - we need to do this without Prisma validation since schema isn't updated yet
      await prisma.$executeRaw`UPDATE tutorials SET "categoryId" = ${categoryId} WHERE id = ${tutorial.id}`;

      console.log(`✅ Assigned '${tutorial.title}' → ${categorySlug}`);
      migratedCount++;
    }

    console.log("\n🎉 Migration completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Total tutorials: ${tutorials.length}`);
    console.log(`   - Successfully migrated: ${migratedCount}`);
    console.log(`   - Unmapped: ${unmappedTutorials.length}`);

    if (unmappedTutorials.length > 0) {
      console.log(`\n⚠️  Unmapped tutorials (assigned to 'fundamentals'):`);
      unmappedTutorials.forEach((title) => console.log(`   - ${title}`));
    }

    console.log("\n✅ You can now run: npx prisma db push");
  } catch (error) {
    console.error("❌ Error during migration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the migration
migrateTutorialCategories().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { migrateTutorialCategories };
