"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PeerReviewInterface from "@/components/contributions/PeerReviewInterface";
import MergedPRCelebration from "@/components/contributions/MergedPRCelebration";

/**
 * Submission Detail Page
 *
 * Displays detailed information about a PR submission including:
 * - PR status and metadata
 * - CI/CD check results
 * - Review progress
 * - Review history
 * - Option to conduct review (if assigned)
 */

interface Submission {
  id: string;
  githubPrUrl: string;
  githubPrNumber: number;
  githubBranch: string;
  prStatus: string;
  prTitle: string;
  prDescription: string;
  featureId: string;
  featureTitle: string;
  ciPassed: boolean;
  testsPassed: boolean;
  lintPassed: boolean;
  peerReviewsNeeded: number;
  peerReviewsReceived: number;
  mentorReviewStatus: string;
  grade: number | null;
  submittedAt: string;
  mergedAt: string | null;
  project: {
    slug: string;
    title: string;
    xpReward: number;
  };
  user: {
    username: string;
    image: string;
  };
  reviews: Review[];
}

interface Review {
  id: string;
  type: string;
  status: string;
  overallScore: number | null;
  strengths: string | null;
  improvements: string | null;
  suggestions: string | null;
  submittedAt: string | null;
  reviewer: {
    username: string;
    image: string;
  };
}

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setSubmissionId(p.id));
  }, [params]);

  useEffect(() => {
    if (submissionId) {
      loadSubmission();
    }
  }, [submissionId]);

  useEffect(() => {
    // Show celebration if just merged
    if (submission?.prStatus === "MERGED" && submissionId && !localStorage.getItem(`celebrated-${submissionId}`)) {
      setShowCelebration(true);
      localStorage.setItem(`celebrated-${submissionId}`, "true");
    }
  }, [submission, submissionId]);

  const loadSubmission = async () => {
    if (!submissionId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/contributions/submissions/${submissionId}`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load submission");
      }

      setSubmission(data.submission);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData: {
    codeQualityScore: number;
    functionalityScore: number;
    documentationScore: number;
    bestPracticesScore: number;
    strengths: string;
    improvements: string;
    suggestions: string;
  }) => {
    if (!submissionId) return;

    try {
      const response = await fetch(`/api/contributions/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: submissionId,
          ...reviewData,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      setShowReviewForm(false);
      loadSubmission();
    } catch (err) {
      throw err;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      OPEN: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      MERGED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      CHANGES_REQUESTED:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.OPEN}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
          <p className="text-red-800 dark:text-red-400">{error || "Submission not found"}</p>
          <Link
            href="/contributions/dashboard"
            className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.id && submission.user;
  const reviewProgress = (submission.peerReviewsReceived / submission.peerReviewsNeeded) * 100;

  if (showReviewForm) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <PeerReviewInterface
            submissionId={submission.id}
            prUrl={submission.githubPrUrl}
            projectTitle={submission.project.title}
            featureTitle={submission.featureTitle}
            reviewType="PEER"
            onSubmit={handleSubmitReview}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Link href="/contributions" className="hover:text-gray-900 dark:hover:text-gray-200">
            Contributions
          </Link>
          <span>/</span>
          <Link href="/contributions/dashboard" className="hover:text-gray-900 dark:hover:text-gray-200">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white">Submission</span>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {submission.prTitle}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {submission.project.title} • {submission.featureTitle}
              </p>
            </div>
            {getStatusBadge(submission.prStatus)}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <span>PR #{submission.githubPrNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Branch: {submission.githubBranch}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <a
              href={submission.githubPrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </div>

        {/* CI/CD Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Automated Checks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${
              submission.ciPassed
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {submission.ciPassed ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium text-gray-900 dark:text-white">CI/CD</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {submission.ciPassed ? "All checks passed" : "Checks failing"}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              submission.testsPassed
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {submission.testsPassed ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium text-gray-900 dark:text-white">Tests</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {submission.testsPassed ? "All tests passing" : "Tests failing"}
              </p>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              submission.lintPassed
                ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {submission.lintPassed ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium text-gray-900 dark:text-white">Lint</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {submission.lintPassed ? "Code style good" : "Style issues"}
              </p>
            </div>
          </div>
        </div>

        {/* Review Progress */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Review Progress
          </h2>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Peer Reviews: {submission.peerReviewsReceived}/{submission.peerReviewsNeeded}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(reviewProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${reviewProgress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Mentor Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              submission.mentorReviewStatus === "APPROVED"
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : submission.mentorReviewStatus === "CHANGES_REQUESTED"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
            }`}>
              {submission.mentorReviewStatus}
            </span>
          </div>

          {submission.grade && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Grade</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {submission.grade}%
              </p>
            </div>
          )}
        </div>

        {/* Reviews */}
        {submission.reviews.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reviews ({submission.reviews.length})
            </h2>
            <div className="space-y-4">
              {submission.reviews.map((review) => (
                <div
                  key={review.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {review.reviewer.image && (
                          <img src={review.reviewer.image} alt={review.reviewer.username} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {review.reviewer.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {review.type} Review
                        </p>
                      </div>
                    </div>
                    {review.overallScore && (
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {Math.round(review.overallScore)}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Score</p>
                      </div>
                    )}
                  </div>

                  {review.strengths && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">
                        ✓ Strengths
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {review.strengths}
                      </p>
                    </div>
                  )}

                  {review.improvements && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">
                        ⚠ Improvements
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {review.improvements}
                      </p>
                    </div>
                  )}

                  {review.suggestions && (
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1">
                        💡 Suggestions
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {review.suggestions}
                      </p>
                    </div>
                  )}

                  {review.submittedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                      Submitted {new Date(review.submittedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        {!isOwner && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Start Review
            </button>
          </div>
        )}
      </div>

      {/* Celebration Modal */}
      {showCelebration && submission.prStatus === "MERGED" && (
        <MergedPRCelebration
          projectTitle={submission.project.title}
          featureTitle={submission.featureTitle}
          xpEarned={submission.project.xpReward}
          prUrl={submission.githubPrUrl}
          submissionId={submission.id}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  );
}
