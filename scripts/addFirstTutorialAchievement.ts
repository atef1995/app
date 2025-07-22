import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function addFirstTutorialAchievement() {
  console.log("Adding FIRST_TUTORIAL achievement...");

  try {
    const achievement = await prisma.achievement.upsert({
      where: { key: "FIRST_TUTORIAL" },
      update: {},
      create: {
        key: "FIRST_TUTORIAL",
        title: "Welcome Explorer 📚",
        description: "Start your first tutorial",
        icon: "📚",
        category: "learning",
        rarity: "COMMON",
        points: 5,
        requirementType: "tutorial_start",
        requirementValue: 1,
        isHidden: false,
      },
    });

    console.log("✅ FIRST_TUTORIAL achievement added:", achievement);
  } catch (error) {
    console.error("❌ Error adding achievement:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addFirstTutorialAchievement();
