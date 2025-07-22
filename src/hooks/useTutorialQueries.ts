import { useQuery, useQueries } from "@tanstack/react-query";
import { TutorialWithQuiz } from "@/lib/tutorialService";

// Types
interface TutorialProgress {
  id: string;
  status: string;
  quizPassed: boolean;
  quizAttempts: number;
  bestScore: number | null;
  completedAt: Date | null;
}

interface TutorialWithProgress extends TutorialWithQuiz {
  progress?: TutorialProgress | null;
  level?: string;
  lessons?: number;
  estimatedTime?: string;
  topics?: string[];
  isPremium: boolean;
  requiredPlan: "FREE" | "PREMIUM" | "PRO";
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

const validateTutorial = (tutorial: unknown): tutorial is TutorialWithQuiz => {
  const t = tutorial as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.slug === 'string' &&
    typeof t.difficulty === 'number'
  );
};

const mapTutorialWithDefaults = async (tutorial: TutorialWithQuiz): Promise<TutorialWithProgress> => {
  let estimatedTime: string = TUTORIAL_DEFAULTS.ESTIMATED_TIME;
  let topics: string[] = [...TUTORIAL_DEFAULTS.DEFAULT_TOPICS];

  // Load MDX metadata if available
  if (tutorial.mdxFile) {
    try {
      const mdxResponse = await fetch(`/api/tutorials/mdx?file=${tutorial.mdxFile}`);
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
      console.warn(`Failed to load MDX metadata for ${tutorial.mdxFile}:`, error);
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

// Fetch functions
const fetchTutorials = async (): Promise<TutorialWithProgress[]> => {
  const response = await fetch("/api/tutorials");
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

  return mappedTutorials;
};

const fetchTutorialProgress = async (tutorialId: string, userId: string): Promise<TutorialProgress | null> => {
  const response = await fetch(
    `/api/progress/tutorial?tutorialId=${tutorialId}&userId=${userId}`
  );
  
  if (!response.ok) {
    // If progress doesn't exist, return null instead of throwing
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch progress for tutorial ${tutorialId}`);
  }
  
  const progressData = await response.json();
  return progressData.data;
};

// Custom hooks
export const useTutorials = () => {
  return useQuery({
    queryKey: ["tutorials"],
    queryFn: fetchTutorials,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTutorialProgress = (tutorials: TutorialWithProgress[], userId?: string) => {
  // Only fetch progress if we have tutorials and userId
  const shouldFetch = Boolean(userId && tutorials.length > 0);
  
  const progressQueries = useQueries({
    queries: tutorials.map((tutorial) => ({
      queryKey: ["tutorial-progress", tutorial.id, userId],
      queryFn: () => fetchTutorialProgress(tutorial.id, userId!),
      enabled: shouldFetch,
      staleTime: 2 * 60 * 1000, // 2 minutes for progress
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Less retries for progress as it's less critical
    })),
  });

  // Combine tutorials with their progress
  const tutorialsWithProgress = tutorials.map((tutorial, index) => ({
    ...tutorial,
    progress: progressQueries[index]?.data || null,
  }));

  const isLoading = progressQueries.some((query) => query.isLoading);
  const hasError = progressQueries.some((query) => query.error);

  return {
    tutorialsWithProgress,
    isProgressLoading: isLoading,
    progressError: hasError,
  };
};

// Export types
export type { TutorialWithProgress, TutorialProgress };
