"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Clock,
  Target,
  BarChart3,
  Lightbulb,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { MOODS } from "@/lib/moods";
import { useMood } from "@/components/providers/MoodProvider";
import { ProgressBadge } from "@/components/ProgressComponents";

// Types for database quiz data
interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  questions: Question[];
}

interface QuizCardProps {
  quiz: Quiz;
  index: number;
  userMood: string;
  progress?: {
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
    bestScore?: number;
    quizAttempts?: number;
  };
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  index,
  userMood,
  progress,
}) => {
  const moodConfig = MOODS[userMood.toLowerCase()];
  const difficultyColors = {
    easy: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  };

  // Ensure questions is an array and filter based on mood difficulty
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const filteredQuestions = questions.filter((q) => {
    if (moodConfig.quizSettings.difficulty === "easy") {
      return q.difficulty === "easy";
    } else if (moodConfig.quizSettings.difficulty === "medium") {
      return q.difficulty === "easy" || q.difficulty === "medium";
    }
    return true; // hard mode includes all questions
  });

  const questionsToShow = filteredQuestions.slice(
    0,
    moodConfig.quizSettings.questionsPerTutorial
  );

  const estimatedTime = moodConfig.quizSettings.timeLimit || 10;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-12 min-w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {index + 1}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {quiz.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tutorial {quiz.tutorialId}
            </p>
          </div>
        </div>
        <div
          className={`text-pretty w-10 px-2 py-1 rounded-md text-xs font-medium ${
            difficultyColors[moodConfig.quizSettings.difficulty]
          }
            `}
        >
          <span>
            {moodConfig.quizSettings.difficulty.charAt(0).toUpperCase() +
              moodConfig.quizSettings.difficulty.slice(1)}{" "}
            Mode
          </span>
        </div>
      </div>

      {/* Progress Badge */}
      {progress && (
        <div className="mb-4">
          <ProgressBadge
            status={progress.status}
            score={progress.bestScore}
            attempts={progress.quizAttempts}
            type="tutorial"
          />
        </div>
      )}

      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {questionsToShow.length} questions
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {estimatedTime} min
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 dark:text-gray-500">
              {moodConfig.emoji}
            </span>
            <span className="text-gray-600 dark:text-gray-300">
              {moodConfig.name} Mode
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-gray-600 dark:text-gray-300">
              {moodConfig.quizSettings.difficulty === "easy"
                ? "Beginner"
                : moodConfig.quizSettings.difficulty === "medium"
                ? "Intermediate"
                : "Advanced"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Question Preview:
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {questionsToShow[0]?.question ||
              "No questions available for this difficulty level"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Based on your <span className="font-medium">{moodConfig.name}</span>{" "}
          mood
        </div>
        <Link
          href={`/quiz/${quiz.id}`}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
};

interface TutorialProgress {
  tutorialId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  bestScore?: number;
  quizAttempts: number;
}

export default function QuizzesPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [tutorialProgress, setTutorialProgress] = useState<
    Record<string, TutorialProgress>
  >({});
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, router]);

  useEffect(() => {
    if (session?.user) {
      fetchQuizzes();
      fetchTutorialProgress();
    }
  }, [session]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data.quizzes || []);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const fetchTutorialProgress = async () => {
    try {
      const response = await fetch("/api/progress?type=tutorial");
      if (response.ok) {
        const data = await response.json();
        // Convert array to object with tutorialId as key
        const progressMap: Record<string, TutorialProgress> = {};
        if (data.progress && Array.isArray(data.progress)) {
          data.progress.forEach((p: TutorialProgress) => {
            progressMap[p.tutorialId] = p;
          });
        }
        setTutorialProgress(progressMap);
      }
    } catch (error) {
      console.error("Error fetching tutorial progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to access quizzes.
          </p>
        </div>
      </div>
    );
  }

  const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              JavaScript Quizzes
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Test your knowledge and track your progress
            </p>

            {/* Progress Summary */}
            {!loadingProgress && (
              <div className="mb-6">
                <div className="inline-flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                  <span>Progress:</span>
                  <span>
                    {
                      Object.values(tutorialProgress).filter(
                        (p) => p.status === "COMPLETED"
                      ).length
                    }{" "}
                    completed
                  </span>
                  <span>•</span>
                  <span>
                    {
                      Object.values(tutorialProgress).filter(
                        (p) => p.status === "IN_PROGRESS"
                      ).length
                    }{" "}
                    in progress
                  </span>
                  <span>•</span>
                  <span>
                    {quizzes.length - Object.keys(tutorialProgress).length} not
                    started
                  </span>
                </div>
              </div>
            )}

            {/* Mood-based info card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <div className="text-3xl">{currentMoodConfig.emoji}</div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {currentMoodConfig.name} Mode Active
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {currentMoodConfig.quizSettings.timeLimit
                      ? `${currentMoodConfig.quizSettings.timeLimit} minute timer`
                      : "No time limit"}{" "}
                    • {currentMoodConfig.quizSettings.questionsPerTutorial}{" "}
                    questions per quiz
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Difficulty:{" "}
                <span className="font-medium capitalize">
                  {currentMoodConfig.quizSettings.difficulty}
                </span>{" "}
                level questions
              </div>
            </div>
          </div>

          {/* Quizzes Grid */}
          {loadingProgress || loadingQuizzes ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading quiz progress...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz: Quiz, index: number) => {
                // The tutorialId in progress matches the quiz ID from the route parameter
                const quizProgress = tutorialProgress[quiz.id.toString()];
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    index={index}
                    userMood={currentMood.id}
                    progress={quizProgress}
                  />
                );
              })}
            </div>
          )}

          {/* Footer Section */}
          <div className="text-center mt-12">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Quiz Tips
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Current Mode:
                    </span>
                  </div>
                  <div>
                    {currentMoodConfig.quizSettings.difficulty === "easy"
                      ? "Focus on fundamental concepts and basic syntax"
                      : currentMoodConfig.quizSettings.difficulty === "medium"
                      ? "Mix of basic and intermediate concepts"
                      : "Challenging questions covering advanced topics"}
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-1" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      Time Management:
                    </span>
                  </div>
                  <div>
                    {currentMoodConfig.quizSettings.timeLimit
                      ? `You have ${currentMoodConfig.quizSettings.timeLimit} minutes per quiz`
                      : "Take your time - no pressure!"}
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <Link
                  href="/tutorials"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-1" />
                  Review tutorials before taking quizzes
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
