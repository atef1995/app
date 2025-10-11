"use client";

import React, { useMemo } from "react";
import { BubbleSortVisualizer } from "./BubbleSortVisualizer";
import { SelectionSortVisualizer } from "./SelectionSortVisualizer";
import {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
} from "../utils/algorithmSteps";

export interface SortingComparisonVisualizerProps {
  /**
   * Initial array to sort (same for both algorithms)
   */
  initialArray?: number[];

  /**
   * User's current mood (affects animation speed)
   */
  mood?: "CHILL" | "RUSH" | "GRIND";

  /**
   * Height of each visualizer panel in pixels
   */
  height?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SortingComparisonVisualizer Component
 *
 * Side-by-side comparison of Bubble Sort vs Selection Sort.
 * Shows both algorithms running on the same input array.
 *
 * Features:
 * - Two synchronized visualization panels
 * - Same input array for fair comparison
 * - Individual step counters for each algorithm
 * - Comparison metrics (comparisons, swaps)
 * - Winner indicator (algorithm with fewer steps)
 * - Independent controls for each visualizer
 *
 * Educational Purpose:
 * - Compare algorithm efficiency visually
 * - See different approaches to same problem
 * - Understand trade-offs between algorithms
 * - Build intuition before formal complexity analysis
 *
 * @example
 * ```tsx
 * <SortingComparisonVisualizer
 *   initialArray={[64, 34, 25, 12, 22, 11, 90]}
 *   mood="CHILL"
 * />
 * ```
 */
export function SortingComparisonVisualizer({
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  mood = "CHILL",
  height = 400,
  className = "",
}: SortingComparisonVisualizerProps) {
  // Memoize steps generation to prevent infinite re-renders
  const bubbleSteps = useMemo(
    () => generateBubbleSortSteps(initialArray),
    [initialArray]
  );
  const selectionSteps = useMemo(
    () => generateSelectionSortSteps(initialArray),
    [initialArray]
  );

  // Calculate final metrics for comparison
  const bubbleMetrics = bubbleSteps[bubbleSteps.length - 1]?.metrics;
  const selectionMetrics = selectionSteps[selectionSteps.length - 1]?.metrics;

  // Determine winner (fewer comparisons + swaps)
  const bubbleTotalOps =
    (bubbleMetrics?.comparisons || 0) + (bubbleMetrics?.swaps || 0);
  const selectionTotalOps =
    (selectionMetrics?.comparisons || 0) + (selectionMetrics?.swaps || 0);

  const winner =
    bubbleTotalOps < selectionTotalOps
      ? "bubble"
      : selectionTotalOps < bubbleTotalOps
      ? "selection"
      : "tie";

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with comparison metrics */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg p-6 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-4">
          Algorithm Comparison: Bubble Sort vs Selection Sort
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bubble Sort Stats */}
          <div
            className={`bg-black/40 rounded-lg p-4 border ${
              winner === "bubble"
                ? "border-green-500 ring-2 ring-green-500/50"
                : "border-purple-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-purple-300">
                Bubble Sort
              </h4>
              {winner === "bubble" && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                  WINNER
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Comparisons:</span>
                <span className="font-mono text-yellow-400">
                  {bubbleMetrics?.comparisons || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Swaps:</span>
                <span className="font-mono text-red-400">
                  {bubbleMetrics?.swaps || 0}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-1 mt-2">
                <span className="font-semibold">Total Operations:</span>
                <span className="font-mono font-bold text-white">
                  {bubbleTotalOps}
                </span>
              </div>
            </div>
          </div>

          {/* VS Divider */}
          <div className="hidden md:flex items-center justify-center">
            <div className="text-4xl font-bold text-gray-500">VS</div>
          </div>

          {/* Selection Sort Stats */}
          <div
            className={`bg-black/40 rounded-lg p-4 border ${
              winner === "selection"
                ? "border-green-500 ring-2 ring-green-500/50"
                : "border-purple-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-semibold text-blue-300">
                Selection Sort
              </h4>
              {winner === "selection" && (
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                  WINNER
                </span>
              )}
            </div>
            <div className="space-y-1 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Comparisons:</span>
                <span className="font-mono text-yellow-400">
                  {selectionMetrics?.comparisons || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Swaps:</span>
                <span className="font-mono text-red-400">
                  {selectionMetrics?.swaps || 0}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-600 pt-1 mt-2">
                <span className="font-semibold">Total Operations:</span>
                <span className="font-mono font-bold text-white">
                  {selectionTotalOps}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tie message */}
        {winner === "tie" && (
          <div className="mt-4 text-center">
            <p className="text-yellow-400 font-semibold">
              It&apos;s a tie! Both algorithms performed the same number of
              operations.
            </p>
          </div>
        )}

        {/* Educational note */}
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded">
          <p className="text-sm text-blue-200">
            <strong>💡 Notice:</strong> Selection Sort typically makes fewer
            swaps than Bubble Sort, but may make more comparisons. The
            &quot;winner&quot; depends on the specific input data!
          </p>
        </div>
      </div>

      {/* Side-by-side visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bubble Sort Panel */}
        <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
          <h4 className="text-xl font-bold text-purple-300 mb-4">
            Bubble Sort
          </h4>
          <BubbleSortVisualizer
            initialArray={initialArray}
            mood={mood}
            height={height}
          />
          <div className="mt-4 p-3 bg-purple-900/30 rounded text-sm text-gray-300">
            <p className="font-semibold text-purple-300 mb-1">How it works:</p>
            <p>
              Repeatedly compares adjacent elements and swaps them if
              they&apos;re in wrong order.
            </p>
          </div>
        </div>

        {/* Selection Sort Panel */}
        <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
          <h4 className="text-xl font-bold text-blue-300 mb-4">
            Selection Sort
          </h4>
          <SelectionSortVisualizer
            initialArray={initialArray}
            mood={mood}
            height={height}
          />
          <div className="mt-4 p-3 bg-blue-900/30 rounded text-sm text-gray-300">
            <p className="font-semibold text-blue-300 mb-1">How it works:</p>
            <p>
              Finds the minimum element and places it at the beginning of
              unsorted portion.
            </p>
          </div>
        </div>
      </div>

      {/* Key Differences Section */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
        <h4 className="text-xl font-bold text-white mb-4">Key Differences</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h5 className="font-semibold text-purple-300">Bubble Sort:</h5>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>
                Compares <strong>adjacent</strong> elements
              </li>
              <li>
                Swaps happen <strong>frequently</strong>
              </li>
              <li>Larger elements &quot;bubble up&quot; to the end</li>
              <li>Good for nearly sorted data</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-blue-300">Selection Sort:</h5>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>
                Finds <strong>minimum</strong> element each pass
              </li>
              <li>
                Swaps happen <strong>once per pass</strong>
              </li>
              <li>Builds sorted portion from the beginning</li>
              <li>Fewer swaps, more comparisons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
