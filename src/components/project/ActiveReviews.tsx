"use client";

import { useSession } from "next-auth/react";
import {
  useReviewAssignments,
} from "@/hooks/useProjectQueries";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  FileText,
  Calendar,
  ExternalLink,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export function ActiveReviews() {
  const { data: session } = useSession();
  const { data: assignments, isLoading, error } = useReviewAssignments(["ACCEPTED"]);

  if (!session) return null;

  const formatTimeLeft = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 1) return `${days} days left`;
    if (days === 1) return `1 day, ${hours}h left`;
    if (days === 0 && hours > 0) return `${hours} hours left`;
    if (days === 0 && hours === 0) return "Due soon";
    return "Overdue";
  };

  const getUrgencyColor = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
    if (days <= 1) return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
    return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
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
          <p>Error loading active reviews</p>
        </div>
      </div>
    );
  }

  if (!assignments?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active review assignments</p>
          <p className="text-sm mt-1">Completed reviews will help other students improve!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Active Reviews
        </h2>
        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm px-2 py-1 rounded-full font-medium">
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

                <div className="flex items-center gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-gray-600 dark:text-gray-400">Due:</span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getUrgencyColor(new Date(assignment.dueDate))}`}>
                      {formatTimeLeft(new Date(assignment.dueDate))}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Accepted on {new Date(assignment.acceptedAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Assignment Type and Status */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                    In Progress
                  </span>
                  {assignment.type === "ADMIN" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                      Admin Review
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    Priority: {assignment.priority}
                  </span>
                </div>
              </div>

              <div className="ml-4">
                <Link
                  href={`/projects/review/${assignment.id}`}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Start Review
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Review Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Review Guidelines
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li>• Provide constructive and specific feedback</li>
          <li>• Focus on code quality, functionality, and best practices</li>
          <li>• Be encouraging and supportive in your comments</li>
          <li>• Complete reviews within the deadline to help fellow students</li>
          <li>• Use the scoring rubric to ensure fair and consistent evaluation</li>
        </ul>
      </div>
    </div>
  );
}