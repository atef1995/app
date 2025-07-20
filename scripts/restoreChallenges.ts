import { PrismaClient } from "@prisma/client";
import { basicChallenges } from "../src/data/challenges/basic";
import { algorithmChallenges } from "../src/data/challenges/algorithms";
import { slugify, generateUniqueSlug } from "../src/lib/slugify";

const prisma = new PrismaClient();

async function main() {
  console.log("🔄 Restoring challenges...");

  // Delete all existing challenges first
  await prisma.challengeAttempt.deleteMany();
  await prisma.challengeTest.deleteMany();
  await prisma.challengeMoodAdaptation.deleteMany();
  await prisma.challenge.deleteMany();
  
  console.log("🗑️ Cleared existing challenge data");

  // Combine all challenges
  const allChallenges = [...basicChallenges, ...algorithmChallenges];
  
  for (const challengeData of allChallenges) {
    try {
      console.log(`📝 Creating challenge: ${challengeData.title}`);

      // Generate unique slug
      const baseSlug = slugify(challengeData.title);
      const slug = await generateUniqueSlug(baseSlug, 'challenge');

      // Create challenge
      const challenge = await prisma.challenge.create({
        data: {
          slug,
          title: challengeData.title,
          description: challengeData.description,
          difficulty: challengeData.difficulty,
          category: challengeData.category,
          initialCode: challengeData.initialCode,
          solution: challengeData.solution,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create mood adaptations
      for (const [moodId, adaptation] of Object.entries(challengeData.moodAdapted)) {
        await prisma.challengeMoodAdaptation.create({
          data: {
            challengeId: challenge.id,
            moodId,
            title: adaptation.title,
            description: adaptation.description,
            timerSeconds: adaptation.timerSeconds,
            hints: adaptation.hints || [],
          },
        });
      }

      // Create test cases
      for (const test of challengeData.tests) {
        await prisma.challengeTest.create({
          data: {
            challengeId: challenge.id,
            input: typeof test.input === 'string' ? test.input : JSON.stringify(test.input),
            expected: typeof test.expected === 'string' ? test.expected : JSON.stringify(test.expected),
            description: test.description,
          },
        });
      }

      console.log(`✅ Created challenge: ${challenge.title} (${challenge.slug})`);
    } catch (error) {
      console.error(`❌ Error creating challenge ${challengeData.title}:`, error);
    }
  }

  console.log("🎉 Challenge restoration complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error during challenge restoration:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
