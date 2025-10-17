"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";

interface ExerciseSubmissionResult {
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
    exerciseId: string;
    html: string | null;
    css: string | null;
    js: string | null;
    passed: boolean;
    passedTests: number;
    timeSpent: number | null;
    hintsUsed: boolean;
    mood: string;
    createdAt: Date;
  };
  progress?: {
    id: string;
    userId: string;
    exerciseId: string;
    status: string;
    passed: boolean;
    attempts: number;
    bestTime: number | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
  error?: string;
}

/**
 * Server action to submit an exercise attempt
 */
export async function submitExerciseAction(
  exerciseId: string,
  html: string,
  css: string,
  js: string,
  passed: boolean,
  passedTests: number,
  timeSpent: number,
  hintsUsed: boolean
): Promise<ExerciseSubmissionResult> {
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

    if (!exerciseId || typeof passed !== "boolean") {
      return {
        success: false,
        achievements: [],
        passed: false,
        error: "Missing required fields",
      };
    }

    const result = await ProgressService.submitExerciseAttempt(
      session.user.id,
      {
        exerciseId,
        html,
        css,
        js,
        passed,
        passedTests,
        timeSpent,
        hintsUsed,
        mood: session.user.mood || "CHILL",
      }
    );

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error submitting exercise:", error);
    return {
      success: false,
      achievements: [],
      passed: false,
      error: "Failed to submit exercise",
    };
  }
}
