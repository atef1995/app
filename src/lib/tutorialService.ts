import { prisma } from "@/lib/prisma";
import { Tutorial, Category, Quiz, Prisma } from "@prisma/client";

// Prisma types for tutorials with relationships
export type TutorialWithCategory = Tutorial & {
  category: Category;
};

export type TutorialWithQuiz = Tutorial & {
  category: Category;
  quizzes: Quiz[];
};

export type TutorialWithAll = Tutorial & {
  category: Category;
  quizzes: Quiz[];
};

// Legacy interface for backward compatibility only
export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/**
 * Service for handling tutorial operations using pure Prisma types
 */
export class TutorialService {
  /**
   * Get all published tutorials with their categories and quizzes
   */
  static async getAllTutorials(
    limit?: number,
    offset?: number
  ): Promise<TutorialWithAll[]> {
    try {
      const tutorials = await prisma.tutorial.findMany({
        where: {
          published: true,
        },
        include: {
          quizzes: true,
          category: true,
        },
        orderBy: {
          order: "asc",
        },
        take: limit,
        skip: offset,
      });

      return tutorials.filter(t => t.category !== null) as TutorialWithAll[];
    } catch (error) {
      console.error("Error in getAllTutorials:", error);
      throw new Error("Failed to fetch tutorials from database");
    }
  }

  /**
   * Get a specific tutorial by ID with its quiz and category
   */
  static async getTutorialById(id: string): Promise<TutorialWithAll | null> {
    try {
      const tutorial = await prisma.tutorial.findUnique({
        where: {
          id,
          published: true,
        },
        include: {
          quizzes: true,
          category: true,
        },
      });

      if (!tutorial || !tutorial.category) return null;
      return tutorial as TutorialWithAll;
    } catch (error) {
      console.error("Error in getTutorialById:", error);
      return null;
    }
  }

