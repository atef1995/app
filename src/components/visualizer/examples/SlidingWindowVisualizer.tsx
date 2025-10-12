"use client";

import React, { useState, useMemo } from "react";
import { AlgorithmVisualizer } from "../AlgorithmVisualizer";
import { generateSlidingWindowSteps } from "../utils/algorithmSteps";
import { VisualizerConfig, Mood } from "../types/visualizer.types";

/**
 * SlidingWindowVisualizer Component
 *
 * Interactive visualizer for the sliding window pattern.
 * Demonstrates finding maximum sum of k consecutive elements.
 *
 * **Features:**
 * - Fixed-size window visualization
 * - Shows window sliding through array
 * - Highlights current and maximum windows
 * - Tracks sum calculations
 * - Interactive controls for custom input
 *
 * **Use Cases:**
 * - Maximum/minimum of k-sized subarrays
 * - Average calculations over windows
 * - Moving averages in time series
 * - Rate limiting with time windows
 *
 * @example
 * ```tsx
 * <SlidingWindowVisualizer
 *   initialArray={[2, 1, 5, 1, 3, 2]}
 *   windowSize={3}
 *   mood="CHILL"
 * />
 * ```
 */
interface SlidingWindowVisualizerProps {
  /** Initial array of numbers */
  initialArray?: number[];
  /** Size of the sliding window */
  windowSize?: number;
  /** User's mood for theming */
  mood?: Mood;
  /** Height of visualizer */
  height?: number;
  /** Whether to allow custom input */
  interactive?: boolean;
  /** Custom className */
  className?: string;
}

export function SlidingWindowVisualizer({
  initialArray = [2, 1, 5, 1, 3, 2],
  windowSize = 3,
  mood = "CHILL",
  height = 400,
  interactive = true,
  className,
}: SlidingWindowVisualizerProps) {
  const [array, setArray] = useState(initialArray);
  const [k, setK] = useState(windowSize);
  const [key, setKey] = useState(0); // Force re-render

  // Memoize steps generation to prevent infinite re-renders
  const steps = useMemo(() => {
    // Validate window size
    if (k > array.length || k < 1) {
      return [];
    }
    return generateSlidingWindowSteps(array, k);
  }, [array, k]);

  // Memoize config to prevent recreating on every render
  const config: VisualizerConfig = useMemo(
    () => ({
      type: "array" as const,
      algorithm: "Sliding Window Pattern",
      initialData: array,
      showCode: false,
      showComplexity: true,
      interactive,
      height,
    }),
    [array, interactive, height]
  );

  const handleUpdateArray = (newArray: string) => {
    try {
      const parsed = newArray
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (parsed.length > 0) {
        setArray(parsed);
        // Adjust window size if it's too large
        if (k > parsed.length) {
          setK(Math.max(1, parsed.length));
        }
        setKey((prevKey) => prevKey + 1); // Force re-render
      }
    } catch (error) {
      console.error("Invalid array input:", error);
    }
  };

  const handleUpdateWindowSize = (newSize: string) => {
    const parsed = parseInt(newSize);
    if (!isNaN(parsed) && parsed > 0 && parsed <= array.length) {
      setK(parsed);
      setKey((prevKey) => prevKey + 1); // Force re-render
    }
  };

  return (
    <div className={className}>
      {/* Interactive Controls */}
      {interactive && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            🎮 Try It Yourself
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Array (comma-separated numbers):
              </label>
              <input
                type="text"
                defaultValue={array.join(", ")}
                onBlur={(e) => handleUpdateArray(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., 2, 1, 5, 1, 3, 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Window Size (k):
              </label>
              <input
                type="number"
                defaultValue={k}
                min={1}
                max={array.length}
                onBlur={(e) => handleUpdateWindowSize(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., 3"
              />
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Must be between 1 and {array.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Visualizer */}
      {steps.length > 0 ? (
        <AlgorithmVisualizer
          key={key}
          config={config}
          steps={steps}
          mood={mood}
        />
      ) : (
        <div className="p-8 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">
            Invalid window size. Please ensure 1 ≤ k ≤ array length.
          </p>
        </div>
      )}

      {/* Educational Notes */}
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          📚 Sliding Window Pattern (Fixed Size)
        </h4>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>
            • <strong>Goal:</strong> Find maximum sum of {k} consecutive
            elements
          </li>
          <li>
            • <strong>Strategy:</strong> Calculate first window, then slide by
            removing left element and adding right element
          </li>
          <li>
            • <strong>Time Complexity:</strong> O(n) - Single pass through
            array
          </li>
          <li>
            • <strong>Space Complexity:</strong> O(1) - Only store window sum
            and max
          </li>
          <li>
            • <strong>Optimization:</strong> Instead of recalculating entire
            window (O(k)), we reuse previous sum (O(1))
          </li>
          <li>
            • <strong>Brute Force:</strong> O(n·k) checking every window from
            scratch
          </li>
        </ul>
      </div>

      {/* Key Insights */}
      <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
          💡 Key Insights
        </h4>
        <div className="text-sm text-purple-800 dark:text-purple-200 space-y-2">
          <div>
            <strong>Sliding Formula:</strong>
            <code className="block mt-1 p-2 bg-purple-100 dark:bg-purple-900/40 rounded font-mono text-xs">
              newSum = oldSum - leftElement + rightElement
            </code>
          </div>
          <div>
            <strong>Example with array [2, 1, 5, 1, 3, 2], k=3:</strong>
            <ul className="mt-1 space-y-1 pl-4">
              <li>• Window [2,1,5]: sum = 8</li>
              <li>• Window [1,5,1]: sum = 8 - 2 + 1 = 7 (no recalculation!)</li>
              <li>• Window [5,1,3]: sum = 7 - 1 + 3 = 9 ← Maximum</li>
              <li>• Window [1,3,2]: sum = 9 - 5 + 2 = 6</li>
            </ul>
          </div>
          <div>
            <strong>Common Applications:</strong>
            <ul className="mt-1 space-y-1 pl-4">
              <li>• Stock prices: Find best k-day trading window</li>
              <li>• Sensor data: Moving averages over time windows</li>
              <li>• Rate limiting: Track requests in last k seconds</li>
              <li>• Stream processing: Aggregate over fixed-size buffers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
