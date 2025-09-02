"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Hook to synchronize progress updates across all related queries
 * Use this when any content (tutorial, quiz, challenge, project) is completed
 */
export const useProgressSync = () => {
  const queryClient = useQueryClient();

  const syncProgress = useCallback(async () => {
    // Invalidate all progress-related queries
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["study-plan"] }),
      queryClient.invalidateQueries({ queryKey: ["tutorial-progress"] }),
      queryClient.invalidateQueries({ queryKey: ["challenge-progress"] }),
      queryClient.invalidateQueries({ queryKey: ["project-progress"] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
      queryClient.invalidateQueries({ queryKey: ["user-stats"] }),
      queryClient.invalidateQueries({ queryKey: ["achievements"] }),
      queryClient.invalidateQueries({ queryKey: ["certificates"] }),
    ]);
  }, [queryClient]);

  const forceRefresh = useCallback(async () => {
    // Force immediate refetch of critical queries
    await Promise.all([
      queryClient.refetchQueries({ 
        queryKey: ["study-plan"],
        type: 'active'
      }),
      queryClient.refetchQueries({ 
        queryKey: ["dashboard"],
        type: 'active'
      }),
    ]);
  }, [queryClient]);

  return {
    syncProgress,
    forceRefresh,
  };
};