import { prisma } from "@/lib/prisma";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TutorialWithQuiz {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null; // Allow null content for MDX-based tutorials
  mdxFile: string | null; // MDX file reference
  difficulty: number;
  order: number;
  published: boolean;
  isPremium: boolean;
  requiredPlan: "FREE" | "PREMIUM" | "PRO";
  createdAt: Date;
  updatedAt: Date;
  quiz?: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
}

/**
 * Service for handling tutorial operations
 */
export class TutorialService {
  /**
   * Get all published tutorials with their quizzes
   */
  static async getAllTutorials(): Promise<TutorialWithQuiz[]> {
    const tutorials = await prisma.tutorial.findMany({
      where: {
        published: true,
      },
      include: {
        quizzes: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return tutorials.map((tutorial) => ({
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      content: tutorial.content,
      mdxFile: tutorial.mdxFile,
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "PREMIUM" | "PRO",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
          }
        : undefined,
    }));
  }

  /**
   * Get a specific tutorial by ID with its quiz
   */
  static async getTutorialById(id: string): Promise<TutorialWithQuiz | null> {
    const tutorial = await prisma.tutorial.findUnique({
      where: {
        id,
        published: true,
      },
      include: {
        quizzes: true,
      },
    });

    if (!tutorial) return null;

    return {
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      content: tutorial.content,
      mdxFile: tutorial.mdxFile,
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "PREMIUM" | "PRO",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
          }
        : undefined,
    };
  }

  /**
   * Get a tutorial by slug with its quiz
   */
  static async getTutorialBySlug(
    slug: string
  ): Promise<TutorialWithQuiz | null> {
    const tutorial = await prisma.tutorial.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        quizzes: true,
      },
    });

    if (!tutorial) return null;

    return {
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      content: tutorial.content,
      mdxFile: tutorial.mdxFile,
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan,
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
          }
        : undefined,
    };
  }

  /**
   * Get tutorials with user progress
   */
  static async getTutorialsWithProgress(userId: string) {
    const tutorials = await this.getAllTutorials();

    const progressData = await prisma.tutorialProgress.findMany({
      where: {
        userId,
        tutorialId: {
          in: tutorials.map((t) => t.id),
        },
      },
    });

    const progressMap = new Map(progressData.map((p) => [p.tutorialId, p]));

    return tutorials.map((tutorial) => ({
      ...tutorial,
      progress: progressMap.get(tutorial.id) || null,
    }));
  }

  /**
   * Search tutorials by title or description
   */
  static async searchTutorials(query: string): Promise<TutorialWithQuiz[]> {
    const tutorials = await prisma.tutorial.findMany({
      where: {
        published: true,
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            description: {
              contains: query,
            },
          },
        ],
      },
      include: {
        quizzes: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return tutorials.map((tutorial) => ({
      id: tutorial.id,
      slug: tutorial.slug,
      title: tutorial.title,
      description: tutorial.description,
      content: tutorial.content,
      mdxFile: tutorial.mdxFile,
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "PREMIUM" | "PRO",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
          }
        : undefined,
    }));
  }
}
