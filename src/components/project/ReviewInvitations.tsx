"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  useReviewAssignments,
  useAcceptReviewAssignment,
  useRejectReviewAssignment,
  ProjectReviewAssignmentWithDetails,
} from "@/hooks/useProjectQueries";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";

interface RejectModalState {
  isOpen: boolean;
  assignmentId: string;
  submissionTitle: string;
}

export function ReviewInvitations() {
  const { data: session } = useSession();
  const [rejectModal, setRejectModal] = useState<RejectModalState>({
    isOpen: false,
    assignmentId: "",
    submissionTitle: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: assignments, isLoading, error } = useReviewAssignments(["ASSIGNED"]);
  const acceptMutation = useAcceptReviewAssignment();
  const rejectMutation = useRejectReviewAssignment();

  if (!session) return null;

  const handleAccept = async (assignmentId: string) => {
    try {
      await acceptMutation.mutateAsync(assignmentId);
    } catch (error) {
      console.error("Error accepting review:", error);
    }
  };

  const handleRejectClick = (assignment: ProjectReviewAssignmentWithDetails) => {
    setRejectModal({
      isOpen: true,
      assignmentId: assignment.id,
      submissionTitle: assignment.submission.title || assignment.submission.project.title,
    });
    setRejectionReason("");
  };

  const handleRejectConfirm = async () => {
    try {
      await rejectMutation.mutateAsync({
        assignmentId: rejectModal.assignmentId,
        reason: rejectionReason.trim() || undefined,
      });
      setRejectModal({ isOpen: false, assignmentId: "", submissionTitle: "" });
      setRejectionReason("");
    } catch (error) {
      console.error("Error rejecting review:", error);
    }
  };

  const formatTimeLeft = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 1) return `${days} days left`;
    if (days === 1) return "1 day left";
    if (days === 0) return "Due today";
    return "Overdue";
  };

  const getUrgencyColor = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "text-red-600 dark:text-red-400";
    if (days <= 1) return "text-orange-600 dark:text-orange-400";
    return "text-green-600 dark:text-green-400";
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <p>Error loading review invitations</p>
        </div>
      </div>
    );
  }

  if (!assignments?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No pending review invitations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Peer Review Invitations
        </h2>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full font-medium">
          {assignments.length}
        </span>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {assignment.submission.title || assignment.submission.project.title}
                </h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>By {assignment.submission.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Project: {assignment.submission.project.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-gray-600 dark:text-gray-400">Due:</span>
                    <span className={getUrgencyColor(new Date(assignment.dueDate))}>
                      {formatTimeLeft(new Date(assignment.dueDate))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Priority: {assignment.priority}/10
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => handleRejectClick(assignment)}
                  disabled={rejectMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Decline
                </button>
                
                <button
                  onClick={() => handleAccept(assignment.id)}
                  disabled={acceptMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {acceptMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Accept Review
                </button>
              </div>
            </div>

            {/* Assignment Type Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Peer Review
              </span>
              {assignment.type === "ADMIN" && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                  Admin Assignment
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Rejection Confirmation Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      Decline Review Invitation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to decline the review for &quot;{rejectModal.submissionTitle}&quot;? 
                        This will help us reassign it to another reviewer.
                      </p>
                      
                      <div className="mt-4">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reason for declining (optional):
                        </label>
                        <textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={3}
                          placeholder="e.g., Not enough time, unfamiliar with the topic, schedule conflict..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={rejectMutation.isPending}
                  onClick={handleRejectConfirm}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {rejectMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Declining...
                    </>
                  ) : (
                    "Decline Review"
                  )}
                </button>
                <button
                  type="button"
                  disabled={rejectMutation.isPending}
                  onClick={() => setRejectModal({ isOpen: false, assignmentId: "", submissionTitle: "" })}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  Keep Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}