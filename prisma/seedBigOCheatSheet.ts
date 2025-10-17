/**
 * Seed script for Big O Time Complexity Cheat Sheet
 * Creates a premium cheat sheet for the "Understanding Time Complexity: Big O" tutorial
 *
 * Usage: npx ts-node --project tsconfig.json prisma/seedBigOCheatSheet.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBigOCheatSheet() {
  console.log("📚 Seeding Big O Complexity Cheat Sheet...\n");

  try {
    // Check if already exists
    const existing = await prisma.cheatSheet.findUnique({
      where: { slug: "big-o-complexity-cheatsheet" },
    });

    if (existing) {
      console.log("✅ Big O Cheat Sheet already exists, updating...");
    }

    const cheatSheet = await prisma.cheatSheet.upsert({
      where: { slug: "big-o-complexity-cheatsheet" },
      update: {
        title: "Big O Time Complexity Cheat Sheet",
        topic: "Time Complexity Analysis",
        category: "Data Structures & Algorithms",
        description:
          "Complete reference for Big O notation, time and space complexity, and how to analyze algorithms. Includes all complexity classes, real-world examples, and optimization techniques from the tutorial.",
        difficulty: "intermediate",
        fileFormat: "PDF",
        fileSize: "2.8 MB",
        downloadUrl: "/downloads/cheat-sheets/big-o-complexity-cheatsheet.pdf",
        previewUrl: "/previews/cheat-sheets/big-o-complexity-cheatsheet.png",
        tags: [
          "big-o",
          "time-complexity",
          "space-complexity",
          "algorithm-analysis",
          "optimization",
          "interview-prep",
          "dsa",
        ],
        isPremium: true,
        requiredPlan: "VIBED",
        keywords:
          "Big O notation, time complexity, space complexity, O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), algorithm analysis, optimization, interview questions",
        published: true,
        viewCount: 0,
        downloadCount: 0,
      },
      create: {
        slug: "big-o-complexity-cheatsheet",
        title: "Big O Time Complexity Cheat Sheet",
        topic: "Time Complexity Analysis",
        category: "Data Structures & Algorithms",
        description:
          "Complete reference for Big O notation, time and space complexity, and how to analyze algorithms. Includes all complexity classes, real-world examples, and optimization techniques from the tutorial.",
        difficulty: "intermediate",
        fileFormat: "PDF",
        fileSize: "2.8 MB",
        downloadUrl: "/downloads/cheat-sheets/big-o-complexity-cheatsheet.pdf",
        previewUrl: "/previews/cheat-sheets/big-o-complexity-cheatsheet.png",
        tags: [
          "big-o",
          "time-complexity",
          "space-complexity",
          "algorithm-analysis",
          "optimization",
          "interview-prep",
          "dsa",
        ],
        isPremium: true,
        requiredPlan: "VIBED",
        keywords:
          "Big O notation, time complexity, space complexity, O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ), algorithm analysis, optimization, interview questions",
        published: true,
        viewCount: 0,
        downloadCount: 0,
      },
    });

    console.log("✅ Seeded: Big O Time Complexity Cheat Sheet");
    console.log(`   📄 Title: ${cheatSheet.title}`);
    console.log(`   🏷️  Slug: ${cheatSheet.slug}`);
    console.log(
      `   💎 Premium: ${cheatSheet.isPremium ? "Yes (VIBED)" : "No"}`
    );
    console.log(`   📦 Tags: ${cheatSheet.tags.join(", ")}`);

    console.log("\n✨ Big O Cheat Sheet seed complete!\n");

    return cheatSheet;
  } catch (error) {
    console.error("❌ Error seeding Big O Cheat Sheet:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedBigOCheatSheet()
  .then((result) => {
    console.log("Result:", result);
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
