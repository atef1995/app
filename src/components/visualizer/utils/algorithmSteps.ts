/**
 * Algorithm Step Generators
 * Functions to generate step-by-step visualizations for various algorithms
 */

import { Step, ArrayState, StepMetrics } from "../types/visualizer.types";
import { generateStepId } from "./animationEngine";

// ============================================================================
// Sorting Algorithms
// ============================================================================

/**
 * Generate steps for Bubble Sort
 */
export function generateBubbleSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const values = [...arr];
  const sorted = new Array(values.length).fill(false);
  const metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    spaceUsed: values.length,
  };

  // Initial state
  steps.push({
    id: generateStepId(0, "start"),
    description: "Starting Bubble Sort",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  const n = values.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      metrics.comparisons++;
      metrics.accesses += 2;

      steps.push({
        id: generateStepId(steps.length, "compare"),
        description: `Comparing ${values[j]} and ${values[j + 1]}`,
        state: {
          type: "array",
          values: [...values],
          sorted: [...sorted],
        },
        comparisons: [j, j + 1],
        operation: "compare",
        metrics: { ...metrics },
      });

      // Swap if needed
      if (values[j] > values[j + 1]) {
        [values[j], values[j + 1]] = [values[j + 1], values[j]];
        metrics.swaps++;

        steps.push({
          id: generateStepId(steps.length, "swap"),
          description: `Swapping ${values[j + 1]} and ${values[j]}`,
          state: {
            type: "array",
            values: [...values],
            sorted: [...sorted],
          },
          swaps: [j, j + 1],
          operation: "swap",
          metrics: { ...metrics },
        });
      }
    }

    // Mark last element as sorted
    sorted[n - 1 - i] = true;
    steps.push({
      id: generateStepId(steps.length, "sorted"),
      description: `${values[n - 1 - i]} is now in its final position`,
      state: {
        type: "array",
        values: [...values],
        sorted: [...sorted],
      },
      highlights: [n - 1 - i],
      metrics: { ...metrics },
    });
  }

  // Mark first element as sorted
  sorted[0] = true;
  steps.push({
    id: generateStepId(steps.length, "complete"),
    description: "Bubble Sort Complete!",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  return steps;
}

/**
 * Generate steps for Selection Sort
 */
export function generateSelectionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const values = [...arr];
  const sorted = new Array(values.length).fill(false);
  const metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    spaceUsed: values.length,
  };

  // Initial state
  steps.push({
    id: generateStepId(0, "start"),
    description: "Starting Selection Sort",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  const n = values.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      id: generateStepId(steps.length, "select"),
      description: `Finding minimum element in unsorted portion`,
      state: {
        type: "array",
        values: [...values],
        sorted: [...sorted],
        pointers: [{ index: i, label: "current", color: "#f59e0b" }],
      },
      highlights: [i],
      metrics: { ...metrics },
    });

    // Find minimum
    for (let j = i + 1; j < n; j++) {
      metrics.comparisons++;
      metrics.accesses += 2;

      steps.push({
        id: generateStepId(steps.length, "compare"),
        description: `Comparing ${values[j]} with current minimum ${values[minIdx]}`,
        state: {
          type: "array",
          values: [...values],
          sorted: [...sorted],
          pointers: [
            { index: minIdx, label: "min", color: "#10b981" },
            { index: j, label: "checking", color: "#f59e0b" },
          ],
        },
        comparisons: [minIdx, j],
        operation: "compare",
        metrics: { ...metrics },
      });

      if (values[j] < values[minIdx]) {
        minIdx = j;
      }
    }

    // Swap if needed
    if (minIdx !== i) {
      metrics.swaps++;
      [values[i], values[minIdx]] = [values[minIdx], values[i]];

      steps.push({
        id: generateStepId(steps.length, "swap"),
        description: `Swapping ${values[minIdx]} with ${values[i]}`,
        state: {
          type: "array",
          values: [...values],
          sorted: [...sorted],
        },
        swaps: [i, minIdx],
        operation: "swap",
        metrics: { ...metrics },
      });
    }

    // Mark as sorted
    sorted[i] = true;
    steps.push({
      id: generateStepId(steps.length, "sorted"),
      description: `${values[i]} is now in its final position`,
      state: {
        type: "array",
        values: [...values],
        sorted: [...sorted],
      },
      highlights: [i],
      metrics: { ...metrics },
    });
  }

  // Mark last element as sorted
  sorted[n - 1] = true;
  steps.push({
    id: generateStepId(steps.length, "complete"),
    description: "Selection Sort Complete!",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  return steps;
}

/**
 * Generate steps for Insertion Sort
 */
export function generateInsertionSortSteps(arr: number[]): Step[] {
  const steps: Step[] = [];
  const values = [...arr];
  const sorted = new Array(values.length).fill(false);
  sorted[0] = true; // First element is always sorted

  const metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    spaceUsed: values.length,
  };

  // Initial state
  steps.push({
    id: generateStepId(0, "start"),
    description: "Starting Insertion Sort. First element is considered sorted.",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  const n = values.length;
  for (let i = 1; i < n; i++) {
    const key = values[i];
    let j = i - 1;

    steps.push({
      id: generateStepId(steps.length, "select"),
      description: `Inserting ${key} into sorted portion`,
      state: {
        type: "array",
        values: [...values],
        sorted: [...sorted],
        pointers: [{ index: i, label: "key", color: "#f59e0b" }],
      },
      highlights: [i],
      metrics: { ...metrics },
    });

    // Shift elements
    while (j >= 0 && values[j] > key) {
      metrics.comparisons++;
      metrics.accesses += 2;

      steps.push({
        id: generateStepId(steps.length, "compare"),
        description: `${values[j]} > ${key}, shifting right`,
        state: {
          type: "array",
          values: [...values],
          sorted: [...sorted],
        },
        comparisons: [j, i],
        operation: "compare",
        metrics: { ...metrics },
      });

      values[j + 1] = values[j];
      metrics.swaps++;
      j--;

      steps.push({
        id: generateStepId(steps.length, "shift"),
        description: `Shifting ${values[j + 2]} to the right`,
        state: {
          type: "array",
          values: [...values],
          sorted: [...sorted],
        },
        operation: "swap",
        metrics: { ...metrics },
      });
    }

    // Insert key
    values[j + 1] = key;

    // Mark position as sorted
    sorted[i] = true;

    steps.push({
      id: generateStepId(steps.length, "insert"),
      description: `Inserted ${key} at position ${j + 1}`,
      state: {
        type: "array",
        values: [...values],
        sorted: [...sorted],
      },
      highlights: [j + 1],
      operation: "insert",
      metrics: { ...metrics },
    });
  }

  steps.push({
    id: generateStepId(steps.length, "complete"),
    description: "Insertion Sort Complete!",
    state: {
      type: "array",
      values: [...values],
      sorted: [...sorted],
    },
    metrics: { ...metrics },
  });

  return steps;
}

// ============================================================================
// Array Manipulation Patterns
// ============================================================================

/**
 * Generate steps for Two Pointer technique
 */
export function generateTwoPointerSteps(arr: number[], target: number): Step[] {
  const steps: Step[] = [];
  const values = [...arr].sort((a, b) => a - b); // Two pointer usually works on sorted array
  const metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    spaceUsed: values.length,
  };

  let left = 0;
  let right = values.length - 1;

  steps.push({
    id: generateStepId(0, "start"),
    description: `Finding two numbers that sum to ${target}`,
    state: {
      type: "array",
      values: [...values],
      pointers: [
        { index: left, label: "left", color: "#10b981" },
        { index: right, label: "right", color: "#f59e0b" },
      ],
    },
    metrics: { ...metrics },
  });

  while (left < right) {
    const sum = values[left] + values[right];
    metrics.comparisons++;
    metrics.accesses += 2;

    steps.push({
      id: generateStepId(steps.length, "check"),
      description: `Checking: ${values[left]} + ${values[right]} = ${sum}`,
      state: {
        type: "array",
        values: [...values],
        pointers: [
          { index: left, label: "left", color: "#10b981" },
          { index: right, label: "right", color: "#f59e0b" },
        ],
      },
      comparisons: [left, right],
      operation: "compare",
      metrics: { ...metrics },
    });

    if (sum === target) {
      steps.push({
        id: generateStepId(steps.length, "found"),
        description: `Found! ${values[left]} + ${values[right]} = ${target}`,
        state: {
          type: "array",
          values: [...values],
          pointers: [
            { index: left, label: "left", color: "#10b981" },
            { index: right, label: "right", color: "#f59e0b" },
          ],
        },
        highlights: [left, right],
        metrics: { ...metrics },
      });
      break;
    } else if (sum < target) {
      left++;
      steps.push({
        id: generateStepId(steps.length, "move-left"),
        description: `Sum too small, move left pointer right`,
        state: {
          type: "array",
          values: [...values],
          pointers: [
            { index: left, label: "left", color: "#10b981" },
            { index: right, label: "right", color: "#f59e0b" },
          ],
        },
        metrics: { ...metrics },
      });
    } else {
      right--;
      steps.push({
        id: generateStepId(steps.length, "move-right"),
        description: `Sum too large, move right pointer left`,
        state: {
          type: "array",
          values: [...values],
          pointers: [
            { index: left, label: "left", color: "#10b981" },
            { index: right, label: "right", color: "#f59e0b" },
          ],
        },
        metrics: { ...metrics },
      });
    }
  }

  return steps;
}

/**
 * Generate steps for Sliding Window technique
 */
export function generateSlidingWindowSteps(
  arr: number[],
  windowSize: number
): Step[] {
  const steps: Step[] = [];
  const values = [...arr];
  const metrics: StepMetrics = {
    comparisons: 0,
    swaps: 0,
    accesses: 0,
    spaceUsed: values.length + 1,
  };

  let maxSum = 0;
  let currentSum = 0;
  let maxStart = 0;

  steps.push({
    id: generateStepId(0, "start"),
    description: `Finding maximum sum of ${windowSize} consecutive elements`,
    state: {
      type: "array",
      values: [...values],
    },
    metrics: { ...metrics },
  });

  // Calculate first window
  for (let i = 0; i < windowSize; i++) {
    currentSum += values[i];
    metrics.accesses++;
  }
  maxSum = currentSum;

  steps.push({
    id: generateStepId(steps.length, "first-window"),
    description: `First window sum: ${currentSum}`,
    state: {
      type: "array",
      values: [...values],
      window: { start: 0, end: windowSize - 1 },
    },
    metrics: { ...metrics },
  });

  // Slide window
  for (let i = windowSize; i < values.length; i++) {
    currentSum = currentSum - values[i - windowSize] + values[i];
    metrics.accesses += 2;

    steps.push({
      id: generateStepId(steps.length, "slide"),
      description: `Sliding window: Remove ${values[i - windowSize]}, Add ${
        values[i]
      }. Sum: ${currentSum}`,
      state: {
        type: "array",
        values: [...values],
        window: { start: i - windowSize + 1, end: i },
      },
      metrics: { ...metrics },
    });

    if (currentSum > maxSum) {
      maxSum = currentSum;
      maxStart = i - windowSize + 1;

      steps.push({
        id: generateStepId(steps.length, "new-max"),
        description: `New maximum sum found: ${maxSum}`,
        state: {
          type: "array",
          values: [...values],
          window: { start: maxStart, end: i },
        },
        highlights: Array.from(
          { length: windowSize },
          (_, idx) => maxStart + idx
        ),
        metrics: { ...metrics },
      });
    }
  }

  steps.push({
    id: generateStepId(steps.length, "complete"),
    description: `Maximum sum is ${maxSum}`,
    state: {
      type: "array",
      values: [...values],
      window: { start: maxStart, end: maxStart + windowSize - 1 },
    },
    highlights: Array.from({ length: windowSize }, (_, idx) => maxStart + idx),
    metrics: { ...metrics },
  });

  return steps;
}
