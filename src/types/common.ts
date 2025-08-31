// Common types used across the application

export type ContentType = "tutorial" | "quiz" | "challenge" | "project";

export type SubscriptionPlan = "FREE" | "VIBED" | "CRACKED";

export type CompletionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "FAILED";

export type ProjectSubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "REVIEWED"
  | "APPROVED"
  | "NEEDS_REVISION";

export type ProjectSubmissionType = "CODE" | "LINK" | "FILE";

export type ProjectReviewType = "PEER" | "INSTRUCTOR" | "SELF" | "AUTO";

export type ProjectReviewStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "OVERDUE";

export type ReviewAssignmentStatus =
  | "ASSIGNED"
  | "ACCEPTED"
  | "DECLINED"
  | "COMPLETED"
  | "OVERDUE";

export type AchievementAction =
  | "QUIZ_COMPLETED"
  | "CHALLENGE_COMPLETED"
  | "PROJECT_COMPLETED"
  | "TUTORIAL_STARTED"
  | "STREAK_UPDATED"
  | "POINTS_EARNED"
  | "TUTORIAL_COMPLETED";

export type RequirementType = "FEATURE" | "TECHNICAL" | "DESIGN" | "TESTING";

export type RequirementPriority = "MUST_HAVE" | "SHOULD_HAVE" | "NICE_TO_HAVE";

export type ResourceType = "DOCUMENTATION" | "TUTORIAL" | "EXAMPLE" | "TOOL";

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Progress tracking
export interface BaseProgress extends BaseEntity {
  userId: string;
  status: CompletionStatus;
  timeSpent?: number;
  completedAt?: Date | null;
}

// Achievement metadata interface
export interface AchievementMetadata {
  score?: number;
  grade?: number;
  timeSpent?: number;
  streak?: number;
  points?: number;
  difficulty?: string;
  mood?: string;
  tutorialId?: string;
  challengeId?: string;
  projectId?: string;
}
