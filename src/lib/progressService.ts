import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

// Define the completion status enum locally until Prisma client is regenerated
export enum CompletionStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface QuizSubmission {
  tutorialId: string;
  answers: number[];
  timeSpent: number;
  mood: Mood;
}

export interface ChallengeSubmission {
  challengeId: string;
  code: string;
  passed: boolean;
  timeSpent: number;
  mood: Mood;
}

/**
 * Progress Service for tracking user completion of tutorials, quizzes, and challenges
 */
export class ProgressService {
  /**
   * Submit a quiz attempt and update tutorial progress
   */
  static async submitQuizAttempt(
    userId: string,
    submission: QuizSubmission,
    quizData: { questions: any[]; passingScore?: number }
  ) {
    const passingScore = quizData.passingScore || 70; // Default 70% passing score
    const totalQuestions = quizData.questions.length;
    let correctAnswers = 0;

    // Calculate score
    submission.answers.forEach((answer, index) => {
      if (
        quizData.questions[index] &&
        answer === quizData.questions[index].correct
      ) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= passingScore;

    // Create quiz attempt record
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: submission.tutorialId, // Use the actual quiz ID (which matches tutorialId)
        tutorialId: submission.tutorialId,
        answers: submission.answers,
        score,
        passed,
        timeSpent: submission.timeSpent,
        mood: submission.mood,
      },
    });

    // Get current progress to calculate best score
    const currentProgress = await prisma.tutorialProgress.findUnique({
      where: {
        userId_tutorialId: {
          userId,
          tutorialId: submission.tutorialId,
        },
      },
    });

    const newBestScore = currentProgress?.bestScore
      ? Math.max(currentProgress.bestScore, score)
      : score;

    // Update or create tutorial progress
    const progress = await prisma.tutorialProgress.upsert({
      where: {
        userId_tutorialId: {
          userId,
          tutorialId: submission.tutorialId,
        },
      },
      update: {
        quizAttempts: {
          increment: 1,
        },
        quizPassed: passed,
        bestScore: newBestScore,
        status: passed
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        completedAt: passed ? new Date() : null,
        timeSpent: {
          increment: submission.timeSpent,
        },
        updatedAt: new Date(),
      },
      create: {
        userId,
        tutorialId: submission.tutorialId,
        status: passed
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        quizPassed: passed,
        quizAttempts: 1,
        bestScore: score,
        timeSpent: submission.timeSpent,
        completedAt: passed ? new Date() : null,
      },
    });

    return {
      attempt: quizAttempt,
      progress,
      score,
      passed,
      correctAnswers,
      totalQuestions,
    };
  }

  /**
   * Submit a challenge attempt and update challenge progress
   */
  static async submitChallengeAttempt(
    userId: string,
    submission: ChallengeSubmission
  ) {
    // Create challenge attempt record
    const challengeAttempt = await prisma.challengeAttempt.create({
      data: {
        userId,
        challengeId: submission.challengeId,
        code: submission.code,
        passed: submission.passed,
        timeSpent: submission.timeSpent,
        mood: submission.mood,
      },
    });

    // Update or create challenge progress
    const progress = await prisma.challengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId: submission.challengeId,
        },
      },
      update: {
        attempts: {
          increment: 1,
        },
        failedAttempts: submission.passed ? undefined : { increment: 1 },
        passed: submission.passed || undefined, // Only update if passed
        status: submission.passed
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        bestTime:
          submission.passed && submission.timeSpent
            ? { set: Math.min(submission.timeSpent, 999999) } // Will be calculated properly
            : undefined,
        firstPassedAt: submission.passed ? new Date() : undefined,
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        challengeId: submission.challengeId,
        status: submission.passed
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        passed: submission.passed,
        attempts: 1,
        failedAttempts: submission.passed ? 0 : 1,
        bestTime: submission.passed ? submission.timeSpent : null,
        firstPassedAt: submission.passed ? new Date() : null,
        lastAttemptAt: new Date(),
      },
    });

    return {
      attempt: challengeAttempt,
      progress,
      passed: submission.passed,
    };
  }

  /**
   * Get user's tutorial progress
   */
  static async getTutorialProgress(userId: string, tutorialId?: string) {
    if (tutorialId) {
      return prisma.tutorialProgress.findUnique({
        where: {
          userId_tutorialId: {
            userId,
            tutorialId,
          },
        },
        include: {
          tutorial: true,
        },
      });
    }

    return prisma.tutorialProgress.findMany({
      where: { userId },
      include: {
        tutorial: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get user's challenge progress
   */
  static async getChallengeProgress(userId: string, challengeId?: string) {
    if (challengeId) {
      return prisma.challengeProgress.findUnique({
        where: {
          userId_challengeId: {
            userId,
            challengeId,
          },
        },
        include: {
          challenge: true,
        },
      });
    }

    return prisma.challengeProgress.findMany({
      where: { userId },
      include: {
        challenge: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Get user's overall progress stats
   */
  static async getUserStats(userId: string) {
    const [tutorialStats, challengeStats, recentActivity] = await Promise.all([
      // Tutorial stats
      prisma.tutorialProgress.groupBy({
        by: ["status"],
        where: { userId },
        _count: {
          status: true,
        },
      }),

      // Challenge stats
      prisma.challengeProgress.groupBy({
        by: ["status"],
        where: { userId },
        _count: {
          status: true,
        },
      }),

      // Recent activity
      prisma.challengeAttempt.findMany({
        where: { userId },
        include: {
          challenge: {
            select: {
              title: true,
              difficulty: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    return {
      tutorials: {
        completed:
          tutorialStats.find((s) => s.status === CompletionStatus.COMPLETED)
            ?._count.status || 0,
        inProgress:
          tutorialStats.find((s) => s.status === CompletionStatus.IN_PROGRESS)
            ?._count.status || 0,
        notStarted:
          tutorialStats.find((s) => s.status === CompletionStatus.NOT_STARTED)
            ?._count.status || 0,
      },
      challenges: {
        completed:
          challengeStats.find((s) => s.status === CompletionStatus.COMPLETED)
            ?._count.status || 0,
        inProgress:
          challengeStats.find((s) => s.status === CompletionStatus.IN_PROGRESS)
            ?._count.status || 0,
        failed:
          challengeStats.find((s) => s.status === CompletionStatus.FAILED)
            ?._count.status || 0,
      },
      recentActivity,
    };
  }

  /**
   * Mark tutorial as started (when user first views it)
   */
  static async markTutorialStarted(userId: string, tutorialId: string) {
    return prisma.tutorialProgress.upsert({
      where: {
        userId_tutorialId: {
          userId,
          tutorialId,
        },
      },
      update: {
        status: CompletionStatus.IN_PROGRESS,
        updatedAt: new Date(),
      },
      create: {
        userId,
        tutorialId,
        status: CompletionStatus.IN_PROGRESS,
      },
    });
  }

  /**
   * Mark challenge as started (when user first attempts it)
   */
  static async markChallengeStarted(userId: string, challengeId: string) {
    return prisma.challengeProgress.upsert({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      update: {
        status: CompletionStatus.IN_PROGRESS,
        lastAttemptAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        userId,
        challengeId,
        status: CompletionStatus.IN_PROGRESS,
        lastAttemptAt: new Date(),
      },
    });
  }
}
