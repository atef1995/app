import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizzes() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        tutorialId: true
      }
    });

    console.log(`Total quizzes found: ${quizzes.length}`);
    console.log('\nQuiz details:');
    quizzes.forEach((quiz, index) => {
      console.log(`${index + 1}. "${quiz.title}"`);
      console.log(`   ID: ${quiz.id}`);
      console.log(`   Slug: ${quiz.slug || 'NO SLUG'}`);
      console.log(`   Tutorial ID: ${quiz.tutorialId}`);
      console.log('');
    });

    const quizzesWithoutSlug = quizzes.filter(q => !q.slug || q.slug === '');
    console.log(`Quizzes without slugs: ${quizzesWithoutSlug.length}`);
  } catch (error) {
    console.error('Error checking quizzes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQuizzes();
