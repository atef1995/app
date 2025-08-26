"use client";

import { useEffect, useState } from "react";

interface QuizTimerProps {
  timeLeft: number;
  onTimeUp: () => void;
  isActive: boolean;
  totalQuestions?: number;
  currentQuestion?: number;
  timePerQuestion?: number;
}

export function QuizTimer({
  timeLeft,
  onTimeUp,
  isActive,
  totalQuestions,
  currentQuestion,
  timePerQuestion,
}: QuizTimerProps) {
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

  const colorClasses = {
    red: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    green: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  };

  const getTimeStatus = (): {
    color: keyof typeof colorClasses;
    message: string;
  } => {
    if (!totalQuestions || !currentQuestion === undefined || !timePerQuestion) {
      return { color: "blue", message: "Time Remaining" };
    }

    const expectedTimeUsed = (currentQuestion || 0) * timePerQuestion;
    const totalTime = totalQuestions * timePerQuestion;
    const actualTimeUsed = totalTime - currentTime;
    const timePerQuestionSoFar =
      actualTimeUsed / Math.max(1, (currentQuestion || 0) + 1);

    if (actualTimeUsed > expectedTimeUsed + timePerQuestion) {
      return { color: "red", message: "Behind Schedule" };
    } else if (actualTimeUsed < expectedTimeUsed - timePerQuestion / 2) {
      return { color: "green", message: "Ahead of Schedule" };
    }
    return { color: "blue", message: "On Track" };
  };

  const timeStatus = getTimeStatus();

  return (
    <div className="max-w-2xl mx-auto mb-4">
      <div
        className={`text-center text-sm font-mono px-3 py-2 rounded-lg ${
          currentTime < 60
            ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
            : colorClasses[timeStatus.color]
        }`}
      >
        <div className="flex justify-between items-center">
          <span>⏱️ {timeStatus.message}</span>
          <span className="font-bold">{formatTime(currentTime)}</span>
        </div>
        {timePerQuestion && totalQuestions && (
          <div className="text-xs mt-1 opacity-75">
            {timePerQuestion}s per question × {totalQuestions} questions
          </div>
        )}
      </div>
    </div>
  );
}
