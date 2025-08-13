import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ProjectWithDetails,
  ProjectSubmissionWithDetails,
  ProjectReviewAssignmentWithDetails,
  CreateProjectSubmissionRequest,
  ProjectReviewRequest,
} from "@/types/project";

// Fetch functions
const fetchProjects = async (category?: string): Promise<ProjectWithDetails[]> => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  
  const response = await fetch(`/api/projects?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error?.message || "Failed to fetch projects");
  }

  return data.data;
};

const fetchProject = async (slug: string): Promise<ProjectWithDetails> => {
  const response = await fetch(`/api/projects/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch project");
  }

  return data.data;
};

const fetchUserSubmission = async (slug: string): Promise<ProjectSubmissionWithDetails | null> => {
  const response = await fetch(`/api/projects/${slug}/submit`);
  if (!response.ok) {
    throw new Error("Failed to fetch submission");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch submission");
  }

  return data.data;
};

const fetchReviewAssignments = async (status?: string[]): Promise<ProjectReviewAssignmentWithDetails[]> => {
  const params = new URLSearchParams();
  if (status && status.length > 0) {
    params.set("status", status.join(","));
  }
  
  const response = await fetch(`/api/projects/reviews?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch review assignments");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch review assignments");
  }

  return data.data;
};

const fetchShowcaseSubmissions = async (
  category?: string,
  limit?: number
): Promise<ProjectSubmissionWithDetails[]> => {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (limit) params.set("limit", limit.toString());
  
  const response = await fetch(`/api/projects/showcase?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch showcase submissions");
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch showcase submissions");
  }

  return data.data;
};

// Submit functions
const submitProject = async (
  slug: string,
  data: {
    title?: string;
    description?: string;
    submissionUrl?: string;
    sourceCode?: string;
    notes?: string;
    status?: "DRAFT" | "SUBMITTED";
  }
): Promise<ProjectSubmissionWithDetails> => {
  const response = await fetch(`/api/projects/${slug}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to submit project");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Failed to submit project");
  }

  return result.data;
};

const acceptReviewAssignment = async (assignmentId: string): Promise<void> => {
  const response = await fetch(`/api/projects/reviews/${assignmentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "accept" }),
  });

  if (!response.ok) {
    throw new Error("Failed to accept review assignment");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Failed to accept review assignment");
  }
};

const submitReview = async (
  assignmentId: string,
  reviewData: {
    overallScore: number;
    criteriaScores: Record<string, number>;
    strengths?: string;
    improvements?: string;
    suggestions?: string;
    timeSpent?: number;
  }
): Promise<void> => {
  const response = await fetch(`/api/projects/reviews/${assignmentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "submit", ...reviewData }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit review");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || "Failed to submit review");
  }
};

// Custom hooks
export const useProjects = (category?: string) => {
  return useQuery({
    queryKey: ["projects", category],
    queryFn: () => fetchProjects(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useProject = (slug: string) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: () => fetchProject(slug),
    enabled: Boolean(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useUserSubmission = (slug: string) => {
  return useQuery({
    queryKey: ["submission", slug],
    queryFn: () => fetchUserSubmission(slug),
    enabled: Boolean(slug),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useReviewAssignments = (status?: string[]) => {
  return useQuery({
    queryKey: ["review-assignments", status],
    queryFn: () => fetchReviewAssignments(status),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useShowcaseSubmissions = (category?: string, limit?: number) => {
  return useQuery({
    queryKey: ["showcase", category, limit],
    queryFn: () => fetchShowcaseSubmissions(category, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubmitProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: CreateProjectSubmissionRequest }) =>
      submitProject(slug, data),
    onSuccess: (_, { slug }) => {
      // Invalidate and refetch submission data
      queryClient.invalidateQueries({ queryKey: ["submission", slug] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAcceptReviewAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptReviewAssignment,
    onSuccess: () => {
      // Invalidate review assignments
      queryClient.invalidateQueries({ queryKey: ["review-assignments"] });
    },
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, reviewData }: { assignmentId: string; reviewData: ProjectReviewRequest }) =>
      submitReview(assignmentId, reviewData),
    onSuccess: () => {
      // Invalidate review assignments and showcase
      queryClient.invalidateQueries({ queryKey: ["review-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["showcase"] });
    },
  });
};

// Export types for convenience
export type {
  ProjectWithDetails,
  ProjectSubmissionWithDetails,
  ProjectReviewAssignmentWithDetails,
};