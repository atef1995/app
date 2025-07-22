"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { useToastContext } from "@/components/providers/ToastProvider";
import { useUnifiedSubscription } from "@/hooks/useUnifiedSubscription";
import { submitChallengeAction } from "@/lib/actions";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { Challenge } from "@/types/practice";
import { getChallengeBySlug } from "@/lib/challengeData";
import PremiumModal from "@/components/ui/PremiumModal";

// Define achievement type
interface UnlockedAchievement {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const toast = useToastContext();
  const { canAccess, showPremiumModal, setShowPremiumModal } = useUnifiedSubscription();
  const [resolvedParams, setResolvedParams] = useState<{ slug: string } | null>(
    null
  );
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState("");
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    description: string;
    expected: unknown;
    actual: unknown;
    error?: string;
  }> | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [challengeStartTime, setChallengeStartTime] = useState<number | null>(
    null
  );

  // Get mood-specific time limit for challenges
  const getMoodTimeLimit = useCallback(() => {
    switch (currentMood.id) {
      case "rush":
        return 300; // 5 minutes for rush mode
      case "grind":
        return 600; // 10 minutes for grind mode (more time for deeper thinking)
      case "chill":
      default:
        return null; // No time limit for chill mode
    }
  }, [currentMood.id]);

  // Resolve params and load challenge
  useEffect(() => {
    const resolveParams = async () => {
      const p = await params;
      setResolvedParams(p);

      const foundChallenge = await getChallengeBySlug(p.slug);
      if (!foundChallenge) {
        notFound();
        return;
      }

      setChallenge(foundChallenge);
      setUserCode(foundChallenge.starter);

      // Check premium access inline (avoiding dependency loop)
      if (foundChallenge.isPremium && !canAccess(foundChallenge.requiredPlan as "PREMIUM" | "PRO", foundChallenge.isPremium)) {
        setShowPremiumModal(true);
        return;
      }

      // Start timer based on mood
      const moodTimeLimit = getMoodTimeLimit();
      if (moodTimeLimit) {
        setTimeLeft(moodTimeLimit);
        setChallengeStartTime(Date.now());
      }

      // Track challenge start for progress and achievements
      if (session?.user?.id && foundChallenge.id) {
        fetch("/api/challenge/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            challengeId: foundChallenge.id,
          }),
        }).catch((error) => {
          console.error("Failed to mark challenge as started:", error);
        });
      }
    };

    resolveParams();
  }, [params, getMoodTimeLimit]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: canAccess and setShowPremiumModal are excluded to prevent infinite loops

  // Update total time spent
  useEffect(() => {
    if (challengeStartTime) {
      const updateTotalTime = () => {
        // Track time for analytics if needed
        const timeSpent = Math.floor((Date.now() - challengeStartTime) / 1000);
        console.log('Time spent:', timeSpent);
      };

      const interval = setInterval(updateTotalTime, 1000);
      return () => clearInterval(interval);
    }
  }, [challengeStartTime]);

  const runTests = useCallback(async () => {
    if (!challenge) return;

    setIsRunning(true);
    setTestResults(null);
    const startTime = Date.now();

    try {
      // Create a function from user code that we can test
      // Handle both function expressions and function declarations
      let testFunction;
      
      try {
        // First try as function expression (arrow function or function assigned to variable)
        testFunction = new Function("return " + userCode)();
      } catch {
        // If that fails, try evaluating the code directly (for function declarations)
        // Create a sandbox environment to execute the function declaration
        const functionScope: Record<string, unknown> = {};
        new Function("scope", userCode + "; for(let key in this) { if(typeof this[key] === 'function') scope[key] = this[key]; }")
          .call(functionScope, functionScope);
        
        // Find the function in the scope (usually the challenge function name like 'findMax')
        const functionNames = Object.keys(functionScope).filter(key => typeof functionScope[key] === 'function');
        if (functionNames.length > 0) {
          testFunction = functionScope[functionNames[0]] as (...args: unknown[]) => unknown;
        } else {
          throw new Error("No function found in code");
        }
      }

      const results = challenge.tests.map((test) => {
        try {
          const inputArray = Array.isArray(test.input)
            ? test.input
            : [test.input];
          const actual = testFunction(...inputArray);
          const passed =
            JSON.stringify(actual) === JSON.stringify(test.expected);

          return {
            passed,
            description: test.description,
            expected: test.expected,
            actual,
          };
        } catch (error) {
          return {
            passed: false,
            description: test.description,
            expected: test.expected,
            actual: "Error",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      });

      setTestResults(results);

      // Check if all tests passed and submit attempt
      const allPassed = results.every((result) => result.passed);
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      // Submit challenge attempt to track progress and trigger achievements
      if (session?.user?.id) {
        try {
          const result = await submitChallengeAction(
            challenge.id,
            userCode,
            allPassed,
            timeSpent
          );
          
          // Show achievement notifications if any were unlocked
          if (result.success && result.achievements && result.achievements.length > 0) {
            result.achievements.forEach((achievement: UnlockedAchievement) => {
              toast.achievement(
                `🏆 Achievement Unlocked!`,
                `${achievement.achievement.icon} ${achievement.achievement.title} - ${achievement.achievement.description}`
              );
            });
          }
        } catch (error) {
          console.error("Failed to submit challenge attempt:", error);
          // Don't let submission errors break the test run
        }
      }
    } catch (error) {
      setTestResults([
        {
          passed: false,
          description: "Code compilation failed",
          expected: "Valid function",
          actual: "Syntax error",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      ]);

      // Still submit failed attempt for tracking
      if (session?.user?.id) {
        try {
          const timeSpent = Math.round((Date.now() - startTime) / 1000);
          await fetch("/api/challenge/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              challengeId: challenge.id,
              code: userCode,
              passed: false,
              timeSpent,
            }),
          });
        } catch (error) {
          console.error("Failed to submit challenge attempt:", error);
        }
      }
    }

    setIsRunning(false);
  }, [challenge, userCode, session?.user?.id, toast]);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          // Time's up! Auto-submit or show timeout message
          if (currentMood.id === "rush") {
            // In rush mode, auto-run tests when time runs out
            runTests();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentMood.id, runTests]);

  // Loading state
  if (!session || !resolvedParams || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const allTestsPassed = testResults?.every((result) => result.passed) ?? false;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "hard":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      default:
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "algorithm":
        return "🧮";
      case "function":
        return "⚡";
      case "array":
        return "📋";
      case "object":
        return "🗂️";
      case "logic":
        return "🧩";
      default:
        return "💻";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Challenge Description */}
          <div className="space-y-6">
            {/* Challenge Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{getTypeIcon(challenge.type)}</div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                    challenge.difficulty
                  )}`}
                >
                  {challenge.difficulty.toUpperCase()}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {challenge.title}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{challenge.description}</p>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                ⏱️ Estimated time: {challenge.estimatedTime}
              </div>

              {/* Timer Display */}
              {timeLeft !== null && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 border-l-4 border-blue-500 dark:border-blue-400">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {currentMood.id === "rush"
                        ? "Rush Mode Timer"
                        : "Grind Mode Timer"}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        timeLeft <= 60
                          ? "text-red-600 dark:text-red-400"
                          : currentMood.id === "rush"
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}
                    >
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {currentMood.id === "rush" && timeLeft <= 60 && (
                    <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                      ⚡ Auto-submit when timer reaches zero!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mood-Adapted Motivation */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 border-l-4 border-l-purple-500 dark:border-l-purple-400">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {currentMood.name} Energy 🎯
              </h2>
              <p className="text-purple-700 dark:text-purple-300">
                {challenge.moodAdapted[currentMood.id]}
              </p>
            </div>

            {/* Test Cases */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Test Cases
              </h2>
              <div className="space-y-3">
                {challenge.tests.map((test, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                      {test.description}
                    </div>
                    <div className="font-mono text-xs bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-2 rounded border">
                      Expected: {JSON.stringify(test.expected)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Test Results
                </h2>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        result.passed
                          ? "border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                          : "border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-sm font-semibold ${
                            result.passed 
                              ? "text-green-600 dark:text-green-400" 
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {result.passed ? "✅ PASS" : "❌ FAIL"}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                          {result.description}
                        </span>
                      </div>
                      <div className="font-mono bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-sm p-2 text-xs space-y-1 border">
                        <div>Expected: {JSON.stringify(result.expected)}</div>
                        <div>Actual: {JSON.stringify(result.actual)}</div>
                        {result.error && (
                          <div className="text-red-600 dark:text-red-400">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {allTestsPassed && (
                  <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                    <div className="text-green-800 dark:text-green-300 font-semibold">
                      🎉 Congratulations! All tests passed!
                    </div>
                    <p className="text-green-700 dark:text-green-400 text-sm mt-1">
                      You&apos;ve successfully solved this challenge. Ready for
                      the next one?
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Code Editor */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Solution
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={runTests}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      currentMood.id === "rush"
                        ? "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
                        : currentMood.id === "grind"
                        ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                        : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    }`}
                  >
                    {isRunning
                      ? "Running..."
                      : currentMood.id === "rush"
                      ? "⚡ Quick Test"
                      : currentMood.id === "grind"
                      ? "🔥 Test & Verify"
                      : "😌 Test Solution"}
                  </button>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                </div>
              </div>

              {/* Mood-specific guidance */}
              <div
                className={`mb-4 p-3 rounded-lg border-l-4 ${
                  currentMood.id === "rush"
                    ? "bg-orange-50 dark:bg-orange-900/20 border-orange-400 dark:border-orange-500"
                    : currentMood.id === "grind"
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500"
                    : "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-500"
                }`}
              >
                <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {currentMood.id === "rush" &&
                    "⚡ Rush Mode: Quick and efficient solutions!"}
                  {currentMood.id === "grind" &&
                    "🔥 Grind Mode: Detailed, optimized approach"}
                  {currentMood.id === "chill" &&
                    "😌 Chill Mode: Take your time and explore"}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {currentMood.id === "rush" &&
                    "Focus on getting it working fast - optimal solution preferred"}
                  {currentMood.id === "grind" &&
                    "Think through edge cases and write clean, optimized code"}
                  {currentMood.id === "chill" &&
                    "No pressure - experiment and learn at your own pace"}
                </div>
              </div>

              <CodeEditor
                initialCode={userCode}
                height="400px"
                placeholder={
                  currentMood.id === "rush"
                    ? "// Rush mode: Write a quick working solution!"
                    : currentMood.id === "grind"
                    ? "// Grind mode: Think through this step by step..."
                    : "// Chill mode: Take your time and experiment..."
                }
                onCodeChange={setUserCode}
              />

              {showSolution && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Solution:
                  </h3>
                  <pre className="font-mono text-sm text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap">
                    {challenge.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Navigation */}
            {allTestsPassed && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  What&apos;s Next?
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/practice"
                    className="block w-full bg-purple-600 dark:bg-purple-700 text-white text-center py-3 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
                  >
                    Try Another Challenge
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block w-full bg-gray-600 dark:bg-gray-700 text-white text-center py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        requiredPlan={challenge?.requiredPlan as "PREMIUM" | "PRO"}
        contentType="challenge"
        contentTitle={challenge?.title}
      />
    </div>
  );
}
