"use client";

import React from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import { MoodId, MoodConfig } from "@/types/mood";

interface MoodSelectorProps {
  className?: string;
  showDescription?: boolean;
}

export function MoodSelector({
  className = "",
  showDescription = true,
}: MoodSelectorProps) {
  const { currentMood, setMood } = useMood();

  return (
    <div className={`mood-selector ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(MOODS).map((mood) => {
          const isSelected = currentMood.id === mood.id;

          return (
            <MoodCard
              key={mood.id}
              mood={mood}
              isSelected={isSelected}
              onClick={() => setMood(mood.id as MoodId)}
              showDescription={showDescription}
            />
          );
        })}
      </div>
    </div>
  );
}

interface MoodCardProps {
  mood: MoodConfig;
  isSelected: boolean;
  onClick: () => void;
  showDescription: boolean;
}

function MoodCard({
  mood,
  isSelected,
  onClick,
  showDescription,
}: MoodCardProps) {
  const cardClasses = `
    relative overflow-hidden rounded-xl p-6 transition-all duration-300 transform
    border-2 hover:scale-105 hover:shadow-lg w-full
    ${
      isSelected
        ? "border-blue-500 shadow-lg scale-105"
        : "border-gray-200 hover:border-gray-300"
    }
    group text-gray-800 bg-white hover:bg-gray-50
  `;

  const moodClasses = {
    chill: {
      bg: "bg-blue-50",
      text: "text-slate-800",
      primary: "text-blue-500",
      accent: "text-cyan-500",
      border: isSelected ? "border-blue-500" : "",
      gradient: "from-blue-500 to-blue-300",
      badge: "bg-cyan-100 text-cyan-600",
    },
    rush: {
      bg: "bg-amber-50",
      text: "text-slate-800",
      primary: "text-amber-500",
      accent: "text-red-500",
      border: isSelected ? "border-amber-500" : "",
      gradient: "from-amber-500 to-amber-300",
      badge: "bg-red-100 text-red-600",
    },
    grind: {
      bg: "bg-gray-800",
      text: "text-gray-50",
      primary: "text-red-600",
      accent: "text-violet-500",
      border: isSelected ? "border-red-600" : "",
      gradient: "from-red-600 to-red-300",
      badge: "bg-violet-100 text-violet-600",
    },
  };

  const currentClasses = moodClasses[mood.id as keyof typeof moodClasses];

  return (
    <div className="mood-card">
      <button
        onClick={onClick}
        className={`
          ${cardClasses}
          ${currentClasses.bg}
          ${currentClasses.text}
          ${currentClasses.border}
        `}
      >
        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-gradient-to-br ${currentClasses.gradient}`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Mood emoji and name */}
          <div className="flex items-center justify-center mb-3">
            <span className="text-4xl mr-3">{mood.emoji}</span>
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
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${currentClasses.accent.replace(
                  "text-",
                  "bg-"
                )}`}
              >
                ✓
              </div>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export default MoodSelector;
