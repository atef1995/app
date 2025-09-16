"use client";

import { useEffect, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOODS } from "@/lib/moods";
import { useMood } from "@/components/providers/MoodProvider";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizResults } from "@/components/quiz/QuizResults";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { useQuiz } from "@/hooks/useQuiz";
import { useAntiCheat } from "@/hooks/useAntiCheat";
import {
  MoodImpactIndicator,
  MoodDifficultyBadge,
} from "@/components/ui/MoodImpactIndicator";

export default function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { currentMood } = useMood();

  const {
    quiz,
    loadingQuiz,
    tutorialNavigation,
    quizState,
    setQuizState,
    submitting,
    shuffledQuestions,
    calculateScore,
    handleQuizComplete,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
  } = useQuiz({ slug: resolvedParams.slug, currentMoodId: currentMood.id });

  const { cheatAttempts: _cheatAttempts } = useAntiCheat({
    tutorialNavigation,
    quizSlug: resolvedParams.slug,
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, router]);

  useEffect(() => {
    // Set up total timer based on user's mood and number of questions
    const moodConfig = MOODS[currentMood.id.toLowerCase()];
    if (
      moodConfig.quizSettings.timeLimit &&
      !quizState.showResults &&
      !quizState.timeLeft &&
      shuffledQuestions.length > 0
    ) {
      // Calculate total time: timeLimit per question × number of questions
      const totalTime =
        moodConfig.quizSettings.timeLimit * shuffledQuestions.length;
      setQuizState((prev) => ({
        ...prev,
        timeLeft: totalTime,
      }));
    }
  }, [
    currentMood,
    quizState.showResults,
    quizState.timeLeft,
    shuffledQuestions.length,
    setQuizState,
  ]);

  if (loadingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Quiz Not Found
          </h1>
          <Link
            href="/tutorials"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  console.log({ quiz, session });

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to take quizzes.
          </p>
        </div>
      </div>
    );
  }

  const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];

  if (quizState.showResults) {
    const { correct, total } = calculateScore();
    const percentage = Math.round((correct / total) * 100);
    const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);

    return (
      <QuizResults
        quizState={quizState}
        correct={correct}
        total={total}
        percentage={percentage}
        timeTaken={timeTaken}
        currentMoodConfig={currentMoodConfig}
        tutorialNavigation={tutorialNavigation}
        shuffledQuestions={shuffledQuestions}
      />
    );
  }

  const currentQuestionData = shuffledQuestions[quizState.currentQuestion];

  // Prevent rendering if no questions available
  if (shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            No Questions Available
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No questions available for this difficulty level.
          </p>
          <Link
            href="/tutorials"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  // Prevent rendering if current question doesn't exist
  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Question Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Unable to load the current question.
          </p>
          <Link
            href="/tutorials"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 select-none">
      <div className="container mx-auto px-4 py-8">
        <QuizTimer
          timeLeft={quizState.timeLeft || 0}
          onTimeUp={handleQuizComplete}
          isActive={!!quizState.timeLeft && quizState.timeLeft > 0}
          totalQuestions={shuffledQuestions.length}
          currentQuestion={quizState.currentQuestion}
          timePerQuestion={
            MOODS[currentMood.id.toLowerCase()].quizSettings.timeLimit
          }
        />

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Mood Impact Indicator */}
          <div className="flex items-center justify-between bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm">
            <MoodImpactIndicator context="quiz" />
            <div className="flex items-center gap-3">
              <MoodDifficultyBadge />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg select-none transform transition-all duration-300 hover:shadow-xl">
            <QuizProgress
              quizTitle={quiz.title}
              currentQuestion={quizState.currentQuestion}
              totalQuestions={shuffledQuestions.length}
            />

            <QuizQuestion
              question={currentQuestionData}
              selectedAnswer={quizState.answers[quizState.currentQuestion]}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={quizState.currentQuestion + 1}
            />

            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousQuestion}
                disabled={quizState.currentQuestion === 0}
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  quizState.answers[quizState.currentQuestion] === undefined ||
                  submitting
                }
                className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {quizState.currentQuestion === shuffledQuestions.length - 1
                  ? submitting
                    ? "Submitting..."
                    : "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
