"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MOODS } from "@/lib/moods";
import { useMood } from "@/components/providers/MoodProvider";
import { ProgressBadge } from "@/components/ProgressComponents";
import { PartyPopper, ThumbsUp, Dumbbell, Star, Book } from "lucide-react";

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

interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResults: boolean;
  timeLeft?: number;
  startTime: number;
  submissionResult?: {
    passed: boolean;
    score: number;
    status: "COMPLETED" | "IN_PROGRESS";
  };
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { currentMood } = useMood();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    startTime: Date.now(),
  });

  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes?id=${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data.quiz);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, [resolvedParams.id]);

  // Define functions early to avoid conditional hook calls
  const calculateScore = useCallback(() => {
    if (!quiz) return { correct: 0, total: 0 };

    const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];
    const filteredQuestions = quiz.questions.filter((q) => {
      if (currentMoodConfig.quizSettings.difficulty === "easy") {
        return q.difficulty === "easy";
      } else if (currentMoodConfig.quizSettings.difficulty === "medium") {
        return q.difficulty === "easy" || q.difficulty === "medium";
      }
      return true;
    });
    const questionsToShow = filteredQuestions.slice(
      0,
      currentMoodConfig.quizSettings.questionsPerTutorial
    );

    let correct = 0;
    quizState.answers.forEach((answer, index) => {
      if (questionsToShow[index] && answer === questionsToShow[index].correct) {
        correct++;
      }
    });
    return { correct, total: questionsToShow.length };
  }, [quiz, currentMood.id, quizState.answers]);

  const handleQuizComplete = useCallback(async () => {
    if (!quiz) return;

    const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];
    const filteredQuestions = quiz.questions.filter((q) => {
      if (currentMoodConfig.quizSettings.difficulty === "easy") {
        return q.difficulty === "easy";
      } else if (currentMoodConfig.quizSettings.difficulty === "medium") {
        return q.difficulty === "easy" || q.difficulty === "medium";
      }
      return true;
    });
    const questionsToShow = filteredQuestions.slice(
      0,
      currentMoodConfig.quizSettings.questionsPerTutorial
    );

    const timeTaken = Math.round((Date.now() - quizState.startTime) / 1000);

    // Submit quiz results to backend
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorialId: resolvedParams.id,
          answers: quizState.answers,
          timeSpent: timeTaken,
          quizData: {
            questions: questionsToShow,
            passingScore: 70, // 70% passing score
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Quiz submitted successfully:", result);

        // Store submission result for UI display
        setQuizState((prev) => ({
          ...prev,
          showResults: true,
          submissionResult: {
            passed: result.passed,
            score: result.score,
            status: result.passed ? "COMPLETED" : "IN_PROGRESS",
          },
        }));
        return;
      } else {
        console.error("Failed to submit quiz");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }

    // Fallback: show results even if submission failed
    setQuizState((prev) => ({
      ...prev,
      showResults: true,
    }));
  }, [
    quiz,
    currentMood.id,
    quizState.startTime,
    quizState.answers,
    resolvedParams.id,
  ]);

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
  }, [session, router]);

  useEffect(() => {
    // Set up timer based on user's mood
    const moodConfig = MOODS[currentMood.id.toLowerCase()];
    if (moodConfig.quizSettings.timeLimit && !quizState.showResults) {
      setQuizState((prev) => ({
        ...prev,
        timeLeft: moodConfig.quizSettings.timeLimit! * 60,
      }));

      const timer = setInterval(() => {
        setQuizState((prev) => {
          if (prev.timeLeft && prev.timeLeft > 0 && !prev.showResults) {
            return { ...prev, timeLeft: prev.timeLeft - 1 };
          } else if (prev.timeLeft === 0) {
            handleQuizComplete();
            return prev;
          }
          return prev;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentMood, quizState.showResults, handleQuizComplete]);

  if (loadingQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

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

  const currentMoodConfig = MOODS[currentMood.id.toLowerCase()];

  // Filter questions based on mood difficulty
  const filteredQuestions =
    quiz?.questions.filter((q) => {
      if (currentMoodConfig.quizSettings.difficulty === "easy") {
        return q.difficulty === "easy";
      } else if (currentMoodConfig.quizSettings.difficulty === "medium") {
        return q.difficulty === "easy" || q.difficulty === "medium";
      }
      return true; // hard mode includes all questions
    }) || [];

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-4 flex justify-center">
                {percentage >= 80 ? (
                  <PartyPopper className="h-16 w-16 text-green-500" />
                ) : percentage >= 60 ? (
                  <ThumbsUp className="h-16 w-16 text-blue-500" />
                ) : (
                  <Dumbbell className="h-16 w-16 text-orange-500" />
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
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

              <p className="text-xl text-gray-600 mb-6">
                You got {correct} out of {total} questions correct!
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Time Taken:</span>
                    <br />
                    <span className="font-semibold text-black">
                      {formatTime(timeTaken)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mood:</span>
                    <br />
                    <span className="font-semibold text-black">
                      {currentMoodConfig.name} {currentMoodConfig.emoji}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {percentage >= 70 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <Star className="h-5 w-5" />
                      Tutorial Completed!
                      <Star className="h-5 w-5" />
                    </p>
                    <p className="text-green-700">
                      Excellent work! You&apos;ve successfully completed this
                      tutorial with a passing score.
                      {percentage >= 80 && " You truly mastered this topic!"}
                    </p>
                  </div>
                ) : percentage >= 60 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 font-semibold flex items-center gap-2">
                      <Book className="h-5 w-5" />
                      Good attempt!
                    </p>
                    <p className="text-yellow-700">
                      You need 70% to complete the tutorial. Review the material
                      and try again!
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold flex items-center gap-2">
                      <Dumbbell className="h-5 w-5" />
                      Keep practicing!
                    </p>
                    <p className="text-red-700">
                      Review the tutorial carefully and try again when
                      you&apos;re ready.
                    </p>
                  </div>
                )}

                <div className="flex gap-4 justify-center">
                  <Link
                    href={`/tutorials/${resolvedParams.id}`}
                    className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Review Tutorial
                  </Link>

                  {percentage >= 70 && parseInt(resolvedParams.id) < 2 && (
                    <Link
                      href={`/tutorials/${parseInt(resolvedParams.id) + 1}`}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Quiz Timer - moved to top of content */}
        {quizState.timeLeft && (
          <div className="max-w-2xl mx-auto mb-4">
            <div
              className={`text-center text-sm font-mono px-3 py-2 rounded-lg ${
                quizState.timeLeft < 60
                  ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                  : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              }`}
            >
              ⏱️ Time Remaining: {formatTime(quizState.timeLeft)}
            </div>
          </div>
        )}
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
                        ? "border-blue-500 bg-blue-100 text-blue-900"
                        : "border-gray-300 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-800"
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
