import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCssTutorials() {
  try {
    console.log("🎨 Seeding CSS tutorials...");

    // First, get or create the CSS category
    const cssCategory = await prisma.category.upsert({
      where: { slug: "css" },
      update: {},
      create: {
        slug: "css",
        title: "CSS",
        description:
          "Learn Cascading Style Sheets to create beautiful, responsive web designs",
        difficulty: "beginner",
        topics: ["CSS", "Styling", "Layout", "Design", "Responsive"],
        duration: "6-8 hours",
        iconBg: "bg-blue-100 dark:bg-blue-900",
        iconColor: "text-blue-600 dark:text-blue-400",
        badgeBg: "bg-blue-100 dark:bg-blue-900",
        badgeColor: "text-blue-800 dark:text-blue-200",
        dotColor: "bg-blue-600",
        order: 2,
        published: true,
      },
    });

    console.log(`✅ CSS category: ${cssCategory.title}`);

    // CSS Fundamentals Tutorial
    const cssFundamentalsTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-fundamentals" },
      update: {},
      create: {
        slug: "css-fundamentals",
        title: "CSS Fundamentals: Styling Your Web Pages",
        description:
          "Learn the basics of CSS including selectors, properties, and styling techniques to make your web pages look amazing.",
        content: null,
        mdxFile: "css/01-css-fundamentals",
        categoryId: cssCategory.id,
        difficulty: 1,
        estimatedTime: 60.0,
        order: 1,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssFundamentalsTutorial.title}`);

    // CSS Flexbox Tutorial
    const cssFlexboxTutorial = await prisma.tutorial.upsert({
      where: { slug: "css-layout-flexbox" },
      update: {},
      create: {
        slug: "css-layout-flexbox",
        title: "CSS Layout with Flexbox: Modern Web Layouts Made Easy",
        description:
          "Master CSS Flexbox to create responsive, flexible layouts with ease. Learn alignment, distribution, and responsive design patterns.",
        content: null,
        mdxFile: "css/02-css-layout-flexbox",
        categoryId: cssCategory.id,
        difficulty: 2,
        estimatedTime: 75.0,
        order: 2,
        published: true,
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Tutorial: ${cssFlexboxTutorial.title}`);

    // Create quizzes for the tutorials
    const cssFundamentalsQuiz = await prisma.quiz.upsert({
      where: { slug: "css-fundamentals-quiz" },
      update: {},
      create: {
        slug: "css-fundamentals-quiz",
        tutorialId: cssFundamentalsTutorial.id,
        title: "CSS Fundamentals Quiz",
        questions: [
          {
            question: "What does CSS stand for?",
            options: [
              "Computer Style Sheets",
              "Cascading Style Sheets",
              "Creative Style Sheets",
              "Colorful Style Sheets",
            ],
            correct: 1,
            explanation:
              "CSS stands for Cascading Style Sheets, which describes how HTML elements should be displayed.",
          },
          {
            question: "Which CSS selector has the highest specificity?",
            options: [
              "Element selector (p)",
              "Class selector (.highlight)",
              "ID selector (#header)",
              "Universal selector (*)",
            ],
            correct: 2,
            explanation:
              "ID selectors have higher specificity than class selectors, which have higher specificity than element selectors.",
          },
          {
            question: "What is the correct CSS syntax?",
            options: [
              "body {color: black}",
              "body {color: black;}",
              "{body: color=black;}",
              "body: color=black;",
            ],
            correct: 1,
            explanation:
              "CSS syntax requires a selector, followed by curly braces containing property: value pairs, ending with semicolons.",
          },
          {
            question:
              "Which property controls the space inside an element's border?",
            options: ["margin", "padding", "border", "spacing"],
            correct: 1,
            explanation:
              "Padding controls the space inside an element between the content and the border.",
          },
          {
            question: "What is the default display value for div elements?",
            options: ["inline", "inline-block", "block", "none"],
            correct: 2,
            explanation:
              "Div elements are block-level elements by default, meaning they take up the full width available and create a new line.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssFundamentalsQuiz.title}`);

    const cssFlexboxQuiz = await prisma.quiz.upsert({
      where: { slug: "css-flexbox-quiz" },
      update: {},
      create: {
        slug: "css-flexbox-quiz",
        tutorialId: cssFlexboxTutorial.id,
        title: "CSS Flexbox Layout Quiz",
        questions: [
          {
            question: "Which property creates a flex container?",
            options: [
              "display: flex-container",
              "display: flex",
              "flex: container",
              "container: flex",
            ],
            correct: 1,
            explanation:
              "The display: flex property creates a flex container, making its direct children flex items.",
          },
          {
            question: "Which property controls alignment along the main axis?",
            options: [
              "align-items",
              "align-content",
              "justify-content",
              "flex-align",
            ],
            correct: 2,
            explanation:
              "justify-content controls alignment and distribution of flex items along the main axis.",
          },
          {
            question: "What does 'flex: 1' mean?",
            options: [
              "flex-grow: 1, flex-shrink: 0, flex-basis: auto",
              "flex-grow: 1, flex-shrink: 1, flex-basis: 0%",
              "flex-grow: 0, flex-shrink: 1, flex-basis: 1px",
              "Only flex-grow: 1",
            ],
            correct: 1,
            explanation:
              "flex: 1 is shorthand for flex-grow: 1, flex-shrink: 1, flex-basis: 0%, meaning the item will grow and shrink equally.",
          },
          {
            question: "Which property makes flex items wrap to new lines?",
            options: [
              "flex-wrap: wrap",
              "flex-break: wrap",
              "wrap: flex",
              "flex-line: wrap",
            ],
            correct: 0,
            explanation:
              "flex-wrap: wrap allows flex items to wrap onto multiple lines when there isn't enough space.",
          },
          {
            question:
              "How do you center an item both horizontally and vertically in a flex container?",
            options: [
              "align-items: center",
              "justify-content: center",
              "align-items: center; justify-content: center",
              "text-align: center; vertical-align: middle",
            ],
            correct: 2,
            explanation:
              "Use both align-items: center (vertical) and justify-content: center (horizontal) to center in both directions.",
          },
        ],
        isPremium: false,
        requiredPlan: "FREE",
      },
    });

    console.log(`✅ Quiz: ${cssFlexboxQuiz.title}`);

    console.log("🎉 CSS tutorials seeded successfully!");

    return {
      category: cssCategory,
      tutorials: [cssFundamentalsTutorial, cssFlexboxTutorial],
      quizzes: [cssFundamentalsQuiz, cssFlexboxQuiz],
    };
  } catch (error) {
    console.error("❌ Error seeding CSS tutorials:", error);
    throw error;
  }
}

export default seedCssTutorials;

// Allow running this script directly
seedCssTutorials()
  .then(() => {
    console.log("✅ CSS tutorials seeding completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ CSS tutorials seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
