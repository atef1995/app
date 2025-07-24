import { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slugify";

const prisma = new PrismaClient();

async function addPremiumQuizzes() {
  console.log("🌱 Adding premium quiz fields and seeding premium quizzes...");

  try {
    // First, let's mark some existing quizzes as premium
    const existingQuizzes = await prisma.quiz.findMany({
      include: {
        tutorial: true,
      },
    });

    console.log(`Found ${existingQuizzes.length} existing quizzes`);

    // Update the second and third quizzes to be premium
    if (existingQuizzes.length >= 2) {
      await prisma.quiz.update({
        where: { id: existingQuizzes[1].id },
        data: {
          isPremium: true,
          requiredPlan: "VIBED",
        },
      });
      console.log(`✅ Updated "${existingQuizzes[1].title}" to VIBED`);
    }

    if (existingQuizzes.length >= 3) {
      await prisma.quiz.update({
        where: { id: existingQuizzes[2].id },
        data: {
          isPremium: true,
          requiredPlan: "CRACKED",
        },
      });
      console.log(`✅ Updated "${existingQuizzes[2].title}" to CRACKED`);
    }

    // Create a new premium tutorial and quiz
    const premiumTutorial = await prisma.tutorial.upsert({
      where: { slug: "advanced-functions-and-scope" },
      update: {},
      create: {
        slug: "advanced-functions-and-scope",
        title: "Advanced Functions and Scope",
        description: "Master closures, IIFE, and advanced function patterns",
        difficulty: 3,
        order: 15,
        published: true,
        isPremium: true,
        requiredPlan: "VIBED",
        mdxFile: "advanced-functions-and-scope.mdx",
      },
    });

    // Create the premium quiz for this tutorial
    const premiumQuiz = await prisma.quiz.create({
      data: {
        tutorialId: premiumTutorial.id,
        title: "Advanced Functions Quiz",
        slug: slugify("Advanced Functions Quiz"),
        isPremium: true,
        requiredPlan: "VIBED",
        questions: [
          {
            id: 1,
            question: "What is a closure in JavaScript?",
            options: [
              "A function that returns another function",
              "A function that has access to variables from its outer scope",
              "A function that is immediately executed",
              "A function that is bound to an object",
            ],
            correct: 1,
            explanation:
              "A closure is a function that has access to variables from its outer (enclosing) scope even after the outer function has returned.",
            difficulty: "medium",
          },
          {
            id: 2,
            question: "What does IIFE stand for?",
            options: [
              "Instantly Invoked Function Expression",
              "Immediately Invoked Function Expression",
              "Internal Invoked Function Expression",
              "Immediate Internal Function Expression",
            ],
            correct: 1,
            explanation:
              "IIFE stands for Immediately Invoked Function Expression - a function that is executed immediately after it is defined.",
            difficulty: "easy",
          },
          {
            id: 3,
            question:
              "What will this code output? (function(x) { return function(y) { return x + y; }; })(5)(3)",
            options: ["8", "53", "undefined", "Error"],
            correct: 0,
            explanation:
              "This is a closure that returns a function. The outer function takes 5 as x, returns a function that takes 3 as y, and returns x + y = 5 + 3 = 8.",
            difficulty: "hard",
          },
          {
            id: 4,
            question:
              "Which method can be used to change the context (this) of a function?",
            options: ["call()", "apply()", "bind()", "All of the above"],
            correct: 3,
            explanation:
              "All three methods (call, apply, and bind) can be used to change the context (this) of a function, but they work slightly differently.",
            difficulty: "medium",
          },
        ],
      },
    });

    console.log(`✅ Created premium quiz: "${premiumQuiz.title}"`);

    // Create another PRO level tutorial and quiz
    const proTutorial = await prisma.tutorial.upsert({
      where: { slug: "asynchronous-javascript-mastery" },
      update: {},
      create: {
        slug: "asynchronous-javascript-mastery",
        title: "Asynchronous JavaScript Mastery",
        description: "Master Promises, async/await, and event loops",
        difficulty: 4,
        order: 25,
        published: true,
        isPremium: true,
        requiredPlan: "CRACKED",
        mdxFile: "asynchronous-javascript-mastery.mdx",
      },
    });

    const proQuiz = await prisma.quiz.create({
      data: {
        tutorialId: proTutorial.id,
        title: "Async JavaScript Mastery Quiz",
        slug: slugify("Async JavaScript Mastery Quiz"),
        isPremium: true,
        requiredPlan: "CRACKED",
        questions: [
          {
            id: 1,
            question:
              "What is the difference between Promise.all() and Promise.race()?",
            options: [
              "There is no difference",
              "Promise.all() waits for all promises, Promise.race() waits for the first",
              "Promise.all() is faster",
              "Promise.race() handles errors better",
            ],
            correct: 1,
            explanation:
              "Promise.all() waits for all promises to resolve (or any to reject), while Promise.race() resolves as soon as the first promise resolves or rejects.",
            difficulty: "medium",
          },
          {
            id: 2,
            question: "What happens when an async function throws an error?",
            options: [
              "The program crashes",
              "It returns a rejected Promise",
              "It returns undefined",
              "It continues execution",
            ],
            correct: 1,
            explanation:
              "When an async function throws an error, it automatically returns a rejected Promise with that error.",
            difficulty: "medium",
          },
          {
            id: 3,
            question: "What is the Event Loop responsible for?",
            options: [
              "Executing synchronous code",
              "Managing memory allocation",
              "Handling asynchronous operations and callbacks",
              "Compiling JavaScript code",
            ],
            correct: 2,
            explanation:
              "The Event Loop is responsible for handling asynchronous operations, managing the callback queue, and determining when callbacks should be executed.",
            difficulty: "hard",
          },
          {
            id: 4,
            question:
              "Which is the correct way to handle multiple async operations that don't depend on each other?",
            options: [
              "await promise1; await promise2;",
              "Promise.all([promise1, promise2])",
              "promise1.then(promise2)",
              "Both A and B are correct",
            ],
            correct: 3,
            explanation:
              "Both approaches work, but Promise.all() is more efficient as it runs operations concurrently, while sequential await runs them one after another.",
            difficulty: "hard",
          },
        ],
      },
    });

    console.log(`✅ Created CRACKED quiz: "${proQuiz.title}"`);

    console.log("\n✅ Premium quizzes setup completed!");
    console.log("📊 Summary:");
    console.log("- Updated existing quizzes with premium tiers");
    console.log("- Created 1 VIBED quiz (Advanced Functions)");
    console.log("- Created 1 CRACKED quiz (Async JavaScript)");
  } catch (error) {
    console.error("❌ Error adding premium quizzes:", error);
    throw error;
  }
}

addPremiumQuizzes()
  .catch((e) => {
    console.error("❌ Script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
