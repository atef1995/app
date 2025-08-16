"use client";

import Link from "next/link";
import { PartyPopper, ThumbsUp, Dumbbell, Star, Book } from "lucide-react";
import { ProgressBadge } from "@/components/ProgressComponents";
import { QuizState, TutorialNavigation } from "@/types/quiz";
import { MoodConfig } from "@/lib/moods";

interface QuizResultsProps {
  quizState: QuizState;
  correct: number;
  total: number;
  percentage: number;
  timeTaken: number;
  currentMoodConfig: MoodConfig;
  tutorialNavigation: TutorialNavigation | null;
}

export function QuizResults({
  quizState,
  correct,
  total,
  percentage,
  timeTaken,
  currentMoodConfig,
  tutorialNavigation,
}: QuizResultsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 select-none">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center select-none">
            <div className="text-6xl mb-4 flex justify-center">
              {percentage >= 80 ? (
                <PartyPopper className="h-16 w-16 text-green-500" />
              ) : percentage >= 60 ? (
                <ThumbsUp className="h-16 w-16 text-blue-500" />
              ) : (
                <Dumbbell className="h-16 w-16 text-orange-500" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 select-none">
              Quiz Complete!
            </h1>

            {/* Progress Badge */}
            <div className="mb-6">
              <ProgressBadge
                status={
                  quizState.submissionResult?.status ||
                  (percentage >= 70 ? "COMPLETED" : "IN_PROGRESS")
                }
                score={percentage}
                type="tutorial"
              />
            </div>

            <div className="text-6xl font-bold mb-4">
              <span
                className={
                  percentage >= 80
                    ? "text-green-600"
                    : percentage >= 60
                    ? "text-yellow-600"
                    : "text-red-600"
                }
              >
                {percentage}%
              </span>
            </div>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 select-none">
              You got {correct} out of {total} questions correct!
            </p>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Time Taken:
                  </span>
                  <br />
                  <span className="font-semibold text-black dark:text-white">
                    {formatTime(timeTaken)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Mood:
                  </span>
                  <br />
                  <span className="font-semibold text-black dark:text-white">
                    {currentMoodConfig.name} {currentMoodConfig.emoji}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Questions:
                  </span>
                  <br />
                  <span className="font-semibold text-black dark:text-white">
                    {correct} / {total}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Status:
                  </span>
                  <br />
                  <span
                    className={`font-semibold ${
                      quizState.submissionResult?.passed
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {quizState.submissionResult?.passed
                      ? "✅ Passed"
                      : "❌ Failed"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {percentage >= 70 ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-300 font-semibold flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Tutorial Completed!
                    <Star className="h-5 w-5" />
                  </p>
                  <p className="text-green-700 dark:text-green-400">
                    Excellent work! You&apos;ve successfully completed this
                    tutorial with a passing score.
                    {percentage >= 80 && " You truly mastered this topic!"}
                  </p>
                </div>
              ) : percentage >= 60 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-yellow-800 dark:text-yellow-300 font-semibold flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Good attempt!
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-400">
                    You need 70% to complete the tutorial. Review the material
                    and try again!
                  </p>
                </div>
              ) : (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-300 font-semibold flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Keep practicing!
                  </p>
                  <p className="text-red-700 dark:text-red-400">
                    Review the tutorial carefully and try again when
                    you&apos;re ready.
                  </p>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <Link
                  href={
                    tutorialNavigation?.current?.slug
                      ? `/tutorials/${tutorialNavigation.current.slug}`
                      : `/tutorials`
                  }
                  className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Review Tutorial
                </Link>

                {percentage >= 70 && tutorialNavigation?.next && (
                  <Link
                    href={`/tutorials/${tutorialNavigation.next.slug}`}
                    className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    Next Tutorial
                  </Link>
                )}

                <Link
                  href="/tutorials"
                  className="bg-purple-600 dark:bg-purple-500 text-white py-2 px-6 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                >
                  All Tutorials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}