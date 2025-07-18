import { PrismaClient, Difficulty } from "@prisma/client";
import { quizzes } from "../src/data/quizzes";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding quizzes and tutorials...");

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
    {
      id: "4",
      slug: "control-structures",
      title: "Control Structures",
      description: "Learn about if statements, loops, and conditional logic.",
      content: "This tutorial covers JavaScript control structures.",
      difficulty: 2,
      order: 4,
      published: true,
    },
    {
      id: "5",
      slug: "dom-manipulation",
      title: "DOM Manipulation",
      description: "Learn how to manipulate the DOM with JavaScript.",
      content: "This tutorial covers DOM manipulation techniques.",
      difficulty: 3,
      order: 5,
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

  // Now process quizzes - flatten questions into individual Quiz records
  const quizArray = Object.values(quizzes);

  for (const quiz of quizArray) {
    const tutorialId = quiz.tutorialId.toString();

    // Create quiz questions as individual Quiz records
    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];

      const quizRecord = {
        id: `${quiz.id}-${question.id}`, // Create unique ID
        tutorialId: tutorialId,
        question: question.question,
        options: question.options, // JSON array
        correctAnswer: question.correct,
        explanation: question.explanation,
        difficulty: question.difficulty.toUpperCase() as
          | "EASY"
          | "MEDIUM"
          | "HARD",
        order: i + 1,
      };

      await prisma.quiz.upsert({
        where: { id: quizRecord.id },
        update: quizRecord,
        create: quizRecord,
      });
    }
  }

  console.log("Seeded quiz questions...");
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
