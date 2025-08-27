"use client";

import React from "react";
import Link from "next/link";
import { Brain, ChevronRight } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import { type TutorialData } from "@/hooks/useTutorial";
import getMoodColors from "@/lib/getMoodColors";

interface TutorialQuizSectionProps {
  tutorial: TutorialData;
  contentLoaded: boolean;
}

export default function TutorialQuizSection({ 
  tutorial, 
  contentLoaded 
}: TutorialQuizSectionProps) {
  const { currentMood } = useMood();
  const moodColors = getMoodColors(currentMood.id);

  // Don't render if there's no quiz
  if (!tutorial.meta.quizQuestions && !tutorial.quiz) {
    return null;
  }

  const questionCount = tutorial.meta.quizQuestions || 
    tutorial.quiz?.questions?.length || 
    0;

  if (questionCount === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl">
      {!contentLoaded ? (
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Ready for the Quiz?
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Test your knowledge with {questionCount} questions. You need 70% 
                or higher to complete this tutorial.
              </p>
            </div>
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>

          <div
            className={`p-4 rounded-lg ${moodColors.gradient} border-2 ${moodColors.border} mb-6`}
          >
            <h3 className={`font-bold mb-2 ${moodColors.text}`}>
              {currentMood.name} Mode Quiz Settings
            </h3>
            <ul className={`text-sm ${moodColors.text} space-y-1`}>
              <li>
                • Difficulty: {currentMood.quizSettings.difficulty}
              </li>
              <li>
                • Questions: {currentMood.quizSettings.questionsPerTutorial}
              </li>
              {currentMood.quizSettings.timeLimit && (
                <li>
                  • Time Limit: {currentMood.quizSettings.timeLimit} seconds
                </li>
              )}
              <li>• Passing Score: 70%</li>
            </ul>
          </div>

          <Link
            href={
              tutorial.quiz?.slug ? `/quiz/${tutorial.quiz.slug}` : "#"
            }
            className={`inline-flex items-center gap-2 ${moodColors.accent} text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
          >
            Start Quiz <ChevronRight className="w-5 h-5" />
          </Link>
        </>
      )}
    </div>
  );
}