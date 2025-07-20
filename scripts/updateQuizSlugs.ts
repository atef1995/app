import { PrismaClient } from '@prisma/client';
import { slugify, generateUniqueSlug } from '../src/lib/slugify';

const prisma = new PrismaClient();

async function updateQuizSlugs() {
  try {
    console.log('🔄 Updating quiz slugs...');
    
    // Get all quizzes without slugs (check for empty strings)
    const quizzes = await prisma.quiz.findMany({
      where: {
        slug: ''
      }
    });

    console.log(`Found ${quizzes.length} quizzes without slugs`);

    // Get all existing slugs to avoid conflicts
    const existingQuizzes = await prisma.quiz.findMany({
      where: {
        slug: {
          not: ''
        }
      },
      select: { slug: true }
    });
    const existingSlugs = existingQuizzes.map(q => q.slug);

    for (const quiz of quizzes) {
      const baseSlug = slugify(quiz.title);
      const uniqueSlug = generateUniqueSlug(baseSlug, existingSlugs);

      await prisma.quiz.update({
        where: { id: quiz.id },
        data: { slug: uniqueSlug }
      });

      // Add the new slug to existing slugs to avoid future conflicts
      existingSlugs.push(uniqueSlug);

      console.log(`✅ Updated quiz "${quiz.title}" with slug: ${uniqueSlug}`);
    }

    console.log('✨ All quiz slugs updated successfully!');
  } catch (error) {
    console.error('❌ Error updating quiz slugs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateQuizSlugs();
