/**
 * Types for the Contribution System
 *
 * Defines TypeScript interfaces for contribution projects,
 * features, submissions, and reviews.
 */

import type { Prisma } from "@prisma/client";

/**
 * Contribution project information
 */
export interface ContributionProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  estimatedHours: number;
  xpReward: number;
  isPremium: boolean;
  requiredPlan: string;
  features: ContributionFeature[];
  githubRepoUrl: string;
  createdAt: string;
  totalSubmissions?: number;
}

/**
 * Feature within a contribution project
 */
export interface ContributionFeature {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  estimatedHours: number;
  xpReward: number;
  requirements: string[];
  acceptanceCriteria: string[];
  testCases: string[];
}

/**
 * Feature with user submission status
 */
export interface ContributionFeatureWithStatus extends ContributionFeature {
  userStatus: string | null; // PR status: OPEN, MERGED, CLOSED, etc.
}

/**
 * Review criterion for evaluating submissions
 */
export interface ReviewCriterion {
  category: string;
  weight: number;
  criteria: string[];
}

/**
 * Required CI/CD check
 */
export interface RequiredCheck {
  name: string;
  description: string;
}

/**
 * Project features type (JSON field)
 */
export type ProjectFeatures = ContributionFeature[];

/**
 * Review criteria type (JSON field)
 */
export type ProjectReviewCriteria = ReviewCriterion[];

/**
 * Required checks type (JSON field)
 */
export type ProjectRequiredChecks = RequiredCheck[];

/**
 * Helper to cast Prisma JSON to proper types
 */
export function parseProjectFeatures(
  features: Prisma.JsonValue
): ContributionFeature[] {
  if (!Array.isArray(features)) {
    return [];
  }
  return features as unknown as ContributionFeature[];
}

export function parseReviewCriteria(
  criteria: Prisma.JsonValue
): ReviewCriterion[] {
  if (!Array.isArray(criteria)) {
    return [];
  }
  return criteria as unknown as ReviewCriterion[];
}

export function parseRequiredChecks(checks: Prisma.JsonValue): RequiredCheck[] {
  if (!Array.isArray(checks)) {
    return [];
  }
  return checks as unknown as RequiredCheck[];
}
