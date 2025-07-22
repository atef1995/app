import { prisma } from "@/lib/prisma";
import { Challenge } from "@/types/practice";
import { Mood, Difficulty, ChallengeType } from "@prisma/client";

export interface DatabaseChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  type: "algorithm" | "function" | "array" | "object" | "logic";
  estimatedTime: string;
  starter: string;
  solution: string;
  moodAdapted: {
    chill: string;
    rush: string;
    grind: string;
  };
  tests: Array<{
    input: unknown;
    expected: unknown;
    description: string;
  }>;
}

// Convert database enums to our types
const difficultyMap: Record<Difficulty, "easy" | "medium" | "hard"> = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
};

const typeMap: Record<
  ChallengeType,
  "algorithm" | "function" | "array" | "object" | "logic"
> = {
  ALGORITHM: "algorithm",
  FUNCTION: "function",
  ARRAY: "array",
  OBJECT: "object",
  LOGIC: "logic",
};

const moodMap: Record<Mood, "chill" | "rush" | "grind"> = {
  CHILL: "chill",
  RUSH: "rush",
  GRIND: "grind",
};

// Convert our types to database enums
const difficultyToEnum: Record<"easy" | "medium" | "hard", Difficulty> = {
  easy: "EASY",
  medium: "MEDIUM",
  hard: "HARD",
};

const typeToEnum: Record<
  "algorithm" | "function" | "array" | "object" | "logic",
  ChallengeType
> = {
  algorithm: "ALGORITHM",
  function: "FUNCTION",
  array: "ARRAY",
  object: "OBJECT",
  logic: "LOGIC",
};

const moodToEnum: Record<"chill" | "rush" | "grind", Mood> = {
  chill: "CHILL",
  rush: "RUSH",
  grind: "GRIND",
};

export async function getAllChallenges(): Promise<DatabaseChallenge[]> {
  const challenges = await prisma.challenge.findMany({
    where: { published: true },
    include: {
      moodAdaptations: true,
      tests: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return challenges.map((challenge) => {
    const moodAdapted = {
      chill:
        challenge.moodAdaptations.find((m) => m.mood === "CHILL")?.content ||
        "",
      rush:
        challenge.moodAdaptations.find((m) => m.mood === "RUSH")?.content || "",
      grind:
        challenge.moodAdaptations.find((m) => m.mood === "GRIND")?.content ||
        "",
    };

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: difficultyMap[challenge.difficulty],
      type: typeMap[challenge.type],
      estimatedTime: challenge.estimatedTime,
      starter: challenge.starter,
      solution: challenge.solution,
      moodAdapted,
      tests: challenge.tests.map((test) => ({
        input: test.input,
        expected: test.expected,
        description: test.description,
      })),
    };
  });
}

export async function getChallengeById(
  id: string
): Promise<DatabaseChallenge | null> {
  const challenge = await prisma.challenge.findUnique({
    where: { id, published: true },
    include: {
      moodAdaptations: true,
      tests: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!challenge) return null;

  const moodAdapted = {
    chill:
      challenge.moodAdaptations.find((m) => m.mood === "CHILL")?.content || "",
    rush:
      challenge.moodAdaptations.find((m) => m.mood === "RUSH")?.content || "",
    grind:
      challenge.moodAdaptations.find((m) => m.mood === "GRIND")?.content || "",
  };

  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    difficulty: difficultyMap[challenge.difficulty],
    type: typeMap[challenge.type],
    estimatedTime: challenge.estimatedTime,
    starter: challenge.starter,
    solution: challenge.solution,
    moodAdapted,
    tests: challenge.tests.map((test) => ({
      input: test.input,
      expected: test.expected,
      description: test.description,
    })),
  };
}

export async function getFilteredChallenges(filters: {
  difficulty?: "easy" | "medium" | "hard";
  type?: "algorithm" | "function" | "array" | "object" | "logic";
}): Promise<DatabaseChallenge[]> {
  const whereClause: Record<string, unknown> = { published: true };

  if (filters.difficulty) {
    whereClause.difficulty = difficultyToEnum[filters.difficulty];
  }

  if (filters.type) {
    whereClause.type = typeToEnum[filters.type];
  }

  const challenges = await prisma.challenge.findMany({
    where: whereClause,
    include: {
      moodAdaptations: true,
      tests: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return challenges.map((challenge) => {
    const moodAdapted = {
      chill:
        challenge.moodAdaptations.find((m) => m.mood === "CHILL")?.content ||
        "",
      rush:
        challenge.moodAdaptations.find((m) => m.mood === "RUSH")?.content || "",
      grind:
        challenge.moodAdaptations.find((m) => m.mood === "GRIND")?.content ||
        "",
    };

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      difficulty: difficultyMap[challenge.difficulty],
      type: typeMap[challenge.type],
      estimatedTime: challenge.estimatedTime,
      starter: challenge.starter,
      solution: challenge.solution,
      moodAdapted,
      tests: challenge.tests.map((test) => ({
        input: test.input,
        expected: test.expected,
        description: test.description,
      })),
    };
  });
}

export async function createChallenge(
  challengeData: Omit<DatabaseChallenge, "id">
): Promise<string> {
  const challenge = await prisma.challenge.create({
    data: {
      title: challengeData.title,
      description: challengeData.description,
      difficulty: difficultyToEnum[challengeData.difficulty],
      type: typeToEnum[challengeData.type],
      estimatedTime: challengeData.estimatedTime,
      starter: challengeData.starter,
      solution: challengeData.solution,
      moodAdaptations: {
        create: [
          { mood: "CHILL", content: challengeData.moodAdapted.chill },
          { mood: "RUSH", content: challengeData.moodAdapted.rush },
          { mood: "GRIND", content: challengeData.moodAdapted.grind },
        ],
      },
      tests: {
        create: challengeData.tests.map((test, index) => ({
          input: test.input,
          expected: test.expected,
          description: test.description,
          order: index,
        })),
      },
    },
  });

  return challenge.id;
}

// Get unique challenge types and difficulties for filtering
export async function getChallengeTypes(): Promise<string[]> {
  const challenges = await prisma.challenge.findMany({
    where: { published: true },
    select: { type: true },
    distinct: ["type"],
  });

  return challenges.map((c) => typeMap[c.type]);
}

export async function getDifficultyLevels(): Promise<string[]> {
  const challenges = await prisma.challenge.findMany({
    where: { published: true },
    select: { difficulty: true },
    distinct: ["difficulty"],
  });

  return challenges.map((c) => difficultyMap[c.difficulty]);
}
