import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTutorial() {
  try {
    const tutorial = await prisma.tutorial.findUnique({
      where: { slug: 'asynchronous-javascript-mastery' },
      include: {
        quizzes: true
      }
    });

    if (tutorial) {
      console.log('✅ Tutorial found:');
      console.log(`   Title: ${tutorial.title}`);
      console.log(`   Slug: ${tutorial.slug}`);
      console.log(`   Difficulty: ${tutorial.difficulty}`);
      console.log(`   Order: ${tutorial.order}`);
      console.log(`   MDX File: ${tutorial.mdxFile}`);
      
      if (tutorial.quizzes.length > 0) {
        console.log(`✅ Quiz found: ${tutorial.quizzes[0].title}`);
        const questions = tutorial.quizzes[0].questions as any[];
        console.log(`   Questions: ${questions.length}`);
      }
    } else {
      console.log('❌ Tutorial not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTutorial();
