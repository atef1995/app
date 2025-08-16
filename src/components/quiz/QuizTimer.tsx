"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  timeLeft: number;
  onTimeUp: () => void;
  isActive: boolean;
}

export function QuizTimer({ timeLeft, onTimeUp, isActive }: QuizTimerProps) {
  const [currentTime, setCurrentTime] = useState(timeLeft);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    setCurrentTime(timeLeft);
    if (timeLeft > 0) {
      setHasStarted(true);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (!isActive || !hasStarted || currentTime <= 0) {
      if (currentTime === 0 && hasStarted) {
        onTimeUp();
      }
      return;
    }

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime, isActive, onTimeUp, hasStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isActive) return null;

  return (
    <div className="max-w-2xl mx-auto mb-4">
      <div
        className={`text-center text-sm font-mono px-3 py-2 rounded-lg ${
          currentTime < 60
            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            : "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
        }`}
      >
        ⏱️ Time Remaining: {formatTime(currentTime)}
      </div>
    </div>
  );
}