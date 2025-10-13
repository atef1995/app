"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * Contributions Dashboard Page
 *
 * Overview of user's contribution activity:
 * - Active submissions
 * - Review assignments
 * - Statistics (PRs merged, reviews given, XP earned)
 * - Quick actions
 */

interface DashboardData {
  submissions: SubmissionSummary[];
  reviewAssignments: ReviewAssignment[];
  stats: {
    totalSubmissions: number;
    mergedPRs: number;
    reviewsGiven: number;
    xpEarned: number;
    currentStreak: number;
  };
}

interface SubmissionSummary {
  id: string;
  prTitle: string;
  prStatus: string;
  featureTitle: string;
  projectTitle: string;
  githubPrUrl: string;
  submittedAt: string;
  peerReviewsReceived: number;
  peerReviewsNeeded: number;
  ciPassed: boolean;
}

interface ReviewAssignment {
  id: string;
  submissionId: string;
  prTitle: string;
  featureTitle: string;
  projectTitle: string;
  status: string;
  assignedAt: string;
}

export default function ContributionsDashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"submissions" | "reviews">(
    "submissions"
  );

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/contributions/dashboard");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to load dashboard");
      }

      setData(result.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "MERGED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "OPEN":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      case "CHANGES_REQUESTED":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-400">
            {error || "Failed to load dashboard"}
          </p>
          <button
            onClick={loadDashboardData}
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
            Contribution Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your PRs, reviews, and contribution progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Total PRs
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.stats.totalSubmissions}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Merged
            </p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {data.stats.mergedPRs}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Reviews Given
            </p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {data.stats.reviewsGiven}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              XP Earned
            </p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {data.stats.xpEarned}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Current Streak
            </p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {data.stats.currentStreak} 🔥
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/contributions"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
          >
            Browse Projects
          </Link>
          <Link
            href="/contributions/reviews"
            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Review Queue
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("submissions")}
              className={`py-3 border-b-2 transition-colors font-medium ${
                activeTab === "submissions"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              My Submissions ({data.submissions.length})
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`py-3 border-b-2 transition-colors font-medium ${
                activeTab === "reviews"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Review Assignments ({data.reviewAssignments.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "submissions" ? (
          <div className="space-y-4">
            {data.submissions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No submissions yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Start contributing by browsing available projects
                </p>
                <Link
                  href="/contributions/projects"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Browse Projects
                </Link>
              </div>
            ) : (
              data.submissions.map((submission) => (
                <Link
                  key={submission.id}
                  href={`/contributions/submissions/${submission.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {submission.prTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {submission.projectTitle} • {submission.featureTitle}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        submission.prStatus
                      )}`}
                    >
                      {submission.prStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      {submission.ciPassed ? (
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
                      <span>
                        CI {submission.ciPassed ? "Passing" : "Failing"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      <span>
                        {submission.peerReviewsReceived}/
                        {submission.peerReviewsNeeded} Reviews
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {data.reviewAssignments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">👀</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No reviews assigned
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Review assignments will appear here
                </p>
              </div>
            ) : (
              data.reviewAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  href={`/contributions/submissions/${assignment.submissionId}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {assignment.prTitle}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {assignment.projectTitle} • {assignment.featureTitle}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        assignment.status === "COMPLETED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      Assigned{" "}
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
