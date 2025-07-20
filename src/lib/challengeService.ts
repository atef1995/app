import { prisma } from "./prisma";
import type { Challenge } from "@/types/practice";
import {
  ChallengeType,
  Difficulty,
  Challenge as PrismaChallenge,
  ChallengeTest,
  ChallengeMoodAdaptation,
} from "@prisma/client";

type DbChallenge = PrismaChallenge & {
  tests: ChallengeTest[];
  moodAdaptations: ChallengeMoodAdaptation[];
};

// Convert database challenge to frontend Challenge type
function convertDbChallengeToFrontend(dbChallenge: DbChallenge): Challenge {
  // Create mood adaptations map
  const moodAdaptations = dbChallenge.moodAdaptations.reduce(
    (acc, adaptation) => {
      acc[adaptation.mood.toLowerCase() as "chill" | "rush" | "grind"] =
        adaptation.content;
      return acc;
    },
    {} as { chill: string; rush: string; grind: string }
  );

  return {
    id: dbChallenge.id,
    slug: dbChallenge.slug,
    title: dbChallenge.title,
    description: dbChallenge.description,
    difficulty: dbChallenge.difficulty.toLowerCase() as
      | "easy"
      | "medium"
      | "hard",
    type: dbChallenge.type.toLowerCase() as
      | "algorithm"
      | "function"
      | "array"
      | "object"
      | "logic",
    estimatedTime: dbChallenge.estimatedTime,
    isPremium: dbChallenge.isPremium,
    requiredPlan: dbChallenge.requiredPlan,
    moodAdapted: moodAdaptations,
    starter: dbChallenge.starter,
    solution: dbChallenge.solution,
    tests: dbChallenge.tests.map((test) => ({
      input: test.input as unknown,
      expected: test.expected as unknown,
      description: test.description,
    })),
  };
}

export async function getAllChallenges(): Promise<Challenge[]> {
  try {
    const dbChallenges = await prisma.challenge.findMany({
      include: {
        tests: true,
        moodAdaptations: true,
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
    });

    return dbChallenges.map(convertDbChallengeToFrontend);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    return [];
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  try {
    const dbChallenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        tests: true,
        moodAdaptations: true,
      },
    });

    if (!dbChallenge) {
      return null;
    }

    return convertDbChallengeToFrontend(dbChallenge);
  } catch (error) {
    console.error("Error fetching challenge by ID:", error);
    return null;
  }
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  try {
    const dbChallenge = await prisma.challenge.findUnique({
      where: { slug },
      include: {
        tests: true,
        moodAdaptations: true,
      },
    });

    if (!dbChallenge) {
      return null;
    }

    return convertDbChallengeToFrontend(dbChallenge);
  } catch (error) {
    console.error("Error fetching challenge by slug:", error);
    return null;
  }
}

export async function getFilteredChallenges(filters: {
  type?: string;
  difficulty?: string;
}): Promise<Challenge[]> {
  try {
    const where: { type?: ChallengeType; difficulty?: Difficulty } = {};

    if (filters.type) {
      where.type = filters.type.toUpperCase() as ChallengeType;
    }

    if (filters.difficulty) {
      where.difficulty = filters.difficulty.toUpperCase() as Difficulty;
    }

    const dbChallenges = await prisma.challenge.findMany({
      where,
      include: {
        tests: true,
        moodAdaptations: true,
      },
      orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
    });

    return dbChallenges.map(convertDbChallengeToFrontend);
  } catch (error) {
    console.error("Error fetching filtered challenges:", error);
    return [];
  }
}

export async function getChallengeTypes(): Promise<string[]> {
  try {
    const types = await prisma.challenge.findMany({
      select: { type: true },
      distinct: ["type"],
    });

    return types.map((t) => t.type.toLowerCase());
  } catch (error) {
    console.error("Error fetching challenge types:", error);
    return [];
  }
}

export async function getChallengeDifficulties(): Promise<string[]> {
  try {
    const difficulties = await prisma.challenge.findMany({
      select: { difficulty: true },
      distinct: ["difficulty"],
    });

    return difficulties.map((d) => d.difficulty.toLowerCase());
  } catch (error) {
    console.error("Error fetching challenge difficulties:", error);
    return [];
  }
}

// Function to record a challenge attempt
export async function recordChallengeAttempt(
  userId: string,
  challengeId: string,
  code: string,
  passed: boolean,
  mood: "CHILL" | "RUSH" | "GRIND",
  timeSpent?: number
) {
  try {
    return await prisma.challengeAttempt.create({
      data: {
        userId,
        challengeId,
        code,
        passed,
        mood,
        timeSpent,
      },
    });
  } catch (error) {
    console.error("Error recording challenge attempt:", error);
    throw error;
  }
}

// Function to get user's challenge attempts
export async function getUserChallengeAttempts(userId: string) {
  try {
    return await prisma.challengeAttempt.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching user challenge attempts:", error);
    return [];
  }
}
