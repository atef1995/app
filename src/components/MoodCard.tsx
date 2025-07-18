"use client";

import { MoodConfig } from "@/types/mood";
import {
  Waves,
  Zap,
  Target,
  BarChart3,
  HelpCircle,
  Clock,
  Check,
} from "lucide-react";

interface MoodCardProps {
  mood: MoodConfig;
  isSelected?: boolean;
  onClick?: (moodId: string) => void;
  showDescription?: boolean;
  showClickIndicator?: boolean;
  variant?: "homepage" | "selector";
  className?: string;
}

export function MoodCard({
  mood,
  isSelected = false,
  onClick,
  showDescription = true,
  showClickIndicator = false,
  variant = "homepage",
  className = "",
}: MoodCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(mood.id);
    }
  };

  const moodClasses = {
    chill: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-slate-800 dark:text-slate-200",
      primary: "text-blue-500 dark:text-blue-400",
      accent: "text-cyan-500 dark:text-cyan-400",
      border: isSelected ? "border-blue-500 dark:border-blue-400" : "",
      gradient: "from-blue-500 to-blue-300",
      badge: "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
      hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
    },
    rush: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      text: "text-slate-800 dark:text-slate-200",
      primary: "text-amber-500 dark:text-amber-400",
      accent: "text-red-500 dark:text-red-400",
      border: isSelected ? "border-amber-500 dark:border-amber-400" : "",
      gradient: "from-amber-500 to-amber-300",
      badge: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
      hover: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
    },
    grind: {
      bg: "bg-gray-800 dark:bg-gray-700",
      text: "text-gray-50",
      primary: "text-red-600 dark:text-red-400",
      accent: "text-violet-500 dark:text-violet-400",
      border: isSelected ? "border-red-600 dark:border-red-400" : "",
      gradient: "from-red-600 to-red-300",
      badge:
        "bg-violet-100 dark:bg-violet-900 text-violet-600 dark:text-violet-300",
      hover: "hover:bg-gray-700 dark:hover:bg-gray-600",
    },
  };

  const currentClasses = moodClasses[mood.id as keyof typeof moodClasses];

  // Homepage variant styling
  if (variant === "homepage") {
    const homepageClasses = `
      p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-600 
      hover:border-gray-300 dark:hover:border-gray-500 
      transition-all hover:shadow-lg cursor-pointer transform hover:scale-105
      ${currentClasses.bg} ${currentClasses.text} ${currentClasses.hover}
      ${className}
    `;

    const getMoodIcon = () => {
      switch (mood.id) {
        case "chill":
          return (
            <Waves className="w-16 h-16 text-blue-500 dark:text-blue-400" />
          );
        case "rush":
          return (
            <Zap className="w-16 h-16 text-orange-500 dark:text-orange-400" />
          );
        case "grind":
          return (
            <Target className="w-16 h-16 text-red-500 dark:text-red-400" />
          );
        default:
          return (
            <Waves className="w-16 h-16 text-blue-500 dark:text-blue-400" />
          );
      }
    };

    return (
      <div onClick={handleClick} className={homepageClasses}>
        <div className="flex justify-center mb-4">{getMoodIcon()}</div>
        <h3 className={`text-2xl font-bold mb-2 ${currentClasses.primary}`}>
          {mood.name}
        </h3>
        {showDescription && (
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            {mood.description}
          </p>
        )}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Difficulty: {mood.quizSettings.difficulty}
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Questions: {mood.quizSettings.questionsPerTutorial} per tutorial
          </div>
          {mood.quizSettings.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time limit: {mood.quizSettings.timeLimit}s per question
            </div>
          )}
          {!mood.quizSettings.timeLimit && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              No time pressure
            </div>
          )}
        </div>

        {/* Click indicator for homepage */}
        {showClickIndicator && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
              <span>Click to get started with {mood.name} mode</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Selector variant styling (for MoodSelector component)
  const cardClasses = `
    relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform
    border-2 hover:scale-105 hover:shadow-lg w-full
    ${
      isSelected
        ? "border-blue-500 dark:border-blue-400 shadow-lg scale-105"
        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
    }
    group ${currentClasses.bg} ${currentClasses.text} ${currentClasses.hover}
    ${className}
  `;

  return (
    <div className="mood-card">
      <button onClick={handleClick} className={cardClasses}>
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${currentClasses.gradient}`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Mood icon and name */}
          <div className="flex items-center justify-center mb-3">
            <div className="mr-3">
              {mood.id === "chill" && (
                <Waves className="w-8 h-8 text-blue-500 dark:text-blue-400" />
              )}
              {mood.id === "rush" && (
                <Zap className="w-8 h-8 text-orange-500 dark:text-orange-400" />
              )}
              {mood.id === "grind" && (
                <Target className="w-8 h-8 text-red-500 dark:text-red-400" />
              )}
            </div>
            <h3 className={`text-xl font-bold ${currentClasses.primary}`}>
              {mood.name}
            </h3>
          </div>

          {/* Description */}
          {showDescription && (
            <p className="text-sm opacity-80 mb-4 leading-relaxed">
              {mood.description}
            </p>
          )}

          {/* Quick stats */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="opacity-70">Questions:</span>
              <span className={`font-semibold ${currentClasses.accent}`}>
                {mood.quizSettings.questionsPerTutorial}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="opacity-70">Time limit:</span>
              <span className={`font-semibold ${currentClasses.accent}`}>
                {mood.quizSettings.timeLimit
                  ? `${mood.quizSettings.timeLimit}s`
                  : "None"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="opacity-70">Difficulty:</span>
              <span
                className={`font-semibold capitalize px-2 py-1 rounded text-xs ${currentClasses.badge}`}
              >
                {mood.quizSettings.difficulty}
              </span>
            </div>
          </div>

          {/* Selected indicator */}
          {isSelected && (
            <div className="absolute -top-1 -right-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${currentClasses.accent.replace(
                  "text-",
                  "bg-"
                )}`}
              >
                <Check className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
