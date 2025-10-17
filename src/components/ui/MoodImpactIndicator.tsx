"use client";

import { MOODS, MoodConfig } from "@/lib/moods";
import { useMood } from "@/components/providers/MoodProvider";
import { getMoodIcon } from "@/lib/getMoodIcon";
import { Sparkles, Music, Bell, Lightbulb } from "lucide-react";

interface MoodImpactIndicatorProps {
  showFullDetails?: boolean;
  context?: "quiz" | "tutorial" | "settings" | "dashboard";
  className?: string;
}

export function MoodImpactIndicator({
  showFullDetails = false,
  context = "dashboard",
  className = "",
}: MoodImpactIndicatorProps) {
  const { currentMood } = useMood();
  const moodConfig = MOODS[currentMood.id.toLowerCase()];

  const getContextualMessage = () => {
    switch (context) {
      case "quiz":
        return {
          icon: "Brain",
          title: "Quiz Experience",
          details: [
            `${moodConfig.quizSettings.questionsPerTutorial} questions at ${moodConfig.quizSettings.difficulty} difficulty`,
            moodConfig.quizSettings.timeLimit
              ? `${moodConfig.quizSettings.timeLimit}s per question`
              : "No time pressure",
          ],
        };
      case "tutorial":
        return {
          icon: "Book",
          title: "Learning Mode",
          details: [
            `${
              moodConfig.quizSettings.difficulty.charAt(0).toUpperCase() +
              moodConfig.quizSettings.difficulty.slice(1)
            } content difficulty`,
            moodConfig.features.animations
              ? "Enhanced with animations"
              : "Clean, focused interface",
          ],
        };
      case "settings":
        return {
          icon: "Settings",
          title: "Current Configuration",
          details: [
            `${moodConfig.quizSettings.questionsPerTutorial} quiz questions`,
            `${moodConfig.quizSettings.difficulty} difficulty level`,
            moodConfig.quizSettings.timeLimit
              ? `${moodConfig.quizSettings.timeLimit}s time limit`
              : "No time limit",
          ],
        };
      default:
        return {
          icon: "Target",
          title: "Learning Style",
          details: [
            moodConfig.description,
            `${moodConfig.quizSettings.difficulty} difficulty level`,
          ],
        };
    }
  };

  const contextInfo = getContextualMessage();

  if (!showFullDetails) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${className}`}
        style={{
          backgroundColor: moodConfig.theme.background,
          borderColor: moodConfig.theme.primary + "40",
          color: moodConfig.theme.text,
        }}
      >
        {(() => {
          const Icon = getMoodIcon(moodConfig.icon);
          return <Icon className="w-5 h-5" />;
        })()}
        <span className="font-medium">{moodConfig.name} Mode</span>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${className}`}
      style={{
        backgroundColor: moodConfig.theme.background,
        borderColor: moodConfig.theme.primary + "40",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        {(() => {
          const Icon = getMoodIcon(moodConfig.icon);
          return <Icon className="w-6 h-6" />;
        })()}
        <div>
          <h3
            className="font-semibold text-lg"
            style={{ color: moodConfig.theme.text }}
          >
            {(() => {
              const ContextIcon = getMoodIcon(contextInfo.icon);
              return <ContextIcon className="w-5 h-5 inline mr-2" />;
            })()}
            {contextInfo.title}
          </h3>
          <p
            className="text-sm opacity-80"
            style={{ color: moodConfig.theme.text }}
          >
            Currently in {moodConfig.name} mode
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {contextInfo.details.map((detail, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm"
            style={{ color: moodConfig.theme.text }}
          >
            <span style={{ color: moodConfig.theme.accent }}>•</span>
            <span>{detail}</span>
          </div>
        ))}
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mt-3">
        {moodConfig.features.animations && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/20 backdrop-blur-sm"
            style={{ color: moodConfig.theme.text }}
          >
            <Sparkles className="w-3 h-3" />
            Animations
          </span>
        )}
        {moodConfig.features.music && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/20 backdrop-blur-sm"
            style={{ color: moodConfig.theme.text }}
          >
            <Music className="w-3 h-3" />
            {moodConfig.features.music}
          </span>
        )}
        {moodConfig.features.notifications && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-white/20 backdrop-blur-sm"
            style={{ color: moodConfig.theme.text }}
          >
            <Bell className="w-3 h-3" />
            Notifications
          </span>
        )}
      </div>

      {/* Quick mood switch hint */}
      <div className="mt-3 pt-3 border-t border-white/20">
        <p
          className="text-xs opacity-60 flex items-center gap-2"
          style={{ color: moodConfig.theme.text }}
        >
          <Lightbulb className="w-3 h-3" />
          Change your mood anytime in Settings to adjust your learning
          experience
        </p>
      </div>
    </div>
  );
}

export function QuickMoodSwitcher({ className = "" }: { className?: string }) {
  const { currentMood, setMood } = useMood();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 dark:text-gray-400">Mood:</span>
      <div className="flex gap-1">
        {Object.values(MOODS).map((mood) => (
          <button
            key={mood.id}
            onClick={() => setMood(mood.id)}
            className={`p-2 rounded-lg transition-all ${
              currentMood.id === mood.id
                ? "bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-300 dark:ring-blue-700"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            }`}
            title={`Switch to ${mood.name} mode: ${mood.description}`}
          >
            {(() => {
              const Icon = getMoodIcon(mood.icon);
              return <Icon className="w-5 h-5" />;
            })()}
          </button>
        ))}
      </div>
    </div>
  );
}

export function MoodDifficultyBadge({
  className = "",
}: {
  className?: string;
}) {
  const { currentMood } = useMood();
  const moodConfig = MOODS[currentMood.id.toLowerCase()];

  const difficultyColors = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    medium:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
        difficultyColors[moodConfig.quizSettings.difficulty]
      } ${className}`}
    >
      {moodConfig.quizSettings.difficulty.charAt(0).toUpperCase() +
        moodConfig.quizSettings.difficulty.slice(1)}{" "}
      Difficulty
    </span>
  );
}
