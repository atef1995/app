"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./Console.module.css";

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
  isComplete?: boolean;
  animatedOutput?: string[];
  showCursor?: boolean;
}

interface StreamingConsoleProps {
  isRunning: boolean;
  onStreamingOutput?: (output: string) => void;
  streamingOutput?: string[];
}

interface ConsoleProps {
  result: ExecutionResult | null;
  isRunning: boolean;
  forceUpdateCounter: number;
  streamingOutput?: string[];
}

const Console: React.FC<ConsoleProps> = ({
  result,
  isRunning,
  forceUpdateCounter,
  streamingOutput = [],
}) => {
  // Animation state
  const [animatedOutput, setAnimatedOutput] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Typing animation effect - only run if we haven't already shown streaming output
  useEffect(() => {
    if (
      !result ||
      !result.isComplete ||
      (result.output.length === 0 && result.errors.length === 0) ||
      streamingOutput.length > 0 // Skip animation if we already showed streaming output
    ) {
      return;
    }

    const allLines = [
      ...result.output,
      ...result.errors.map((err) => `❌ ${err}`),
    ];
    if (allLines.length === 0) return;

    // Reset animation state
    setAnimatedOutput([]);
    setShowCursor(true);

    let lineIndex = 0;
    let charIndex = 0;

    const animateTyping = () => {
      if (lineIndex < allLines.length) {
        const currentLine = allLines[lineIndex];

        if (charIndex < currentLine.length) {
          // Update current line with new character
          setAnimatedOutput((prev) => {
            const newOutput = [...prev];
            newOutput[lineIndex] = currentLine.substring(0, charIndex + 1);
            return newOutput;
          });
          charIndex++;
        } else {
          // Move to next line
          lineIndex++;
          charIndex = 0;
          if (lineIndex < allLines.length) {
            setAnimatedOutput((prev) => [...prev, ""]);
          }
        }

        if (lineIndex < allLines.length) {
          const delay = Math.random() * 20 + 20; // Random delay between 20-50ms
          animationTimeoutRef.current = setTimeout(animateTyping, delay);
        } else {
          // Animation complete, hide cursor after delay
          setTimeout(() => setShowCursor(false), 500);
        }
      }
    };

    // Start animation immediately
    animateTyping();

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [result?.isComplete, result?.executionTime]); // Only depend on completion and execution time

  // Cursor blink effect is now handled by CSS animation only

  // Reset animation state immediately when result changes or streaming output exists
  useEffect(() => {
    if (result && !result.isComplete) {
      setAnimatedOutput([]);
      setShowCursor(true);
    }
    // Also clear animation state if streaming output exists
    if (streamingOutput.length > 0) {
      setAnimatedOutput([]);
      setShowCursor(false);
    }
  }, [result, streamingOutput.length]);

  return (
    <>
      {(result || streamingOutput.length > 0 || isRunning) && (
        <div className="border-t border-gray-200 dark:border-gray-600 h-80">
          <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-700 h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Console
                </h4>
                {isRunning && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 animate-pulse">
                      Running...
                    </span>
                  </div>
                )}
              </div>
              {result?.isComplete && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {result.executionTime}ms
                </span>
              )}
            </div>

            <div
              className={`bg-black text-green-400 p-4 rounded font-mono text-sm overflow-y-auto h-full relative border border-green-900/30 ${
                isRunning ? styles.consoleScanning : ""
              }`}
            >
              {/* Show streaming output during execution */}
              {streamingOutput.length > 0 && (
                <div className="space-y-1">
                  {streamingOutput.map((line, index) => (
                    <div
                      key={`streaming-${index}-${Date.now()}`}
                      className="mb-1 text-green-400"
                    >
                      <span className="text-gray-500 mr-2">{">"}</span>
                      {line}
                    </div>
                  ))}
                  {isRunning && (
                    <div className="flex items-center gap-2 mt-2 text-yellow-400">
                      <div
                        className={`w-2 h-2 bg-yellow-400 rounded-full ${styles.loadingDot1}`}
                      ></div>
                      <span className="text-xs">Execution in progress...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced loading state with multiple phases */}
              {isRunning && streamingOutput.length === 0 && (
                <div className={styles.loadingContainer}>
                  <div className="space-y-3">
                    {/* Primary loading indicator */}
                    <div className="flex items-center gap-3 text-yellow-400">
                      <div className="flex gap-1">
                        <div
                          className={`w-3 h-3 bg-yellow-400 rounded-full ${styles.loadingDot1}`}
                        ></div>
                        <div
                          className={`w-3 h-3 bg-yellow-400 rounded-full ${styles.loadingDot2}`}
                        ></div>
                        <div
                          className={`w-3 h-3 bg-yellow-400 rounded-full ${styles.loadingDot3}`}
                        ></div>
                      </div>
                      <span className={styles.loadingText}>
                        <span className="text-gray-500 mr-2">{">"}</span>
                        Initializing execution environment...
                      </span>
                    </div>

                    {/* Secondary loading phases */}
                    <div className="ml-6 space-y-1 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="animate-pulse">Preparing runtime</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-70">
                        <div
                          className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        >
                          Loading modules
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-50">
                        <div
                          className="w-1 h-1 bg-purple-400 rounded-full animate-pulse"
                          style={{ animationDelay: "1s" }}
                        ></div>
                        <span
                          className="animate-pulse"
                          style={{ animationDelay: "1s" }}
                        >
                          Compiling code
                        </span>
                      </div>
                    </div>

                    {/* Progress bar effect */}
                    <div className="ml-6 mt-3">
                      <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 rounded-full animate-pulse"
                          style={{
                            width: "70%",
                            animation:
                              "pulse 2s infinite, terminal-scan 3s infinite linear",
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 animate-pulse">
                        Executing...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Animated output - only show if no streaming output was displayed */}
              {animatedOutput.length > 0 && streamingOutput.length === 0 ? (
                <div className="relative z-10">
                  {animatedOutput.map((line, index) => (
                    <div
                      key={`animated-${index}-${result?.executionTime}-${forceUpdateCounter}`}
                      className={`mb-1 transform transition-all duration-300 ${
                        styles.fadeIn
                      } ${
                        line.startsWith("❌")
                          ? "text-red-400"
                          : line.startsWith("⚠️")
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                      style={{
                        animationDelay: `${index * 0.1}s`,
                      }}
                    >
                      <span className="text-gray-500 mr-2">{">"}</span>
                      {line}
                      {index === animatedOutput.length - 1 && showCursor && (
                        <span
                          className={`${styles.terminalCursor} ml-1 text-green-400`}
                        >
                          ▋
                        </span>
                      )}
                    </div>
                  ))}

                  {!showCursor && result?.isComplete && (
                    <div className="mt-3 text-gray-500 text-xs flex items-center gap-2 opacity-60">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Execution completed</span>
                    </div>
                  )}
                </div>
              ) : !isRunning &&
                (!result || (!result.output.length && !result.errors.length)) &&
                streamingOutput.length === 0 ? (
                <div className="text-gray-500 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div>Ready to execute</div>
                    <div className="text-xs mt-1 opacity-60">
                      Click &ldquo;Run&rdquo; to see the magic
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Console;
