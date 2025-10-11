/**
 * Feedback Trigger Logic Utilities
 *
 * Pure functions for calculating when to show feedback modals.
 * These functions are stateless and testable, handling the core
 * business logic for feedback triggering.
 */

import {
  FeedbackHistory,
  FeedbackTriggerConfig,
  FeedbackTriggerState,
  FeedbackTriggerReason,
  DEFAULT_FEEDBACK_CONFIG,
  FEEDBACK_STORAGE_PREFIX,
} from "@/types/feedbackTrigger";

/**
 * Calculate if feedback modal should be shown based on completion count and history
 *
 * @param history - User's feedback history
 * @param config - Feedback trigger configuration
 * @returns State indicating whether to show feedback and why
 */
export function shouldShowFeedback(
  history: FeedbackHistory,
  config: FeedbackTriggerConfig = DEFAULT_FEEDBACK_CONFIG
): FeedbackTriggerState {
  // Don't show if dismissed this session
  if (config.respectSessionDismissals && history.dismissedThisSession) {
    return {
      shouldShow: false,
      reason: "dismissed_this_session",
      history,
      config,
    };
  }

  // Show after first tutorial completion
  if (config.showAfterFirst && history.tutorialsCompleted === 1) {
    return {
      shouldShow: true,
      reason: "first_tutorial_completed",
      history,
      config,
    };
  }

  // Check if interval has been reached
  if (history.tutorialsCompleted >= history.nextFeedbackTriggerAt) {
    return {
      shouldShow: true,
      reason: "interval_reached",
      history,
      config,
    };
  }

  // Too soon to show feedback
  return {
    shouldShow: false,
    reason: "too_soon",
    history,
    config,
  };
}

/**
 * Calculate the next trigger point using variable intervals
 * This prevents users from predicting when feedback will appear
 *
 * @param currentCount - Current number of tutorials completed
 * @param config - Feedback trigger configuration
 * @returns Next tutorial count when feedback should trigger
 */
export function calculateNextTriggerPoint(
  currentCount: number,
  config: FeedbackTriggerConfig = DEFAULT_FEEDBACK_CONFIG
): number {
  if (config.useVariableIntervals) {
    // Generate a random interval between min and max
    const interval =
      Math.floor(Math.random() * (config.maxInterval - config.minInterval + 1)) +
      config.minInterval;
    return currentCount + interval;
  }

  // Use fixed interval (minInterval)
  return currentCount + config.minInterval;
}

/**
 * Initialize default feedback history for new users
 *
 * @returns Fresh feedback history object
 */
export function initializeFeedbackHistory(): FeedbackHistory {
  return {
    tutorialsCompleted: 0,
    tutorialsSinceLastFeedback: 0,
    dismissedThisSession: false,
    feedbackTutorialIds: [],
    nextFeedbackTriggerAt: 1, // First tutorial triggers feedback
  };
}

/**
 * Update feedback history after tutorial completion
 *
 * @param history - Current feedback history
 * @param tutorialId - ID of completed tutorial
 * @param config - Feedback trigger configuration
 * @returns Updated feedback history
 */
export function updateFeedbackHistoryOnCompletion(
  history: FeedbackHistory,
  tutorialId: string,
  config: FeedbackTriggerConfig = DEFAULT_FEEDBACK_CONFIG
): FeedbackHistory {
  const newCount = history.tutorialsCompleted + 1;
  const newSinceLastFeedback = history.tutorialsSinceLastFeedback + 1;

  return {
    ...history,
    tutorialsCompleted: newCount,
    tutorialsSinceLastFeedback: newSinceLastFeedback,
  };
}

/**
 * Update feedback history after user submits feedback
 *
 * @param history - Current feedback history
 * @param tutorialId - ID of tutorial for which feedback was given
 * @param config - Feedback trigger configuration
 * @returns Updated feedback history
 */
export function updateFeedbackHistoryOnSubmission(
  history: FeedbackHistory,
  tutorialId: string,
  config: FeedbackTriggerConfig = DEFAULT_FEEDBACK_CONFIG
): FeedbackHistory {
  const now = new Date().toISOString();
  const nextTrigger = calculateNextTriggerPoint(history.tutorialsCompleted, config);

  return {
    ...history,
    tutorialsSinceLastFeedback: 0,
    lastFeedbackAt: now,
    lastShownAt: now,
    dismissedThisSession: false,
    feedbackTutorialIds: [...history.feedbackTutorialIds, tutorialId],
    nextFeedbackTriggerAt: nextTrigger,
  };
}

/**
 * Update feedback history after user dismisses modal
 *
 * @param history - Current feedback history
 * @returns Updated feedback history with dismissal recorded
 */
export function updateFeedbackHistoryOnDismissal(
  history: FeedbackHistory
): FeedbackHistory {
  const now = new Date().toISOString();

  return {
    ...history,
    dismissedThisSession: true,
    lastShownAt: now,
  };
}

/**
 * Generate localStorage key for feedback data
 *
 * @param userId - User ID (optional for anonymous)
 * @param suffix - Key suffix (e.g., 'history', 'config')
 * @returns Full localStorage key
 */
export function getFeedbackStorageKey(userId?: string, suffix: string = "history"): string {
  const userPart = userId || "anonymous";
  return `${FEEDBACK_STORAGE_PREFIX}_${userPart}_${suffix}`;
}

/**
 * Load feedback history from localStorage
 *
 * @param userId - User ID (optional for anonymous)
 * @returns Feedback history or initialized default
 */
export function loadFeedbackHistory(userId?: string): FeedbackHistory {
  if (typeof window === "undefined") {
    return initializeFeedbackHistory();
  }

  try {
    const key = getFeedbackStorageKey(userId);
    const stored = localStorage.getItem(key);

    if (stored) {
      const parsed = JSON.parse(stored);
      // Reset session dismissal on page load
      return { ...parsed, dismissedThisSession: false };
    }
  } catch (error) {
    console.error("Failed to load feedback history:", error);
  }

  return initializeFeedbackHistory();
}

/**
 * Save feedback history to localStorage
 *
 * @param history - Feedback history to save
 * @param userId - User ID (optional for anonymous)
 */
export function saveFeedbackHistory(history: FeedbackHistory, userId?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const key = getFeedbackStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save feedback history:", error);
  }
}

/**
 * Reset feedback dismissal for new session
 * Useful when user navigates away and comes back
 *
 * @param userId - User ID (optional for anonymous)
 */
export function resetSessionDismissal(userId?: string): void {
  const history = loadFeedbackHistory(userId);
  if (history.dismissedThisSession) {
    saveFeedbackHistory(
      { ...history, dismissedThisSession: false },
      userId
    );
  }
}

/**
 * Check if enough time has passed since last feedback
 * Prevents showing feedback too frequently based on time
 *
 * @param history - Current feedback history
 * @param minHours - Minimum hours between feedback prompts
 * @returns Whether enough time has passed
 */
export function hasEnoughTimePassed(
  history: FeedbackHistory,
  minHours: number = 24
): boolean {
  if (!history.lastShownAt) {
    return true;
  }

  const lastShown = new Date(history.lastShownAt);
  const now = new Date();
  const hoursSince = (now.getTime() - lastShown.getTime()) / (1000 * 60 * 60);

  return hoursSince >= minHours;
}
