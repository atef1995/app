import { PrismaClient } from "@prisma/client";
import { seedCategories } from "./seedCategories";
import { seedTutorials } from "./seedTutorials";

const prisma = new PrismaClient();

async function seedAll() {
  try {
    console.log("🚀 Starting complete database seeding...");
    
    // First seed categories
    await seedCategories();
    
    // Then seed tutorials (which depend on categories)
    await seedTutorials();
    
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