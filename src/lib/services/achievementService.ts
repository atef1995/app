/**
 * Achievement Service
 *
 * Handles checking and unlocking achievements for users.
 * Achievements are badges earned by reaching specific milestones.
 *
 * Achievement Types:
 * - First PR Merged
 * - 10 PRs Merged
 * - 50 PRs Merged
 * - 100 PRs Merged
 * - First Review Completed
 * - 50 Reviews Completed
 * - 100 Reviews Completed
 * - Perfect Score (100%)
 * - 7-day Streak
 * - 30-day Streak
 */

import { prisma } from "@/lib/prisma";

/**
 * Achievement definitions
 */
export const ACHIEVEMENTS = {
  FIRST_PR: {
    id: "first-pr",
    title: "First Steps",
    description: "Merge your first pull request",
    icon: "🌱",
    category: "submissions",
  },
  TEN_PRS: {
    id: "ten-prs",
    title: "Getting Started",
    description: "Merge 10 pull requests",
    icon: "🚀",
    category: "submissions",
  },
  FIFTY_PRS: {
    id: "fifty-prs",
    title: "Contributor",
    description: "Merge 50 pull requests",
    icon: "⭐",
    category: "submissions",
  },
  HUNDRED_PRS: {
    id: "hundred-prs",
    title: "Open Source Hero",
    description: "Merge 100 pull requests",
    icon: "🏆",
    category: "submissions",
  },
  FIRST_REVIEW: {
    id: "first-review",
    title: "Peer Reviewer",
    description: "Complete your first code review",
    icon: "👀",
    category: "reviews",
  },
  FIFTY_REVIEWS: {
    id: "fifty-reviews",
    title: "Review Expert",
    description: "Complete 50 code reviews",
    icon: "🔍",
    category: "reviews",
  },
  HUNDRED_REVIEWS: {
    id: "hundred-reviews",
    title: "Review Master",
    description: "Complete 100 code reviews",
    icon: "👑",
    category: "reviews",
  },
  PERFECT_SCORE: {
    id: "perfect-score",
    title: "Perfectionist",
    description: "Receive a perfect score (100%) on a submission",
    icon: "💯",
    category: "quality",
  },
  WEEK_STREAK: {
    id: "week-streak",
    title: "Dedicated",
    description: "Maintain a 7-day contribution streak",
    icon: "🔥",
    category: "streak",
  },
  MONTH_STREAK: {
    id: "month-streak",
    title: "Unstoppable",
    description: "Maintain a 30-day contribution streak",
    icon: "⚡",
    category: "streak",
  },
} as const;

export type AchievementId = keyof typeof ACHIEVEMENTS;

export interface AchievementUnlockResult {
  unlocked: boolean;
  achievement?: typeof ACHIEVEMENTS[AchievementId];
  alreadyUnlocked?: boolean;
}

/**
 * Check if user has unlocked a specific achievement
 *
 * @param userId - User ID
 * @param achievementId - Achievement ID to check
 * @returns Whether achievement is unlocked
 */
export async function hasAchievement(
  userId: string,
  achievementId: string
): Promise<boolean> {
  const achievement = await prisma.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId,
        achievementId,
      },
    },
  });

  return achievement !== null;
}

/**
 * Unlock an achievement for a user
 *
 * @param userId - User ID
 * @param achievementId - Achievement ID
 * @returns Result of unlock attempt
 */
export async function unlockAchievement(
  userId: string,
  achievementId: AchievementId
): Promise<AchievementUnlockResult> {
  try {
    // Check if already unlocked
    const alreadyUnlocked = await hasAchievement(userId, achievementId);

    if (alreadyUnlocked) {
      return {
        unlocked: false,
        alreadyUnlocked: true,
      };
    }

    // Unlock achievement
    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
        unlockedAt: new Date(),
      },
    });

    const achievement = ACHIEVEMENTS[achievementId];

    // Send notification
    await prisma.notification.create({
      data: {
        userId,
        type: "ACHIEVEMENT_UNLOCKED",
        title: `🏆 Achievement Unlocked!`,
        message: `You've unlocked "${achievement.title}": ${achievement.description}`,
        data: {
          achievementId,
          achievementTitle: achievement.title,
          achievementIcon: achievement.icon,
        },
      },
    });

    console.log(`[Achievement] User ${userId} unlocked: ${achievementId}`);

    return {
      unlocked: true,
      achievement,
    };
  } catch (error) {
    console.error("Error unlocking achievement:", error);
    return {
      unlocked: false,
    };
  }
}

/**
 * Check and unlock PR-related achievements
 *
 * @param userId - User ID
 * @returns Array of newly unlocked achievements
 */
export async function checkPRAchievements(
  userId: string
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];

  // Count merged PRs
  const mergedPRCount = await prisma.contributionSubmission.count({
    where: {
      userId,
      prStatus: "MERGED",
    },
  });

  // Check First PR
  if (mergedPRCount === 1) {
    const result = await unlockAchievement(userId, "FIRST_PR");
    results.push(result);
  }

  // Check 10 PRs
  if (mergedPRCount === 10) {
    const result = await unlockAchievement(userId, "TEN_PRS");
    results.push(result);
  }

  // Check 50 PRs
  if (mergedPRCount === 50) {
    const result = await unlockAchievement(userId, "FIFTY_PRS");
    results.push(result);
  }

  // Check 100 PRs
  if (mergedPRCount === 100) {
    const result = await unlockAchievement(userId, "HUNDRED_PRS");
    results.push(result);
  }

  return results.filter((r) => r.unlocked);
}

