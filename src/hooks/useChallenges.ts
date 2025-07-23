"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllChallenges as getAllChallengesFromLib,
  getFilteredChallenges as getFilteredChallengesFromLib,
} from "@/lib/challengeData";

interface ChallengeFilters {
  type?: string;
  difficulty?: string;
}

// Hook for fetching all challenges
export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: getAllChallengesFromLib,
    staleTime: 5 * 60 * 1000, // 5 minutes - challenges don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching filtered challenges
export const useFilteredChallenges = (filters: ChallengeFilters) => {
  return useQuery({
    queryKey: ["challenges", "filtered", filters],
    queryFn: () => getFilteredChallengesFromLib(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!(filters.type || filters.difficulty), // Only run if there are actual filters
  });
};

// Hook that automatically chooses between all challenges or filtered based on filters
export const useChallengesWithFilters = (filters: ChallengeFilters) => {
  const hasFilters = !!(
    (filters.type && filters.type !== "all") ||
    (filters.difficulty && filters.difficulty !== "all")
  );

  const allChallengesQuery = useChallenges();
  const filteredChallengesQuery = useFilteredChallenges({
    type: filters.type === "all" ? undefined : filters.type,
    difficulty: filters.difficulty === "all" ? undefined : filters.difficulty,
  });

  // Return the appropriate query based on whether filters are applied
  if (hasFilters) {
    return {
      data: filteredChallengesQuery.data || [],
      isLoading: filteredChallengesQuery.isLoading,
      error: filteredChallengesQuery.error,
      isError: filteredChallengesQuery.isError,
      refetch: filteredChallengesQuery.refetch,
    };
  }

  return {
    data: allChallengesQuery.data || [],
    isLoading: allChallengesQuery.isLoading,
    error: allChallengesQuery.error,
    isError: allChallengesQuery.isError,
    refetch: allChallengesQuery.refetch,
  };
};

export type { ChallengeFilters };
