"use client";

import { Certificate, CertificateType } from "@prisma/client";
import { useState } from "react";
import {
  Award,
  Share,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import { format } from "date-fns";
import getMoodColors from "@/lib/getMoodColors";

interface CertificateCardProps {
  certificate: Certificate;
  showActions?: boolean;
  compact?: boolean;
}

interface CertificateMetadata {
  score?: number;
  timeSpent?: number;
  difficulty?: number;
  quizPassed?: boolean;
  completionPercentage?: number;
  tutorialsCompleted?: number;
  totalTutorials?: number;
  averageScore?: number;
  totalTimeSpent?: number;
}

export default function CertificateCard({
  certificate,
  showActions = true,
  compact = false,
}: CertificateCardProps) {
  const { currentMood } = useMood();
  const [copied, setCopied] = useState(false);
  const [isUpdatingPublicity, setIsUpdatingPublicity] = useState(false);

  const metadata = certificate.metadata as CertificateMetadata;

  const moodColors = getMoodColors(currentMood.id);

  const getCertificateIcon = () => {
    return certificate.type === CertificateType.TUTORIAL ? "🎯" : "🏆";
  };

  const formatTimeSpent = (timeInSeconds: number) => {
    if (timeInSeconds < 60) return `${timeInSeconds}s`;
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  };

  const copyShareableUrl = async () => {
    if (!certificate.shareableUrl) return;

    try {
      await navigator.clipboard.writeText(certificate.shareableUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  const togglePublicity = async () => {
    setIsUpdatingPublicity(true);
    try {
      const response = await fetch("/api/certificates/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          certificateId: certificate.id,
          isPublic: !certificate.isPublic,
        }),
      });

      if (response.ok) {
        // Update local state or refetch data
        window.location.reload(); // Simple approach for now
      }
    } catch (error) {
      console.error("Failed to update certificate publicity:", error);
    } finally {
      setIsUpdatingPublicity(false);
    }
  };

  if (compact) {
    return (
      <div
        className={`bg-gradient-to-r ${moodColors.bg} border ${moodColors.border} rounded-lg p-4`}
      >
        <div className="flex items-center gap-3">
          <div className={`${moodColors.accent} p-2 rounded-full`}>
            <Award className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCertificateIcon()}</span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {certificate.entityTitle}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {format(new Date(certificate.completedAt), "MMM dd, yyyy")}
            </p>
          </div>
          {showActions && (
            <button
              onClick={copyShareableUrl}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br ${moodColors.bg} border ${moodColors.border} rounded-xl p-6 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`${moodColors.accent} p-3 rounded-full`}>
            <Award className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getCertificateIcon()}</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {certificate.entityTitle}
              </h3>
            </div>
            <p className={`text-sm ${moodColors.text} font-medium`}>
              Certificate of Completion •{" "}
              {certificate.type === CertificateType.TUTORIAL
                ? "Tutorial"
                : "Category"}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePublicity}
              disabled={isUpdatingPublicity}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title={certificate.isPublic ? "Make private" : "Make public"}
            >
              {certificate.isPublic ? (
                <Unlock className="h-4 w-4" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={copyShareableUrl}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="Copy shareable link"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {certificate.shareableUrl && (
              <a
                href={certificate.shareableUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="View public certificate"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* Metadata */}
      {metadata && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {certificate.type === CertificateType.TUTORIAL && (
            <>
              {metadata.score !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metadata.score.toPrecision(2)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Score
                  </div>
                </div>
              )}
              {metadata.timeSpent !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatTimeSpent(metadata.timeSpent)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Time Spent
                  </div>
                </div>
              )}
              {metadata.difficulty !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {"⭐".repeat(Math.min(5, metadata.difficulty))}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Difficulty
                  </div>
                </div>
              )}
            </>
          )}

          {certificate.type === CertificateType.CATEGORY && (
            <>
              {metadata.tutorialsCompleted !== undefined &&
                metadata.totalTutorials !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {metadata.tutorialsCompleted}/{metadata.totalTutorials}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tutorials
                    </div>
                  </div>
                )}
              {metadata.averageScore !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metadata.averageScore.toFixed(0)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Avg Score
                  </div>
                </div>
              )}
              {metadata.totalTimeSpent !== undefined && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatTimeSpent(metadata.totalTimeSpent)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Total Time
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Completed on{" "}
          {format(new Date(certificate.completedAt), "MMMM dd, yyyy")}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              certificate.isPublic
                ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }`}
          >
            {certificate.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>
    </div>
  );
}
