import { PrismaClient } from "@prisma/client";
import { basicChallenges } from "../src/data/challenges/basic";
import { algorithmChallenges } from "../src/data/challenges/algorithms";
import { slugify, generateUniqueSlug } from "../src/lib/slugify";
import { seedChallenges } from "./seedChallenges";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed challenges
    await seedChallenges();
    
    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