  /**
   * Get a tutorial by slug with its quiz and category
   */
  static async getTutorialBySlug(slug: string): Promise<TutorialWithAll | null> {
    try {
      const tutorial = await prisma.tutorial.findUnique({
        where: {
          slug,
          published: true,
        },
        include: {
          quizzes: true,
          category: true,
        },
      });

      if (!tutorial || !tutorial.category) return null;
      return tutorial as TutorialWithAll;
    } catch (error) {
      console.error("Error in getTutorialBySlug:", error);
      return null;
    }
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
  static async getTutorialsByCategory(
    categorySlug: string,
    limit?: number,
    offset?: number
  ): Promise<TutorialWithAll[]> {
    try {
      const tutorials = await prisma.tutorial.findMany({
        where: {
          published: true,
          category: {
            slug: categorySlug,
          },
        },
        include: {
          quizzes: true,
          category: true,
        },
        orderBy: {
          order: "asc",
        },
        take: limit,
        skip: offset,
      });

      return tutorials.filter(t => t.category !== null) as TutorialWithAll[];
    } catch (error) {
      console.error("Error in getTutorialsByCategory:", error);
      throw new Error("Failed to fetch tutorials by category");
    }
  }

  /**
   * Get all available tutorial categories
   */
  static async getCategories(): Promise<Category[]> {
    try {
      return await prisma.category.findMany({
        where: {
          published: true,
        },
        orderBy: {
          order: "asc",
        },
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw new Error("Failed to fetch categories");
    }
  }

  /**
   * Get categories with tutorial counts and user progress stats
   */
  static async getCategoriesWithStats(userId?: string): Promise<(Category & {
    _count: { tutorials: number };
    tutorialStats?: { total: number; completed: number };
  })[]> {
    try {
      // Get categories with tutorial counts using Prisma _count
      const categoriesWithCounts = await prisma.category.findMany({
        where: {
          published: true,
        },
        include: {
          _count: {
            select: {
              tutorials: {
                where: {
                  published: true,
                },
              },
            },
          },
        },
        orderBy: {
          order: "asc",
        },
      });

      // If no user provided, just return categories with tutorial counts
      if (!userId) {
        return categoriesWithCounts.map(category => ({
          ...category,
          tutorialStats: {
            total: category._count.tutorials,
            completed: 0,
          },
        }));
      }

      // Get user's completed tutorials grouped by category
      const userProgressByCategoryRaw = await prisma.tutorialProgress.groupBy({
        by: ['tutorialId'],
        where: {
          userId,
          status: 'COMPLETED',
          quizPassed: true,
        },
        _count: {
          tutorialId: true,
        },
      });

      // Get tutorial category mappings for completed tutorials
      const completedTutorialIds = userProgressByCategoryRaw.map(p => p.tutorialId);
      const tutorialCategoryMappings = await prisma.tutorial.findMany({
        where: {
          id: {
            in: completedTutorialIds,
          },
        },
        select: {
          id: true,
          categoryId: true,
        },
      });

      // Group completed tutorials by category
      const completedByCategory = tutorialCategoryMappings.reduce((acc, tutorial) => {
        if (!acc[tutorial.categoryId]) {
          acc[tutorial.categoryId] = 0;
        }
        acc[tutorial.categoryId]++;
        return acc;
      }, {} as Record<string, number>);

      // Combine with category data
      return categoriesWithCounts.map(category => ({
        ...category,
        tutorialStats: {
          total: category._count.tutorials,
          completed: completedByCategory[category.id] || 0,
        },
      }));
    } catch (error) {
      console.error("Error in getCategoriesWithStats:", error);
      throw new Error("Failed to fetch categories with stats");
    }
  }

  /**
   * Get a specific category by slug
   */
  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      return await prisma.category.findUnique({
        where: {
          slug,
          published: true,
        },
      });
    } catch (error) {
      console.error("Error fetching category by slug:", error);
      return null;
    }
  }

  /**
   * Get tutorials grouped by category
   */
  static async getTutorialsGroupedByCategory(): Promise<Record<string, TutorialWithAll[]>> {
    const tutorials = await this.getAllTutorials();

    return tutorials.reduce((groups, tutorial) => {
      const categorySlug = tutorial.category.slug;
      if (!groups[categorySlug]) {
        groups[categorySlug] = [];
      }
      groups[categorySlug].push(tutorial);
      return groups;
    }, {} as Record<string, TutorialWithAll[]>);
  }

  /**
   * Search tutorials by title or description
   */
  static async searchTutorials(
    query: string,
    limit?: number,
    offset?: number
  ): Promise<TutorialWithAll[]> {
    try {
      const tutorials = await prisma.tutorial.findMany({
        where: {
          published: true,
          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          quizzes: true,
          category: true,
        },
        orderBy: {
          order: "asc",
        },
        take: limit,
        skip: offset,
      });

      return tutorials.filter(t => t.category !== null) as TutorialWithAll[];
    } catch (error) {
      console.error("Error in searchTutorials:", error);
      throw new Error("Failed to search tutorials");
    }
  }

  /**
   * Get total count of tutorials based on filters
   */
  static async getTutorialsCount(filters?: {
    category?: string;
    search?: string;
  }): Promise<number> {
    try {
      const where: Prisma.TutorialWhereInput = {
        published: true,
      };

      if (filters?.category) {
        where.category = {
          slug: filters.category,
        };
      }

      if (filters?.search) {
        where.OR = [
          {
            title: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: filters.search,
              mode: "insensitive",
            },
          },
        ];
      }

      return await prisma.tutorial.count({ where });
    } catch (error) {
      console.error("Error in getTutorialsCount:", error);
      throw new Error("Failed to count tutorials");
    }
  }

  /**
   * Get recommended tutorials based on current tutorial
   * Uses topics, category, prerequisites, and difficulty for smart matching
   */
  static async getRecommendedTutorials(
    currentTutorialSlug: string,
    limit: number = 3
  ): Promise<TutorialWithAll[]> {
    try {
      const currentTutorial = await this.getTutorialBySlug(currentTutorialSlug);
      if (!currentTutorial) return [];

      const allTutorials = await this.getAllTutorials();

      const scoredTutorials = allTutorials
        .filter(tutorial => tutorial.slug !== currentTutorialSlug)
        .map(tutorial => {
          let score = 0;

          const currentTopics = currentTutorial.topics as string[] || [];
          const tutorialTopics = tutorial.topics as string[] || [];

          const sharedTopics = currentTopics.filter(topic =>
            tutorialTopics.includes(topic)
          );

          if (sharedTopics.length >= 2) score += 3;
          else if (sharedTopics.length === 1) score += 2;

          if (tutorial.categoryId === currentTutorial.categoryId) score += 1;

          const diffDifference = Math.abs(tutorial.difficulty - currentTutorial.difficulty);
          if (diffDifference === 1) score += 1;
          else if (diffDifference === 0) score += 0.5;

          const currentPrereqs = currentTutorial.prerequisites as string[] || [];
          const tutorialPrereqs = tutorial.prerequisites as string[] || [];
          if (tutorialPrereqs.includes(currentTutorial.title)) score += 2;
          if (currentPrereqs.includes(tutorial.title)) score += 1.5;

          return { tutorial, score };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.tutorial);

      return scoredTutorials;
    } catch (error) {
      console.error("Error in getRecommendedTutorials:", error);
      return [];
    }
  }
}