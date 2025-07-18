"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { notFound } from "next/navigation";
import CodeEditor from "@/components/CodeEditor";
import { Challenge } from "@/types/practice";
import { getChallengeById } from "@/lib/challengeData";

// Mock challenges data - replaced with modular system

interface ChallengePageProps {
  params: Promise<{ id: string }>;
}

export default function ChallengePage({ params }: ChallengePageProps) {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
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
  const [totalTime, setTotalTime] = useState(0);
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

      const foundChallenge = await getChallengeById(p.id);
      if (!foundChallenge) {
        notFound();
        return;
      }

      setChallenge(foundChallenge);
      setUserCode(foundChallenge.starter);

      // Start timer based on mood
      const moodTimeLimit = getMoodTimeLimit();
      if (moodTimeLimit) {
        setTimeLeft(moodTimeLimit);
        setChallengeStartTime(Date.now());
      }
    };

    resolveParams();
  }, [params, getMoodTimeLimit]);

  // Update total time spent
  useEffect(() => {
    if (challengeStartTime) {
      const updateTotalTime = () => {
        setTotalTime(Math.floor((Date.now() - challengeStartTime) / 1000));
      };

      const interval = setInterval(updateTotalTime, 1000);
      return () => clearInterval(interval);
    }
  }, [challengeStartTime]);

  const runTests = useCallback(async () => {
    if (!challenge) return;

    setIsRunning(true);
    setTestResults(null);

    try {
      // Create a function from user code that we can test
      const testFunction = new Function("return " + userCode)();

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
    }

    setIsRunning(false);
  }, [challenge, userCode]);

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
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
          Loading challenge...
        </div>
      </div>
    );
  }

  const allTestsPassed = testResults?.every((result) => result.passed) ?? false;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
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

  if (!session || !resolvedParams || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Challenge Description */}
          <div className="space-y-6">
            {/* Challenge Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
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

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {challenge.title}
              </h1>

              <p className="text-gray-600 mb-4">{challenge.description}</p>

              <div className="text-sm text-gray-500">
                ⏱️ Estimated time: {challenge.estimatedTime}
              </div>

              {/* Timer Display */}
              {timeLeft !== null && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {currentMood.id === "rush"
                        ? "Rush Mode Timer"
                        : "Grind Mode Timer"}
                    </span>
                    <span
                      className={`text-lg font-bold ${
                        timeLeft <= 60
                          ? "text-red-600"
                          : currentMood.id === "rush"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {Math.floor(timeLeft / 60)}:
                      {(timeLeft % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                  {currentMood.id === "rush" && timeLeft <= 60 && (
                    <div className="text-xs text-red-500 mt-1">
                      ⚡ Auto-submit when timer reaches zero!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mood-Adapted Motivation */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {currentMood.name} Energy 🎯
              </h2>
              <p className="text-purple-700">
                {challenge.moodAdapted[currentMood.id]}
              </p>
            </div>

            {/* Test Cases */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Test Cases
              </h2>
              <div className="space-y-3">
                {challenge.tests.map((test, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      {test.description}
                    </div>
                    <div className="font-mono text-xs text-black dark:bg-black dark:text-white p-2 rounded">
                      Expected: {JSON.stringify(test.expected)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Test Results */}
            {testResults && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Test Results
                </h2>
                <div className="space-y-3">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 ${
                        result.passed
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span
                          className={`text-sm font-semibold ${
                            result.passed ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {result.passed ? "✅ PASS" : "❌ FAIL"}
                        </span>
                        <span className="text-sm text-gray-600 ml-2">
                          {result.description}
                        </span>
                      </div>
                      <div className="font-mono text-black rounded-sm dark:bg-black p-2 dark:text-white text-xs space-y-1">
                        <div>Expected: {JSON.stringify(result.expected)}</div>
                        <div>Actual: {JSON.stringify(result.actual)}</div>
                        {result.error && (
                          <div className="text-red-600">
                            Error: {result.error}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {allTestsPassed && (
                  <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-lg">
                    <div className="text-green-800 font-semibold">
                      🎉 Congratulations! All tests passed!
                    </div>
                    <p className="text-green-700 text-sm mt-1">
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Solution
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={runTests}
                    disabled={isRunning}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                      currentMood.id === "rush"
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : currentMood.id === "grind"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-green-600 text-white hover:bg-green-700"
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
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                </div>
              </div>

              {/* Mood-specific guidance */}
              <div
                className={`mb-4 p-3 rounded-lg border-l-4 ${
                  currentMood.id === "rush"
                    ? "bg-orange-50 border-orange-400"
                    : currentMood.id === "grind"
                    ? "bg-blue-50 border-blue-400"
                    : "bg-green-50 border-green-400"
                }`}
              >
                <div className="text-sm font-medium">
                  {currentMood.id === "rush" &&
                    "⚡ Rush Mode: Quick and efficient solutions!"}
                  {currentMood.id === "grind" &&
                    "🔥 Grind Mode: Detailed, optimized approach"}
                  {currentMood.id === "chill" &&
                    "😌 Chill Mode: Take your time and explore"}
                </div>
                <div className="text-xs text-gray-600 mt-1">
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
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Solution:
                  </h3>
                  <pre className="font-mono text-sm text-yellow-700 whitespace-pre-wrap">
                    {challenge.solution}
                  </pre>
                </div>
              )}
            </div>

            {/* Navigation */}
            {allTestsPassed && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  What&apos;s Next?
                </h2>
                <div className="space-y-3">
                  <Link
                    href="/practice"
                    className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Try Another Challenge
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block w-full bg-gray-600 text-white text-center py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
