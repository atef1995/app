"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrayState, ColorScheme } from "./types/visualizer.types";
import { calculateArrayLayout } from "./utils/layoutEngine";

/**
 * ArrayVisualizer Component
 * Visualizes array operations with animations for sorting, searching, and manipulation
 */
interface ArrayVisualizerProps {
  state: ArrayState;
  width: number;
  height: number;
  colorScheme: ColorScheme;
  mode?: "bar" | "block";
  showIndices?: boolean;
  showValues?: boolean;
  highlightedIndices?: number[];
  comparisonIndices?: [number, number] | null;
}

export function ArrayVisualizer({
  state,
  width,
  height,
  colorScheme,
  mode = "block",
  showIndices = true,
  showValues = true,
  highlightedIndices = [],
  comparisonIndices = null,
}: ArrayVisualizerProps) {
  const { values, pointers, window, partitions, sorted } = state;

  // Calculate layout for array elements
  const layout = useMemo(
    () => calculateArrayLayout(values.length, width, height, mode),
    [values.length, width, height, mode]
  );

  // Get maximum value for bar height scaling
  const maxValue = Math.max(...values, 1);

  /**
   * Get color for an element based on its state
   */
  const getElementColor = (index: number): string => {
    // Check if sorted
    if (sorted && sorted[index]) {
      return colorScheme.sorted;
    }

    // Check if being compared
    if (
      comparisonIndices &&
      (comparisonIndices[0] === index || comparisonIndices[1] === index)
    ) {
      return colorScheme.comparison;
    }

    // Check if highlighted
    if (highlightedIndices.includes(index)) {
      return colorScheme.highlight;
    }

    // Check if in window
    if (window && index >= window.start && index <= window.end) {
      return colorScheme.active;
    }

    // Check if in partition
    if (partitions) {
      const partition = partitions.find(
        (p) => index >= p.start && index <= p.end
      );
      if (partition && partition.color) {
        return partition.color;
      }
    }

    return colorScheme.primary;
  };

  /**
   * Get bar height based on value (for bar mode)
   */
  const getBarHeight = (value: number): number => {
    const maxBarHeight = height - 150;
    return (value / maxValue) * maxBarHeight;
  };

  return (
    <svg
      width={width}
      height={height}
      className="bg-white dark:bg-gray-900"
      aria-label="Array visualization"
    >
      {/* Array Elements */}
      {values.map((value, index) => {
        const pos = layout[index];
        const elementColor = getElementColor(index);
        const barHeight = mode === "bar" ? getBarHeight(value) : pos.height;
        const yPosition = mode === "bar" ? height - barHeight - 80 : pos.y;

        return (
          <g key={`element-${index}`}>
            {/* Element Rectangle */}
            <motion.rect
              x={pos.x}
              y={yPosition}
              width={pos.width}
              height={barHeight}
              fill={elementColor}
              stroke={colorScheme.primary}
              strokeWidth="2"
              rx="4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            />

            {/* Value Label */}
            {showValues && (
              <motion.text
                x={pos.x + pos.width / 2}
                y={yPosition + barHeight / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={colorScheme.background}
                fontSize="14"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {value}
              </motion.text>
            )}

            {/* Index Label */}
            {showIndices && (
              <text
                x={pos.x + pos.width / 2}
                y={height - 50}
                textAnchor="middle"
                fill={colorScheme.text}
                fontSize="12"
                opacity="0.7"
              >
                {index}
              </text>
            )}
          </g>
        );
      })}

      {/* Pointers */}
      {pointers &&
        pointers.map((pointer, idx) => {
          const pos = layout[pointer.index];
          if (!pos) return null;

          const pointerColor = pointer.color || colorScheme.highlight;
          const arrowY = mode === "bar" ? height - 150 : pos.y - 20;

          return (
            <g key={`pointer-${idx}`}>
              {/* Arrow */}
              <motion.path
                d={`M ${pos.x + pos.width / 2} ${arrowY - 10}
                    L ${pos.x + pos.width / 2} ${arrowY}
                    L ${pos.x + pos.width / 2 - 5} ${arrowY - 5}
                    M ${pos.x + pos.width / 2} ${arrowY}
                    L ${pos.x + pos.width / 2 + 5} ${arrowY - 5}`}
                stroke={pointerColor}
                strokeWidth="2"
                fill="none"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* Pointer Label */}
              <motion.text
                x={pos.x + pos.width / 2}
                y={arrowY - 15}
                textAnchor="middle"
                fill={pointerColor}
                fontSize="12"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {pointer.label}
              </motion.text>
            </g>
          );
        })}

      {/* Window Highlight */}
      {window && (
        <motion.rect
          x={layout[window.start].x - 5}
          y={layout[window.start].y - 5}
          width={
            layout[window.end].x -
            layout[window.start].x +
            layout[window.end].width +
            10
          }
          height={layout[window.start].height + 10}
          fill="none"
          stroke={colorScheme.active}
          strokeWidth="3"
          strokeDasharray="5,5"
          rx="6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Partition Labels */}
      {partitions &&
        partitions.map((partition, idx) => {
          if (!partition.label) return null;

          const startPos = layout[partition.start];
          const endPos = layout[partition.end];
          const midX = (startPos.x + endPos.x + endPos.width) / 2;

          return (
            <text
              key={`partition-${idx}`}
              x={midX}
              y={20}
              textAnchor="middle"
              fill={partition.color || colorScheme.text}
              fontSize="14"
              fontWeight="bold"
            >
              {partition.label}
            </text>
          );
        })}
    </svg>
  );
}
