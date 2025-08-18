import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTutorialCategories() {
  try {
    console.log('🔍 Checking tutorial category assignments...\n');
    
    // Get all tutorials with their categories
    const tutorials = await prisma.tutorial.findMany({
      include: {
        category: true
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    // Get all categories
    const categories = await prisma.category.findMany({
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log(`📚 Total tutorials: ${tutorials.length}`);
    console.log(`📁 Total categories: ${categories.length}\n`);
    
    // Group tutorials by category
    const tutorialsByCategory = {};
    
    tutorials.forEach(tutorial => {
      const categorySlug = tutorial.category ? tutorial.category.slug : 'no-category';
      if (!tutorialsByCategory[categorySlug]) {
        tutorialsByCategory[categorySlug] = [];
      }
      tutorialsByCategory[categorySlug].push(tutorial);
    });
    
    console.log('📊 Tutorials by category:');
    Object.entries(tutorialsByCategory).forEach(([categorySlug, tuts]) => {
      const categoryName = tuts[0]?.category?.title || 'No Category';
      console.log(`  ${categoryName} (${categorySlug}): ${tuts.length} tutorials`);
      tuts.forEach(tut => {
        console.log(`    - ${tut.title}`);
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTutorialCategories();