import { prisma } from "@/lib/prisma";
import { ChallengeMoodAdaptation } from "@prisma/client";
import { AchievementService } from "./achievementService";
import { CertificateService } from "./certificateService";
import { MoodId } from "@/types/mood";
import { AchievementAction, AchievementMetadata } from "@/types/common";

// Define the completion status enum locally until Prisma client is regenerated
export enum CompletionStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface QuizSubmission {
  tutorialId: string;
  quizId: string;
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

export interface ProjectSubmission {
  projectId: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "REVIEWED"
    | "APPROVED"
    | "NEEDS_REVISION";
  grade?: number;
  timeSpent: number;
  mood: string;
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
        quizId: submission.quizId, // Use the actual quiz ID from submission
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

      // Generate tutorial certificate
      const tutorialCertificate = await CertificateService.generateTutorialCertificate(
        userId,
        submission.tutorialId,
        {
          score,
          timeSpent: submission.timeSpent,
          difficulty: 1, // Default difficulty, should be fetched from tutorial
          quizPassed: true,
          completionPercentage: 100
        }
      );

      // Check if user is now eligible for category certificate
      const tutorial = await prisma.tutorial.findUnique({
        where: { id: submission.tutorialId },
        select: { categoryId: true }
      });
      
      if (tutorial?.categoryId) {
        await CertificateService.generateCategoryCertificate(userId, tutorial.categoryId);
      }

      // Share quiz completion to social feed if user has sharing enabled
      await this.shareQuizCompletion(userId, submission.tutorialId, score, submission.timeSpent, submission.ChallengeMoodAdaptation.mood);
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

      // Share challenge completion to social feed if user has sharing enabled
      await this.shareChallengeCompletion(userId, submission.challengeId, submission.timeSpent, submission.ChallengeMoodAdaptation.mood);
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
      projectStats,
      recentActivity,
      totalTutorials,
      totalChallenges,
      totalProjects,
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

      // Project stats
      prisma.projectProgress.groupBy({
        by: ["status"],
        where: { userId },
        _count: {
          status: true,
        },
      }),

      // Recent activity (combine challenges and projects)
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
        take: 5,
      }),

      // Total available tutorials
      prisma.tutorial.count(),

      // Total available challenges
      prisma.challenge.count(),

      // Total available projects
      prisma.project.count({ where: { published: true } }),
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

    const completedProjects =
      projectStats.find((s) => s.status === CompletionStatus.COMPLETED)?._count
        .status || 0;
    const inProgressProjects =
      projectStats.find((s) => s.status === CompletionStatus.IN_PROGRESS)
        ?._count.status || 0;
    const notStartedProjects = Math.max(
      0,
      totalProjects - completedProjects - inProgressProjects
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
      projects: {
        completed: completedProjects,
        inProgress: inProgressProjects,
        notStarted: notStartedProjects,
        total: totalProjects,
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

  /**
   * Submit a project submission and update project progress
   */
  static async submitProjectSubmission(
    userId: string,
    submission: ProjectSubmission
  ) {
    const isCompleted = ["REVIEWED", "APPROVED"].includes(submission.status);
    const grade = submission.grade || 0;

    // Update or create project progress
    const progress = await prisma.projectProgress.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId: submission.projectId,
        },
      },
      update: {
        status: isCompleted
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        grade: submission.grade || undefined,
        timeSpent: {
          increment: submission.timeSpent,
        },
        submissionStatus: submission.status,
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date(),
      },
      create: {
        userId,
        projectId: submission.projectId,
        status: isCompleted
          ? CompletionStatus.COMPLETED
          : CompletionStatus.IN_PROGRESS,
        grade: submission.grade,
        timeSpent: submission.timeSpent,
        submissionStatus: submission.status,
        completedAt: isCompleted ? new Date() : null,
      },
    });

    // Check for achievements if project was completed
    let achievements: Array<{
      achievement: {
        id: string;
        title: string;
        description: string;
        icon: string;
      };
    }> = [];
    if (isCompleted) {
      achievements = await AchievementService.checkAndUnlockAchievements({
        userId,
        action: "PROJECT_COMPLETED" as AchievementAction,
        metadata: {
          grade: grade,
          timeSpent: submission.timeSpent,
          mood: submission.mood,
          projectId: submission.projectId,
        } as AchievementMetadata,
      });
    }

    return {
      progress,
      completed: isCompleted,
      grade: submission.grade,
      achievements,
    };
  }

  /**
   * Get user's project progress
   */
  static async getProjectProgress(userId: string, projectId?: string) {
    if (projectId) {
      return prisma.projectProgress.findUnique({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
        include: {
          project: true,
        },
      });
    }

    return prisma.projectProgress.findMany({
      where: { userId },
      include: {
        project: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * Mark project as started (when user first views it)
   */
  static async markProjectStarted(userId: string, projectId: string) {
    return prisma.projectProgress.upsert({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
      update: {
        status: CompletionStatus.IN_PROGRESS,
        updatedAt: new Date(),
      },
      create: {
        userId,
        projectId,
        status: CompletionStatus.IN_PROGRESS,
        submissionStatus: "DRAFT",
      },
    });
  }

  /**
   * Share quiz completion to social feed
   */
  private static async shareQuizCompletion(
    userId: string,
    tutorialId: string,
    score: number,
    timeSpent: number,
    mood: string
  ) {
    try {
      // Check if user has social sharing enabled
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      if (userSettings && userSettings.shareProgress === false) {
        return; // User has explicitly disabled progress sharing
      }

      // Get tutorial information
      const tutorial = await prisma.tutorial.findUnique({
        where: { id: tutorialId },
        select: { title: true, difficulty: true },
      });

      if (!tutorial) {
        return;
      }

      // Create description based on score
      let description = `Completed ${tutorial.title} quiz`;
      if (score >= 95) {
        description = `🔥 Aced ${tutorial.title} quiz with ${score}%!`;
      } else if (score >= 85) {
        description = `💪 Crushed ${tutorial.title} quiz with ${score}%`;
      } else if (score >= 75) {
        description = `✅ Passed ${tutorial.title} quiz with ${score}%`;
      } else {
        description = `📚 Completed ${tutorial.title} quiz (${score}%)`;
      }

      await prisma.progressShare.create({
        data: {
          userId,
          type: "quiz_completed",
          title: `🎯 ${tutorial.title} Quiz`,
          description,
          data: {
            score,
            timeSpent,
            mood,
            tutorialId,
            difficulty: tutorial.difficulty,
          },
          visibility: "FRIENDS",
        },
      });
    } catch (error) {
      console.error("Error sharing quiz completion:", error);
    }
  }

  /**
   * Share challenge completion to social feed
   */
  private static async shareChallengeCompletion(
    userId: string,
    challengeId: string,
    timeSpent: number,
    mood: string
  ) {
    try {
      // Check if user has social sharing enabled
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      if (userSettings && userSettings.shareProgress === false) {
        return; // User has explicitly disabled progress sharing
      }

      // Get challenge information
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
        select: { title: true, difficulty: true },
      });

      if (!challenge) {
        return;
      }

      const description = `💻 Solved the "${challenge.title}" coding challenge`;

      await prisma.progressShare.create({
        data: {
          userId,
          type: "challenge_completed",
          title: `⚡ ${challenge.title}`,
          description,
          data: {
            timeSpent,
            mood,
            challengeId,
            difficulty: challenge.difficulty,
          },
          visibility: "FRIENDS",
        },
      });
    } catch (error) {
      console.error("Error sharing challenge completion:", error);
    }
  }
}
