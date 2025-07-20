import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listChallenges() {
  console.log('📋 Listing all challenges with their slugs...\n');

  const challenges = await prisma.challenge.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      difficulty: true,
      type: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  challenges.forEach((challenge, index) => {
    console.log(`${index + 1}. ${challenge.title}`);
    console.log(`   Slug: ${challenge.slug}`);
    console.log(`   Difficulty: ${challenge.difficulty}`);
    console.log(`   Type: ${challenge.type}`);
    console.log(`   URL: /practice/${challenge.slug}`);
    console.log('');
  });

  console.log(`Total challenges: ${challenges.length}`);
}

listChallenges()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