/**
 * Check and unlock review-related achievements
 *
 * @param userId - User ID (reviewer)
 * @returns Array of newly unlocked achievements
 */
export async function checkReviewAchievements(
  userId: string
): Promise<AchievementUnlockResult[]> {
  const results: AchievementUnlockResult[] = [];

  // Count completed reviews
  const completedReviewCount = await prisma.contributionReview.count({
    where: {
      reviewerId: userId,
      status: { not: "PENDING" },
      submittedAt: { not: null },
    },
  });

  // Check First Review
  if (completedReviewCount === 1) {
    const result = await unlockAchievement(userId, "FIRST_REVIEW");
    results.push(result);
  }

  // Check 50 Reviews
  if (completedReviewCount === 50) {
    const result = await unlockAchievement(userId, "FIFTY_REVIEWS");
    results.push(result);
  }

  // Check 100 Reviews
  if (completedReviewCount === 100) {
    const result = await unlockAchievement(userId, "HUNDRED_REVIEWS");
    results.push(result);
  }

  return results.filter((r) => r.unlocked);
}

/**
 * Check and unlock perfect score achievement
 *
 * @param userId - User ID (submission author)
 * @param overallScore - Overall score received
 * @returns Achievement unlock result (if applicable)
 */
export async function checkPerfectScoreAchievement(
  userId: string,
  overallScore: number
): Promise<AchievementUnlockResult | null> {
  if (overallScore === 100) {
    return await unlockAchievement(userId, "PERFECT_SCORE");
  }

  return null;
}

/**
 * Get all achievements for a user
 *
 * @param userId - User ID
 * @returns List of unlocked achievements
 */
export async function getUserAchievements(userId: string) {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    orderBy: { unlockedAt: "desc" },
  });

  return userAchievements.map((ua) => {
    const achievementDef = Object.values(ACHIEVEMENTS).find(
      (a) => a.id === ua.achievementId
    );

    return {
      ...ua,
      ...achievementDef,
    };
  });
}

/**
 * Get achievement progress for a user
 *
 * @param userId - User ID
 * @returns Progress towards each achievement
 */
export async function getAchievementProgress(userId: string) {
  // Count metrics
  const [mergedPRs, completedReviews, perfectScores] = await Promise.all([
    prisma.contributionSubmission.count({
      where: { userId, prStatus: "MERGED" },
    }),
    prisma.contributionReview.count({
      where: {
        reviewerId: userId,
        status: { not: "PENDING" },
        submittedAt: { not: null },
      },
    }),
    prisma.contributionReview.count({
      where: {
        submission: { userId },
        overallScore: 100,
      },
    }),
  ]);

  // Get unlocked achievements
  const unlockedAchievements = await getUserAchievements(userId);
  const unlockedIds = new Set(unlockedAchievements.map((a) => a.achievementId));

  return {
    submissions: {
      count: mergedPRs,
      achievements: [
        {
          ...ACHIEVEMENTS.FIRST_PR,
          unlocked: unlockedIds.has("first-pr"),
          progress: Math.min(mergedPRs, 1),
          target: 1,
        },
        {
          ...ACHIEVEMENTS.TEN_PRS,
          unlocked: unlockedIds.has("ten-prs"),
          progress: Math.min(mergedPRs, 10),
          target: 10,
        },
        {
          ...ACHIEVEMENTS.FIFTY_PRS,
          unlocked: unlockedIds.has("fifty-prs"),
          progress: Math.min(mergedPRs, 50),
          target: 50,
        },
        {
          ...ACHIEVEMENTS.HUNDRED_PRS,
          unlocked: unlockedIds.has("hundred-prs"),
          progress: Math.min(mergedPRs, 100),
          target: 100,
        },
      ],
    },
    reviews: {
      count: completedReviews,
      achievements: [
        {
          ...ACHIEVEMENTS.FIRST_REVIEW,
          unlocked: unlockedIds.has("first-review"),
          progress: Math.min(completedReviews, 1),
          target: 1,
        },
        {
          ...ACHIEVEMENTS.FIFTY_REVIEWS,
          unlocked: unlockedIds.has("fifty-reviews"),
          progress: Math.min(completedReviews, 50),
          target: 50,
        },
        {
          ...ACHIEVEMENTS.HUNDRED_REVIEWS,
          unlocked: unlockedIds.has("hundred-reviews"),
          progress: Math.min(completedReviews, 100),
          target: 100,
        },
      ],
    },
    quality: {
      perfectScores,
      achievements: [
        {
          ...ACHIEVEMENTS.PERFECT_SCORE,
          unlocked: unlockedIds.has("perfect-score"),
          progress: perfectScores > 0 ? 1 : 0,
          target: 1,
        },
      ],
    },
  };
}
