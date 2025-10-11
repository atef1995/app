"use client";

import React, { useMemo } from "react";
import { AlgorithmVisualizer } from "../AlgorithmVisualizer";
import { generateSelectionSortSteps } from "../utils/algorithmSteps";
import type { VisualizerConfig } from "../types/visualizer.types";

export interface SelectionSortVisualizerProps {
  /**
   * Initial array to sort
   */
  initialArray?: number[];

  /**
   * User's current mood (affects animation speed and styling)
   */
  mood?: "CHILL" | "RUSH" | "GRIND";

  /**
   * Height of the visualizer in pixels
   */
  height?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * SelectionSortVisualizer Component
 *
 * Interactive visualizer for Selection Sort algorithm.
 * Shows step-by-step execution with highlighted comparisons and swaps.
 *
 * How Selection Sort Works:
 * 1. Find the minimum element in the unsorted portion
 * 2. Swap it with the first unsorted element
 * 3. Move the boundary between sorted and unsorted portions
 * 4. Repeat until array is fully sorted
 *
 * Features:
 * - Green highlight shows current minimum element
 * - Yellow highlight shows element being compared
 * - Red highlight shows swap operation
 * - Step counter tracks comparisons and swaps
 * - Play/Pause/Step/Reset controls
 * - Mood-based animation speeds
 *
 * @example
 * ```tsx
 * <SelectionSortVisualizer
 *   initialArray={[64, 34, 25, 12, 22, 11, 90]}
 *   mood="CHILL"
 * />
 * ```
 */
export function SelectionSortVisualizer({
  initialArray = [64, 34, 25, 12, 22, 11, 90],
  mood = "CHILL",
  height = 500,
  className,
}: SelectionSortVisualizerProps) {
  // Memoize steps generation to prevent infinite re-renders
  const steps = useMemo(() => generateSelectionSortSteps(initialArray), [initialArray]);

  // Memoize config to prevent recreating on every render
  const config: VisualizerConfig = useMemo(
    () => ({
      type: "array" as const,
      algorithm: "Selection Sort",
      initialData: initialArray,
      showCode: false,
      showComplexity: true,
      interactive: false,
      height,
    }),
    [initialArray, height]
  );

  return (
    <AlgorithmVisualizer
      config={config}
      steps={steps}
      mood={mood}
      className={className}
    />
  );
}
