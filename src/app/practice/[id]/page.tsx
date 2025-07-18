"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";
import { useState, useEffect } from "react";
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
    };

    resolveParams();
  }, [params]);

  const runTests = async () => {
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
  };

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

  const allTestsPassed = testResults?.every((result) => result.passed) ?? false;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/practice" className="text-2xl font-bold">
            <span className="text-blue-600">Vibed</span> to{" "}
            <span className="text-purple-600">Cracked</span>
          </Link>
          <Link
            href="/practice"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Practice
          </Link>
        </div>
      </header>

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
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    {isRunning ? "Running..." : "Run Tests"}
                  </button>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {showSolution ? "Hide Solution" : "Show Solution"}
                  </button>
                </div>
              </div>

              <CodeEditor
                initialCode={userCode}
                height="400px"
                placeholder="// Write your solution here"
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
