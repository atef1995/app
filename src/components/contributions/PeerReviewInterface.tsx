"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PeerReviewInterface Component
 *
 * Interactive code review interface for peer and mentor reviews.
 * Displays PR diff, rubric scoring system, and feedback forms.
 *
 * Features:
 * - GitHub PR diff display
 * - Weighted rubric scoring (Functionality 40%, Code Quality 30%, Best Practices 20%, Documentation 10%)
 * - Strength/improvement/suggestion feedback areas
 * - Real-time score calculation
 * - Submission validation
 */

interface PRFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

interface PRDiff {
  filesChanged: number;
  additions: number;
  deletions: number;
  files: PRFile[];
}

interface ReviewData {
  codeQualityScore: number;
  functionalityScore: number;
  documentationScore: number;
  bestPracticesScore: number;
  strengths: string;
  improvements: string;
  suggestions: string;
}

interface PeerReviewInterfaceProps {
  submissionId: string;
  prUrl: string;
  projectTitle: string;
  featureTitle: string;
  reviewType: "PEER" | "MENTOR";
  onSubmit: (reviewData: ReviewData) => Promise<void>;
  onCancel?: () => void;
}

const RUBRIC_CRITERIA = {
  functionality: {
    weight: 0.4,
    title: "Functionality",
    description: "Feature works correctly, meets acceptance criteria, handles edge cases",
    items: [
      "Feature implements all requirements",
      "Edge cases are handled properly",
      "No runtime errors or bugs",
      "User experience is smooth",
    ],
  },
  codeQuality: {
    weight: 0.3,
    title: "Code Quality",
    description: "Clean code, clear naming, no duplication",
    items: [
      "Code is clean and readable",
      "Variables and functions have clear names",
      "No code duplication (DRY principle)",
      "Proper code organization",
    ],
  },
  bestPractices: {
    weight: 0.2,
    title: "Best Practices",
    description: "Error handling, accessibility, performance, security",
    items: [
      "Proper error handling",
      "Accessibility considerations",
      "Performance optimizations",
      "Security best practices",
    ],
  },
  documentation: {
    weight: 0.1,
    title: "Documentation",
    description: "Code comments, PR description, README updates",
    items: [
      "Code has helpful comments",
      "PR description is clear",
      "README updated if needed",
      "Complex logic is explained",
    ],
  },
};

export default function PeerReviewInterface({
  submissionId,
  prUrl,
  projectTitle,
  featureTitle,
  reviewType,
  onSubmit,
  onCancel,
}: PeerReviewInterfaceProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [prDiff, setPrDiff] = useState<PRDiff | null>(null);
  const [error, setError] = useState("");

  // Review scores (0-100)
  const [scores, setScores] = useState({
    functionality: 80,
    codeQuality: 80,
    bestPractices: 80,
    documentation: 80,
  });

  // Feedback text
  const [feedback, setFeedback] = useState({
    strengths: "",
    improvements: "",
    suggestions: "",
  });

  // Active tab for file viewer
  const [activeFile, setActiveFile] = useState(0);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>("functionality");

  // Calculate overall score based on weighted rubric
  const calculateOverallScore = (): number => {
    return (
      scores.functionality * RUBRIC_CRITERIA.functionality.weight +
      scores.codeQuality * RUBRIC_CRITERIA.codeQuality.weight +
      scores.bestPractices * RUBRIC_CRITERIA.bestPractices.weight +
      scores.documentation * RUBRIC_CRITERIA.documentation.weight
    );
  };

  const overallScore = calculateOverallScore();

  // Load PR diff on mount
  useEffect(() => {
    loadPRDiff();
  }, [submissionId]);

  const loadPRDiff = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/contributions/submissions/${submissionId}/diff`);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to load PR diff");
      }

      setPrDiff(data.diff);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    // Validate feedback
    if (!feedback.strengths.trim()) {
      setError("Please provide at least one strength");
      return;
    }

    if (overallScore < 70 && !feedback.improvements.trim()) {
      setError("Please provide improvement suggestions for scores below 70%");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await onSubmit({
        functionalityScore: scores.functionality,
        codeQualityScore: scores.codeQuality,
        documentationScore: scores.documentation,
        bestPracticesScore: scores.bestPractices,
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        suggestions: feedback.suggestions,
      });
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-blue-600 dark:text-blue-400";
    if (score >= 50) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Work";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading PR diff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {reviewType === "PEER" ? "Peer Review" : "Mentor Review"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Project: <span className="font-medium">{projectTitle}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Feature: <span className="font-medium">{featureTitle}</span>
            </p>
          </div>
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View on GitHub</span>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* PR Diff Viewer */}
      {prDiff && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Code Changes
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {prDiff.filesChanged} file{prDiff.filesChanged !== 1 ? "s" : ""} changed
              </span>
              <span className="text-green-600 dark:text-green-400">
                +{prDiff.additions}
              </span>
              <span className="text-red-600 dark:text-red-400">
                -{prDiff.deletions}
              </span>
            </div>
          </div>

          {/* File Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <div className="flex">
              {prDiff.files.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setActiveFile(index)}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeFile === index
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  {file.filename}
                </button>
              ))}
            </div>
          </div>

          {/* File Diff Display */}
          <div className="p-4 bg-gray-50 dark:bg-gray-900 overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {prDiff.files[activeFile]?.patch || "No changes to display"}
            </pre>
          </div>
        </div>
      )}

      {/* Rubric Scoring */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review Rubric
        </h3>

        <div className="space-y-4">
          {Object.entries(RUBRIC_CRITERIA).map(([key, criteria]) => (
            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg">
              <button
                onClick={() => setExpandedCriteria(expandedCriteria === key ? null : key)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {criteria.title}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({criteria.weight * 100}%)
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {criteria.description}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className={`text-2xl font-bold ${getScoreColor(scores[key as keyof typeof scores])}`}>
                    {scores[key as keyof typeof scores]}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedCriteria === key ? "transform rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <AnimatePresence>
                {expandedCriteria === key && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 pt-0 space-y-4">
                      <ul className="space-y-2">
                        {criteria.items.map((item, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Score (0-100)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={scores[key as keyof typeof scores]}
                          onChange={(e) =>
                            setScores({ ...scores, [key]: parseInt(e.target.value) })
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>0</span>
                          <span>50</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Overall Score Display */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Weighted average</p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
                {Math.round(overallScore)}
              </p>
              <p className={`text-sm font-medium ${getScoreColor(overallScore)}`}>
                {getScoreLabel(overallScore)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Feedback
        </h3>

        <div className="space-y-4">
          {/* Strengths */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Strengths <span className="text-red-500">*</span>
            </label>
            <textarea
              value={feedback.strengths}
              onChange={(e) => setFeedback({ ...feedback, strengths: e.target.value })}
              placeholder="What did the student do well? Be specific and encouraging..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Areas for Improvement */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Areas for Improvement {overallScore < 70 && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={feedback.improvements}
              onChange={(e) => setFeedback({ ...feedback, improvements: e.target.value })}
              placeholder="What could be improved? Be constructive and specific..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Suggestions for Next Time
            </label>
            <textarea
              value={feedback.suggestions}
              onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
              placeholder="Tips for future improvements, resources to check out, patterns to learn..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={submitting}
            className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmitReview}
          disabled={submitting}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
