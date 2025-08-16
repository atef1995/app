import { prisma } from "@/lib/prisma";

export interface CodeProgressData {
  challengeId: string;
  code: string;
  lastModified: Date;
}

export interface SaveCodeProgressParams {
  userId: string;
  challengeId: string;
  code: string;
}

export interface LoadCodeProgressParams {
  userId: string;
  challengeId: string;
}

export class ChallengeCodeProgressService {
  /**
   * Save or update code progress for a specific challenge and user
   */
  static async saveCodeProgress({
    userId,
    challengeId,
    code,
  }: SaveCodeProgressParams): Promise<void> {
    await prisma.challengeCodeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      create: {
        userId,
        challengeId,
        code,
        lastModified: new Date(),
      },
      update: {
        code,
        lastModified: new Date(),
      },
    });
  }

  /**
   * Load saved code progress for a specific challenge and user
   */
  static async loadCodeProgress({
    userId,
    challengeId,
  }: LoadCodeProgressParams): Promise<CodeProgressData | null> {
    const progress = await prisma.challengeCodeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      select: {
        challengeId: true,
        code: true,
        lastModified: true,
      },
    });

    return progress;
  }

  /**
   * Delete code progress for a specific challenge and user
   */
  static async deleteCodeProgress({
    userId,
    challengeId,
  }: LoadCodeProgressParams): Promise<void> {
    await prisma.challengeCodeProgress.deleteMany({
      where: {
        userId,
        challengeId,
      },
    });
  }

  /**
   * Get all saved code progress for a user
   */
  static async getUserCodeProgress(userId: string): Promise<CodeProgressData[]> {
    const progress = await prisma.challengeCodeProgress.findMany({
      where: {
        userId,
      },
      select: {
        challengeId: true,
        code: true,
        lastModified: true,
      },
      orderBy: {
        lastModified: "desc",
      },
    });

    return progress;
  }

  /**
   * Check if user has saved progress for a challenge
   */
  static async hasCodeProgress({
    userId,
    challengeId,
  }: LoadCodeProgressParams): Promise<boolean> {
    const progress = await prisma.challengeCodeProgress.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      select: {
        id: true,
      },
    });

    return !!progress;
  }
}