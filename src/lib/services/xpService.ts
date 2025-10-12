/**
 * XP (Experience Points) Service
 *
 * Handles awarding XP to users for various contribution activities.
 * XP is used for gamification and progression tracking.
 *
 * XP Rewards:
 * - PR Merged: Variable based on project difficulty (100-500 XP)
 * - Peer Review Completed: 25 XP
 * - Mentor Review Completed: 50 XP
 * - First PR Merged: Bonus 100 XP
 * - Perfect Score (100%): Bonus 50 XP
 */

import { prisma } from "@/lib/prisma";

export interface XPAwardResult {
  success: boolean;
  xpAwarded: number;
  newTotal: number;
  levelUp?: boolean;
  newLevel?: number;
  error?: string;
}

/**
 * Award XP to a user
 *
 * @param userId - User ID
 * @param amount - Amount of XP to award
 * @param reason - Reason for awarding XP (for tracking/debugging)
 * @param metadata - Additional metadata (e.g., submissionId, reviewId)
 * @returns Result of XP award
 */
export async function awardXP(
  userId: string,
  amount: number,
  reason: string,
  metadata?: Record<string, any>
): Promise<XPAwardResult> {
  try {
    // Fetch current user XP and level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        xp: true,
        level: true,
      },
    });

    if (!user) {
      return {
        success: false,
        xpAwarded: 0,
        newTotal: 0,
        error: "User not found",
      };
    }

    const currentXP = user.xp || 0;
    const currentLevel = user.level || 1;

    const newXP = currentXP + amount;

    // Calculate level based on XP
    // Level formula: level = floor(sqrt(xp / 100)) + 1
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    // Level 4: 900-1599 XP
    // etc.
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    const levelUp = newLevel > currentLevel;

    // Update user XP and level
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });

    // Log XP transaction (optional, for audit trail)
    console.log(`[XP] Awarded ${amount} XP to user ${userId}`, {
      reason,
      metadata,
      oldXP: currentXP,
      newXP,
      oldLevel: currentLevel,
      newLevel,
      levelUp,
    });

    // Send notification if level up
    if (levelUp) {
      await prisma.notification.create({
        data: {
          userId,
          type: "LEVEL_UP",
          title: `Level Up! You're now Level ${newLevel}`,
          message: `Congratulations! You've reached Level ${newLevel} with ${newXP} XP!`,
          data: {
            oldLevel: currentLevel,
            newLevel,
            totalXP: newXP,
          },
        },
      });
    }

    return {
      success: true,
      xpAwarded: amount,
      newTotal: newXP,
      levelUp,
      newLevel: levelUp ? newLevel : undefined,
    };
  } catch (error) {
    console.error("Error awarding XP:", error);
    return {
      success: false,
      xpAwarded: 0,
      newTotal: 0,
      error: (error as Error).message,
    };
  }
}

/**
 * Award XP for a merged PR
 *
 * @param userId - User ID
 * @param xpAmount - XP amount from project
 * @param submissionId - Submission ID
 * @param isFirstPR - Whether this is the user's first merged PR (bonus XP)
 * @returns Result of XP award
 */
export async function awardPRMergeXP(
  userId: string,
  xpAmount: number,
  submissionId: string,
  isFirstPR: boolean = false
): Promise<XPAwardResult> {
  let totalXP = xpAmount;

  // Bonus for first PR
  if (isFirstPR) {
    totalXP += 100;
  }

  return awardXP(userId, totalXP, "PR_MERGED", {
    submissionId,
    baseXP: xpAmount,
    bonusXP: isFirstPR ? 100 : 0,
    isFirstPR,
  });
}

/**
 * Award XP for completing a code review
 *
 * @param userId - Reviewer user ID
 * @param reviewId - Review ID
 * @param type - Review type (PEER or MENTOR)
 * @returns Result of XP award
 */
export async function awardReviewXP(
  userId: string,
  reviewId: string,
  type: "PEER" | "MENTOR"
): Promise<XPAwardResult> {
  const xpAmount = type === "MENTOR" ? 50 : 25;

  return awardXP(userId, xpAmount, "REVIEW_COMPLETED", {
    reviewId,
    reviewType: type,
  });
}

/**
 * Award bonus XP for achieving a perfect score
 *
 * @param userId - User ID
 * @param submissionId - Submission ID
 * @returns Result of XP award
 */
export async function awardPerfectScoreBonusXP(
  userId: string,
  submissionId: string
): Promise<XPAwardResult> {
  return awardXP(userId, 50, "PERFECT_SCORE", {
    submissionId,
  });
}

/**
 * Check if user has reached a new level
 *
 * @param xp - Current XP amount
 * @returns Current level
 */
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

/**
 * Calculate XP needed for next level
 *
 * @param currentLevel - Current level
 * @returns XP needed to reach next level
 */
export function xpForNextLevel(currentLevel: number): number {
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
}

/**
 * Get XP progress to next level
 *
 * @param currentXP - Current XP amount
 * @returns Progress information
 */
export function getXPProgress(currentXP: number): {
  currentLevel: number;
  nextLevel: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  xpNeededForNextLevel: number;
  progressPercentage: number;
} {
  const currentLevel = calculateLevel(currentXP);
  const nextLevel = currentLevel + 1;

  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
  const xpForNextLevel = Math.pow(nextLevel - 1, 2) * 100;

  const xpInCurrentLevel = currentXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - currentXP;
  const progressPercentage =
    (xpInCurrentLevel / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return {
    currentLevel,
    nextLevel,
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercentage,
  };
}
