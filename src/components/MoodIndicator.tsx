"use client";

import React from "react";
import { useMood } from "@/components/providers/MoodProvider";

interface MoodIndicatorProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function MoodIndicator({
  className = "",
  showText = true,
  size = "md",
}: MoodIndicatorProps) {
  const { currentMood, isLoading } = useMood();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-pulse bg-gray-200 rounded-full w-6 h-6"></div>
        {showText && (
          <div className="animate-pulse bg-gray-200 rounded h-4 w-16"></div>
        )}
      </div>
    );
  }

  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={sizeClasses[size]}>{currentMood.emoji}</span>
      {showText && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          Current mood:{" "}
          <span className="font-semibold text-blue-600">
            {currentMood.name}
          </span>
        </span>
      )}
    </div>
  );
}

export default MoodIndicator;
