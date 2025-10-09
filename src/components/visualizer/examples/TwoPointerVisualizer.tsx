"use client";

import React, { useState } from "react";
import { AlgorithmVisualizer } from "../AlgorithmVisualizer";
import { generateTwoPointerSteps } from "../utils/algorithmSteps";
import { VisualizerConfig, Mood } from "../types/visualizer.types";

/**
 * TwoPointerVisualizer Component
 * Pre-configured visualizer for Two Pointer technique
 * Can be used directly in MDX tutorials
 */
interface TwoPointerVisualizerProps {
  /** Initial sorted array */
  initialArray?: number[];
  /** Target sum to find */
  target?: number;
  /** User's mood for theming */
  mood?: Mood;
  /** Height of visualizer */
  height?: number;
  /** Whether to allow custom input */
  interactive?: boolean;
  /** Custom className */
  className?: string;
}

export function TwoPointerVisualizer({
  initialArray = [1, 3, 5, 7, 9, 11, 13, 15],
  target = 16,
  mood = "CHILL",
  height = 400,
  interactive = true,
  className,
}: TwoPointerVisualizerProps) {
  const [array, setArray] = useState(initialArray);
  const [targetSum, setTargetSum] = useState(target);
  const [key, setKey] = useState(0); // Force re-render

  // Generate steps for the algorithm
  const steps = generateTwoPointerSteps(array, targetSum);

  // Configuration
  const config: VisualizerConfig = {
    type: "array",
    algorithm: "Two Pointer Technique",
    initialData: array,
    showCode: false,
    showComplexity: true,
    interactive,
    height,
  };

  const handleUpdateArray = (newArray: string) => {
    try {
      const parsed = newArray
        .split(",")
        .map((n) => parseInt(n.trim()))
        .filter((n) => !isNaN(n));
      if (parsed.length > 0) {
        setArray(parsed.sort((a, b) => a - b)); // Keep sorted
        setKey((k) => k + 1); // Force re-render
      }
    } catch (error) {
      console.error("Invalid array input:" + error);
    }
  };

  const handleUpdateTarget = (newTarget: string) => {
    const parsed = parseInt(newTarget);
    if (!isNaN(parsed)) {
      setTargetSum(parsed);
      setKey((k) => k + 1); // Force re-render
    }
  };

  return (
    <div className={className}>
      {/* Interactive Controls */}
      {interactive && (
        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
            🎮 Try It Yourself
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                Array (comma-separated, will be sorted):
              </label>
              <input
                type="text"
                defaultValue={array.join(", ")}
                onBlur={(e) => handleUpdateArray(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., 1, 3, 5, 7, 9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-800 dark:text-purple-200 mb-1">
                Target Sum:
              </label>
              <input
                type="number"
                defaultValue={targetSum}
                onBlur={(e) => handleUpdateTarget(e.target.value)}
                className="w-full px-3 py-2 border border-purple-300 dark:border-purple-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="e.g., 16"
              />
            </div>
          </div>
        </div>
      )}

      {/* Visualizer */}
      <AlgorithmVisualizer
        key={key}
        config={config}
        steps={steps}
        mood={mood}
      />

      {/* Educational Notes */}
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          📚 Two Pointer Technique
        </h4>
        <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
          <li>• Uses two pointers moving from opposite ends of sorted array</li>
          <li>• Move left pointer right if sum is too small</li>
          <li>• Move right pointer left if sum is too large</li>
          <li>• Time Complexity: O(n) - Single pass through array</li>
          <li>• Space Complexity: O(1) - Only uses two pointer variables</li>
          <li>
            • <strong>Key Requirement:</strong> Array must be sorted
          </li>
        </ul>
      </div>
    </div>
  );
}
