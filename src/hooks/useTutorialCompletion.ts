"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseTutorialCompletionParams {
  tutorialId?: string;
  canAccess: boolean;
}

interface TutorialCompletionResponse {
  success: boolean;
  progress: any;
  achievements?: any[];
}

const completeTutorial = async (tutorialId: string): Promise<TutorialCompletionResponse> => {
  const response = await fetch("/api/tutorial/complete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tutorialId }),
  });

  if (!response.ok) {
    throw new Error("Failed to complete tutorial");
  }

  return response.json();
};

export function useTutorialCompletion({ 
  tutorialId, 
  canAccess 
}: UseTutorialCompletionParams) {
  const [hasCompletedReading, setHasCompletedReading] = useState(false);
  const queryClient = useQueryClient();

  const completionMutation = useMutation({
    mutationFn: completeTutorial,
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["tutorial-progress"] });
      queryClient.invalidateQueries({ queryKey: ["study-plan"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      
      // Show achievements if any
      if (data.achievements && data.achievements.length > 0) {
        // You could show a toast or modal here
        console.log("🎉 Achievements unlocked:", data.achievements);
      }
    },
    onError: (error) => {
      console.error("Failed to complete tutorial:", error);
    },
  });

  // Auto-complete tutorial when user scrolls to bottom (reading completion heuristic)
  useEffect(() => {
    if (!tutorialId || !canAccess || hasCompletedReading) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Consider tutorial "read" when user scrolls to 70% of the content
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      
      if (scrollPercentage >= 0.7 && !hasCompletedReading) {
        setHasCompletedReading(true);
        completionMutation.mutate(tutorialId);
      }
    };

    // Add scroll listener with debounce
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 300);
    };

    window.addEventListener("scroll", debouncedHandleScroll);
    
    return () => {
      window.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [tutorialId, canAccess, hasCompletedReading, completionMutation]);

  const manualComplete = () => {
    if (tutorialId && canAccess && !hasCompletedReading) {
      setHasCompletedReading(true);
      completionMutation.mutate(tutorialId);
    }
  };

  return {
    isCompleting: completionMutation.isPending,
    hasCompletedReading,
    manualComplete,
  };
}