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
  slug: string;
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
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const { currentMood } = useMood();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [tutorialNavigation, setTutorialNavigation] = useState<{
    current: { id: string; slug: string; title: string; order: number };
    prev: { id: string; slug: string; title: string; order: number } | null;
    next: { id: string; slug: string; title: string; order: number } | null;
  } | null>(null);
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    startTime: Date.now(),
  });

  // Fetch quiz data from API using slug
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quizzes/slug/${resolvedParams.slug}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data.quiz);
          
          // Fetch tutorial navigation if quiz has tutorial info
          if (data.quiz?.tutorialId) {
            const navResponse = await fetch(`/api/tutorials/navigation?tutorialId=${data.quiz.tutorialId}`);
            if (navResponse.ok) {
              const navData = await navResponse.json();
              if (navData.success) {
                setTutorialNavigation(navData.data);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoadingQuiz(false);
      }
    };

    fetchQuiz();
  }, [resolvedParams.slug]);

  // Fun cheat attempt messages
  const cheatMessages = useCallback(
    () => [
      "Bruh, really? 💀 Just use your brain instead of trying to copy!",
      "Caught you red-handed! 🚨 No cap, cheating ain't it chief",
      "Sus behavior detected 👀 Stop trying to cheat and actually learn!",
      "Yo, we see you! 😂 Put those copy skills toward learning JavaScript",
      "Nice try, but we're not NPCs 🤖 Close those dev tools and focus!",
      "Sheesh! 😬 Imagine trying to cheat on a learning platform...",
      "This ain't it, bestie 💅 Learn it properly or you'll get rekt later",
      "Dev tools? In MY quiz? 🤡 Close them or get yeeted out!",
      "Stop the cap! 🧢 We know you're trying to cheat - just don't!",
      "Skill issue detected 📉 Maybe try actually reading the tutorial?",
    ],
    []
  );

  const showCheatMessage = useCallback(() => {
    const messages = cheatMessages();
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Create a fun popup that can't be easily dismissed
    const messageEl = document.createElement("div");
    messageEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #ef4444;
      color: white;
      padding: 20px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
      animation: shake 0.5s ease-in-out infinite;
      text-align: center;
      max-width: 400px;
    `;
    messageEl.innerHTML = `
      <div>🚨 CHEAT DETECTED 🚨</div>
      <div style="margin: 10px 0; font-size: 16px;">${randomMessage}</div>
      <div style="font-size: 14px; opacity: 0.9;">Attempt #${
        cheatAttempts + 1
      }</div>
    `;

    // Add shake animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
        25% { transform: translate(-50%, -50%) rotate(-2deg); }
        75% { transform: translate(-50%, -50%) rotate(2deg); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(messageEl);

    setCheatAttempts((prev) => prev + 1);

    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(messageEl)) {
        document.body.removeChild(messageEl);
      }
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    }, 3000);

    // If too many attempts, redirect them
    if (cheatAttempts >= 4) {
      setTimeout(() => {
        alert("Too many cheat attempts! Time to actually study 📚");
        const redirectSlug = tutorialNavigation?.current?.slug || resolvedParams.slug;
        router.push(`/tutorials/${redirectSlug}`);
      }, 3500);
    }
  }, [cheatAttempts, router, resolvedParams.slug, cheatMessages, tutorialNavigation]);

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

    // Submit quiz results to backend with full question set for normalized scoring
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorialId: quiz.id, // Use quiz ID for backend submission
          answers: quizState.answers,
          timeSpent: timeTaken,
          quizData: {
            questions: quiz.questions, // Send full question set for normalized scoring
            passingScore: 70, // 70% passing score
          },
          uiQuestions: questionsToShow, // Send filtered questions for UI reference
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

  // Enhanced anti-cheat system with dev tools detection
  useEffect(() => {
    let devToolsOpen = false;

    // Detect dev tools by checking window dimensions and console
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      // Console detection trick
      let consoleOpen = false;
      const element = new Image();
      Object.defineProperty(element, "id", {
        get: function () {
          consoleOpen = true;
          throw new Error("Dev tools detected!");
        },
      });

      try {
        console.log(element);
        console.clear();
      } catch {
        consoleOpen = true;
      }

      if ((widthThreshold || heightThreshold || consoleOpen) && !devToolsOpen) {
        devToolsOpen = true;
        showCheatMessage();

        // Extra spicy message for dev tools
        setTimeout(() => {
          if (devToolsOpen) {
            const messages = [
              "Bruh close the dev tools 😤 This isn't inspect element simulator",
              "Console.log('stop_cheating') 💻 We see those dev tools homie",
              "Element inspector? More like skill inspector 🔍 and yours is missing!",
            ];
            alert(messages[Math.floor(Math.random() * messages.length)]);
          }
        }, 1000);
      } else if (
        !widthThreshold &&
        !heightThreshold &&
        !consoleOpen &&
        devToolsOpen
      ) {
        devToolsOpen = false;
      }
    };

    // Check for dev tools every 500ms
    const devToolsCheckInterval = setInterval(detectDevTools, 500);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts and show funny messages
      if (
        (e.ctrlKey &&
          (e.key === "c" || e.key === "a" || e.key === "v" || e.key === "x")) ||
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.shiftKey && e.key === "J") ||
        (e.ctrlKey && e.shiftKey && e.key === "C") ||
        (e.ctrlKey && e.key === "u") ||
        (e.ctrlKey && e.key === "s")
      ) {
        e.preventDefault();
        e.stopPropagation();
        showCheatMessage();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showCheatMessage();
    };

    // Disable drag and drop
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showCheatMessage();
    };

    // Disable text selection via mouse
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      showCheatMessage();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("selectstart", handleSelectStart);

    // Initial dev tools check
    detectDevTools();

    // Show warning message on quiz start
    const warningEl = document.createElement("div");
    warningEl.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #fbbf24;
      color: #92400e;
      padding: 15px;
      border-radius: 8px;
      font-weight: bold;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    warningEl.innerHTML = `
      <div>⚠️ Anti-Cheat Active</div>
      <div style="font-size: 12px; margin-top: 5px; font-weight: normal;">
        We're watching 👀 No copying, dev tools, or sus behavior!
      </div>
    `;
    document.body.appendChild(warningEl);

    // Remove warning after 5 seconds
    setTimeout(() => {
      if (document.body.contains(warningEl)) {
        document.body.removeChild(warningEl);
      }
    }, 5000);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("selectstart", handleSelectStart);
      if (devToolsCheckInterval) {
        clearInterval(devToolsCheckInterval);
      }
    };
  }, [cheatAttempts, showCheatMessage]);

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
                    href={tutorialNavigation?.current?.slug ? `/tutorials/${tutorialNavigation.current.slug}` : `/tutorials`}
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

  const currentQuestionData = questionsToShow[quizState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 select-none">
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg select-none">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {quiz.title}
                </h1>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {quizState.currentQuestion + 1} / {questionsToShow.length}
                </span>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 ${
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
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 select-none">
                {currentQuestionData.question}
              </h2>

              <div className="space-y-3 select-none">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all select-none ${
                      quizState.answers[quizState.currentQuestion] === index
                        ? "border-blue-500 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    <span className="font-semibold mr-3 select-none">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="select-none">{option}</span>
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
                className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={
                  quizState.answers[quizState.currentQuestion] === undefined
                }
                className="bg-blue-600 dark:bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
