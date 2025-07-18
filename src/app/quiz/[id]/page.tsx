"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { quizzes, type Quiz } from "@/data/quizzes";
import { MOODS } from "@/lib/moods";

interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResults: boolean;
  timeLeft?: number;
  startTime: number;
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    startTime: Date.now(),
  });

  const quizId = parseInt(params.id);
  const quiz: Quiz | undefined = quizzes[quizId as keyof typeof quizzes];

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, router]);

  useEffect(() => {
    // Set up timer based on user's mood
    if (session?.user.mood) {
      const moodConfig = MOODS[session.user.mood.toLowerCase()];
      if (moodConfig.quizSettings.timeLimit) {
        setQuizState((prev) => ({
          ...prev,
          timeLeft: moodConfig.quizSettings.timeLimit! * 60,
        }));

        const timer = setInterval(() => {
          setQuizState((prev) => {
            if (prev.timeLeft && prev.timeLeft > 0) {
              return { ...prev, timeLeft: prev.timeLeft - 1 };
            } else {
              handleQuizComplete();
              return prev;
            }
          });
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [session]);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Quiz Not Found
          </h1>
          <Link href="/tutorials" className="text-blue-600 hover:underline">
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to take quizzes.</p>
        </div>
      </div>
    );
  }

  const userMood = session.user.mood || "CHILL";
  const currentMoodConfig = MOODS[userMood.toLowerCase()];

  // Filter questions based on mood difficulty
  const filteredQuestions = quiz.questions.filter((q) => {
    if (currentMoodConfig.quizSettings.difficulty === "easy") {
      return q.difficulty === "easy";
    } else if (currentMoodConfig.quizSettings.difficulty === "medium") {
      return q.difficulty === "easy" || q.difficulty === "medium";
    }
    return true; // hard mode includes all questions
  });

  const questionsToShow = filteredQuestions.slice(
    0,
    currentMoodConfig.quizSettings.questionsPerTutorial
  );

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState((prev) => ({ ...prev, answers: newAnswers }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion < questionsToShow.length - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    setQuizState((prev) => ({ ...prev, showResults: true }));
  };

  const calculateScore = () => {
    let correct = 0;
    quizState.answers.forEach((answer, index) => {
      if (questionsToShow[index] && answer === questionsToShow[index].correct) {
        correct++;
      }
    });
    return { correct, total: questionsToShow.length };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (quizState.showResults) {
    const { correct, total } = calculateScore();
    const percentage = Math.round((correct / total) * 100);
    const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/tutorials" className="text-2xl font-bold">
              <span className="text-blue-600">Vibed</span> to{" "}
              <span className="text-purple-600">Cracked</span>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-4">
                {percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪"}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quiz Complete!
              </h1>

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

              <p className="text-xl text-gray-600 mb-6">
                You got {correct} out of {total} questions correct!
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Time Taken:</span>
                    <br />
                    <span className="font-semibold">
                      {formatTime(timeTaken)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mood:</span>
                    <br />
                    <span className="font-semibold">
                      {currentMoodConfig.name} {currentMoodConfig.emoji}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {percentage >= 80 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold">
                      Excellent work! 🌟
                    </p>
                    <p className="text-green-700">
                      You&apos;ve mastered this topic. Ready for the next
                      challenge?
                    </p>
                  </div>
                ) : percentage >= 60 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-semibold">
                      Good job! 📚
                    </p>
                    <p className="text-yellow-700">
                      You understand the basics. Consider reviewing the tutorial
                      again.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold">
                      Keep practicing! 💪
                    </p>
                    <p className="text-red-700">
                      Review the tutorial and try again when you&apos;re ready.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Link
                    href={`/tutorials/${params.id}`}
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Review Tutorial
                  </Link>

                  {percentage >= 60 && parseInt(params.id) < 2 && (
                    <Link
                      href={`/tutorials/${parseInt(params.id) + 1}`}
                      className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Tutorial
                    </Link>
                  )}

                  <Link
                    href="/tutorials"
                    className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors"
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

  const currentQuestionData = questionsToShow[quizState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/tutorials" className="text-2xl font-bold">
              <span className="text-blue-600">Vibed</span> to{" "}
              <span className="text-purple-600">Cracked</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {currentMoodConfig.name} Mode {currentMoodConfig.emoji}
              </span>
              {quizState.timeLeft && (
                <div
                  className={`text-sm font-mono px-3 py-1 rounded ${
                    quizState.timeLeft < 60
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  ⏱️ {formatTime(quizState.timeLeft)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {quiz.title}
                </h1>
                <span className="text-sm text-gray-500">
                  {quizState.currentQuestion + 1} / {questionsToShow.length}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${
                    quizState.currentQuestion === 0
                      ? "w-0"
                      : quizState.currentQuestion === 1
                      ? "w-1/4"
                      : quizState.currentQuestion === 2
                      ? "w-1/2"
                      : quizState.currentQuestion === 3
                      ? "w-3/4"
                      : "w-full"
                  }`}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestionData.question}
              </h2>

              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      quizState.answers[quizState.currentQuestion] === index
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-semibold mr-3">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setQuizState((prev) => ({
                    ...prev,
                    currentQuestion: Math.max(0, prev.currentQuestion - 1),
                  }))
                }
                disabled={quizState.currentQuestion === 0}
                className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  quizState.answers[quizState.currentQuestion] === undefined
                }
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {quizState.currentQuestion === questionsToShow.length - 1
                  ? "Finish Quiz"
                  : "Next Question"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
