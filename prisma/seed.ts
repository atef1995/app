import { PrismaClient } from "@prisma/client";
import { basicChallenges } from "../src/data/challenges/basic";
import { algorithmChallenges } from "../src/data/challenges/algorithms";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Combine all challenges
  const allChallenges = [...basicChallenges, ...algorithmChallenges];

  for (const challenge of allChallenges) {
    console.log(`🔧 Creating challenge: ${challenge.title}`);

    // Create the challenge
    const createdChallenge = await prisma.challenge.create({
      data: {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty.toUpperCase() as
          | "EASY"
          | "MEDIUM"
          | "HARD",
        type: challenge.type.toUpperCase() as
          | "ALGORITHM"
          | "FUNCTION"
          | "ARRAY"
          | "OBJECT"
          | "LOGIC",
        estimatedTime: challenge.estimatedTime,
        starter: challenge.starter,
        solution: challenge.solution,
        published: true,
      },
    });

    // Create mood adaptations
    await prisma.challengeMoodAdaptation.createMany({
      data: [
        {
          challengeId: createdChallenge.id,
          mood: "CHILL",
          content: challenge.moodAdapted.chill,
        },
        {
          challengeId: createdChallenge.id,
          mood: "RUSH",
          content: challenge.moodAdapted.rush,
        },
        {
          challengeId: createdChallenge.id,
          mood: "GRIND",
          content: challenge.moodAdapted.grind,
        },
      ],
    });

    // Create test cases
    await prisma.challengeTest.createMany({
      data: challenge.tests.map((test, index) => ({
        challengeId: createdChallenge.id,
        input: JSON.stringify(test.input),
        expected: JSON.stringify(test.expected),
        description: test.description,
        order: index,
      })),
    });

    console.log(`✅ Created challenge: ${challenge.title}`);
  }

  console.log(`🎉 Seeded ${allChallenges.length} challenges successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
