"use client";

import React from "react";

/**
 * Value in a comparison table cell
 * Can be a simple string or an object with additional properties
 */
export interface ComparisonValue {
  value: string;
  variant?: "success" | "warning" | "danger" | "neutral";
  icon?: "check" | "cross" | "info";
}

/**
 * Row in the comparison table
 */
export interface ComparisonRow {
  label: string;
  values: (string | ComparisonValue)[];
  highlighted?: boolean;
}

/**
 * ComparisonTable component props
 */
export interface ComparisonTableProps {
  /** Table column headers */
  headers: string[];
  /** Table rows with data */
  rows: ComparisonRow[];
  /** Index of column to highlight (0-based) */
  highlightColumn?: number;
  /** Visual variant */
  variant?: "default" | "compact" | "bordered";
  /** Custom className */
  className?: string;
  /** Caption for the table */
  caption?: string;
}

/**
 * ComparisonTable Component
 *
 * A beautiful, responsive comparison table for tutorials
 * Features:
 * - Responsive (stacks on mobile, table on desktop)
 * - Dark mode support
 * - Complexity notation auto-formatting
 * - Visual badges and icons
 * - Zebra striping
 *
 * @example
 * ```tsx
 * <ComparisonTable
 *   headers={['Approach', 'Time', 'Space', 'When to Use']}
 *   rows={[
 *     { label: 'Brute Force', values: ['O(n²)', 'O(1)', 'Never'] },
 *     { label: 'Two Pointers', values: ['O(n)', 'O(1)', 'Sorted arrays'], highlighted: true }
 *   ]}
 * />
 * ```
 */
export function ComparisonTable({
  headers,
  rows,
  highlightColumn,
  variant = "default",
  className = "",
  caption,
}: ComparisonTableProps) {
  const isCompact = variant === "compact";
  const isBordered = variant === "bordered";

  /**
   * Auto-format complexity notation (O(n), O(1), etc.)
   */
  const formatComplexity = (text: string): string => {
    // Check if text contains Big-O notation
    if (text.match(/O\([^)]+\)/)) {
      return text;
    }
    return text;
  };

  /**
   * Get badge color based on complexity
   */
  const getComplexityColor = (complexity: string): string => {
    if (complexity.includes("O(1)")) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    if (complexity.includes("O(n)") && !complexity.includes("²") && !complexity.includes("³")) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    }
    if (complexity.includes("O(n log n)")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (complexity.includes("O(n²)")) return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    if (complexity.includes("O(n³)") || complexity.includes("O(2ⁿ)")) {
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  /**
   * Check if a string looks like complexity notation
   */
  const isComplexityNotation = (text: string): boolean => {
    return /O\([^)]+\)/.test(text);
  };

  /**
   * Render cell value with appropriate styling
   */
  const renderCellValue = (value: string | ComparisonValue, columnIndex: number) => {
    const stringValue = typeof value === "string" ? value : value.value;
    const isHighlighted = highlightColumn === columnIndex;

    // Check if this is complexity notation
    if (isComplexityNotation(stringValue)) {
      return (
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-mono font-semibold ${getComplexityColor(
            stringValue
          )}`}
        >
          {formatComplexity(stringValue)}
        </span>
      );
    }

    // Render with variant styling
    if (typeof value === "object" && value.variant) {
      const variantColors = {
        success: "text-green-700 dark:text-green-300",
        warning: "text-yellow-700 dark:text-yellow-300",
        danger: "text-red-700 dark:text-red-300",
        neutral: "text-gray-700 dark:text-gray-300",
      };

      return (
        <span className={variantColors[value.variant]}>
          {value.icon && (
            <span className="mr-1">
              {value.icon === "check" && "✓"}
              {value.icon === "cross" && "✗"}
              {value.icon === "info" && "ℹ"}
            </span>
          )}
          {stringValue}
        </span>
      );
    }

    return <span className={isHighlighted ? "font-semibold" : ""}>{stringValue}</span>;
  };

  return (
    <div className={`my-6 ${className}`}>
      {caption && (
        <div className="mb-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
          {caption}
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 ${isCompact ? "py-2" : "py-3"} text-left text-sm font-semibold ${
                    index === 0 ? "rounded-tl-lg" : ""
                  } ${index === headers.length - 1 ? "rounded-tr-lg" : ""}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  transition-colors
                  ${row.highlighted
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500"
                    : rowIndex % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800/50"
                  }
                  hover:bg-indigo-50 dark:hover:bg-indigo-900/10
                `}
              >
                <td
                  className={`px-4 ${isCompact ? "py-2" : "py-3"} font-semibold text-gray-900 dark:text-gray-100`}
                >
                  {row.label}
                </td>
                {row.values.map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className={`px-4 ${isCompact ? "py-2" : "py-3"} text-sm text-gray-700 dark:text-gray-300 ${
                      highlightColumn === colIndex + 1 ? "bg-purple-50 dark:bg-purple-900/20" : ""
                    }`}
                  >
                    {renderCellValue(value, colIndex + 1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`
              rounded-lg border p-4
              ${row.highlighted
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
              }
            `}
          >
            <div className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100 pb-2 border-b border-gray-200 dark:border-gray-700">
              {row.label}
            </div>
            <dl className="space-y-2">
              {headers.slice(1).map((header, headerIndex) => (
                <div key={headerIndex}>
                  <dt className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                    {header}
                  </dt>
                  <dd className="text-sm text-gray-700 dark:text-gray-300">
                    {renderCellValue(row.values[headerIndex], headerIndex + 1)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Legend for complexity colors (optional) */}
      {rows.some(row =>
        row.values.some(v => isComplexityNotation(typeof v === "string" ? v : v.value))
      ) && (
        <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Complexity Key:</span>{" "}
          <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ml-2">
            Excellent
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ml-1">
            Good
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ml-1">
            Fair
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 ml-1">
            Slow
          </span>
          <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ml-1">
            Very Slow
          </span>
        </div>
      )}
    </div>
  );
}
