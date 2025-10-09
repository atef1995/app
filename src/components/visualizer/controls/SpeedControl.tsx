"use client";

import React from "react";
import { Gauge } from "lucide-react";

/**
 * SpeedControl Component
 * Allows users to adjust the animation playback speed
 */
interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function SpeedControl({
  speed,
  onSpeedChange,
  min = 0.1,
  max = 3,
  step = 0.1,
  disabled = false,
}: SpeedControlProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSpeedChange(parseFloat(e.target.value));
  };

  const presetSpeeds = [
    { label: "0.5x", value: 0.5 },
    { label: "1x", value: 1 },
    { label: "1.5x", value: 1.5 },
    { label: "2x", value: 2 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Speed
        </span>
        <span className="ml-auto text-sm font-semibold text-blue-600 dark:text-blue-400">
          {speed.toFixed(1)}x
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={speed}
        onChange={handleChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Animation speed"
      />

      {/* Preset Buttons */}
      <div className="flex gap-1 mt-2">
        {presetSpeeds.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onSpeedChange(preset.value)}
            disabled={disabled}
            className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
              speed === preset.value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
