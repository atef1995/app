"use client";

import { ProjectWithDetails } from "@/types/project";
import { useMood } from "@/components/providers/MoodProvider";
import {
  Clock,
  Users,
  Trophy,
  Code,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import getMoodColors from "@/lib/getMoodColors";

interface ProjectCardProps {
  project: ProjectWithDetails;
  userProgress?: {
    hasSubmission?: boolean;
    submissionStatus?: string;
    grade?: number;
  };
  className?: string;
  showCategory?: boolean;
}

const getSubmissionTypeIcon = (type: string) => {
  switch (type) {
    case "CODE":
      return Code;
    case "LINK":
      return LinkIcon;
    case "FILE":
      return FileText;
    default:
      return Code;
  }
};

const getSubmissionTypeLabel = (type: string) => {
  switch (type) {
    case "CODE":
      return "Code Submission";
    case "LINK":
      return "External Link";
    case "FILE":
      return "File Upload";
    default:
      return "Code Submission";
  }
};

const getDifficultyLabel = (difficulty: number) => {
  if (difficulty <= 1) return "Beginner";
  if (difficulty <= 2) return "Intermediate";
  return "Advanced";
};

const getDifficultyColor = (difficulty: number) => {
  if (difficulty <= 1) return "text-green-600 dark:text-green-400";
  if (difficulty <= 2) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return "text-green-600 dark:text-green-400";
    case "REVIEWED":
      return "text-blue-600 dark:text-blue-400";
    case "UNDER_REVIEW":
      return "text-yellow-600 dark:text-yellow-400";
    case "SUBMITTED":
      return "text-purple-600 dark:text-purple-400";
    case "DRAFT":
      return "text-gray-600 dark:text-gray-400";
    case "NEEDS_REVISION":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const getStatusIcon = (status?: string) => {
  switch (status) {
    case "APPROVED":
      return CheckCircle;
    case "REVIEWED":
    case "UNDER_REVIEW":
      return AlertCircle;
    case "SUBMITTED":
      return Clock;
    case "NEEDS_REVISION":
      return AlertCircle;
    default:
      return BookOpen;
  }
};

export default function ProjectCard({
  project,
  userProgress,
  className = "",
  showCategory = true,
}: ProjectCardProps) {
  const { currentMood } = useMood();

  const SubmissionIcon = getSubmissionTypeIcon(project.submissionType);
  const StatusIcon = getStatusIcon(userProgress?.submissionStatus);

  const moodColors = getMoodColors(currentMood.id);

  return (
    <Link href={`/projects/${project.slug}`}>
      <div
        className={`
        bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl
        border-2 ${moodColors.border} ${moodColors.hover}
        transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl
        cursor-pointer h-full flex flex-col
        ${className}
      `}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {showCategory && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium capitalize">
                    {project.category}
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                    project.difficulty
                  )} bg-gray-100 dark:bg-gray-700`}
                >
                  {getDifficultyLabel(project.difficulty)}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Project Status */}
            {userProgress?.hasSubmission && (
              <div className="ml-4 flex flex-col items-end">
                <div className="flex items-center gap-1 mb-1">
                  <StatusIcon className="w-4 h-4" />
                  <span
                    className={`text-xs font-medium ${getStatusColor(
                      userProgress.submissionStatus
                    )}`}
                  >
                    {userProgress.submissionStatus
                      ?.replace(/_/g, " ")
                      .toLowerCase()}
                  </span>
                </div>
                {userProgress.grade && (
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {userProgress.grade.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Requirements Preview */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Key Requirements
              </span>
            </div>
            <div className="space-y-1">
              {project.requirements.slice(0, 3).map((req) => (
                <div key={req.id} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {req.title}
                  </span>
                </div>
              ))}
              {project.requirements.length > 3 && (
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    +{project.requirements.length - 3} more requirements
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto p-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{project.estimatedHours}h</span>
              </div>
              <div className="flex items-center gap-1">
                <SubmissionIcon className="w-3 h-3" />
                <span>{getSubmissionTypeLabel(project.submissionType)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project._count?.submissions || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {project.isPremium && (
                <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium">
                  {project.requiredPlan}
                </span>
              )}

              {userProgress?.hasSubmission ? (
                <span className={`text-xs font-medium ${moodColors.accent}`}>
                  View Progress
                </span>
              ) : (
                <span className={`text-xs font-medium ${moodColors.accent}`}>
                  Start Project
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
