"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";
import { AchievementService } from "@/lib/achievementService";

interface TutorialStartResult {
  success: boolean;
  achievements: Array<{
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
    };
  }>;
  progress?: {
    id: string;
    userId: string;
    tutorialId: string;
    status: string;
    quizPassed: boolean;
    quizAttempts: number;
    bestScore: number | null;
    timeSpent: number | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

/**
 * Server action to mark a tutorial as started and check for achievements
 */
export async function startTutorialAction(tutorialId: string): Promise<TutorialStartResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        achievements: [],
        error: "Unauthorized - user not logged in",
      };
    }

    if (!tutorialId) {
      return {
        success: false,
        achievements: [],
        error: "Missing required field: tutorialId",
      };
    }

    // Mark tutorial as started
    const progress = await ProgressService.markTutorialStarted(
      session.user.id,
      tutorialId
    );

    // Check for "first tutorial" achievement
    const achievements = await AchievementService.checkAndUnlockAchievements({
      userId: session.user.id,
      action: "TUTORIAL_STARTED",
      metadata: {
        tutorialId,
      }
    });

    return {
      success: true,
      progress,
      achievements,
    };
  } catch (error) {
    console.error("Error marking tutorial as started:", error);
    return {
      success: false,
      achievements: [],
      error: "Failed to mark tutorial as started",
    };
  }
}
