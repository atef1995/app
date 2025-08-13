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
  category: string; // Will use fallback if missing from DB
  difficulty: number;
  order: number;
  published: boolean;
  isPremium: boolean;
  requiredPlan: "FREE" | "VIBED" | "CRACKED";
  createdAt: Date;
  updatedAt: Date;
  quiz?: {
    id: string;
    title: string;
    slug: string;
    questions: QuizQuestion[];
    isPremium: boolean;
    requiredPlan: string;
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
    try {
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
      category: tutorial.category || "fundamentals", // Fallback for missing category
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            slug: tutorial.quizzes[0].slug,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
            isPremium: tutorial.quizzes[0].isPremium,
            requiredPlan: tutorial.quizzes[0].requiredPlan,
          }
        : undefined,
    }));
    } catch (error) {
      console.error("Error in getAllTutorials:", error);
      throw new Error("Failed to fetch tutorials from database");
    }
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
      category: tutorial.category || "fundamentals", // Fallback for missing category
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            slug: tutorial.quizzes[0].slug,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
            isPremium: tutorial.quizzes[0].isPremium,
            requiredPlan: tutorial.quizzes[0].requiredPlan,
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
      category: tutorial.category || "fundamentals", // Fallback for missing category
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            slug: tutorial.quizzes[0].slug,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
            isPremium: tutorial.quizzes[0].isPremium,
            requiredPlan: tutorial.quizzes[0].requiredPlan,
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
   * Get tutorials by category
   */
  static async getTutorialsByCategory(category: string): Promise<TutorialWithQuiz[]> {
    const tutorials = await prisma.tutorial.findMany({
      where: {
        published: true,
        category: category,
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
      category: tutorial.category || "fundamentals", // Fallback for missing category
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            slug: tutorial.quizzes[0].slug,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
            isPremium: tutorial.quizzes[0].isPremium,
            requiredPlan: tutorial.quizzes[0].requiredPlan,
          }
        : undefined,
    }));
  }

  /**
   * Get all available tutorial categories
   */
  static async getCategories(): Promise<string[]> {
    try {
      const categories = await prisma.tutorial.findMany({
        where: {
          published: true,
        },
        select: {
          category: true,
        },
        distinct: ['category'],
      });

      return categories.map(c => c.category || "fundamentals").filter(Boolean).sort();
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Return default categories if DB query fails
      return ["fundamentals", "oop", "async", "dom", "advanced"];
    }
  }

  /**
   * Get tutorials grouped by category
   */
  static async getTutorialsGroupedByCategory(): Promise<Record<string, TutorialWithQuiz[]>> {
    const tutorials = await this.getAllTutorials();
    
    return tutorials.reduce((groups, tutorial) => {
      const category = tutorial.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(tutorial);
      return groups;
    }, {} as Record<string, TutorialWithQuiz[]>);
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
      category: tutorial.category || "fundamentals", // Fallback for missing category
      difficulty: tutorial.difficulty,
      order: tutorial.order,
      published: tutorial.published,
      isPremium: tutorial.isPremium,
      requiredPlan: tutorial.requiredPlan as "FREE" | "VIBED" | "CRACKED",
      createdAt: tutorial.createdAt,
      updatedAt: tutorial.updatedAt,
      quiz: tutorial.quizzes[0]
        ? {
            id: tutorial.quizzes[0].id,
            title: tutorial.quizzes[0].title,
            slug: tutorial.quizzes[0].slug,
            questions: tutorial.quizzes[0]
              .questions as unknown as QuizQuestion[],
            isPremium: tutorial.quizzes[0].isPremium,
            requiredPlan: tutorial.quizzes[0].requiredPlan,
          }
        : undefined,
    }));
  }
}
