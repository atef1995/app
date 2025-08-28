import { useQuery } from "@tanstack/react-query";
import { TutorialWithAll } from "@/lib/tutorialService";
import { Category } from "@prisma/client";

// Types
interface TutorialProgress {
  id: string;
  tutorialId: string;
  status: string;
  quizPassed: boolean;
  quizAttempts: number;
  bestScore: number | null;
  completedAt: Date | null;
}

interface TutorialWithProgress extends Omit<TutorialWithAll, "estimatedTime"> {
  progress?: TutorialProgress | null;
  level?: string;
  lessons?: number;
  estimatedTime?: string; // Override to be string instead of number
  topics?: string[];
}

// Constants
const TUTORIAL_DEFAULTS = {
  ESTIMATED_TIME: "2 hours" as string,
  DEFAULT_TOPICS: ["JavaScript", "Programming"] as string[],
  DEFAULT_LESSONS: 8,
} as const;

// Utility functions
const getDifficultyLevel = (difficulty: number): string => {
  if (difficulty === 1) return "beginner";
  if (difficulty === 2) return "intermediate";
  return "advanced";
};

const validateTutorial = (tutorial: unknown): tutorial is TutorialWithAll => {
  const t = tutorial as Record<string, unknown>;
  return (
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    typeof t.slug === "string" &&
    typeof t.difficulty === "number"
  );
};

const mapTutorialWithDefaults = async (
  tutorial: TutorialWithAll
): Promise<TutorialWithProgress> => {
  let estimatedTime: string = TUTORIAL_DEFAULTS.ESTIMATED_TIME;
  let topics: string[] = [...TUTORIAL_DEFAULTS.DEFAULT_TOPICS];

  // Load MDX metadata if available
  if (tutorial.mdxFile) {
    try {
      const mdxResponse = await fetch(
        `/api/tutorials/mdx?file=${tutorial.mdxFile}`
      );
      if (mdxResponse.ok) {
        const mdxData = await mdxResponse.json();
        if (mdxData.success && mdxData.data.frontmatter) {
          const frontmatter = mdxData.data.frontmatter as {
            estimatedTime?: string;
            topics?: string[];
          };
          estimatedTime = frontmatter.estimatedTime || estimatedTime;
          topics = frontmatter.topics || topics;
        }
      }
    } catch (error) {
      console.warn(
        `Failed to load MDX metadata for ${tutorial.mdxFile}:`,
        error
      );
    }
  }

  return {
    ...tutorial,
    level: getDifficultyLevel(tutorial.difficulty),
    lessons: TUTORIAL_DEFAULTS.DEFAULT_LESSONS,
    estimatedTime,
    topics,
    isPremium: tutorial.isPremium || false,
    requiredPlan: tutorial.requiredPlan || "FREE",
  };
};

// Pagination response interface
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Fetch functions
const fetchTutorials = async (
  page = 1,
  limit = 10,
  all = false
): Promise<PaginatedResponse<TutorialWithProgress>> => {
  const url = all
    ? `/api/tutorials?page=1&limit=1000` // Get all tutorials for stats
    : `/api/tutorials?page=${page}&limit=${limit}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch tutorials");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch tutorials");
  }

  // Validate and map tutorials
  const validTutorials = data.data.filter(validateTutorial);
  const mappedTutorials = await Promise.all(
    validTutorials.map(mapTutorialWithDefaults)
  );

  return {
    success: true,
    data: mappedTutorials,
    pagination: data.pagination,
  };
};

const fetchTutorialsProgressBulk = async (
  tutorialIds: string[]
): Promise<TutorialProgress[]> => {
  if (tutorialIds.length === 0) {
    return [];
  }

  const response = await fetch(
    `/api/progress/tutorials-bulk?tutorialIds=${tutorialIds.join(",")}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch bulk tutorial progress");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch bulk tutorial progress");
  }

  return data.data;
};

const fetchCategories = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Category>> => {
  const response = await fetch(
    `/api/tutorials/categories?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch categories");
  }

  return {
    success: true,
    data: data.data,
    pagination: data.pagination,
  };
};

const fetchCategoryBySlug = async (slug: string): Promise<Category | null> => {
  const response = await fetch(
    `/api/tutorials/categories/${encodeURIComponent(slug)}`
  );
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Failed to fetch category");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch category");
  }

  return data.data;
};

// Type for categories with stats
export interface CategoryWithStats extends Category {
  _count: { tutorials: number };
  tutorialStats?: { total: number; completed: number };
}

interface CategoriesWithStatsResponse extends PaginatedResponse<CategoryWithStats> {
  overallStats?: {
    totalTutorials: number;
    completedTutorials: number;
  } | null;
}

const fetchCategoriesWithStats = async (
  page = 1,
  limit = 10
): Promise<CategoriesWithStatsResponse> => {
  const response = await fetch(
    `/api/tutorials/categories-with-stats?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch categories with stats");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch categories with stats");
  }

  return data;
};

const fetchTutorialsByCategory = async (
  category: string,
  page = 1,
  limit = 10
): Promise<PaginatedResponse<TutorialWithProgress>> => {
  const response = await fetch(
    `/api/tutorials/category/${encodeURIComponent(
      category
    )}?page=${page}&limit=${limit}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch tutorials for category: ${category}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch tutorials for category");
  }

  // Validate and map tutorials
  const validTutorials = data.data.filter(validateTutorial);
  const mappedTutorials = await Promise.all(
    validTutorials.map(mapTutorialWithDefaults)
  );

  return {
    success: true,
    data: mappedTutorials,
    pagination: data.pagination,
  };
};

// Custom hooks
export const useTutorials = (page = 1, limit = 10, all = false) => {
  return useQuery({
    queryKey: all ? ["tutorials", "all"] : ["tutorials", page, limit],
    queryFn: () => fetchTutorials(page, limit, all),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTutorialProgress = (
  tutorials: TutorialWithProgress[],
  userId?: string
) => {
  // Only fetch progress if we have tutorials and userId
  const shouldFetch = Boolean(userId && tutorials.length > 0);
  const tutorialIds = tutorials.map(t => t.id);

  // Use optimized bulk fetching instead of individual queries
  const progressQuery = useQuery({
    queryKey: ["tutorials-progress-bulk", tutorialIds.sort().join(","), userId],
    queryFn: () => fetchTutorialsProgressBulk(tutorialIds),
    enabled: shouldFetch,
    staleTime: 2 * 60 * 1000, // 2 minutes for progress
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Less retries for progress as it's less critical
  });

  // Create a map for O(1) lookup of progress data
  const progressMap = new Map(
    (progressQuery.data || []).map(p => [p.tutorialId, p])
  );

  // Combine tutorials with their progress
  const tutorialsWithProgress = tutorials.map((tutorial) => ({
    ...tutorial,
    progress: progressMap.get(tutorial.id) || null,
  }));

  return {
    tutorialsWithProgress,
    isProgressLoading: progressQuery.isLoading,
    progressError: progressQuery.error,
  };
};

export const useCategories = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["tutorial-categories", page, limit],
    queryFn: () => fetchCategories(page, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCategoriesWithStats = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["tutorial-categories-with-stats", page, limit],
    queryFn: () => fetchCategoriesWithStats(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes (shorter since it includes user progress)
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useTutorialsByCategory = (
  category: string,
  page = 1,
  limit = 12
) => {
  return useQuery({
    queryKey: ["tutorials-by-category", category, page, limit],
    queryFn: () => fetchTutorialsByCategory(category, page, limit),
    enabled: Boolean(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["category-by-slug", slug],
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Export types
export type { TutorialWithProgress, TutorialProgress };
