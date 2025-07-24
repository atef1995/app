import { prisma } from "@/lib/prisma";
import { MoodId } from "@/types/mood";
import { Achievement, UserAchievement } from "@prisma/client";

interface AchievementCheck {
  userId: string;
  action:
    | "QUIZ_COMPLETED"
    | "CHALLENGE_COMPLETED"
    | "TUTORIAL_STARTED"
    | "STREAK_UPDATED"
    | "POINTS_EARNED";
  metadata?: {
    score?: number;
    timeSpent?: number;
    streak?: number;
    points?: number;
    difficulty?: string;
    mood?: MoodId;
    tutorialId?: string;
  };
}

export class AchievementService {
  /**
   * Check and unlock achievements based on user actions
   */
  static async checkAndUnlockAchievements({
    userId,
    action,
    metadata = {},
  }: AchievementCheck) {
    try {
      const unlockedAchievements: (UserAchievement & {
        achievement: Achievement;
      })[] = [];

      // Get user's current achievements
      const userAchievements = await prisma.userAchievement.findMany({
        where: { userId },
        include: { achievement: true },
      });

      const unlockedKeys = new Set(
        userAchievements.map((ua) => ua.achievement.key)
      );

      // Get user stats for achievement checking
      const userStats = await this.getUserStats(userId);

      // Define achievement conditions
      const achievementChecks = [
        // First Steps
        {
          key: "FIRST_TUTORIAL",
          condition: action === "TUTORIAL_STARTED",
          points: 5,
        },
        {
          key: "FIRST_QUIZ",
          condition:
            action === "QUIZ_COMPLETED" && userStats.quizzesCompleted === 1,
          points: 10,
        },
        {
          key: "FIRST_CHALLENGE",
          condition:
            action === "CHALLENGE_COMPLETED" &&
            userStats.challengesCompleted === 1,
          points: 15,
        },

        // Learning Achievements
        {
          key: "QUIZ_MASTER_10",
          condition:
            action === "QUIZ_COMPLETED" && userStats.quizzesCompleted >= 10,
          points: 50,
        },
        {
          key: "QUIZ_MASTER_25",
          condition:
            action === "QUIZ_COMPLETED" && userStats.quizzesCompleted >= 25,
          points: 100,
        },
        {
          key: "PERFECT_SCORE",
          condition:
            action === "QUIZ_COMPLETED" && (metadata.score || 0) >= 100,
          points: 25,
        },
        {
          key: "SPEED_DEMON",
          condition:
            action === "QUIZ_COMPLETED" && (metadata.timeSpent || 0) <= 30,
          points: 30,
        },

        // Challenge Achievements
        {
          key: "CHALLENGE_MASTER_5",
          condition:
            action === "CHALLENGE_COMPLETED" &&
            userStats.challengesCompleted >= 5,
          points: 40,
        },
        {
          key: "CHALLENGE_MASTER_15",
          condition:
            action === "CHALLENGE_COMPLETED" &&
            userStats.challengesCompleted >= 15,
          points: 75,
        },

        // Points Achievements
        {
          key: "POINTS_100",
          condition: userStats.totalPoints >= 100,
          points: 25,
        },
        {
          key: "POINTS_500",
          condition: userStats.totalPoints >= 500,
          points: 50,
        },
        {
          key: "POINTS_1000",
          condition: userStats.totalPoints >= 1000,
          points: 100,
        },

        // Mood-based Achievements
        {
          key: "CHILL_LEARNER",
          condition:
            action === "QUIZ_COMPLETED" &&
            metadata.mood === MoodId.CHILL &&
            userStats.chillQuizzes >= 10,
          points: 30,
        },
        {
          key: "FOCUSED_LEARNER",
          condition:
            action === "QUIZ_COMPLETED" &&
            metadata.mood === MoodId.FOCUSED &&
            userStats.focusedQuizzes >= 10,
          points: 30,
        },
        {
          key: "CRACKED_LEARNER",
          condition:
            action === "QUIZ_COMPLETED" &&
            metadata.mood === MoodId.CRACKED &&
            userStats.crackedQuizzes >= 10,
          points: 50,
        },
      ];

      // Check each achievement
      for (const check of achievementChecks) {
        if (check.condition && !unlockedKeys.has(check.key)) {
          // Get achievement from database
          const achievement = await prisma.achievement.findUnique({
            where: { key: check.key },
          });

          if (achievement) {
            // Unlock achievement
            const userAchievement = await prisma.userAchievement.create({
              data: {
                userId,
                achievementId: achievement.id,
                unlockedAt: new Date(),
              },
              include: { achievement: true },
            });

            unlockedAchievements.push(userAchievement);

            // Share achievement unlock if user has social sharing enabled
            await this.shareAchievementUnlock(userId, achievement);
          }
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    }
  }

  /**
   * Get user statistics for achievement checking
   */
  private static async getUserStats(userId: string) {
    const [tutorialProgress, challengeProgress] = await Promise.all([
      prisma.tutorialProgress.findMany({
        where: { userId, quizPassed: true },
      }),
      prisma.challengeProgress.findMany({
        where: { userId, passed: true },
      }),
    ]);

    // Get all tutorial progress (including started but not completed)
    const allTutorialProgress = await prisma.tutorialProgress.findMany({
      where: { userId },
    });

    // Calculate total points from achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const totalPoints = userAchievements.reduce(
      (sum, ua) => sum + ua.achievement.points,
      0
    );

    // Count mood-based quizzes
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
    });

    const moodCounts = quizAttempts.reduce((counts, attempt) => {
      const mood = attempt.mood || "CHILL";
      counts[mood] = (counts[mood] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    return {
      tutorialsStarted: allTutorialProgress.length,
      quizzesCompleted: tutorialProgress.length,
      challengesCompleted: challengeProgress.length,
      totalPoints,
      chillQuizzes: moodCounts.CHILL || 0,
      focusedQuizzes: moodCounts.FOCUSED || 0,
      crackedQuizzes: moodCounts.CRACKED || 0,
    };
  }

  /**
   * Share achievement unlock to social feed
   */
  private static async shareAchievementUnlock(
    userId: string,
    achievement: Achievement
  ) {
    try {
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      // Only share if user has social sharing enabled
      if (userSettings?.shareProgress) {
        await prisma.progressShare.create({
          data: {
            userId,
            type: "achievement",
            title: `unlocked "${achievement.title}"!`,
            description: achievement.description,
            data: { points: achievement.points },
          },
        });
      }
    } catch (error) {
      console.error("Error sharing achievement:", error);
    }
  }
}
