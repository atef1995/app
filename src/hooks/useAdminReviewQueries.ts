import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types for admin review management
interface AdminReviewAssignment {
  id: string;
  submissionId: string;
  reviewerId: string;
  priority: number;
  status: string;
  type: string;
  dueDate: Date;
  acceptedAt: Date | null;
  completedAt: Date | null;
  expiredAt: Date | null;
  rejectedAt: Date | null;
  rejectionReason: string | null;
  reviewer: {
    id: string;
    name: string | null;
    username: string | null;
    image: string | null;
  };
  submission: {
    id: string;
    title: string | null;
    status: string;
    submittedAt: Date | null;
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

interface AdminReviewStats {
  totalAssignments: number;
  pendingAssignments: number;
  acceptedAssignments: number;
  completedAssignments: number;
  expiredAssignments: number;
  rejectedAssignments: number;
  averageCompletionTime: number;
  submissionsAwaitingReview: number;
}

interface AdminSubmissionOverview {
  id: string;
  title: string | null;
  status: string;
  submittedAt: Date;
  reviewedAt: Date | null;
  grade: number | null;
  project: {
    id: string;
    title: string;
    minReviews: number;
  };
  user: {
    id: string;
    name: string | null;
    username: string | null;
  };
  reviewAssignments: {
    id: string;
    status: string;
    type: string;
    reviewer: {
      name: string | null;
      username: string | null;
    };
  }[];
  reviews: {
    id: string;
    overallScore: number | null;
    status: string;
    reviewer: {
      name: string | null;
    };
  }[];
}

// Fetch functions
const fetchAllReviewAssignments = async (): Promise<AdminReviewAssignment[]> => {
  const response = await fetch('/api/admin/review-assignments');
  if (!response.ok) {
    throw new Error('Failed to fetch review assignments');
  }
  const data = await response.json();
  return data.success ? data.data : [];
};

const fetchReviewStats = async (): Promise<AdminReviewStats> => {
  const response = await fetch('/api/admin/review-stats');
  if (!response.ok) {
    throw new Error('Failed to fetch review stats');
  }
  const data = await response.json();
  return data.success ? data.data : {
    totalAssignments: 0,
    pendingAssignments: 0,
    acceptedAssignments: 0,
    completedAssignments: 0,
    expiredAssignments: 0,
    rejectedAssignments: 0,
    averageCompletionTime: 0,
    submissionsAwaitingReview: 0,
  };
};

const fetchSubmissionOverviews = async (): Promise<AdminSubmissionOverview[]> => {
  const response = await fetch('/api/admin/submissions-overview');
  if (!response.ok) {
    throw new Error('Failed to fetch submissions overview');
  }
  const data = await response.json();
  return data.success ? data.data : [];
};

const assignAdminReviewer = async (submissionId: string, adminUserId?: string): Promise<void> => {
  const response = await fetch('/api/projects/reviews/admin-assign', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ submissionId, adminUserId }),
  });

  if (!response.ok) {
    throw new Error('Failed to assign admin reviewer');
  }
};

const reassignReview = async (assignmentId: string): Promise<void> => {
  const response = await fetch(`/api/admin/review-assignments/${assignmentId}/reassign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reassign review');
  }
};

const cancelAssignment = async (assignmentId: string): Promise<void> => {
  const response = await fetch(`/api/admin/review-assignments/${assignmentId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to cancel assignment');
  }
};

// Hooks
export const useAllReviewAssignments = () => {
  return useQuery({
    queryKey: ['admin', 'review-assignments'],
    queryFn: fetchAllReviewAssignments,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: ['admin', 'review-stats'],
    queryFn: fetchReviewStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubmissionOverviews = () => {
  return useQuery({
    queryKey: ['admin', 'submissions-overview'],
    queryFn: fetchSubmissionOverviews,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAssignAdminReviewer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ submissionId, adminUserId }: { submissionId: string; adminUserId?: string }) =>
      assignAdminReviewer(submissionId, adminUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'submissions-overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-stats'] });
    },
  });
};

export const useReassignReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reassignReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'submissions-overview'] });
    },
  });
};

export const useCancelAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'submissions-overview'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'review-stats'] });
    },
  });
};

// Export types
export type { AdminReviewAssignment, AdminReviewStats, AdminSubmissionOverview };