"use client";

import React from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/**
 * PlaybackControls Component
 * Provides play/pause, step controls, and reset functionality for algorithm visualizations
 */
interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep?: (step: number) => void;
  disabled?: boolean;
}

export function PlaybackControls({
  isPlaying,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  disabled = false,
}: PlaybackControlsProps) {
  const progressPercentage =
    totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onJumpToStep || disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetStep = Math.floor(percentage * (totalSteps - 1));

    onJumpToStep(Math.max(0, Math.min(targetStep, totalSteps - 1)));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-2 sm:py-3">
      {/* Progress Bar */}
      <div className="mb-2 sm:mb-3">
        <div
          className="h-2 sm:h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer hover:h-3 sm:hover:h-4 transition-all touch-none relative"
          onClick={handleProgressClick}
          role="progressbar"
          aria-label="Algorithm progress"
        >
          <div
            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-200 absolute top-0 left-0"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
          <span>
            Step {currentStep + 1}/{totalSteps}
          </span>
          <span className="hidden sm:inline">
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={disabled}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation cursor-pointer"
          title="Reset to beginning"
          aria-label="Reset"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Skip to Start - Hidden on mobile */}
        <button
          onClick={() => onJumpToStep && onJumpToStep(0)}
          disabled={disabled || !onJumpToStep || currentStep === 0}
          className="hidden sm:block p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Skip to start"
          aria-label="Skip to start"
        >
          <SkipBack className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Step Backward Button */}
        <button
          onClick={onStepBackward}
          disabled={disabled || currentStep === 0}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation cursor-pointer"
          title="Step backward"
          aria-label="Step backward"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={disabled}
          className="p-2.5 sm:p-3 rounded-lg bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md touch-manipulation cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
          title={isPlaying ? "Pause" : "Play"}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5" />
          )}
        </button>

        {/* Step Forward Button */}
        <button
          onClick={onStepForward}
          disabled={disabled || currentStep === totalSteps - 1}
          className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation cursor-pointer"
          title="Step forward"
          aria-label="Step forward"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Skip to End - Hidden on mobile */}
        <button
          onClick={() => onJumpToStep && onJumpToStep(totalSteps - 1)}
          disabled={disabled || !onJumpToStep || currentStep === totalSteps - 1}
          className="hidden sm:block p-2 sm:p-2.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Skip to end"
          aria-label="Skip to end"
        >
          <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}
