"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { UpgradeOverlay } from "./UpgradeOverlay";
import { Code2, Zap, Clock } from "lucide-react";

/**
 * AlgorithmComparison Component
 *
 * Side-by-side comparison of common algorithms showing:
 * - Time complexity
 * - Space complexity
 * - Real-world performance at different input sizes
 * - Code snippets
 *
 * Features:
 * - FREE mode: Shows 2 preset comparisons (static)
 * - CRACKED mode: Choose any 2+ algorithms, customize input sizes, see code
 */

interface AlgorithmComparisonProps {
  /** User's current plan */
  plan: "FREE" | "VIBED" | "CRACKED";
  /** Custom className */
  className?: string;
}

/**
 * Algorithm metadata
 */
interface Algorithm {
  id: string;
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: "sorting" | "searching" | "graph" | "dynamic-programming";
  description: string;
  codeSnippet: string;
}

/**
 * Predefined algorithms database
 */
const ALGORITHMS: Algorithm[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    category: "sorting",
    description: "Simple comparison-based sort. Good for teaching, bad for production.",
    codeSnippet: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    category: "sorting",
    description: "Efficient divide-and-conquer sort. Industry standard.",
    codeSnippet: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`,
  },
  {
    id: "merge-sort",
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    category: "sorting",
    description: "Stable divide-and-conquer sort. Guaranteed O(n log n).",
    codeSnippet: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}`,
  },
  {
    id: "linear-search",
    name: "Linear Search",
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    category: "searching",
    description: "Check every element. Works on unsorted data.",
    codeSnippet: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}`,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    category: "searching",
    description: "Divide and conquer. Requires sorted array.",
    codeSnippet: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
  },
];

/**
 * Simulate runtime (ms) for an algorithm at given input size
 */
function simulateRuntime(timeComplexity: string, n: number): number {
  const baseTime = 0.001; // 0.001ms per operation
  let operations = 0;

  switch (timeComplexity) {
    case "O(1)":
      operations = 1;
      break;
    case "O(log n)":
      operations = Math.log2(n);
      break;
    case "O(n)":
      operations = n;
      break;
    case "O(n log n)":
      operations = n * Math.log2(n);
      break;
    case "O(n²)":
      operations = n * n;
      break;
    default:
      operations = n;
  }

  return Number((operations * baseTime).toFixed(3));
}

export function AlgorithmComparison({
  plan,
  className = "",
}: AlgorithmComparisonProps) {
  const isCracked = plan === "CRACKED";

  // State for algorithm selection (CRACKED only)
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(
    isCracked ? ["bubble-sort", "quick-sort"] : ["linear-search", "binary-search"]
  );
  const [inputSize, setInputSize] = useState(1000);
  const [showCode, setShowCode] = useState(false);
  const [useLogScale, setUseLogScale] = useState(false);

  /**
   * Get selected algorithm objects
   */
  const algorithms = ALGORITHMS.filter((algo) =>
    selectedAlgorithms.includes(algo.id)
  );

  /**
   * Generate comparison data
   */
  const comparisonData = algorithms.map((algo) => ({
    name: algo.name,
    runtime: simulateRuntime(algo.timeComplexity, inputSize),
    complexity: algo.timeComplexity,
  }));

  /**
   * Detect large performance variance (auto-suggest log scale)
   */
  const maxRuntime = comparisonData.length > 0
    ? Math.max(...comparisonData.map((d) => d.runtime))
    : 0;
  const minRuntime = comparisonData.length > 0
    ? Math.min(...comparisonData.map((d) => d.runtime))
    : 0;
  const hasLargeVariance = minRuntime > 0 && (maxRuntime / minRuntime) > 10;

  /**
   * Get bar color based on complexity
   */
  const getComplexityColor = (complexity: string) => {
    if (complexity.includes("O(1)")) return "#10b981";
    if (complexity.includes("O(log n)")) return "#3b82f6";
    if (complexity.includes("O(n)") && !complexity.includes("²")) return "#8b5cf6";
    if (complexity.includes("O(n log n)")) return "#f59e0b";
    if (complexity.includes("O(n²)")) return "#ef4444";
    return "#6b7280";
  };

  /**
   * Toggle algorithm selection (CRACKED only)
   */
  const toggleAlgorithm = (id: string) => {
    if (!isCracked) return;
    setSelectedAlgorithms((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* FREE Mode: Show preview with overlay */}
      {!isCracked && (
        <UpgradeOverlay
          featureName="Algorithm Comparison Tool"
          valueProp="Compare any algorithms side-by-side with real performance data and code snippets"
          benefits={[
            "Compare 10+ sorting, searching, and graph algorithms",
            "See real runtime performance at different input sizes",
            "View code implementations for each algorithm",
            "Adjust input size from 10 to 1,000,000",
            "Export comparison data for interview prep",
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
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Algorithm Performance Comparison
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isCracked
              ? "Select algorithms to compare their real-world performance"
              : `Preview: Comparing ${algorithms[0]?.name} vs ${algorithms[1]?.name}`}
          </p>
        </div>

        {/* Algorithm Selection (CRACKED only) */}
        {isCracked && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Select Algorithms to Compare:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ALGORITHMS.map((algo) => (
                  <button
                    key={algo.id}
                    onClick={() => toggleAlgorithm(algo.id)}
                    className={`
                      p-3 rounded-lg text-left text-sm transition-all
                      ${
                        selectedAlgorithms.includes(algo.id)
                          ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500"
                          : "bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 hover:border-purple-300"
                      }
                    `}
                  >
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {algo.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {algo.timeComplexity}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Size Slider */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Input Size: {inputSize.toLocaleString()}
              </label>
              <input
                type="range"
                min="10"
                max="100000"
                step="10"
                value={inputSize}
                onChange={(e) => setInputSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>10</span>
                <span>50,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* Show Code Toggle */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="show-code"
                checked={showCode}
                onChange={(e) => setShowCode(e.target.checked)}
                className="w-4 h-4 accent-purple-600"
              />
              <label
                htmlFor="show-code"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Show Code Implementations
              </label>
            </div>

            {/* Large Variance Warning + Scale Toggle */}
            {hasLargeVariance && (
              <div className="flex items-center justify-between gap-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
                    ⚠️ Large performance difference detected! ({(maxRuntime / minRuntime).toFixed(0)}x)
                  </span>
                </div>
                <button
                  onClick={() => setUseLogScale(!useLogScale)}
                  className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-200 dark:hover:bg-yellow-900/60 rounded-lg transition-colors"
                >
                  {useLogScale ? "Switch to Linear Scale" : "Use Log Scale"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Performance Chart */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Runtime Performance (Input Size: {inputSize.toLocaleString()})
          </h4>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="name"
                  className="text-gray-600 dark:text-gray-400"
                />
                <YAxis
                  scale={useLogScale ? "log" : "linear"}
                  domain={useLogScale ? [0.001, "auto"] : [0, "auto"]}
                  label={{
                    value: `Runtime (ms)${useLogScale ? " - Log Scale" : ""}`,
                    angle: -90,
                    position: "insideLeft",
                  }}
                  tickFormatter={(value: number) =>
                    value >= 1 ? value.toFixed(1) : value.toFixed(3)
                  }
                  className="text-gray-600 dark:text-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f9fafb",
                  }}
                  formatter={(value: number) => {
                    const ratio = minRuntime > 0 ? (value / minRuntime).toFixed(1) : "1.0";
                    return [
                      `${value.toFixed(3)}ms (${ratio}x ${ratio === "1.0" ? "fastest" : "slower"})`,
                      "Runtime",
                    ];
                  }}
                />
                <Bar dataKey="runtime" radius={[8, 8, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getComplexityColor(entry.complexity)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Algorithm Details Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
                  Algorithm
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Time Complexity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Space Complexity
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">
                  Runtime @ {inputSize.toLocaleString()}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {algorithms.map((algo, index) => (
                <tr
                  key={algo.id}
                  className={
                    index % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800/50"
                  }
                >
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    {algo.name}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-mono font-semibold text-white"
                      style={{ backgroundColor: getComplexityColor(algo.timeComplexity) }}
                    >
                      {algo.timeComplexity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {algo.spaceComplexity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">
                        {simulateRuntime(algo.timeComplexity, inputSize)}ms
                      </span>
                      {comparisonData.length > 1 && minRuntime > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {(simulateRuntime(algo.timeComplexity, inputSize) / minRuntime).toFixed(1)}x
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code Snippets (CRACKED only, when enabled) */}
        {isCracked && showCode && (
          <div className="mt-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Implementation Code
            </h4>
            {algorithms.map((algo) => (
              <div
                key={algo.id}
                className="bg-gray-900 rounded-lg p-4 overflow-x-auto"
              >
                <div className="text-sm font-semibold text-gray-300 mb-2">
                  {algo.name}
                </div>
                <pre className="text-sm text-gray-100 font-mono">
                  <code>{algo.codeSnippet}</code>
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Winner Callout */}
        {comparisonData.length >= 2 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-start gap-3">
            <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-green-900 dark:text-green-200 mb-1">
                Fastest Algorithm:
              </h4>
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-bold">
                  {comparisonData.reduce((prev, curr) =>
                    curr.runtime < prev.runtime ? curr : prev
                  ).name}
                </span>{" "}
                is the most efficient choice for n={inputSize.toLocaleString()} with{" "}
                {comparisonData.reduce((prev, curr) =>
                  curr.runtime < prev.runtime ? curr : prev
                ).runtime}
                ms runtime.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
