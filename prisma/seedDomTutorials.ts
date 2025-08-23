import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDomTutorials() {
  console.log("🌱 Seeding DOM tutorials...");

  try {
    // Create or get the DOM category
    const domCategory = await prisma.category.upsert({
      where: { slug: "dom" },
      update: {},
      create: {
        title: "DOM Manipulation",
        slug: "dom",
        description:
          "Master the Document Object Model and Browser APIs to create dynamic, interactive web experiences.",
        difficulty: "intermediate",
        duration: "6-8 hours", // Total estimated time for all tutorials
        topics: ["DOM", "JavaScript", "Browser APIs", "Events", "Forms"],
        order: 3, // After fundamentals and CSS
        published: true,
      },
    });

    console.log(`✅ DOM category created/updated: ${domCategory.id}`);

    // Define DOM tutorials
    const domTutorials = [
      {
        title: "DOM Manipulation: Bringing Web Pages to Life",
        slug: "dom-manipulation",
        description:
          "Learn to interact with and manipulate HTML elements using JavaScript DOM methods for dynamic web experiences.",
        content: "dom/01-dom-manipulation",
        difficulty: 2,
        estimatedTime: 45,
        order: 1,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        title: "DOM Selectors & Traversal: Finding Elements Like a Pro",
        slug: "dom-selectors-traversal",
        description:
          "Master advanced DOM selection techniques, CSS selectors, and tree traversal methods to efficiently navigate HTML structures.",
        content: "dom/02-dom-selectors-traversal",
        difficulty: 2,
        estimatedTime: 50,
        order: 2,
        isPremium: false,
        requiredPlan: "FREE",
      },
      {
        title: "DOM Events Deep Dive: Interactive Web Magic",
        slug: "dom-events-deep-dive",
        description:
          "Master event handling, event delegation, custom events, and advanced interaction patterns for dynamic web applications.",
        content: "dom/03-dom-events-deep-dive",
        difficulty: 3,
        estimatedTime: 60,
        order: 3,
        isPremium: true,
        requiredPlan: "PRO",
      },
      {
        title: "Form Handling & Validation: User Input Mastery",
        slug: "form-handling-validation",
        description:
          "Master form interactions, validation patterns, data collection, and user experience best practices for web forms.",
        content: "dom/04-form-handling-validation",
        difficulty: 3,
        estimatedTime: 55,
        order: 4,
        isPremium: true,
        requiredPlan: "PRO",
      },
      {
        title: "Browser Object Model (BOM): Mastering the Browser Environment",
        slug: "browser-object-model",
        description:
          "Explore the Browser Object Model to control navigation, manage browser history, handle storage, and interact with the browser environment.",
        content: "dom/05-browser-object-model",
        difficulty: 3,
        estimatedTime: 50,
        order: 5,
        isPremium: true,
        requiredPlan: "PRO",
      },
    ];

    // Create tutorials
    for (const tutorialData of domTutorials) {
      const tutorial = await prisma.tutorial.upsert({
        where: {
          slug: tutorialData.slug,
        },
        update: {
          title: tutorialData.title,
          description: tutorialData.description,
          mdxFile: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          published: true,
          categoryId: domCategory.id,
        },
        create: {
          title: tutorialData.title,
          slug: tutorialData.slug,
          description: tutorialData.description,
          mdxFile: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          published: true,
          categoryId: domCategory.id,
        },
      });

      console.log(`✅ Tutorial created/updated: ${tutorial.title}`);
    }

    // Note: Quiz creation should be handled by the quiz seeding system
    console.log(
      "📝 Tutorial structure created. Quizzes should be seeded separately using the quiz system."
    );

    // Create sample achievements related to DOM learning
    const domAchievements = [
      {
        key: "dom-manipulator",
        title: "DOM Manipulator",
        description: "Complete your first DOM manipulation tutorial",
        icon: "🎯",
        category: "learning",
        rarity: "COMMON",
        points: 50,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 1,
        isHidden: false,
      },
      {
        key: "element-selector-master",
        title: "Element Selector Master",
        description: "Master all DOM selector techniques",
        icon: "🎪",
        category: "learning",
        rarity: "COMMON",
        points: 75,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 2,
        isHidden: false,
      },
      {
        key: "event-handler-pro",
        title: "Event Handler Pro",
        description: "Complete the DOM Events Deep Dive tutorial",
        icon: "⚡",
        category: "learning",
        rarity: "RARE",
        points: 100,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 3,
        isHidden: false,
      },
      {
        key: "form-wizard",
        title: "Form Wizard",
        description: "Master form handling and validation",
        icon: "🧙‍♂️",
        category: "learning",
        rarity: "RARE",
        points: 125,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 4,
        isHidden: false,
      },
      {
        key: "browser-master",
        title: "Browser Master",
        description: "Complete all DOM and Browser API tutorials",
        icon: "🌐",
        category: "learning",
        rarity: "EPIC",
        points: 200,
        requirementType: "TUTORIAL_COMPLETION",
        requirementValue: 5,
        isHidden: false,
      },
    ];

    for (const achievementData of domAchievements) {
      await prisma.achievement.upsert({
        where: {
          key: achievementData.key,
        },
        update: achievementData,
        create: achievementData,
      });
    }

    console.log(
      `✅ Created ${domAchievements.length} DOM-related achievements`
    );

    console.log("🎉 DOM tutorials seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding DOM tutorials:", error);
    throw error;
  }
}

export default seedDomTutorials;

seedDomTutorials()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
