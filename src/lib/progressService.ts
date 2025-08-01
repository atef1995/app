import { prisma } from "@/lib/prisma";
import { ChallengeMoodAdaptation } from "@prisma/client";
import { AchievementService } from "./achievementService";
import { MoodId } from "@/types/mood";

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
  ChallengeMoodAdaptation: ChallengeMoodAdaptation;
}

export interface ChallengeSubmission {
  challengeId: string;
  code: string;
  passed: boolean;
  timeSpent: number;
  ChallengeMoodAdaptation: ChallengeMoodAdaptation;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface QuizData {
  questions: QuizQuestion[];
  passingScore?: number;
  uiQuestions?: QuizQuestion[];
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
    quizData: QuizData
  ) {
    const passingScore = quizData.passingScore || 70; // Default 70% passing score
    const totalQuestions = quizData.questions.length; // Always use full question set for scoring
    const uiQuestions = quizData.uiQuestions || quizData.questions; // Fallback to full set if no UI questions provided

    let correctAnswers = 0;

    // Calculate score based on the questions the user actually answered (UI questions)
    // but normalize against the full question set for fair scoring
    submission.answers.forEach((answer, index) => {
      if (uiQuestions[index] && answer === uiQuestions[index].correct) {
        correctAnswers++;
      }
    });

    // Normalize score: (correct answers / questions answered) * (questions answered / total questions) * 100
    // This gives partial credit based on the subset they answered while maintaining fairness
    const questionsAnswered = uiQuestions.length;
    const rawScore =
      questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

    // For scoring purposes, we'll use the raw score as it represents their performance
    // on the questions they were given, regardless of ChallengeMoodAdaptation
    const score = rawScore;
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
        mood: submission.ChallengeMoodAdaptation.mood,
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

    // Check for achievements if quiz was passed
    let achievements: Array<{
      achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
      };
    }> = [];
    if (passed) {
      achievements = await AchievementService.checkAndUnlockAchievements({
        userId,
        action: "QUIZ_COMPLETED",
        metadata: {
          score,
          timeSpent: submission.timeSpent,
          mood: submission.ChallengeMoodAdaptation.mood as MoodId,
        },
      });
    }

    return {
      attempt: quizAttempt,
      progress,
      score,
      passed,
      correctAnswers,
      totalQuestions,
      achievements, // Include achievements in response
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
        mood: submission.ChallengeMoodAdaptation.mood as MoodId,
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

    // Check for achievements if challenge was passed
    let achievements: Array<{
      achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
      };
    }> = [];
    if (submission.passed) {
      achievements = await AchievementService.checkAndUnlockAchievements({
        userId,
        action: "CHALLENGE_COMPLETED",
        metadata: {
          timeSpent: submission.timeSpent,
          mood: submission.ChallengeMoodAdaptation.mood as MoodId,
        },
      });
    }

    return {
      attempt: challengeAttempt,
      progress,
      passed: submission.passed,
      achievements, // Include achievements in response
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
    const [
      tutorialStats,
      challengeStats,
      recentActivity,
      totalTutorials,
      totalChallenges,
    ] = await Promise.all([
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

      // Total available tutorials
      prisma.tutorial.count(),

      // Total available challenges
      prisma.challenge.count(),
    ]);

    const completedTutorials =
      tutorialStats.find((s) => s.status === CompletionStatus.COMPLETED)?._count
        .status || 0;
    const inProgressTutorials =
      tutorialStats.find((s) => s.status === CompletionStatus.IN_PROGRESS)
        ?._count.status || 0;
    const notStartedTutorials = Math.max(
      0,
      totalTutorials - completedTutorials - inProgressTutorials
    );

    const completedChallenges =
      challengeStats.find((s) => s.status === CompletionStatus.COMPLETED)
        ?._count.status || 0;
    const inProgressChallenges =
      challengeStats.find((s) => s.status === CompletionStatus.IN_PROGRESS)
        ?._count.status || 0;
    const failedChallenges =
      challengeStats.find((s) => s.status === CompletionStatus.FAILED)?._count
        .status || 0;
    const notStartedChallenges = Math.max(
      0,
      totalChallenges -
        completedChallenges -
        inProgressChallenges -
        failedChallenges
    );

    return {
      tutorials: {
        completed: completedTutorials,
        inProgress: inProgressTutorials,
        notStarted: notStartedTutorials,
        total: totalTutorials,
      },
      challenges: {
        completed: completedChallenges,
        inProgress: inProgressChallenges,
        failed: failedChallenges,
        notStarted: notStartedChallenges,
        total: totalChallenges,
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
