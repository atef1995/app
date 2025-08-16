"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

export interface CodeProgressData {
  challengeId: string;
  code: string;
  lastModified: Date;
}

export interface SaveStatus {
  status: "idle" | "saving" | "saved" | "error";
  message?: string;
}

interface UseCodeProgressProps {
  challengeId: string;
  initialCode: string;
  autoSaveDelay?: number; // milliseconds
}

export function useCodeProgress({
  challengeId,
  initialCode,
  autoSaveDelay = 2000, // 2 seconds default
}: UseCodeProgressProps) {
  const { data: session } = useSession();
  const [code, setCode] = useState(initialCode);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ status: "idle" });
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedCodeRef = useRef(initialCode);

  // Load saved progress on mount
  useEffect(() => {
    if (!session?.user?.id || hasLoadedProgress || !challengeId) return;

    const loadProgress = async () => {
      try {
        const response = await fetch(
          `/api/challenge/progress?challengeId=${challengeId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.code) {
            setCode(data.data.code);
            lastSavedCodeRef.current = data.data.code;
          }
        }
      } catch (error) {
        console.error("Failed to load code progress:", error);
      } finally {
        setHasLoadedProgress(true);
      }
    };

    loadProgress();
  }, [challengeId, session?.user?.id, hasLoadedProgress]);

  // Debounced save function
  const saveProgress = useCallback(async (codeToSave: string) => {
    if (!session?.user?.id || !challengeId || codeToSave === lastSavedCodeRef.current) {
      return;
    }

    setSaveStatus({ status: "saving" });

    try {
      const response = await fetch("/api/challenge/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId,
          code: codeToSave,
        }),
      });

      if (response.ok) {
        lastSavedCodeRef.current = codeToSave;
        setSaveStatus({ status: "saved" });
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          setSaveStatus((prev) => 
            prev.status === "saved" ? { status: "idle" } : prev
          );
        }, 2000);
      } else {
        setSaveStatus({ 
          status: "error", 
          message: "Failed to save progress" 
        });
      }
    } catch (error) {
      console.error("Error saving code progress:", error);
      setSaveStatus({ 
        status: "error", 
        message: "Network error while saving" 
      });
    }
  }, [challengeId, session?.user?.id]);

  // Handle code changes with debounced saving
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Only auto-save if user is logged in and has loaded initial progress
    if (session?.user?.id && hasLoadedProgress && newCode.trim()) {
      // Reset error status when user starts typing
      if (saveStatus.status === "error") {
        setSaveStatus({ status: "idle" });
      }

      // Set up new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        saveProgress(newCode);
      }, autoSaveDelay);
    }
  }, [session?.user?.id, hasLoadedProgress, saveProgress, autoSaveDelay, saveStatus.status]);

  // Manual save function (for save button)
  const manualSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveProgress(code);
  }, [code, saveProgress]);

  // Check if code has unsaved changes
  const hasUnsavedChanges = code !== lastSavedCodeRef.current;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    code,
    setCode: handleCodeChange,
    saveStatus,
    hasUnsavedChanges,
    hasLoadedProgress,
    manualSave,
  };
}