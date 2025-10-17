import { prisma } from "@/lib/prisma";
import { MoodId } from "@/types/mood";
import { AchievementAction, AchievementMetadata } from "@/types/common";
import { Achievement, UserAchievement } from "@prisma/client";

interface AchievementCheck {
  userId: string;
  action: AchievementAction;
  metadata?: AchievementMetadata;
}

/**
 * Simple in-memory cache for achievement checks to prevent duplicate queries
 * Cache expires after 30 seconds
 */
interface CacheEntry {
  data: (UserAchievement & { achievement: Achievement })[];
  timestamp: number;
}

export class AchievementService {
  private static cache: Map<string, CacheEntry> = new Map();
  private static CACHE_TTL = 30000; // 30 seconds

  /**
   * Generate cache key for achievement checks
   */
  private static getCacheKey(userId: string, action: AchievementAction): string {
    return `${userId}:${action}`;
  }

  /**
   * Check if cache entry is still valid
   */
  private static isCacheValid(entry: CacheEntry | undefined): boolean {
    if (!entry) return false;
    return Date.now() - entry.timestamp < this.CACHE_TTL;
  }

  /**
   * Get from cache if valid
   */
  private static getFromCache(
    userId: string,
    action: AchievementAction
  ): (UserAchievement & { achievement: Achievement })[] | null {
    const key = this.getCacheKey(userId, action);
    const entry = this.cache.get(key);

    if (this.isCacheValid(entry)) {
      return entry!.data;
    }

    // Clean up expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  /**
   * Store in cache
   */
  private static setCache(
    userId: string,
    action: AchievementAction,
    data: (UserAchievement & { achievement: Achievement })[]
  ): void {
    const key = this.getCacheKey(userId, action);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Periodically clean up old cache entries (keep cache size reasonable)
    if (this.cache.size > 100) {
      const now = Date.now();
      for (const [cacheKey, entry] of this.cache.entries()) {
        if (now - entry.timestamp >= this.CACHE_TTL) {
          this.cache.delete(cacheKey);
        }
      }
    }
  }
  /**
   * Check and unlock achievements based on user actions
   */
  static async checkAndUnlockAchievements({
    userId,
    action,
    metadata = {},
  }: AchievementCheck) {
    try {
      // Check cache first to prevent duplicate queries
      const cached = this.getFromCache(userId, action);
      if (cached !== null) {
        return cached;
      }

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

        // Exercise Achievements - Quality & Performance
        {
          key: "FIRST_EXERCISE",
          condition:
            action === "EXERCISE_COMPLETED" &&
            userStats.exercisesCompleted === 1,
          points: 15,
        },
        {
          key: "EXERCISE_PERFECTIONIST",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.attempts === 1 &&
            metadata.hintsUsed === false,
          points: 100,
        },
        {
          key: "NO_HINTS_MASTER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            userStats.exercisesCompletedNoHints >= 5,
          points: 75,
        },
        {
          key: "EXERCISE_SPEEDSTER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.timeSpent &&
            metadata.timeSpent <= (metadata.difficulty === "beginner" ? 7.5 : metadata.difficulty === "intermediate" ? 10 : 12.5) * 60,
          points: 120,
        },
        {
          key: "CLEAN_CODE_CHAMPION",
          condition:
            action === "EXERCISE_COMPLETED" &&
            userStats.firstTryPasses >= 3,
          points: 80,
        },

        // Exercise Achievements - Skill-Based
        {
          key: "HTML_CSS_MASTER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.category === "HTML & CSS" &&
            userStats.completedCategories["HTML & CSS"] === true,
          points: 150,
        },
        {
          key: "JAVASCRIPT_NINJA",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.category === "JavaScript" &&
            userStats.completedCategories["JavaScript"] === true,
          points: 150,
        },
        {
          key: "DOM_WIZARD",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.category === "DOM Manipulation" &&
            userStats.completedCategories["DOM Manipulation"] === true,
          points: 100,
        },
        {
          key: "FULL_STACK_BUILDER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            Object.keys(userStats.exercisesByCategory).length >= 3,
          points: 90,
        },
        {
          key: "DIFFICULTY_CLIMBER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            (userStats.exercisesByDifficulty.beginner || 0) > 0 &&
            (userStats.exercisesByDifficulty.intermediate || 0) > 0 &&
            (userStats.exercisesByDifficulty.advanced || 0) > 0,
          points: 125,
        },

        // Exercise Achievements - Learning & Progress
        {
          key: "PROBLEM_SOLVER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.attempts === 2,
          points: 40,
        },
        {
          key: "PERSISTENT_LEARNER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            (metadata.attempts || 0) >= 3,
          points: 60,
        },
        {
          key: "CALCULATOR_MASTER",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.exerciseId === "calculator",
          points: 30,
        },
        {
          key: "FORM_VALIDATOR_PRO",
          condition:
            action === "EXERCISE_COMPLETED" &&
            metadata.exerciseId === "form-validation",
          points: 30,
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

      // Store result in cache before returning
      this.setCache(userId, action, unlockedAchievements);

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
    const [
      tutorialProgress,
      challengeProgress,
      exerciseProgress,
      exerciseAttempts,
      allExercises,
    ] = await Promise.all([
      prisma.tutorialProgress.findMany({
        where: { userId, quizPassed: true },
      }),
      prisma.challengeProgress.findMany({
        where: { userId, passed: true },
      }),
      prisma.exerciseProgress.findMany({
        where: { userId, passed: true },
        include: { exercise: true },
      }),
      prisma.exerciseAttempt.findMany({
        where: { userId },
        include: { exercise: true },
      }),
      prisma.exercise.findMany({
        where: { published: true },
        select: { category: true, id: true },
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

    // Calculate exercise stats
    const exercisesCompleted = exerciseProgress.length;
    const exercisesCompletedNoHints = exerciseAttempts.filter(
      (attempt) => attempt.passed && !attempt.hintsUsed
    ).length;

    // Group exercises by category
    const exercisesByCategory = exerciseProgress.reduce((acc, progress) => {
      const category = progress.exercise.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(progress.exerciseId);
      return acc;
    }, {} as Record<string, string[]>);

    // Group exercises by difficulty
    const exercisesByDifficulty = exerciseProgress.reduce((acc, progress) => {
      const difficulty = progress.exercise.difficulty;
      if (!acc[difficulty]) acc[difficulty] = 0;
      acc[difficulty]++;
      return acc;
    }, {} as Record<string, number>);

    // Count first-try passes (passed on first attempt)
    const firstTryPasses = exerciseProgress.filter(
      (progress) => progress.attempts === 1
    ).length;

    // Count exercises with multiple attempts
    const multipleAttemptPasses = exerciseProgress.filter(
      (progress) => progress.attempts >= 3
    ).length;

    // Calculate category completion status
    const totalExercisesByCategory = allExercises.reduce((acc, exercise) => {
      if (!acc[exercise.category]) acc[exercise.category] = 0;
      acc[exercise.category]++;
      return acc;
    }, {} as Record<string, number>);

    const completedCategories: Record<string, boolean> = {};
    for (const category in exercisesByCategory) {
      const totalInCategory = totalExercisesByCategory[category] || 0;
      const completedInCategory = exercisesByCategory[category].length;
      completedCategories[category] = completedInCategory >= totalInCategory && totalInCategory > 0;
    }

    return {
      tutorialsStarted: allTutorialProgress.length,
      quizzesCompleted: tutorialProgress.length,
      challengesCompleted: challengeProgress.length,
      exercisesCompleted,
      exercisesCompletedNoHints,
      exercisesByCategory,
      exercisesByDifficulty,
      firstTryPasses,
      multipleAttemptPasses,
      completedCategories,
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

      // Only share if user has social sharing enabled (default: enabled)
      if (!userSettings || userSettings.shareProgress !== false) {
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
