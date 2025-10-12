import { PrismaClient } from "@prisma/client";
import type { Prisma } from "@prisma/client";

/**
 * Tutorial seed data structure (without categoryId)
 * categoryId is resolved dynamically from categorySlug
 */
export interface TutorialSeedData {
  slug: string;
  title: string;
  description: string;
  mdxFile: string;
  difficulty: number;
  order: number;
  published: boolean;
  isPremium: boolean;
  requiredPlan: string;
  estimatedTime: number;
}

/**
 * Quiz seed data structure
 */
export interface QuizSeedData {
  slug: string;
  title: string;
  tutorialSlug: string;
  isPremium: boolean;
  requiredPlan: string;
  questions: QuizQuestion[];
}

/**
 * Quiz question structure
 */
export interface QuizQuestion {
  id: string;
  question: string;
  type: string;
  options: string[];
  correct: number;
  explanation: string;
}

/**
 * Seeds a single tutorial
 *
 * @param categorySlug - The category slug to associate the tutorial with
 * @param tutorialData - Tutorial data without categoryId
 * @param prisma - PrismaClient instance
 * @returns The created or updated tutorial
 *
 * @example
 * const tutorial = await seedTutorial('data-structures', {
 *   slug: '02-two-pointer-technique',
 *   title: 'Master the Two-Pointer Technique',
 *   // ... other fields
 * }, prisma);
 */
export async function seedTutorial(
  categorySlug: string,
  tutorialData: TutorialSeedData,
  prisma: PrismaClient
) {
  // Find the category
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });

  if (!category) {
    throw new Error(
      `Category '${categorySlug}' not found. Please run seedCategories first.`
    );
  }

  const existingTutorial = await prisma.tutorial.findUnique({
    where: { slug: tutorialData.slug },
  });

  if (existingTutorial) {
    return;
  }

  // Create or update the tutorial
  const tutorial = await prisma.tutorial.create({
    data: {
      ...tutorialData,
      category: {
        connect: { id: category.id },
      },
    },
  });

  console.log(`✅ Tutorial: ${tutorial.title}`);
  return tutorial;
}

/**
 * Seeds multiple tutorials for a category
 *
 * @param categorySlug - The category slug to associate tutorials with
 * @param tutorials - Array of tutorial data
 * @param prisma - PrismaClient instance
 * @returns Array of created or updated tutorials
 *
 * @example
 * const tutorials = await seedTutorials('data-structures', [
 *   { slug: '01-arrays', ... },
 *   { slug: '02-two-pointer', ... }
 * ], prisma);
 */
export async function seedTutorials(
  categorySlug: string,
  tutorials: TutorialSeedData[],
  prisma: PrismaClient
) {
  console.log(
    `📚 Seeding ${tutorials.length} tutorials for '${categorySlug}'...`
  );

  const createdTutorials = [];

  for (const tutorialData of tutorials) {
    const tutorial = await seedTutorial(categorySlug, tutorialData, prisma);
    createdTutorials.push(tutorial);
  }

  console.log(`🎉 Successfully seeded ${createdTutorials.length} tutorials!`);
  return createdTutorials;
}

/**
 * Seeds a single quiz (create only, does not update existing quizzes)
 *
 * @param quizData - Quiz data including tutorialSlug
 * @param prisma - PrismaClient instance
 * @returns The created quiz, or null if tutorial not found or quiz already exists
 *
 * @example
 * const quiz = await seedQuiz({
 *   slug: '02-two-pointer-quiz',
 *   title: 'Two Pointer Quiz',
 *   tutorialSlug: '02-two-pointer-technique',
 *   questions: [...],
 *   // ... other fields
 * }, prisma);
 */
export async function seedQuiz(quizData: QuizSeedData, prisma: PrismaClient) {
  // Check if quiz already exists
  const existingQuiz = await prisma.quiz.findUnique({
    where: { slug: quizData.slug },
  });

  if (existingQuiz) {
    console.log(`⏭️  Quiz already exists: ${existingQuiz.title}`);
    return null;
  }

  // Find the tutorial this quiz belongs to
  const tutorial = await prisma.tutorial.findUnique({
    where: { slug: quizData.tutorialSlug },
  });

  if (!tutorial) {
    console.warn(
      `⚠️  Quiz skipped: Tutorial '${quizData.tutorialSlug}' not found for quiz '${quizData.slug}'`
    );
    return null;
  }

  // Extract tutorialSlug and create quiz data
  const { tutorialSlug, questions, ...quizDataWithoutSlug } = quizData;

  // Create the quiz (only create, never update)
  const quiz = await prisma.quiz.create({
    data: {
      ...quizDataWithoutSlug,
      tutorialId: tutorial.id,
      questions: questions as unknown as Prisma.InputJsonValue,
    },
  });

  console.log(`✅ Quiz: ${quiz.title}`);
  return quiz;
}

/**
 * Seeds multiple quizzes
 *
 * @param quizzes - Array of quiz data
 * @param prisma - PrismaClient instance
 * @returns Array of created or updated quizzes (null entries for skipped quizzes)
 *
 * @example
 * const quizzes = await seedQuizzes([
 *   { slug: '01-arrays-quiz', tutorialSlug: '01-arrays', ... },
 *   { slug: '02-two-pointer-quiz', tutorialSlug: '02-two-pointer', ... }
 * ], prisma);
 */
export async function seedQuizzes(
  quizzes: QuizSeedData[],
  prisma: PrismaClient
) {
  console.log(`📝 Seeding ${quizzes.length} quizzes...`);

  const createdQuizzes = [];

  for (const quizData of quizzes) {
    const quiz = await seedQuiz(quizData, prisma);
    createdQuizzes.push(quiz);
  }

  const successCount = createdQuizzes.filter((q) => q !== null).length;
  console.log(
    `🎉 Successfully seeded ${successCount}/${quizzes.length} quizzes!`
  );

  return createdQuizzes;
}

/**
 * Utility function to create tutorial and quiz together
 * Ensures tutorial is created before quiz
 *
 * @param categorySlug - Category for the tutorial
 * @param tutorialData - Tutorial data
 * @param quizData - Quiz data (optional)
 * @param prisma - PrismaClient instance
 * @returns Object with tutorial and quiz (quiz may be null)
 */
export async function seedTutorialWithQuiz(
  categorySlug: string,
  tutorialData: TutorialSeedData,
  quizData: QuizSeedData | null,
  prisma: PrismaClient
) {
  // Seed tutorial first
  const tutorial = await seedTutorial(categorySlug, tutorialData, prisma);

  // Seed quiz if provided
  let quiz = null;
  if (quizData) {
    quiz = await seedQuiz(quizData, prisma);
  }

  return { tutorial, quiz };
}
