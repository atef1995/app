import { prisma } from "@/lib/prisma";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  slug: string;
  questions: Question[];
  isPremium: boolean;
  requiredPlan: string;
  createdAt: Date;
  updatedAt: Date;
  tutorial?: {
    id: string;
    slug: string;
    title: string;
    order: number;
  };
}

/**
 * Helper function to safely parse questions from database JSON
 */
function parseQuestions(questionsData: unknown): Question[] {
  try {
    if (Array.isArray(questionsData)) {
      return questionsData as Question[];
    }
    if (typeof questionsData === "string") {
      const parsed = JSON.parse(questionsData);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (error) {
    console.error("Error parsing questions:", error);
    return [];
  }
}

export class QuizService {
  /**
   * Get all quizzes from the database
   */
  static async getAllQuizzes(): Promise<Quiz[]> {
    const quizzes = await prisma.quiz.findMany({
      orderBy: {
        tutorialId: "asc",
      },
    });

    return quizzes.map((quiz) => ({
      ...quiz,
      questions: parseQuestions(quiz.questions),
    }));
  }

  /**
   * Get a specific quiz by ID
   */
  static async getQuizById(id: string): Promise<Quiz | null> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        tutorial: true, // Include tutorial information
      },
    });

    if (!quiz) return null;

    return {
      ...quiz,
      questions: parseQuestions(quiz.questions),
    };
  }

  /**
   * Get a specific quiz by slug
   */
  static async getQuizBySlug(slug: string): Promise<Quiz | null> {
    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        tutorial: true, // Include tutorial information
      },
    });

    if (!quiz) return null;

    return {
      ...quiz,
      questions: parseQuestions(quiz.questions),
    };
  }

  /**
   * Get quizzes by tutorial ID
   */
  static async getQuizzesByTutorialId(tutorialId: string): Promise<Quiz[]> {
    const quizzes = await prisma.quiz.findMany({
      where: { tutorialId },
      orderBy: {
        createdAt: "asc",
      },
    });

    return quizzes.map((quiz) => ({
      ...quiz,
      questions: parseQuestions(quiz.questions),
    }));
  }

  /**
   * Get user's quiz attempts for a specific quiz
   */
  static async getUserQuizAttempts(userId: string, quizId: string) {
    return await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get user's best score for a quiz
   */
  static async getUserBestScore(
    userId: string,
    quizId: string
  ): Promise<number | null> {
    const bestAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
      },
      orderBy: {
        score: "desc",
      },
    });

    return bestAttempt?.score || null;
  }
}
