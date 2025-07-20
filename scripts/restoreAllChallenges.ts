import { PrismaClient } from '@prisma/client';
import { basicChallenges } from '../src/data/challenges/basic';
import { algorithmChallenges } from '../src/data/challenges/algorithms';
import { slugify } from '../src/lib/slugify';

const prisma = new PrismaClient();

async function restoreAllChallenges() {
  console.log('🚀 Starting comprehensive challenge restoration...');

  try {
    // Combine all challenges from data files
    const allChallenges = [...basicChallenges, ...algorithmChallenges];
    
    console.log(`📊 Found ${allChallenges.length} challenges to restore`);

    for (const challenge of allChallenges) {
      console.log(`\n⚡ Restoring challenge: ${challenge.title}`);

      // Generate slug from title
      const slug = slugify(challenge.title);
      
      // Determine premium status based on difficulty
      const isPremium = challenge.difficulty === 'hard';
      const requiredPlan = challenge.difficulty === 'hard' ? 'PRO' : 
                          challenge.difficulty === 'medium' ? 'PREMIUM' : 'FREE';

      // Create the challenge
      const createdChallenge = await prisma.challenge.create({
        data: {
          slug: slug,
          title: challenge.title,
          description: challenge.description,
          difficulty: challenge.difficulty.toUpperCase(),
          type: challenge.type.toUpperCase(),
          estimatedTime: challenge.estimatedTime,
          starter: challenge.starter,
          solution: challenge.solution,
          order: parseInt(challenge.id),
          published: true,
          isPremium: isPremium,
          requiredPlan: requiredPlan,
        },
      });

      console.log(`✅ Created challenge: ${createdChallenge.title} (${createdChallenge.slug})`);

      // Create mood adaptations
      for (const [mood, content] of Object.entries(challenge.moodAdapted)) {
        await prisma.challengeMoodAdaptation.create({
          data: {
            challengeId: createdChallenge.id,
            mood: mood.toUpperCase(),
            content: content,
          },
        });
      }

      console.log(`🎨 Added mood adaptations for ${Object.keys(challenge.moodAdapted).length} moods`);

      // Create test cases
      for (let i = 0; i < challenge.tests.length; i++) {
        const test = challenge.tests[i];
        await prisma.challengeTest.create({
          data: {
            challengeId: createdChallenge.id,
            input: JSON.parse(JSON.stringify(test.input)),
            expected: JSON.parse(JSON.stringify(test.expected)),
            description: test.description,
            order: i,
          },
        });
      }

      console.log(`🧪 Added ${challenge.tests.length} test cases`);
    }

    // Verify restoration
    const challengeCount = await prisma.challenge.count();
    const moodAdaptationCount = await prisma.challengeMoodAdaptation.count();
    const testCount = await prisma.challengeTest.count();

    console.log('\n🎉 Challenge restoration completed successfully!');
    console.log(`📈 Summary:`);
    console.log(`   - Challenges: ${challengeCount}`);
    console.log(`   - Mood adaptations: ${moodAdaptationCount}`);
    console.log(`   - Test cases: ${testCount}`);

    // Show premium breakdown
    const premiumChallenges = await prisma.challenge.count({ where: { isPremium: true } });
    const freeChallenges = await prisma.challenge.count({ where: { isPremium: false } });
    
    console.log(`\n💎 Premium breakdown:`);
    console.log(`   - FREE challenges: ${freeChallenges}`);
    console.log(`   - PREMIUM/PRO challenges: ${premiumChallenges}`);

    // List all challenges with their details
    const challenges = await prisma.challenge.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        difficulty: true,
        isPremium: true,
        requiredPlan: true,
        order: true,
      },
    });

    console.log('\n📋 Restored challenges:');
    challenges.forEach((challenge) => {
      const premiumIcon = challenge.isPremium ? '💎' : '🆓';
      console.log(`   ${premiumIcon} ${challenge.order}. ${challenge.title} (${challenge.difficulty}) - ${challenge.requiredPlan}`);
    });

  } catch (error) {
    console.error('❌ Error during challenge restoration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the restoration
restoreAllChallenges()
  .then(() => {
    console.log('\n✨ All challenges have been successfully restored!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Restoration failed:', error);
    process.exit(1);
  });
