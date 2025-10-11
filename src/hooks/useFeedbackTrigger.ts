/**
 * useFeedbackTrigger Hook
 *
 * Custom React hook for managing feedback modal triggering.
 * Handles the complete lifecycle of feedback collection including:
 * - Determining when to show feedback modal
 * - Tracking tutorial completions
 * - Managing user dismissals
 * - Persisting state across sessions
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  FeedbackHistory,
  FeedbackTriggerConfig,
  FeedbackTriggerState,
  TutorialCompletionEvent,
  DEFAULT_FEEDBACK_CONFIG,
} from "@/types/feedbackTrigger";
import {
  shouldShowFeedback,
  loadFeedbackHistory,
  saveFeedbackHistory,
  updateFeedbackHistoryOnCompletion,
  updateFeedbackHistoryOnSubmission,
  updateFeedbackHistoryOnDismissal,
  hasEnoughTimePassed,
} from "@/lib/feedbackTriggerLogic";
import { checkFeedbackEligibility } from "@/lib/services/feedbackService";

interface UseFeedbackTriggerOptions {
  /** Custom configuration (optional) */
  config?: Partial<FeedbackTriggerConfig>;
  /** Minimum hours between feedback prompts */
  minHoursBetweenPrompts?: number;
}

interface UseFeedbackTriggerReturn {
  /** Whether feedback modal should be shown */
  shouldShowModal: boolean;
  /** Current feedback history */
  history: FeedbackHistory;
  /** Current tutorial context for feedback */
  currentTutorial: TutorialCompletionEvent | null;
  /** Function to call when tutorial is completed */
  onTutorialComplete: (event: TutorialCompletionEvent) => void;
  /** Function to call when feedback is submitted */
  onFeedbackSubmit: (tutorialId: string) => void;
  /** Function to call when modal is dismissed */
  onFeedbackDismiss: () => void;
  /** Function to manually show feedback modal */
  showFeedbackModal: (tutorial: TutorialCompletionEvent) => void;
  /** Loading state for eligibility check */
  isCheckingEligibility: boolean;
}

/**
 * Hook for managing feedback modal triggering based on tutorial completions
 *
 * @param options - Configuration options
 * @returns Feedback trigger state and handlers
 */
export function useFeedbackTrigger(
  options: UseFeedbackTriggerOptions = {}
): UseFeedbackTriggerReturn {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Merge custom config with defaults (memoized to prevent re-renders)
  const config: FeedbackTriggerConfig = useMemo(
    () => ({
      ...DEFAULT_FEEDBACK_CONFIG,
      ...options.config,
    }),
    [options.config]
  );

  // State management
  const [history, setHistory] = useState<FeedbackHistory>(() =>
    loadFeedbackHistory(userId)
  );
  const [triggerState, setTriggerState] = useState<FeedbackTriggerState | null>(null);
  const [currentTutorial, setCurrentTutorial] = useState<TutorialCompletionEvent | null>(
    null
  );
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  // Load history from localStorage on mount and when user changes
  useEffect(() => {
    const loadedHistory = loadFeedbackHistory(userId);
    setHistory(loadedHistory);
  }, [userId]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveFeedbackHistory(history, userId);
  }, [history, userId]);

  /**
   * Check if feedback should be shown and verify eligibility
   */
  const checkShouldShow = useCallback(
    async (tutorialId: string): Promise<boolean> => {
      // Calculate trigger state
      const state = shouldShowFeedback(history, config);

      // Additional time-based check
      const timePassed = hasEnoughTimePassed(
        history,
        options.minHoursBetweenPrompts
      );

      if (!state.shouldShow || !timePassed) {
        return false;
      }

      // Check eligibility with API (only for authenticated users)
      if (userId) {
        setIsCheckingEligibility(true);
        try {
          const eligibility = await checkFeedbackEligibility(tutorialId);
          setIsCheckingEligibility(false);

          // Don't show if already submitted for this tutorial
          if (eligibility.hasSubmittedForTutorial) {
            return false;
          }

          return eligibility.eligible;
        } catch (error) {
          setIsCheckingEligibility(false);
          console.error("Failed to check eligibility:", error);
          // Allow feedback on error (graceful degradation)
          return true;
        }
      }

      return true;
    },
    [history, config, userId, options.minHoursBetweenPrompts]
  );

  /**
   * Handle tutorial completion event
   */
  const onTutorialComplete = useCallback(
    async (event: TutorialCompletionEvent) => {
      // Update history with new completion
      const updatedHistory = updateFeedbackHistoryOnCompletion(
        history,
        event.tutorialId,
        config
      );
      setHistory(updatedHistory);

      // Check if feedback should be shown
      const shouldShow = await checkShouldShow(event.tutorialId);

      if (shouldShow) {
        setCurrentTutorial(event);
        const state = shouldShowFeedback(updatedHistory, config);
        setTriggerState(state);
      }
    },
    [history, config, checkShouldShow]
  );

  /**
   * Handle feedback submission
   */
  const onFeedbackSubmit = useCallback(
    (tutorialId: string) => {
      const updatedHistory = updateFeedbackHistoryOnSubmission(
        history,
        tutorialId,
        config
      );
      setHistory(updatedHistory);
      setCurrentTutorial(null);
      setTriggerState(null);
    },
    [history, config]
  );

  /**
   * Handle feedback dismissal
   */
  const onFeedbackDismiss = useCallback(() => {
    const updatedHistory = updateFeedbackHistoryOnDismissal(history);
    setHistory(updatedHistory);
    setCurrentTutorial(null);
    setTriggerState(null);
  }, [history]);

  /**
   * Manually show feedback modal for a specific tutorial
   */
  const showFeedbackModal = useCallback(
    async (tutorial: TutorialCompletionEvent) => {
      const shouldShow = await checkShouldShow(tutorial.tutorialId);

      if (shouldShow) {
        setCurrentTutorial(tutorial);
        const state = shouldShowFeedback(history, config);
        setTriggerState(state);
      }
    },
    [history, config, checkShouldShow]
  );

  return {
    shouldShowModal: triggerState?.shouldShow || false,
    history,
    currentTutorial,
    onTutorialComplete,
    onFeedbackSubmit,
    onFeedbackDismiss,
    showFeedbackModal,
    isCheckingEligibility,
  };
}
