/**
 * Animation Engine for Algorithm Visualizations
 * Handles step recording, playback, and state management
 */

import { Step, AnimationState, DataState } from "../types/visualizer.types";

/**
 * Creates an animation state manager
 */
export class AnimationEngine {
  private state: AnimationState;
  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((state: AnimationState) => void)[] = [];

  constructor(steps: Step[], initialState: DataState) {
    this.state = {
      currentStep: 0,
      totalSteps: steps.length,
      isPlaying: false,
      speed: 1,
      steps,
      currentState: initialState,
    };
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: AnimationState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Notify all listeners of state change
   * Creates a new state object to ensure React detects the change
   */
  private notify() {
    // Create a new state object so React's state setter detects the change
    // React uses shallow comparison, so we need a new object reference
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Get current state
   */
  getState(): AnimationState {
    return { ...this.state };
  }

  /**
   * Start playing the animation
   */
  play() {
    if (this.state.isPlaying) return;

    this.state.isPlaying = true;
    this.notify();

    const baseDelay = 1000; // 1 second base delay
    const delay = baseDelay / this.state.speed;

    this.intervalId = setInterval(() => {
      if (this.state.currentStep < this.state.totalSteps - 1) {
        this.stepForward();
      } else {
        this.pause();
      }
    }, delay);
  }

  /**
   * Pause the animation
   */
  pause() {
    if (!this.state.isPlaying) return;

    this.state.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notify();
  }

  /**
   * Reset to beginning
   */
  reset() {
    this.pause();
    this.state.currentStep = 0;
    if (this.state.steps.length > 0) {
      this.state.currentState = this.state.steps[0].state;
    }
    this.notify();
  }

  /**
   * Step forward one step
   */
  stepForward() {
    if (this.state.currentStep < this.state.totalSteps - 1) {
      this.state.currentStep++;
      this.state.currentState = this.state.steps[this.state.currentStep].state;
      this.notify();
    }
  }

  /**
   * Step backward one step
   */
  stepBackward() {
    if (this.state.currentStep > 0) {
      this.state.currentStep--;
      this.state.currentState = this.state.steps[this.state.currentStep].state;
      this.notify();
    }
  }

  /**
   * Jump to specific step
   */
  jumpToStep(step: number) {
    if (step >= 0 && step < this.state.totalSteps) {
      this.state.currentStep = step;
      this.state.currentState = this.state.steps[step].state;
      this.notify();
    }
  }

  /**
   * Set animation speed
   */
  setSpeed(speed: number) {
    const wasPlaying = this.state.isPlaying;
    if (wasPlaying) {
      this.pause();
    }

    this.state.speed = Math.max(0.1, Math.min(3, speed));
    this.notify();

    if (wasPlaying) {
      this.play();
    }
  }

  /**
   * Get current step
   */
  getCurrentStep(): Step | null {
    if (this.state.currentStep < this.state.steps.length) {
      return this.state.steps[this.state.currentStep];
    }
    return null;
  }

  /**
   * Cleanup
   */
  destroy() {
    this.pause();
    this.listeners = [];
  }
}

/**
 * Helper function to calculate animation duration based on speed
 */
export function getAnimationDuration(speed: number): number {
  const baseDuration = 500; // 500ms base duration
  return baseDuration / speed;
}

/**
 * Helper function to interpolate between steps for smooth transitions
 */
export function interpolateSteps(
  fromStep: Step,
  toStep: Step,
  progress: number
): DataState {
  // For now, we'll use simple step-based transitions
  // In the future, this can be enhanced for smoother animations
  return progress < 0.5 ? fromStep.state : toStep.state;
}

/**
 * Create default color scheme based on mood
 */
export function getMoodColorScheme(mood: "CHILL" | "RUSH" | "GRIND") {
  const schemes = {
    CHILL: {
      primary: "#60a5fa", // blue-400
      secondary: "#93c5fd", // blue-300
      highlight: "#fbbf24", // amber-400
      comparison: "#f472b6", // pink-400
      swap: "#fb923c", // orange-400
      sorted: "#4ade80", // green-400
      active: "#a78bfa", // violet-400
      inactive: "#9ca3af", // gray-400
      background: "#f3f4f6", // gray-100
      text: "#9E9E9E", // gray-800
    },
    RUSH: {
      primary: "#3b82f6", // blue-500
      secondary: "#60a5fa", // blue-400
      highlight: "#f59e0b", // amber-500
      comparison: "#ec4899", // pink-500
      swap: "#f97316", // orange-500
      sorted: "#22c55e", // green-500
      active: "#8b5cf6", // violet-500
      inactive: "#6b7280", // gray-500
      background: "#ffffff",
      text: "#9E9E9E", // gray-900
    },
    GRIND: {
      primary: "#2563eb", // blue-600
      secondary: "#3b82f6", // blue-500
      highlight: "#d97706", // amber-600
      comparison: "#db2777", // pink-600
      swap: "#ea580c", // orange-600
      sorted: "#16a34a", // green-600
      active: "#7c3aed", // violet-600
      inactive: "#4b5563", // gray-600
      background: "#000000",
      text: "#9E9E9E", // gray-50
    },
  };

  return schemes[mood];
}

/**
 * Generate step ID
 */
export function generateStepId(index: number, operation: string): string {
  return `step-${operation}-${index}-${Date.now()}`;
}
