"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { UpgradeOverlay } from "./UpgradeOverlay";

/**
 * ComplexityChart Component
 *
 * Interactive visualization of time complexity curves (O(1), O(log n), O(n), O(n²), etc.)
 *
 * Features:
 * - FREE mode: Shows static chart with limited data points
 * - CRACKED mode: Interactive controls, custom input sizes, export
 * - Toggle individual complexity curves
 * - Hover tooltips with exact values
 * - Responsive design
 */

interface ComplexityChartProps {
  /** User's current plan */
  plan: "FREE" | "VIBED" | "CRACKED";
  /** Custom className */
  className?: string;
}

/**
 * Calculate complexity values for different Big O notations
 */
function calculateComplexity(n: number, type: string): number {
  switch (type) {
    case "O(1)":
      return 1;
    case "O(log n)":
      return Math.log2(n);
    case "O(n)":
      return n;
    case "O(n log n)":
      return n * Math.log2(n);
    case "O(n²)":
      return n * n;
    case "O(2ⁿ)":
      return Math.pow(2, Math.min(n, 20)); // Cap at 2^20 to avoid overflow
    default:
      return 0;
  }
}

/**
 * Generate data points for the chart
 */
function generateChartData(maxN: number, step: number) {
  const data = [];
  for (let n = step; n <= maxN; n += step) {
    data.push({
      n,
      "O(1)": calculateComplexity(n, "O(1)"),
      "O(log n)": calculateComplexity(n, "O(log n)"),
      "O(n)": calculateComplexity(n, "O(n)"),
      "O(n log n)": calculateComplexity(n, "O(n log n)"),
      "O(n²)": calculateComplexity(n, "O(n²)"),
      "O(2ⁿ)": calculateComplexity(n, "O(2ⁿ)"),
    });
  }
  return data;
}

const COMPLEXITY_COLORS = {
  "O(1)": "#10b981", // green-500
  "O(log n)": "#3b82f6", // blue-500
  "O(n)": "#8b5cf6", // violet-500
  "O(n log n)": "#f59e0b", // amber-500
  "O(n²)": "#ef4444", // red-500
  "O(2ⁿ)": "#dc2626", // red-600
};

export function ComplexityChart({ plan, className = "" }: ComplexityChartProps) {
  const isCracked = plan === "CRACKED";

  // State for interactive controls (CRACKED only)
  const [maxN, setMaxN] = useState(100);
  const [step, setStep] = useState(10);
  const [visibleCurves, setVisibleCurves] = useState({
    "O(1)": true,
    "O(log n)": true,
    "O(n)": true,
    "O(n log n)": true,
    "O(n²)": true,
    "O(2ⁿ)": false, // Hidden by default (grows too fast)
  });

  // Generate chart data
  const chartData = generateChartData(isCracked ? maxN : 50, isCracked ? step : 10);

  /**
   * Toggle visibility of a complexity curve
   */
  const toggleCurve = (curve: string) => {
    if (!isCracked) return;
    setVisibleCurves((prev) => ({
      ...prev,
      [curve]: !prev[curve],
    }));
  };

  /**
   * Export chart data as CSV (CRACKED only)
   */
  const exportData = () => {
    if (!isCracked) return;

    const headers = ["n", ...Object.keys(COMPLEXITY_COLORS)];
    const csvRows = [
      headers.join(","),
      ...chartData.map((row) =>
        headers.map((h) => row[h as keyof typeof row]).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complexity-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative ${className}`}>
      {/* FREE Mode: Show preview with overlay */}
      {!isCracked && (
        <UpgradeOverlay
          featureName="Interactive Complexity Visualizer"
          valueProp="Customize input sizes, toggle curves, and export data to master Big O intuition"
          benefits={[
            "Adjust input size (n) from 10 to 10,000",
            "Toggle individual complexity curves on/off",
            "Export chart data as CSV for analysis",
            "See exact values on hover",
            "Compare multiple algorithms side-by-side",
          ]}
          currentPlan={plan}
          className="min-h-[500px]"
        />
      )}

      {/* Chart Container */}
      <div
        className={`bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${
          !isCracked ? "pointer-events-none select-none" : ""
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Time Complexity Growth Comparison
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isCracked
              ? "Visualize how different algorithms scale with input size"
              : "Preview: Limited to n=50. Upgrade to customize!"}
          </p>
        </div>

        {/* Interactive Controls (CRACKED only) */}
        {isCracked && (
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max N Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Input Size (n): {maxN}
                </label>
                <input
                  type="range"
                  min="10"
                  max="10000"
                  step="10"
                  value={maxN}
                  onChange={(e) => setMaxN(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>10</span>
                  <span>5,000</span>
                  <span>10,000</span>
                </div>
              </div>

              {/* Step Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Step Size: {step}
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={step}
                  onChange={(e) => setStep(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
            </div>

            {/* Curve Toggles */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Visible Curves:
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(COMPLEXITY_COLORS).map(([curve, color]) => (
                  <button
                    key={curve}
                    onClick={() => toggleCurve(curve)}
                    className={`
                      px-3 py-1 rounded-full text-xs font-mono font-semibold
                      transition-all duration-200
                      ${
                        visibleCurves[curve as keyof typeof visibleCurves]
                          ? "opacity-100 scale-100"
                          : "opacity-40 scale-95"
                      }
                    `}
                    style={{
                      backgroundColor: visibleCurves[curve as keyof typeof visibleCurves]
                        ? color
                        : "#e5e7eb",
                      color: visibleCurves[curve as keyof typeof visibleCurves]
                        ? "#ffffff"
                        : "#6b7280",
                    }}
                  >
                    {curve}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <div className="flex justify-end">
              <button
                onClick={exportData}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Export as CSV
              </button>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis
                dataKey="n"
                label={{
                  value: "Input Size (n)",
                  position: "insideBottom",
                  offset: -5,
                }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                label={{
                  value: "Operations",
                  angle: -90,
                  position: "insideLeft",
                }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.9)",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#f9fafb",
                }}
                labelStyle={{ color: "#f9fafb" }}
              />
              <Legend />

              {/* Render lines for each complexity */}
              {Object.entries(COMPLEXITY_COLORS).map(([curve, color]) =>
                visibleCurves[curve as keyof typeof visibleCurves] ? (
                  <Line
                    key={curve}
                    type="monotone"
                    dataKey={curve}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ) : null
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights (shown for both FREE and CRACKED) */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Key Insights:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
            <li>• O(1) and O(log n) stay flat - these are the most efficient!</li>
            <li>• O(n) grows linearly - still very manageable</li>
            <li>• O(n²) grows exponentially - avoid for large inputs</li>
            <li>• O(2ⁿ) explodes quickly - only use for tiny inputs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
