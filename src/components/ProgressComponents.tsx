import React from "react";
import { CheckCircle, Clock, XCircle, Target } from "lucide-react";

interface ProgressBadgeProps {
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  score?: number;
  attempts?: number;
  grade?: number;
  type: "tutorial" | "challenge" | "project";
}

export function ProgressBadge({
  status,
  score,
  attempts,
  grade,
  type,
}: ProgressBadgeProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "COMPLETED":
        return (
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
        );
      case "IN_PROGRESS":
        return (
          <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "FAILED":
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
      default:
        return <Target className="w-4 h-4 text-gray-400 dark:text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700";
      case "IN_PROGRESS":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700";
      case "FAILED":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "COMPLETED":
        if (type === "tutorial") {
          return `Completed${score ? ` (${score}%)` : ""}`;
        } else if (type === "project") {
          return `Completed${grade ? ` (${Math.round(grade)}%)` : ""}`;
        } else {
          return "Passed";
        }
      case "IN_PROGRESS":
        if (type === "tutorial") {
          return `In Progress${attempts ? ` (${attempts} attempts)` : ""}`;
        } else if (type === "project") {
          return "In Progress";
        } else {
          return `Attempting${attempts ? ` (${attempts} tries)` : ""}`;
        }
      case "FAILED":
        return `Failed${attempts ? ` (${attempts} attempts)` : ""}`;
      default:
        return "Not Started";
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()}`}
    >
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
}

interface ProgressStatsProps {
  tutorialStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number; // Total available tutorials in the system
  };
  challengeStats: {
    completed: number;
    inProgress: number;
    failed: number;
    notStarted: number;
    total: number; // Total available challenges in the system
  };
  projectStats: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number; // Total available projects in the system
  };
}

export function ProgressStats({
  tutorialStats,
  challengeStats,
  projectStats,
}: ProgressStatsProps) {
  const totalTutorials = tutorialStats.total;
  const totalChallenges = challengeStats.total;
  const totalProjects = projectStats.total;

  const tutorialProgress =
    totalTutorials > 0 ? (tutorialStats.completed / totalTutorials) * 100 : 0;
  const challengeProgress =
    totalChallenges > 0
      ? (challengeStats.completed / totalChallenges) * 100
      : 0;
  const projectProgress =
    totalProjects > 0 ? (projectStats.completed / totalProjects) * 100 : 0;

  // Clamp progress values between 0 and 100
  const clampedTutorialProgress = Math.min(100, Math.max(0, tutorialProgress));
  const clampedChallengeProgress = Math.min(
    100,
    Math.max(0, challengeProgress)
  );
  const clampedProjectProgress = Math.min(100, Math.max(0, projectProgress));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Your Progress
      </h3>

      <div className="space-y-6">
        {/* Tutorial Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tutorials
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {tutorialStats.completed}/{totalTutorials} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* Dynamic width required for progress indicator */}
            <div
              className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${clampedTutorialProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {tutorialStats.inProgress} in progress •{" "}
              {tutorialStats.notStarted} not started
            </span>
            <span>{Math.round(tutorialProgress)}% complete</span>
          </div>
        </div>

        {/* Challenge Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Challenges
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {challengeStats.completed}/{totalChallenges} passed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* Dynamic width required for progress indicator */}
            <div
              className="bg-purple-600 dark:bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${clampedChallengeProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {challengeStats.inProgress} in progress •{" "}
              {challengeStats.notStarted} not started
            </span>
            <span>{Math.round(challengeProgress)}% passed</span>
          </div>
        </div>

        {/* Project Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Projects
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {projectStats.completed}/{totalProjects} completed
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            {/* Dynamic width required for progress indicator */}
            <div
              className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${clampedProjectProgress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>
              {projectStats.inProgress} in progress •{" "}
              {projectStats.notStarted} not started
            </span>
            <span>{Math.round(projectProgress)}% complete</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {tutorialStats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Tutorials Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {challengeStats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Challenges Passed
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {projectStats.completed}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Projects Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
