"use client";

import React, { useMemo } from "react";
import { AlgorithmVisualizer } from "../AlgorithmVisualizer";
import { generateBubbleSortSteps } from "../utils/algorithmSteps";
import { VisualizerConfig, Mood } from "../types/visualizer.types";

/**
 * BubbleSortVisualizer Component
 * Pre-configured visualizer for Bubble Sort algorithm
 * Can be used directly in MDX tutorials
 */
interface BubbleSortVisualizerProps {
  /** Initial array to sort */
  initialArray?: number[];
  /** User's mood for theming */
  mood?: Mood;
  /** Height of visualizer */
  height?: number;
  /** Custom className */
  className?: string;
}

export function BubbleSortVisualizer({
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  mood = "CHILL",
  height = 500,
  className,
}: BubbleSortVisualizerProps) {
  // Memoize steps generation to prevent infinite re-renders
  const steps = useMemo(() => generateBubbleSortSteps(initialArray), [initialArray]);

  // Memoize config to prevent recreating on every render
  const config: VisualizerConfig = useMemo(
    () => ({
      type: "array" as const,
      algorithm: "Bubble Sort",
      initialData: initialArray,
      showCode: false,
      showComplexity: true,
      interactive: false,
      height,
    }),
    [initialArray, height]
  );

  return (
    <div className={className}>
      <AlgorithmVisualizer config={config} steps={steps} mood={mood} />

      {/* Educational Notes */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          📚 How Bubble Sort Works
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>
            • Compares adjacent elements and swaps if they&apos;re in wrong
            order
          </li>
          <li>• Repeats until no more swaps are needed</li>
          <li>• Largest elements &quot;bubble up&quot; to the end</li>
          <li>• Time Complexity: O(n²) - Not efficient for large datasets</li>
          <li>• Space Complexity: O(1) - Sorts in-place</li>
        </ul>
      </div>
    </div>
  );
}
