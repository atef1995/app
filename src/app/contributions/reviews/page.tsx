"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Review Queue Page
 *
 * Central hub for reviewers to manage their assigned code reviews.
 * Features:
 * - List of pending and completed reviews
 * - Filter by status
 * - Quick access to start reviewing
 * - Review statistics
 */

interface ReviewAssignment {
  id: string;
  submissionId: string;
  status: string;
  type: string;
  createdAt: string;
  submittedAt: string | null;
  overallScore: number | null;
  submission: {
    prTitle: string;
    featureTitle: string;
    githubPrUrl: string;
    ciPassed: boolean;
    testsPassed: boolean;
    lintPassed: boolean;
    project: {
      title: string;
    };
    user: {
      username: string;
      image: string | null;
    };
  };
}

interface ReviewQueueData {
  assignments: ReviewAssignment[];
  stats: {
    pending: number;
    completedThisWeek: number;
    totalCompleted: number;
    averageScore: number;
  };
}

type FilterStatus = "all" | "pending" | "completed";

export default function ReviewQueuePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ReviewQueueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadReviewQueue();
  }, [session]);

  const loadReviewQueue = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/contributions/reviews");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load review queue");
      }

      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAssignments = (): ReviewAssignment[] => {
    if (!data) return [];

    switch (filter) {
      case "pending":
        return data.assignments.filter((a) => a.status === "PENDING");
      case "completed":
        return data.assignments.filter((a) => a.status !== "PENDING");
      case "all":
      default:
        return data.assignments;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      CHANGES_REQUESTED:
        "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || styles.PENDING
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const filteredAssignments = getFilteredAssignments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading review queue...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-400">
            {error || "Failed to load review queue"}
          </p>
          <button
            onClick={loadReviewQueue}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Review Queue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help your peers by reviewing their pull requests
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Pending Reviews
            </p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {data.stats.pending}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Completed This Week
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.stats.completedThisWeek}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total Completed
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.stats.totalCompleted}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Average Score
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.stats.averageScore > 0 ? Math.round(data.stats.averageScore) : "—"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                All ({data.assignments.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Pending ({data.stats.pending})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                Completed ({data.stats.totalCompleted})
              </button>
            </div>
          </div>
        </div>

        {/* Review List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">
                {filter === "pending" ? "🎉" : filter === "completed" ? "✅" : "👀"}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === "pending"
                  ? "No pending reviews"
                  : filter === "completed"
                  ? "No completed reviews yet"
                  : "No review assignments"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filter === "pending"
                  ? "Check back later for new review assignments"
                  : filter === "completed"
                  ? "Start reviewing to build your contribution history"
                  : "Review assignments will appear here when available"}
              </p>
              {filter === "pending" && (
                <Link
                  href="/contributions/dashboard"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Go to Dashboard
                </Link>
              )}
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {assignment.submission.prTitle}
                      </h3>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {assignment.submission.project.title} •{" "}
                      {assignment.submission.featureTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    {assignment.submission.user.image ? (
                      <img
                        src={assignment.submission.user.image}
                        alt={assignment.submission.user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium">
                        {assignment.submission.user.username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-900 dark:text-white font-medium">
                      {assignment.submission.user.username}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Assigned {new Date(assignment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* CI Status */}
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    {assignment.submission.ciPassed ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span className="text-gray-600 dark:text-gray-400">
                      CI {assignment.submission.ciPassed ? "Passing" : "Failing"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignment.submission.testsPassed ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span className="text-gray-600 dark:text-gray-400">
                      Tests {assignment.submission.testsPassed ? "Passing" : "Failing"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {assignment.submission.lintPassed ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                    <span className="text-gray-600 dark:text-gray-400">
                      Lint {assignment.submission.lintPassed ? "Passing" : "Failing"}
                    </span>
                  </div>
                </div>

                {/* Score Display (if completed) */}
                {assignment.overallScore !== null && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Your Score:{" "}
                      <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">
                        {Math.round(assignment.overallScore)}%
                      </span>
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {assignment.status === "PENDING" ? (
                    <Link
                      href={`/contributions/submissions/${assignment.submissionId}`}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
                    >
                      Start Review
                    </Link>
                  ) : (
                    <Link
                      href={`/contributions/submissions/${assignment.submissionId}`}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      View Submission
                    </Link>
                  )}
                  <a
                    href={assignment.submission.githubPrUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
