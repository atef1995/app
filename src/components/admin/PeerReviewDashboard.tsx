"use client";

import { useState } from "react";
import {
  useAllReviewAssignments,
  useReviewStats,
  useSubmissionOverviews,
  useAssignAdminReviewer,
  useReassignReview,
  useCancelAssignment,
  AdminReviewAssignment,
  AdminSubmissionOverview,
} from "@/hooks/useAdminReviewQueries";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  FileText,
  UserCheck,
  Calendar,
  TrendingUp,
  Loader2,
  RefreshCw,
  UserPlus,
  Ban,
} from "lucide-react";

type TabType = "overview" | "assignments" | "submissions";

export default function PeerReviewDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [selectedAssignment, setSelectedAssignment] = useState<AdminReviewAssignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<AdminSubmissionOverview | null>(null);

  const { data: assignments, isLoading: assignmentsLoading, error: assignmentsError } = useAllReviewAssignments();
  const { data: stats, isLoading: statsLoading } = useReviewStats();
  const { data: submissions, isLoading: submissionsLoading } = useSubmissionOverviews();

  const assignAdminMutation = useAssignAdminReviewer();
  const reassignMutation = useReassignReview();
  const cancelMutation = useCancelAssignment();

  const handleAssignAdmin = async (submissionId: string) => {
    try {
      await assignAdminMutation.mutateAsync({ submissionId });
    } catch (error) {
      console.error("Error assigning admin reviewer:", error);
    }
  };

  const handleReassign = async (assignmentId: string) => {
    try {
      await reassignMutation.mutateAsync(assignmentId);
    } catch (error) {
      console.error("Error reassigning review:", error);
    }
  };

  const handleCancel = async (assignmentId: string) => {
    try {
      await cancelMutation.mutateAsync(assignmentId);
    } catch (error) {
      console.error("Error canceling assignment:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "REJECTED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "ADMIN"
      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date();
  };

  // Overview Tab Content
  const OverviewTab = () => (
    <div className="p-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.totalAssignments || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.pendingAssignments || 0}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats?.completedAssignments || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {statsLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : `${stats?.averageCompletionTime || 0}h`}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Assignment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{stats?.pendingAssignments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Accepted</span>
              <span className="text-sm font-medium text-blue-600">{stats?.acceptedAssignments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
              <span className="text-sm font-medium text-green-600">{stats?.completedAssignments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Expired</span>
              <span className="text-sm font-medium text-red-600">{stats?.expiredAssignments || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rejected</span>
              <span className="text-sm font-medium text-gray-600">{stats?.rejectedAssignments || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats?.submissionsAwaitingReview || 0} submissions awaiting review
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats?.expiredAssignments || 0} assignments expired
              </span>
            </div>
            <div className="flex items-center gap-3">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats?.rejectedAssignments || 0} assignments rejected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Assignments Tab Content
  const AssignmentsTab = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Review Assignments ({assignments?.length || 0})
        </h3>
      </div>

      {assignmentsLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : assignmentsError ? (
        <div className="text-center text-red-600 dark:text-red-400 py-12">
          Error loading assignments
        </div>
      ) : !assignments?.length ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No review assignments found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {assignment.submission.title || assignment.submission.project.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(assignment.type)}`}>
                      {assignment.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="font-medium">Reviewer:</span>
                      <p>{assignment.reviewer.name || assignment.reviewer.username || "Unknown"}</p>
                    </div>
                    <div>
                      <span className="font-medium">Student:</span>
                      <p>{assignment.submission.user.name || assignment.submission.user.username}</p>
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span>
                      <p className={isOverdue(assignment.dueDate) && assignment.status === "ASSIGNED" ? "text-red-600" : ""}>
                        {formatDate(assignment.dueDate)}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span>
                      <p>{assignment.priority}</p>
                    </div>
                  </div>

                  {assignment.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-800 dark:text-red-200">
                        <strong>Rejection Reason:</strong> {assignment.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {assignment.status === "ASSIGNED" && (
                    <>
                      <button
                        onClick={() => handleReassign(assignment.id)}
                        disabled={reassignMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {reassignMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3 h-3" />
                        )}
                        Reassign
                      </button>
                      <button
                        onClick={() => handleCancel(assignment.id)}
                        disabled={cancelMutation.isPending}
                        className="flex items-center gap-1 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Ban className="w-3 h-3" />
                        )}
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Submissions Tab Content
  const SubmissionsTab = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Project Submissions ({submissions?.length || 0})
        </h3>
      </div>

      {submissionsLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : !submissions?.length ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No submissions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {submission.title || submission.project.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div>
                      <span className="font-medium">Student:</span>
                      <p>{submission.user.name || submission.user.username}</p>
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span>
                      <p>{formatDate(submission.submittedAt)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reviews Required:</span>
                      <p>{submission.project.minReviews}</p>
                    </div>
                    <div>
                      <span className="font-medium">Reviews Completed:</span>
                      <p>{submission.reviews.length}</p>
                    </div>
                  </div>

                  {/* Review Assignments Status */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review Assignments:</p>
                    <div className="flex flex-wrap gap-2">
                      {submission.reviewAssignments.map((assignment, index) => (
                        <span
                          key={assignment.id}
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(assignment.status)}`}
                        >
                          {assignment.reviewer.name || assignment.reviewer.username} ({assignment.status})
                        </span>
                      ))}
                      {submission.reviewAssignments.length === 0 && (
                        <span className="text-sm text-gray-500">No assignments yet</span>
                      )}
                    </div>
                  </div>

                  {/* Grade if available */}
                  {submission.grade !== null && (
                    <div className="text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">Final Grade:</span>
                      <span className="ml-2 font-bold text-green-600">{submission.grade.toFixed(1)}/100</span>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  {submission.status === "SUBMITTED" && submission.reviewAssignments.length < submission.project.minReviews && (
                    <button
                      onClick={() => handleAssignAdmin(submission.id)}
                      disabled={assignAdminMutation.isPending}
                      className="flex items-center gap-1 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                      {assignAdminMutation.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <UserPlus className="w-3 h-3" />
                      )}
                      Assign Admin
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Peer Review Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage project peer reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {assignments?.length || 0} assignments
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "assignments"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            👥 Assignments
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "submissions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📝 Submissions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "assignments" && <AssignmentsTab />}
        {activeTab === "submissions" && <SubmissionsTab />}
      </div>
    </div>
  );
}