import { PrismaClient } from "@prisma/client";
import { seedSkills } from "../prisma/seeds/skillSeeds";

const prisma = new PrismaClient();

async function main() {
  try {
    await seedSkills();
    console.log("✅ Skills seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding skills:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});