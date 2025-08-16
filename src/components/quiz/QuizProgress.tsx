"use client";

import { MoodConfig } from "@/lib/moods";

interface QuizProgressProps {
  quizTitle: string;
  currentQuestion: number;
  totalQuestions: number;
  currentMoodConfig: MoodConfig;
}

export function QuizProgress({
  quizTitle,
  currentQuestion,
  totalQuestions,
  currentMoodConfig,
}: QuizProgressProps) {
  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {quizTitle}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
            {currentMoodConfig.name} {currentMoodConfig.emoji}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="text-right mt-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
    </div>
  );
}