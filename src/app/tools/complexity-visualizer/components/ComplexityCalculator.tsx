"use client";

import React, { useState } from "react";
import { UpgradeOverlay } from "./UpgradeOverlay";
import { Calculator, Code, Info, AlertCircle } from "lucide-react";

/**
 * ComplexityCalculator Component
 *
 * Interactive tool to analyze code and calculate Big O complexity
 *
 * Features:
 * - FREE mode: Shows 2 pre-analyzed examples (read-only)
 * - CRACKED mode: Paste any code, get AI-powered analysis
 * - Step-by-step complexity breakdown
 * - Visual loop/recursion detection
 * - Interview-ready explanation generation
 */

interface ComplexityCalculatorProps {
  /** User's current plan */
  plan: "FREE" | "VIBED" | "CRACKED";
  /** Custom className */
  className?: string;
}

/**
 * Pre-analyzed code example
 */
interface CodeExample {
  id: string;
  title: string;
  code: string;
  timeComplexity: string;
  spaceComplexity: string;
  breakdown: string[];
  explanation: string;
}

/**
 * Predefined examples for FREE users
 */
const EXAMPLE_ANALYSES: CodeExample[] = [
  {
    id: "nested-loops",
    title: "Nested Loops",
    code: `function findPairs(arr) {
  const pairs = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      pairs.push([arr[i], arr[j]]);
    }
  }
  return pairs;
}`,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(n²)",
    breakdown: [
      "Outer loop runs n times",
      "Inner loop runs n-1, n-2, ..., 1 times",
      "Total iterations: n(n-1)/2 ≈ n²/2",
      "Dropping constants: O(n²)",
    ],
    explanation:
      "This function has O(n²) time complexity because of the nested loops. The outer loop runs n times, and for each iteration, the inner loop runs approximately n times, resulting in n × n = n² operations.",
  },
  {
    id: "binary-search",
    title: "Binary Search",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    breakdown: [
      "Array is halved each iteration",
      "If n = 16: 16 → 8 → 4 → 2 → 1 (4 steps)",
      "Pattern: log₂(n) iterations",
      "Space: Only a few variables (constant)",
    ],
    explanation:
      "Binary search has O(log n) time complexity because we eliminate half the search space in each iteration. With each comparison, we either find the target or narrow the search to half the remaining elements.",
  },
];

/**
 * Analyze code complexity (simplified simulation for demo)
 */
function analyzeCode(code: string): CodeExample {
  // This is a simplified simulation
  // In production, you'd use an AI API or AST parser

  const hasNestedLoops = /for.*for/s.test(code) || /while.*for/s.test(code);
  const hasRecursion = code.includes("function") && new RegExp(`${code.match(/function\s+(\w+)/)?.[1]}\\(`).test(code);
  const hasSingleLoop = /for|while/.test(code) && !hasNestedLoops;

  let timeComplexity = "O(n)";
  let spaceComplexity = "O(1)";
  let breakdown: string[] = [];
  let explanation = "";

  if (hasNestedLoops) {
    timeComplexity = "O(n²)";
    breakdown = [
      "Detected nested loops",
      "Outer loop: O(n)",
      "Inner loop: O(n)",
      "Combined: O(n) × O(n) = O(n²)",
    ];
    explanation =
      "This code has nested loops, where each loop iterates over the input. This results in quadratic time complexity O(n²).";
  } else if (hasRecursion) {
    timeComplexity = "O(2ⁿ)";
    spaceComplexity = "O(n)";
    breakdown = [
      "Detected recursion",
      "Each call branches into multiple calls",
      "Creates exponential growth",
      "Stack space needed for recursion depth",
    ];
    explanation =
      "This recursive function appears to have exponential complexity due to multiple recursive calls.";
  } else if (hasSingleLoop) {
    timeComplexity = "O(n)";
    breakdown = [
      "Single loop detected",
      "Iterates through input once",
      "Linear time complexity",
    ];
    explanation = "Single loop iterating through input results in linear O(n) complexity.";
  } else {
    timeComplexity = "O(1)";
    breakdown = [
      "No loops or recursion detected",
      "Constant number of operations",
      "Time complexity is constant",
    ];
    explanation = "Simple operations with no loops result in constant O(1) complexity.";
  }

  return {
    id: "custom",
    title: "Your Code",
    code,
    timeComplexity,
    spaceComplexity,
    breakdown,
    explanation,
  };
}

