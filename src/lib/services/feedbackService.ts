/**
 * Feedback Service
 *
 * Service layer for handling all feedback-related API operations.
 * Follows single responsibility principle by managing only
 * feedback submission, retrieval, and eligibility checks.
 */

import {
  FeedbackSubmissionPayload,
  FeedbackSubmissionResponse,
  FeedbackCheckResponse,
} from "@/types/feedback";
import { FeedbackEligibilityResponse } from "@/types/feedbackTrigger";

/**
 * Submit user feedback for a tutorial
 *
 * @param payload - Feedback submission data
 * @returns Response with submission status and any achievements unlocked
 * @throws Error if submission fails
 */
export async function submitFeedback(
  payload: FeedbackSubmissionPayload
): Promise<FeedbackSubmissionResponse> {
  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to submit feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

/**
 * Check if user has already submitted feedback for a tutorial
 *
 * @param tutorialId - Tutorial ID to check
 * @returns Check response with submission status
 * @throws Error if check fails
 */
export async function checkFeedbackSubmission(
  tutorialId: string
): Promise<FeedbackCheckResponse> {
  try {
    const response = await fetch(
      `/api/feedback/check?tutorialId=${encodeURIComponent(tutorialId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to check feedback status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking feedback submission:", error);
    throw error;
  }
}

/**
 * Check if user is eligible to submit feedback
 * Considers submission history and platform rules
 *
 * @param tutorialId - Tutorial ID to check eligibility for
 * @returns Eligibility response with reason
 */
export async function checkFeedbackEligibility(
  tutorialId: string
): Promise<FeedbackEligibilityResponse> {
  try {
    const response = await fetch(
      `/api/feedback/eligibility?tutorialId=${encodeURIComponent(tutorialId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // If endpoint doesn't exist yet, assume eligible
      return {
        eligible: true,
        hasSubmittedForTutorial: false,
        totalSubmissions: 0,
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking feedback eligibility:", error);
    // Default to eligible on error
    return {
      eligible: true,
      hasSubmittedForTutorial: false,
      totalSubmissions: 0,
    };
  }
}

/**
 * Get user's feedback statistics
 * Useful for displaying engagement metrics
 *
 * @returns User feedback statistics
 */
export async function getUserFeedbackStats(): Promise<{
  totalSubmissions: number;
  averageRating: number;
  lastSubmissionDate?: string;
}> {
  try {
    const response = await fetch("/api/feedback/stats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch feedback stats");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching feedback stats:", error);
    return {
      totalSubmissions: 0,
      averageRating: 0,
    };
  }
}

/**
 * Update existing feedback submission
 * Allows users to revise their feedback
 *
 * @param feedbackId - ID of existing feedback
 * @param updates - Fields to update
 * @returns Updated feedback response
 */
export async function updateFeedback(
  feedbackId: string,
  updates: Partial<FeedbackSubmissionPayload>
): Promise<FeedbackSubmissionResponse> {
  try {
    const response = await fetch(`/api/feedback/${feedbackId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
}

/**
 * Delete user's feedback submission
 *
 * @param feedbackId - ID of feedback to delete
 * @returns Success status
 */
export async function deleteFeedback(feedbackId: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/feedback/${feedbackId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw error;
  }
}
