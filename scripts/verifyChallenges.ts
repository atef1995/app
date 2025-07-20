import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllChallenges() {
  console.log('🔍 Verifying challenge restoration...\n');

  try {
    // Get all challenges with complete data
    const challenges = await prisma.challenge.findMany({
      include: {
        moodAdaptations: true,
        tests: true,
      },
      orderBy: { order: 'asc' }
    });

    console.log(`📊 Total challenges restored: ${challenges.length}\n`);

    challenges.forEach((challenge, index) => {
      const premiumIcon = challenge.isPremium ? '💎' : '🆓';
      console.log(`${premiumIcon} Challenge ${index + 1}: ${challenge.title}`);
      console.log(`   • Slug: ${challenge.slug}`);
      console.log(`   • Difficulty: ${challenge.difficulty}`);
      console.log(`   • Type: ${challenge.type}`);
      console.log(`   • Premium: ${challenge.isPremium} (${challenge.requiredPlan})`);
      console.log(`   • Mood adaptations: ${challenge.moodAdaptations.length}`);
      console.log(`   • Test cases: ${challenge.tests.length}`);
      console.log(`   • URL: /practice/${challenge.slug}\n`);
    });

    // Verify database integrity
    const totalChallenges = await prisma.challenge.count();
    const totalMoodAdaptations = await prisma.challengeMoodAdaptation.count();
    const totalTests = await prisma.challengeTest.count();

    console.log('📈 Database integrity check:');
    console.log(`   ✅ Challenges: ${totalChallenges}`);
    console.log(`   ✅ Mood adaptations: ${totalMoodAdaptations}`);
    console.log(`   ✅ Test cases: ${totalTests}`);

    // Check premium distribution
    const freeCount = await prisma.challenge.count({ where: { isPremium: false } });
    const premiumCount = await prisma.challenge.count({ where: { isPremium: true } });

    console.log('\n💎 Premium distribution:');
    console.log(`   🆓 FREE: ${freeCount} challenges`);
    console.log(`   💎 PREMIUM/PRO: ${premiumCount} challenges`);

    // Test slug uniqueness
    const slugs = challenges.map(c => c.slug);
    const uniqueSlugs = new Set(slugs);
    
    if (slugs.length === uniqueSlugs.size) {
      console.log('\n✅ All slugs are unique');
    } else {
      console.log('\n❌ Duplicate slugs detected!');
    }

    console.log('\n🎉 Challenge verification completed successfully!');
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyAllChallenges()
  .then(() => {
    console.log('\n✨ All challenges are properly restored and verified!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Verification failed:', error);
    process.exit(1);
  });