export function ComplexityCalculator({
  plan,
  className = "",
}: ComplexityCalculatorProps) {
  const isCracked = plan === "CRACKED";

  const [selectedExample, setSelectedExample] = useState(0);
  const [customCode, setCustomCode] = useState("");
  const [analysis, setAnalysis] = useState<CodeExample | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /**
   * Handle code analysis (CRACKED only)
   */
  const handleAnalyze = () => {
    if (!isCracked || !customCode.trim()) return;

    setIsAnalyzing(true);
    // Simulate API delay
    setTimeout(() => {
      const result = analyzeCode(customCode);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1000);
  };

  /**
   * Current example to display
   */
  const currentExample = analysis || EXAMPLE_ANALYSES[selectedExample];

  return (
    <div className={`relative ${className}`}>
      {/* FREE Mode: Show preview with overlay */}
      {!isCracked && (
        <UpgradeOverlay
          featureName="Code Complexity Calculator"
          valueProp="Paste your code and get instant Big O analysis with step-by-step breakdown"
          benefits={[
            "Analyze any code snippet (JavaScript, Python, Java, etc.)",
            "Get detailed time & space complexity breakdown",
            "See step-by-step reasoning for the analysis",
            "Generate interview-ready explanations",
            "Save and compare multiple analyses",
          ]}
          currentPlan={plan}
          className="min-h-[600px]"
        />
      )}

      {/* Content */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${
          !isCracked ? "pointer-events-none select-none" : ""
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Calculator className="w-7 h-7" />
            Complexity Calculator
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isCracked
              ? "Paste your code below to analyze its time and space complexity"
              : "Preview: View pre-analyzed examples"}
          </p>
        </div>

        {/* Example Selector (FREE mode) or Code Input (CRACKED mode) */}
        {!isCracked ? (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Example:
            </label>
            <div className="flex gap-2">
              {EXAMPLE_ANALYSES.map((example, index) => (
                <button
                  key={example.id}
                  onClick={() => setSelectedExample(index)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-semibold transition-all
                    ${
                      selectedExample === index
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  {example.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Code className="inline w-4 h-4 mr-1" />
              Paste Your Code:
            </label>
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="function example(arr) {&#10;  // Your code here...&#10;}"
              className="w-full h-48 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 dark:text-gray-100"
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleAnalyze}
                disabled={!customCode.trim() || isAnalyzing}
                className={`
                  px-6 py-2 rounded-lg font-semibold transition-all
                  ${
                    customCode.trim() && !isAnalyzing
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Complexity"}
              </button>
              <button
                onClick={() => {
                  setCustomCode("");
                  setAnalysis(null);
                }}
                className="px-4 py-2 rounded-lg font-semibold bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Code Display */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Code Being Analyzed:
          </h4>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono">
              <code>{currentExample.code}</code>
            </pre>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Time Complexity */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Time Complexity
            </h4>
            <div className="text-3xl font-bold font-mono text-blue-800 dark:text-blue-300 mb-2">
              {currentExample.timeComplexity}
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              How runtime scales with input size
            </p>
          </div>

          {/* Space Complexity */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Space Complexity
            </h4>
            <div className="text-3xl font-bold font-mono text-green-800 dark:text-green-300 mb-2">
              {currentExample.spaceComplexity}
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Memory usage relative to input size
            </p>
          </div>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Step-by-Step Breakdown
          </h4>
          <div className="space-y-2">
            {currentExample.breakdown.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Explanation */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-200 mb-2">
            Interview-Ready Explanation:
          </h4>
          <p className="text-sm text-purple-800 dark:text-purple-300">
            &ldquo;{currentExample.explanation}&rdquo;
          </p>
        </div>

        {/* Tips for FREE users */}
        {!isCracked && (
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Unlock More:
            </h4>
            <ul className="text-sm text-yellow-800 dark:text-yellow-300 space-y-1">
              <li>• Analyze your own code snippets</li>
              <li>• Support for multiple programming languages</li>
              <li>• Save and compare multiple analyses</li>
              <li>• Export analysis reports for interview prep</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
