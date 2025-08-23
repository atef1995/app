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
        content: "dom/01-dom-manipulation.mdx",
        difficulty: 2,
        estimatedTime: 45,
        order: 1,
        isPremium: false,
        requiredPlan: "FREE",
        topics: ["DOM", "JavaScript", "HTML", "Events", "Elements"],
        quizQuestions: 12,
      },
      {
        title: "DOM Selectors & Traversal: Finding Elements Like a Pro",
        slug: "dom-selectors-traversal",
        description:
          "Master advanced DOM selection techniques, CSS selectors, and tree traversal methods to efficiently navigate HTML structures.",
        content: "dom/02-dom-selectors-traversal.mdx",
        difficulty: 2,
        estimatedTime: 50,
        order: 2,
        isPremium: false,
        requiredPlan: "FREE",
        topics: ["DOM", "Selectors", "CSS", "Traversal", "Elements"],
        quizQuestions: 14,
      },
      {
        title: "DOM Events Deep Dive: Interactive Web Magic",
        slug: "dom-events-deep-dive",
        description:
          "Master event handling, event delegation, custom events, and advanced interaction patterns for dynamic web applications.",
        content: "dom/03-dom-events-deep-dive.mdx",
        difficulty: 3,
        estimatedTime: 60,
        order: 3,
        isPremium: true,
        requiredPlan: "PRO",
        topics: [
          "DOM",
          "Events",
          "Event Delegation",
          "Custom Events",
          "Interaction",
        ],
        quizQuestions: 16,
      },
      {
        title: "Form Handling & Validation: User Input Mastery",
        slug: "form-handling-validation",
        description:
          "Master form interactions, validation patterns, data collection, and user experience best practices for web forms.",
        content: "dom/04-form-handling-validation.mdx",
        difficulty: 3,
        estimatedTime: 55,
        order: 4,
        isPremium: true,
        requiredPlan: "PRO",
        topics: ["Forms", "Validation", "User Input", "UX", "DOM"],
        quizQuestions: 15,
      },
      {
        title: "Browser Object Model (BOM): Mastering the Browser Environment",
        slug: "browser-object-model",
        description:
          "Explore the Browser Object Model to control navigation, manage browser history, handle storage, and interact with the browser environment.",
        content: "dom/05-browser-object-model.mdx",
        difficulty: 3,
        estimatedTime: 50,
        order: 5,
        isPremium: true,
        requiredPlan: "PRO",
        topics: [
          "BOM",
          "Window",
          "Navigation",
          "History",
          "Storage",
          "Location",
        ],
        quizQuestions: 13,
      },
    ];

    // Create tutorials
    for (const tutorialData of domTutorials) {
      const tutorial = await prisma.tutorial.upsert({
        where: {
          categoryId_slug: {
            categoryId: domCategory.id,
            slug: tutorialData.slug,
          },
        },
        update: {
          title: tutorialData.title,
          description: tutorialData.description,
          content: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          topics: tutorialData.topics,
          quizQuestions: tutorialData.quizQuestions,
        },
        create: {
          title: tutorialData.title,
          slug: tutorialData.slug,
          description: tutorialData.description,
          content: tutorialData.content,
          difficulty: tutorialData.difficulty,
          estimatedTime: tutorialData.estimatedTime,
          order: tutorialData.order,
          isPremium: tutorialData.isPremium,
          requiredPlan: tutorialData.requiredPlan,
          topics: tutorialData.topics,
          quizQuestions: tutorialData.quizQuestions,
          categoryId: domCategory.id,
        },
      });

      console.log(`✅ Tutorial created/updated: ${tutorial.title}`);
    }

    // Create sample quiz questions for DOM Manipulation tutorial
    const domManipulationTutorial = await prisma.tutorial.findFirst({
      where: {
        categoryId: domCategory.id,
        slug: "dom-manipulation",
      },
    });

    if (domManipulationTutorial) {
      // Sample quiz questions for DOM Manipulation
      const quizQuestions = [
        {
          question: "Which method is used to select an element by its ID?",
          options: [
            "document.querySelector('#id')",
            "document.getElementById('id')",
            "document.getElementByClass('id')",
            "document.selectById('id')",
          ],
          correctAnswer: 1,
          explanation:
            "document.getElementById() is the most direct and fastest way to select an element by its ID. It returns the element directly or null if not found.",
          difficulty: 1,
          order: 1,
        },
        {
          question: "What is the difference between textContent and innerHTML?",
          options: [
            "They are exactly the same",
            "textContent sets/gets plain text, innerHTML sets/gets HTML content",
            "innerHTML is faster than textContent",
            "textContent only works with div elements",
          ],
          correctAnswer: 1,
          explanation:
            "textContent sets or gets the plain text content of an element, while innerHTML sets or gets the HTML content including tags. innerHTML can parse HTML, textContent treats everything as plain text.",
          difficulty: 2,
          order: 2,
        },
        {
          question:
            "Which method adds a CSS class to an element without removing existing classes?",
          options: [
            "element.className = 'newClass'",
            "element.classList.add('newClass')",
            "element.addClass('newClass')",
            "element.style.class = 'newClass'",
          ],
          correctAnswer: 1,
          explanation:
            "classList.add() adds a class to an element's class list without affecting existing classes. It's safer than directly setting className which would replace all classes.",
          difficulty: 2,
          order: 3,
        },
        {
          question: "How do you create a new HTML element with JavaScript?",
          options: [
            "document.newElement('div')",
            "document.createElement('div')",
            "document.addElement('div')",
            "new HTMLElement('div')",
          ],
          correctAnswer: 1,
          explanation:
            "document.createElement() creates a new HTML element with the specified tag name. The element exists in memory but must be added to the DOM using methods like appendChild().",
          difficulty: 1,
          order: 4,
        },
        {
          question: "What does the addEventListener method do?",
          options: [
            "It adds a CSS class to an element",
            "It attaches an event handler function to an element",
            "It creates a new HTML element",
            "It removes an element from the DOM",
          ],
          correctAnswer: 1,
          explanation:
            "addEventListener() attaches an event handler function to an element for a specified event. It's the modern way to handle events and allows multiple handlers for the same event.",
          difficulty: 2,
          order: 5,
        },
      ];

      // Create quiz questions
      for (const questionData of quizQuestions) {
        await prisma.quizQuestion.upsert({
          where: {
            tutorialId_order: {
              tutorialId: domManipulationTutorial.id,
              order: questionData.order,
            },
          },
          update: questionData,
          create: {
            ...questionData,
            tutorialId: domManipulationTutorial.id,
          },
        });
      }

      console.log(
        `✅ Created ${quizQuestions.length} quiz questions for DOM Manipulation tutorial`
      );
    }

    // Create sample achievements related to DOM learning
    const domAchievements = [
      {
        title: "DOM Manipulator",
        description: "Complete your first DOM manipulation tutorial",
        icon: "🎯",
        type: "TUTORIAL_COMPLETION",
        requiredValue: 1,
        category: "learning",
        isSecret: false,
        order: 1,
      },
      {
        title: "Element Selector Master",
        description: "Master all DOM selector techniques",
        icon: "🎪",
        type: "TUTORIAL_COMPLETION",
        requiredValue: 2,
        category: "learning",
        isSecret: false,
        order: 2,
      },
      {
        title: "Event Handler Pro",
        description: "Complete the DOM Events Deep Dive tutorial",
        icon: "⚡",
        type: "TUTORIAL_COMPLETION",
        requiredValue: 3,
        category: "learning",
        isSecret: false,
        order: 3,
      },
      {
        title: "Form Wizard",
        description: "Master form handling and validation",
        icon: "🧙‍♂️",
        type: "TUTORIAL_COMPLETION",
        requiredValue: 4,
        category: "learning",
        isSecret: false,
        order: 4,
      },
      {
        title: "Browser Master",
        description: "Complete all DOM and Browser API tutorials",
        icon: "🌐",
        type: "TUTORIAL_COMPLETION",
        requiredValue: 5,
        category: "learning",
        isSecret: false,
        order: 5,
      },
    ];

    for (const achievementData of domAchievements) {
      await prisma.achievement.upsert({
        where: {
          title: achievementData.title,
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

// Allow running this seeder directly
if (require.main === module) {
  seedDomTutorials()
    .catch((e) => {
      console.error("❌ Seeding failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
