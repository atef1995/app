import { PrismaClient } from "@prisma/client";
import { quizzes, Quiz } from "./seeds/data/quizzes";
import { slugify, generateUniqueSlug } from "../src/lib/slugify";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding quizzes and tutorials...");
  // Get existing quiz slugs to avoid conflicts
  const existingQuizzes = await prisma.quiz.findMany({
    select: { slug: true },
  });
  const existingSlugs = existingQuizzes.map((q) => q.slug).filter(Boolean);

  // Now process quizzes - create single Quiz records with questions as JSON
  const quizArray = Object.values(quizzes);

  for (const quiz of quizArray) {
    const tutorialId = quiz.tutorialId.toString();

    // Generate unique slug for the quiz
    const baseSlug = slugify(quiz.title);
    const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);
    existingSlugs.push(uniqueSlug);

    const quizRecord = {
      id: quiz.id.toString(),
      tutorialId: tutorialId,
      title: quiz.title,
      slug: uniqueSlug,
      questions: quiz.questions, // Store as JSON
    };

    await prisma.quiz.upsert({
      where: { id: quizRecord.id },
      update: quizRecord,
      create: quizRecord,
    });

    console.log(`✅ Created quiz "${quiz.title}" with slug: ${uniqueSlug}`);
  }

  console.log("Seeded quizzes...");
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
