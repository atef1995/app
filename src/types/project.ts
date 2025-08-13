import { 
  BaseEntity, 
  BaseProgress, 
  ProjectSubmissionStatus, 
  ProjectSubmissionType, 
  ProjectReviewType, 
  ProjectReviewStatus,
  ReviewAssignmentStatus,
  RequirementType,
  RequirementPriority,
  ResourceType,
  SubscriptionPlan 
} from './common';
import { Prisma } from '@prisma/client';

export interface ProjectRequirement {
  id: string;
  title: string;
  description: string;
  type: RequirementType;
  priority: RequirementPriority;
  points?: number;
}

export interface ProjectResource {
  id: string;
  title: string;
  url: string;
  type: ResourceType;
  description?: string;
}

export interface ProjectRubricCriteria {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
  weight: number; // 0-1, how much this criteria affects overall score
}

export interface ProjectWithDetails extends BaseEntity {
  slug: string;
  title: string;
  description: string;
  requirements: ProjectRequirement[];
  category: string;
  difficulty: number;
  estimatedHours: number;
  order: number;
  published: boolean;
  isPremium: boolean;
  requiredPlan: SubscriptionPlan;
  submissionType: ProjectSubmissionType;
  reviewType: ProjectReviewType;
  minReviews: number;
  dueDate: Date | null;
  resources: ProjectResource[];
  rubric: ProjectRubricCriteria[];
  _count?: {
    submissions: number;
  };
}

export interface ProjectSubmissionWithDetails extends BaseEntity {
  userId: string;
  projectId: string;
  title: string | null;
  description: string | null;
  submissionUrl: string | null;
  submissionFiles: unknown;
  sourceCode: string | null;
  notes: string | null;
  status: ProjectSubmissionStatus;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  grade: number | null;
  isPublic: boolean;
  allowFeedback: boolean;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  project: {
    id: string;
    title: string;
    category: string;
    difficulty: number;
  };
  reviews: ProjectReviewWithDetails[];
  _count?: {
    reviews: number;
  };
}

export interface ProjectReviewWithDetails extends BaseEntity {
  submissionId: string;
  reviewerId: string;
  assignmentId: string | null;
  type: ProjectReviewType;
  status: ProjectReviewStatus;
  overallScore: number | null;
  criteriaScores: Record<string, number>;
  strengths: string | null;
  improvements: string | null;
  suggestions: string | null;
  isConstructive: boolean | null;
  timeSpent: number | null;
  submittedAt: Date | null;
  reviewer: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
}

export interface ProjectReviewAssignmentWithDetails extends BaseEntity {
  submissionId: string;
  reviewerId: string;
  assignedBy: string;
  priority: number;
  status: ReviewAssignmentStatus;
  dueDate: Date;
  acceptedAt: Date | null;
  completedAt: Date | null;
  declinedReason: string | null;
  remindersSent: number;
  reviewer: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  submission: {
    id: string;
    title: string | null;
    project: {
      id: string;
      title: string;
    };
    user: {
      id: string;
      name: string | null;
      username: string | null;
    };
  };
}

export interface ProjectProgress extends BaseProgress {
  projectId: string;
  submissionStatus: ProjectSubmissionStatus;
  grade: number | null;
}

// API request/response types
export interface CreateProjectSubmissionRequest {
  title?: string;
  description?: string;
  submissionUrl?: string;
  submissionFiles?: Prisma.InputJsonValue;
  sourceCode?: string;
  notes?: string;
  status?: "DRAFT" | "SUBMITTED";
}

export interface ProjectReviewRequest {
  overallScore: number;
  criteriaScores: Record<string, number>;
  strengths?: string;
  improvements?: string;
  suggestions?: string;
  timeSpent?: number;
}

export interface ProjectStats {
  completed: number;
  inProgress: number;
  notStarted: number;
  total: number;
  recentActivity: ProjectSubmissionWithDetails[];
}