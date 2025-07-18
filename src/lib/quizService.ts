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
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
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
      questions: quiz.questions as unknown as Question[],
    }));
  }

  /**
   * Get a specific quiz by ID
   */
  static async getQuizById(id: string): Promise<Quiz | null> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) return null;

    return {
      ...quiz,
      questions: quiz.questions as unknown as Question[],
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
      questions: quiz.questions as unknown as Question[],
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
