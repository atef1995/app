"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { AnimationEngine, getMoodColorScheme } from "./utils/animationEngine";
import { PlaybackControls } from "./controls/PlaybackControls";
import { SpeedControl } from "./controls/SpeedControl";
import { ArrayVisualizer } from "./ArrayVisualizer";
import {
  Step,
  AnimationState,
  VisualizerConfig,
  ArrayState,
  Mood,
} from "./types/visualizer.types";
import { Settings } from "lucide-react";

/**
 * AlgorithmVisualizer Component
 * Main visualization engine that orchestrates all algorithm visualizations
 */
interface AlgorithmVisualizerProps {
  /** Configuration for the visualizer */
  config: VisualizerConfig;
  /** Pre-recorded steps for the algorithm */
  steps: Step[];
  /** User's current mood (for theming) */
  mood?: Mood;
  /** Custom className */
  className?: string;
}

export function AlgorithmVisualizer({
  config,
  steps,
  mood = "CHILL",
  className = "",
}: AlgorithmVisualizerProps) {
  const [engine, setEngine] = useState<AnimationEngine | null>(null);
  const [animationState, setAnimationState] = useState<AnimationState | null>(
    null
  );
  const [showSettings, setShowSettings] = useState(false);
  const [containerWidth, setContainerWidth] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);

  const colorScheme = getMoodColorScheme(mood);
  const baseHeight = config.height || 500;

  // Responsive dimensions
  const responsiveHeight =
    typeof window !== "undefined"
      ? Math.min(baseHeight, window.innerHeight * 0.6)
      : baseHeight;

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(Math.max(width, 320)); // Minimum 320px
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Initialize animation engine
  useEffect(() => {
    if (steps.length === 0) return;

    const initialState = steps[0].state;
    const newEngine = new AnimationEngine(steps, initialState);

    // Set default speed based on mood
    const moodSpeeds = {
      CHILL: 0.5,
      RUSH: 1.5,
      GRIND: 2.0,
    };
    newEngine.setSpeed(moodSpeeds[mood]);

    // Subscribe to state changes
    const unsubscribe = newEngine.subscribe((state) => {
      setAnimationState(state);
    });

    setEngine(newEngine);
    setAnimationState(newEngine.getState());

    return () => {
      unsubscribe();
      newEngine.destroy();
    };
  }, [steps, mood]);

  // Playback control handlers
  const handlePlay = useCallback(() => {
    engine?.play();
  }, [engine]);

  const handlePause = useCallback(() => {
    engine?.pause();
  }, [engine]);

  const handleReset = useCallback(() => {
    engine?.reset();
  }, [engine]);

  const handleStepForward = useCallback(() => {
    engine?.stepForward();
  }, [engine]);

  const handleStepBackward = useCallback(() => {
    engine?.stepBackward();
  }, [engine]);

  const handleJumpToStep = useCallback(
    (step: number) => {
      engine?.jumpToStep(step);
    },
    [engine]
  );

  const handleSpeedChange = useCallback(
    (speed: number) => {
      engine?.setSpeed(speed);
    },
    [engine]
  );

  if (!animationState || !engine) {
    return (
      <div
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ minHeight: "300px" }}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4 text-center">
          Loading visualization...
        </p>
      </div>
    );
  }

  const currentStep = engine.getCurrentStep();
  const currentState = animationState.currentState;

  return (
    <div
      ref={containerRef}
      className={`border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base sm:text-lg truncate">
            {config.algorithm}
          </h3>
          {currentStep && (
            <p className="text-white/80 text-xs sm:text-sm mt-1 line-clamp-2">
              {currentStep.description}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0 cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800">
          <SpeedControl
            speed={animationState.speed}
            onSpeedChange={handleSpeedChange}
          />
        </div>
      )}

      {/* Visualization Area */}
      <div className="p-2 sm:p-4 bg-white dark:bg-gray-900 overflow-x-auto ">
        {config.type === "array" && currentState.type === "array" && (
          <ArrayVisualizer
            state={currentState as ArrayState}
            width={Math.max(containerWidth - 16, 288)} // Account for padding, min 288px
            height={Math.max(responsiveHeight - 200, 200)} // Account for controls, min 200px
            colorScheme={colorScheme}
            mode="block"
            showIndices={true}
            showValues={true}
            highlightedIndices={currentStep?.highlights || []}
            comparisonIndices={currentStep?.comparisons || null}
          />
        )}

        {/* TODO: Add other visualizers (Tree, Graph, LinkedList) */}
        {config.type !== "array" && (
          <div
            className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
            style={{ minHeight: "200px" }}
          >
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base px-4 text-center">
              {config.type} visualizer coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Step Information */}
      {currentStep && (
        <div className="px-3 sm:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-xs sm:text-sm">
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              {currentStep.description}
            </span>
            {currentStep.metrics && (
              <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">
                <span className="hidden sm:inline">
                  Comparisons: {currentStep.metrics.comparisons} | Swaps:{" "}
                  {currentStep.metrics.swaps}
                </span>
                <span className="sm:hidden">
                  C: {currentStep.metrics.comparisons} | S:{" "}
                  {currentStep.metrics.swaps}
                </span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Playback Controls */}
      <PlaybackControls
        isPlaying={animationState.isPlaying}
        currentStep={animationState.currentStep}
        totalSteps={animationState.totalSteps}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onJumpToStep={handleJumpToStep}
      />
    </div>
  );
}
