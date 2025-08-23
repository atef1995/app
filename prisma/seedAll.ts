import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seedCategories";
import { seedTutorials } from "./seedTutorials";
import seedHtmlTutorials from "./seedHtmlTutorials";
import seedCssTutorials from "./seedCssTutorials";
import { seedSkills } from "./seeds/skillSeeds";

const prisma = new PrismaClient();

async function seedAll() {
  try {
    console.log("🚀 Starting complete database seeding...");
    
    // First seed skills (independent)
    await seedSkills();
    
    // Then seed categories
    await seedCategories();
    
    // Then seed tutorials (which depend on categories)
    await seedTutorials();
    
    // Seed HTML tutorials
    await seedHtmlTutorials();
    
    // Seed CSS tutorials
    await seedCssTutorials();
    
    console.log("🎉 Complete seeding finished successfully!");
  } catch (error) {
    console.error("❌ Error during complete seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the complete seeding
seedAll().catch((e) => {
  console.error(e);
  process.exit(1);
});

export { seedAll };