import { PrismaClient } from "@prisma/client";
import { quizzes } from "../src/data/quizzes";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with quizzes...");

  // First, create Tutorial records
  const tutorials = [
    {
      id: "1",
      slug: "variables-and-data-types",
      title: "Variables and Data Types",
      description:
        "Learn about JavaScript variables, data types, and how to work with them.",
      content:
        "This tutorial covers the fundamentals of JavaScript variables and data types.",
      difficulty: 1,
      order: 1,
      published: true,
    },
    {
      id: "2",
      slug: "functions-and-scope",
      title: "Functions and Scope",
      description: "Understanding JavaScript functions, parameters, and scope.",
      content: "This tutorial covers JavaScript functions and how scope works.",
      difficulty: 2,
      order: 2,
      published: true,
    },
    {
      id: "3",
      slug: "arrays-and-objects",
      title: "Arrays and Objects",
      description: "Working with JavaScript arrays and objects.",
      content: "This tutorial covers JavaScript arrays and objects.",
      difficulty: 2,
      order: 3,
      published: true,
    },
  ];

  // Create tutorials
  for (const tutorial of tutorials) {
    await prisma.tutorial.upsert({
      where: { id: tutorial.id },
      update: tutorial,
      create: tutorial,
    });
  }

  console.log("Created tutorials...");

  // Clear existing Quiz records to avoid conflicts
  await prisma.quiz.deleteMany({});
  console.log("Cleared existing quiz records...");

  // Now create Quiz records with complete quiz data
  const quizArray = Object.values(quizzes);

  for (const quiz of quizArray) {
    const quizRecord = {
      id: quiz.id.toString(),
      tutorialId: quiz.tutorialId.toString(),
      title: quiz.title,
      questions: quiz.questions, // Store the entire questions array as JSON
    };

    await prisma.quiz.create({
      data: quizRecord,
    });

    console.log(`Created quiz: ${quiz.title}`);
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
