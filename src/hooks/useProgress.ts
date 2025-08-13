"use client";

import { useQuery } from "@tanstack/react-query";

interface TutorialProgress {
  tutorialId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  bestScore?: number;
  quizAttempts: number;
}

interface ChallengeProgress {
  challengeId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  bestScore?: number;
  attempts: number;
  lastAttemptAt?: string;
}

interface ProjectProgress {
  projectId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  submissionStatus?: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "REVIEWED" | "APPROVED" | "NEEDS_REVISION";
  grade?: number;
  timeSpent?: number;
  completedAt?: string;
}

interface ProgressStats {
  tutorials: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  };
  challenges: {
    completed: number;
    inProgress: number;
    failed: number;
    notStarted: number;
    total: number;
  };
  projects: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  };
}

interface ProgressResponse {
  success: boolean;
  progress?: TutorialProgress[] | ChallengeProgress[] | ProjectProgress[];
  stats?: ProgressStats;
}

// Fetch functions for different progress types
const fetchTutorialProgress = async (): Promise<TutorialProgress[]> => {
  const response = await fetch("/api/progress?type=tutorial");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch tutorial progress: ${response.status}`);
  }
  
  const data: ProgressResponse = await response.json();
  
  if (!data.success) {
    throw new Error("Failed to fetch tutorial progress from API");
  }
  
  return (data.progress || []) as TutorialProgress[];
};

const fetchChallengeProgress = async (): Promise<ChallengeProgress[]> => {
  const response = await fetch("/api/progress?type=challenge");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch challenge progress: ${response.status}`);
  }
  
  const data: ProgressResponse = await response.json();
  
  if (!data.success) {
    throw new Error("Failed to fetch challenge progress from API");
  }
  
  return (data.progress || []) as ChallengeProgress[];
};

const fetchProjectProgress = async (): Promise<ProjectProgress[]> => {
  const response = await fetch("/api/progress?type=project");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch project progress: ${response.status}`);
  }
  
  const data: ProgressResponse = await response.json();
  
  if (!data.success) {
    throw new Error("Failed to fetch project progress from API");
  }
  
  return (data.progress || []) as ProjectProgress[];
};

const fetchProgressStats = async (): Promise<ProgressStats> => {
  const response = await fetch("/api/progress?type=stats");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch progress stats: ${response.status}`);
  }
  
  const data: ProgressResponse = await response.json();
  
  if (!data.success) {
    throw new Error("Failed to fetch progress stats from API");
  }
  
  return data.stats as ProgressStats;
};

// Hook for fetching tutorial progress
export const useTutorialProgress = (userId?: string) => {
  return useQuery({
    queryKey: ["progress", "tutorial", userId],
    queryFn: fetchTutorialProgress,
    enabled: !!userId, // Only run if user is logged in
    staleTime: 2 * 60 * 1000, // 2 minutes - progress changes more frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true, // Refetch when user comes back to track progress
    select: (data: TutorialProgress[]) => {
      // Convert array to object with tutorialId as key for easier lookup
      const progressMap: Record<string, TutorialProgress> = {};
      data.forEach((p) => {
        progressMap[p.tutorialId] = p;
      });
      return progressMap;
    },
  });
};

// Hook for fetching challenge progress
export const useChallengeProgress = (userId?: string) => {
  return useQuery({
    queryKey: ["progress", "challenge", userId],
    queryFn: fetchChallengeProgress,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true,
    select: (data: ChallengeProgress[]) => {
      // Convert array to object with challengeId as key
      const progressMap: Record<string, ChallengeProgress> = {};
      data.forEach((p) => {
        progressMap[p.challengeId] = p;
      });
      return progressMap;
    },
  });
};

// Hook for fetching project progress
export const useProjectProgress = (userId?: string) => {
  return useQuery({
    queryKey: ["progress", "project", userId],
    queryFn: fetchProjectProgress,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true,
    select: (data: ProjectProgress[]) => {
      // Convert array to object with projectId as key
      const progressMap: Record<string, ProjectProgress> = {};
      data.forEach((p) => {
        progressMap[p.projectId] = p;
      });
      return progressMap;
    },
  });
};

// Hook for fetching dashboard progress stats
export const useProgressStats = (userId?: string) => {
  return useQuery({
    queryKey: ["progress", "stats", userId],
    queryFn: fetchProgressStats,
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute - stats should be relatively fresh
    gcTime: 3 * 60 * 1000, // 3 minutes
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

export type { TutorialProgress, ChallengeProgress, ProjectProgress, ProgressStats };
