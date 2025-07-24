"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";

interface QuizSubmissionResult {
  success: boolean;
  achievements: Array<{
    achievement: {
      id: string;
      title: string;
      description: string;
      icon: string;
    };
  }>;
  score: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  attempt?: {
    id: string;
    userId: string;
    quizId: string;
    tutorialId: string;
    answers: unknown; // Using unknown for JSON compatibility
    score: number;
    passed: boolean;
    timeSpent: number | null;
    mood: string;
    createdAt: Date;
  };
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

interface QuizData {
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
  }>;
  passingScore?: number;
  uiQuestions?: Array<{
    id: number;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty: "easy" | "medium" | "hard";
  }>;
}

/**
 * Server action to submit a quiz attempt
 */
export async function submitQuizAction(
  tutorialId: string,
  answers: number[],
  timeSpent: number,
  quizData: QuizData
): Promise<QuizSubmissionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        achievements: [],
        score: 0,
        passed: false,
        correctAnswers: 0,
        totalQuestions: 0,
        error: "Unauthorized - user not logged in",
      };
    }

    if (!tutorialId || !answers || !quizData) {
      return {
        success: false,
        achievements: [],
        score: 0,
        passed: false,
        correctAnswers: 0,
        totalQuestions: 0,
        error: "Missing required fields",
      };
    }

    const result = await ProgressService.submitQuizAttempt(
      session.user.id,
      {
        tutorialId,
        answers,
        timeSpent: timeSpent || 0,
        ChallengeMoodAdaptation: session.user.mood || "CHILL",
      },
      quizData
    );

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return {
      success: false,
      achievements: [],
      score: 0,
      passed: false,
      correctAnswers: 0,
      totalQuestions: 0,
      error: "Failed to submit quiz",
    };
  }
}
