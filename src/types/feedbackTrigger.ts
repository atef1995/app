/**
 * Feedback Trigger System Types
 *
 * Defines types for the intelligent feedback modal triggering system.
 * This system shows feedback modals after first tutorial completion,
 * then periodically (every 3-5 tutorials) to gather user insights
 * without being annoying.
 */

/**
 * Configuration for feedback trigger behavior
 */
export interface FeedbackTriggerConfig {
  /** Show feedback after first tutorial completion */
  showAfterFirst: boolean;
  /** Minimum interval between feedback prompts (in tutorials completed) */
  minInterval: number;
  /** Maximum interval between feedback prompts (in tutorials completed) */
  maxInterval: number;
  /** Whether to use variable intervals (prevents predictability) */
  useVariableIntervals: boolean;
  /** Respect user dismissals for current session */
  respectSessionDismissals: boolean;
}

/**
 * User's feedback submission history
 */
export interface FeedbackHistory {
  /** Total number of tutorials completed */
  tutorialsCompleted: number;
  /** Number of tutorials completed since last feedback shown */
  tutorialsSinceLastFeedback: number;
  /** Timestamp of last feedback submission */
  lastFeedbackAt?: string;
  /** Timestamp of last feedback modal shown */
  lastShownAt?: string;
  /** Whether feedback was dismissed in current session */
  dismissedThisSession: boolean;
  /** List of tutorial IDs that triggered feedback */
  feedbackTutorialIds: string[];
  /** Next tutorial count when feedback should be shown */
  nextFeedbackTriggerAt: number;
}

/**
 * Current state of feedback trigger system
 */
export interface FeedbackTriggerState {
  /** Whether feedback modal should be shown */
  shouldShow: boolean;
  /** Reason for showing/not showing feedback */
  reason: FeedbackTriggerReason;
  /** Current feedback history */
  history: FeedbackHistory;
  /** Configuration being used */
  config: FeedbackTriggerConfig;
}

/**
 * Reasons why feedback modal is shown or not shown
 */
export type FeedbackTriggerReason =
  | "first_tutorial_completed"
  | "interval_reached"
  | "dismissed_this_session"
  | "too_soon"
  | "no_completion_yet"
  | "already_submitted"
  | "user_preference_disabled";

/**
 * Event triggered when tutorial is completed
 */
export interface TutorialCompletionEvent {
  /** Tutorial ID that was completed */
  tutorialId: string;
  /** Tutorial slug */
  tutorialSlug: string;
  /** Tutorial title */
  tutorialTitle: string;
  /** Quiz ID if quiz was completed */
  quizId?: string;
  /** User ID (undefined for anonymous) */
  userId?: string;
  /** Timestamp of completion */
  completedAt: Date;
}

/**
 * Feedback eligibility check response from API
 */
export interface FeedbackEligibilityResponse {
  /** Whether user is eligible to submit feedback for this tutorial */
  eligible: boolean;
  /** Whether user has already submitted feedback for this tutorial */
  hasSubmittedForTutorial: boolean;
  /** Total feedback submissions by user */
  totalSubmissions: number;
  /** Reason for eligibility status */
  reason?: string;
}

/**
 * Default configuration values
 */
export const DEFAULT_FEEDBACK_CONFIG: FeedbackTriggerConfig = {
  showAfterFirst: true,
  minInterval: 3,
  maxInterval: 5,
  useVariableIntervals: true,
  respectSessionDismissals: true,
};

/**
 * LocalStorage key prefix for feedback data
 */
export const FEEDBACK_STORAGE_PREFIX = "vibed_feedback";
