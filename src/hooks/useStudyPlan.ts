"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  DynamicStudyPlan,
  StudyPlanProgress,
} from "@/lib/services/studyPlanService";
import { devMode } from "@/lib/services/envService";

const debugMode = devMode();

interface StudyPlanData {
  studyPlan: DynamicStudyPlan;
  userProgress: StudyPlanProgress;
}

interface UpdateProgressParams {
  stepId: string;
  completed: boolean;
  hoursSpent?: number;
}

interface UpdateProgressResponse {
  userProgress: StudyPlanProgress;
  message: string;
}

const STUDY_PLAN_QUERY_KEY = ["study-plan"] as const;

// Fetch study plan data
const fetchStudyPlan = async (): Promise<StudyPlanData> => {
  const response = await fetch("/api/study-plan");
  if (!response.ok) {
    throw new Error("Failed to load study plan");
  }
  return response.json();
};

// Update step progress
const updateStepProgress = async ({
  stepId,
  completed,
  hoursSpent = 0,
}: UpdateProgressParams): Promise<UpdateProgressResponse> => {
  const response = await fetch("/api/study-plan/progress", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stepId,
      completed,
      hoursSpent,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update progress");
  }

  return response.json();
};

// Hook to fetch study plan data
export const useStudyPlan = () => {
  const { status } = useSession();

  return useQuery({
    queryKey: STUDY_PLAN_QUERY_KEY,
    queryFn: fetchStudyPlan,
    enabled: status === "authenticated", // Only fetch when authenticated
    staleTime: 30 * 1000, // 30 seconds - refresh more frequently to catch progress updates
    gcTime: 5 * 60 * 1000, // 5 minutes cache time
    retry: 2,
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchOnMount: "always", // Always refetch when component mounts
  });
};

// Hook to update step progress
export const useUpdateStepProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStepProgress,
    onSuccess: (data) => {
      // Update the cached study plan data with new progress
      queryClient.setQueryData(
        STUDY_PLAN_QUERY_KEY,
        (oldData: StudyPlanData | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            userProgress: data.userProgress,
          };
        }
      );

      // Optionally show success message
      if (debugMode) {
        console.log(data.message);
      }
    },
    onError: (error) => {
      console.error("Error updating progress:", error);
    },
  });
};

// Hook to get study plan query utilities
export const useStudyPlanUtils = () => {
  const queryClient = useQueryClient();

  const invalidateStudyPlan = () => {
    queryClient.invalidateQueries({ queryKey: STUDY_PLAN_QUERY_KEY });
  };

  const refetchStudyPlan = () => {
    queryClient.refetchQueries({ queryKey: STUDY_PLAN_QUERY_KEY });
  };

  const prefetchStudyPlan = () => {
    queryClient.prefetchQuery({
      queryKey: STUDY_PLAN_QUERY_KEY,
      queryFn: fetchStudyPlan,
      staleTime: 30 * 1000,
    });
  };

  // Force refresh study plan immediately
  const forceRefreshStudyPlan = async () => {
    await queryClient.refetchQueries({ 
      queryKey: STUDY_PLAN_QUERY_KEY,
      type: 'active'
    });
  };

  return {
    invalidateStudyPlan,
    refetchStudyPlan,
    prefetchStudyPlan,
    forceRefreshStudyPlan,
  };
};
