"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";

interface ChallengeStartResult {
  success: boolean;
  progress?: {
    id: string;
    userId: string;
    challengeId: string;
    status: string;
    passed: boolean;
    attempts: number;
    failedAttempts: number;
    bestTime: number | null;
    firstPassedAt: Date | null;
    lastAttemptAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

interface ChallengeSubmissionResult {
  success: boolean;
  achievements: Array<{
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
    };
  }>;
  passed: boolean;
  attempt?: {
    id: string;
    userId: string;
    challengeId: string;
    code: string;
    passed: boolean;
    timeSpent: number | null;
    mood: string;
    createdAt: Date;
  };
  progress?: {
    id: string;
    userId: string;
    challengeId: string;
    status: string;
    passed: boolean;
    attempts: number;
    failedAttempts: number;
    bestTime: number | null;
    firstPassedAt: Date | null;
    lastAttemptAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

/**
 * Server action to mark a challenge as started
 */
export async function startChallengeAction(
  challengeId: string
): Promise<ChallengeStartResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized - user not logged in",
      };
    }

    if (!challengeId) {
      return {
        success: false,
        error: "Missing required field: challengeId",
      };
    }

    // Mark challenge as started
    const progress = await ProgressService.markChallengeStarted(
      session.user.id,
      challengeId
    );

    return {
      success: true,
      progress,
    };
  } catch (error) {
    console.error("Error marking challenge as started:", error);
    return {
      success: false,
      error: "Failed to mark challenge as started",
    };
  }
}

/**
 * Server action to submit a challenge attempt
 */
export async function submitChallengeAction(
  challengeId: string,
  code: string,
  passed: boolean,
  timeSpent?: number
): Promise<ChallengeSubmissionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        achievements: [],
        passed: false,
        error: "Unauthorized - user not logged in",
      };
    }

    if (!challengeId || !code || typeof passed !== "boolean") {
      return {
        success: false,
        achievements: [],
        passed: false,
        error: "Missing required fields",
      };
    }

    const result = await ProgressService.submitChallengeAttempt(
      session.user.id,
      {
        challengeId,
        code,
        passed,
        timeSpent: timeSpent || 0,
        ChallengeMoodAdaptation: {
          id: "challenge-mood",
          challengeId,
          mood: session.user.mood || "CHILL",
          content: "challenge-submission",
        },
      }
    );

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error submitting challenge:", error);
    return {
      success: false,
      achievements: [],
      passed: false,
      error: "Failed to submit challenge",
    };
  }
}
