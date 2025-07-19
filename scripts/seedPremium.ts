// Seed script to add premium tutorials and test the payment system
import { prisma } from "../src/lib/prisma";

async function seedPremiumContent() {
  console.log("🌱 Seeding premium content...");

  // Create a premium tutorial
  const premiumTutorial = await prisma.tutorial.upsert({
    where: { slug: "advanced-javascript-concepts" },
    update: {},
    create: {
      slug: "advanced-javascript-concepts",
      title: "Advanced JavaScript Concepts",
      description:
        "Dive deep into closures, prototypes, and advanced JavaScript patterns",
      difficulty: 3,
      order: 10,
      published: true,
      isPremium: true,
      requiredPlan: "PREMIUM",
      mdxFile: "advanced-javascript-concepts.mdx",
    },
  });

  // Create another premium tutorial
  const enterpriseTutorial = await prisma.tutorial.upsert({
    where: { slug: "enterprise-javascript-architecture" },
    update: {},
    create: {
      slug: "enterprise-javascript-architecture",
      title: "Enterprise JavaScript Architecture",
      description:
        "Learn to build scalable enterprise applications with advanced patterns",
      difficulty: 4,
      order: 20,
      published: true,
      isPremium: true,
      requiredPlan: "PRO",
      mdxFile: "enterprise-javascript-architecture.mdx",
    },
  });

  // Create quizzes for premium tutorials
  const existingPremiumQuiz = await prisma.quiz.findFirst({
    where: { tutorialId: premiumTutorial.id },
  });

  if (!existingPremiumQuiz) {
    await prisma.quiz.create({
      data: {
        tutorialId: premiumTutorial.id,
        title: "Advanced JavaScript Quiz",
        questions: [
          {
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
          },
          {
            question: "What is the prototype chain?",
            options: [
              "A way to chain function calls",
              "JavaScript's inheritance mechanism",
              "A method to create objects",
              "A way to handle errors",
            ],
            correct: 1,
            explanation:
              "The prototype chain is JavaScript's mechanism for inheritance, allowing objects to inherit properties and methods from other objects.",
          },
        ],
      },
    });
  }

  const existingEnterpriseQuiz = await prisma.quiz.findFirst({
    where: { tutorialId: enterpriseTutorial.id },
  });

  if (!existingEnterpriseQuiz) {
    await prisma.quiz.create({
      data: {
        tutorialId: enterpriseTutorial.id,
        title: "Enterprise Architecture Quiz",
        questions: [
          {
            question: "What is the Module pattern?",
            options: [
              "A way to import modules",
              "A design pattern for encapsulation",
              "A way to create classes",
              "A method for handling async code",
            ],
            correct: 1,
            explanation:
              "The Module pattern is a design pattern used to encapsulate code and create private scope in JavaScript.",
          },
        ],
      },
    });
  }

  // Mark the first tutorial as free to show the difference
  await prisma.tutorial.updateMany({
    where: { order: 1 },
    data: {
      isPremium: false,
      requiredPlan: "FREE",
    },
  });

  console.log("✅ Premium content seeded successfully!");
  console.log(`📚 Created premium tutorial: ${premiumTutorial.title}`);
  console.log(`🏢 Created enterprise tutorial: ${enterpriseTutorial.title}`);
}

seedPremiumContent()
  .catch((e) => {
    console.error("❌ Error seeding premium content:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
