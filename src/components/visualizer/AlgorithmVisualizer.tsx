"use client";

import React, { useState, useEffect, useCallback } from "react";
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

  const colorScheme = getMoodColorScheme(mood);
  const height = config.height || 500;
  const width = 800; // Fixed width for now

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
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500 dark:text-gray-400">
          Loading visualization...
        </p>
      </div>
    );
  }

  const currentStep = engine.getCurrentStep();
  const currentState = animationState.currentState;

  return (
    <div
      className={`border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900 ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">
            {config.algorithm}
          </h3>
          {currentStep && (
            <p className="text-white/80 text-sm mt-1">
              {currentStep.description}
            </p>
          )}
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
          <SpeedControl
            speed={animationState.speed}
            onSpeedChange={handleSpeedChange}
          />
        </div>
      )}

      {/* Visualization Area */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {config.type === "array" && currentState.type === "array" && (
          <ArrayVisualizer
            state={currentState as ArrayState}
            width={width - 32} // Account for padding
            height={height - 150} // Account for controls
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
            style={{ height: height - 150 }}
          >
            <p className="text-gray-500 dark:text-gray-400">
              {config.type} visualizer coming soon!
            </p>
          </div>
        )}
      </div>

      {/* Step Information */}
      {currentStep && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              {currentStep.description}
            </span>
            {currentStep.metrics && (
              <span className="text-blue-600 dark:text-blue-400">
                Comparisons: {currentStep.metrics.comparisons} | Swaps:{" "}
                {currentStep.metrics.swaps}
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
