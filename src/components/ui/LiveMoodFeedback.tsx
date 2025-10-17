"use client";

import { useState, useEffect } from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import { useSession } from "next-auth/react";
import { Settings, Zap } from "lucide-react";
import Link from "next/link";
import { getMoodIcon } from "@/lib/getMoodIcon";
import { useMoodColors } from "@/hooks/useMoodColors";

interface LiveMoodFeedbackProps {
  context?: "quiz" | "tutorial" | "global";
  onMoodChange?: (newMoodId: string) => void;
}

export function LiveMoodFeedback({
  context = "global",
  onMoodChange,
}: LiveMoodFeedbackProps) {
  const { currentMood, setMood } = useMood();
  const { data: session } = useSession();
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastMoodChange, setLastMoodChange] = useState<string | null>(null);

  const moodConfig = MOODS[currentMood.id.toLowerCase()];
  const Icon = getMoodIcon(currentMood.icon);
  const { bg, border, text, gradient, button } = useMoodColors();

  // Show feedback when mood changes
  useEffect(() => {
    if (lastMoodChange && lastMoodChange !== currentMood.id) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 5000);
      return () => clearTimeout(timer);
    }
    setLastMoodChange(currentMood.id);
  }, [currentMood.id, lastMoodChange]);

  // Auto-hide on first load
  useEffect(() => {
    const timer = setTimeout(() => setShowFeedback(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getContextualTips = () => {
    switch (context) {
      case "quiz":
        return {
          title: "Quiz Mode Active",
          tips: [
            `${moodConfig.quizSettings.questionsPerTutorial} questions selected for your ${moodConfig.name} mood`,
            moodConfig.quizSettings.timeLimit
              ? `⏱️ ${moodConfig.quizSettings.timeLimit}s per question - stay focused!`
              : "🧘 Take your time - no rush!",
            moodConfig.quizSettings.difficulty === "easy"
              ? "💡 Questions are carefully selected for comfortable learning"
              : moodConfig.quizSettings.difficulty === "medium"
              ? "⚡ Moderate challenge ahead - you got this!"
              : "🔥 Maximum difficulty - time to show your skills!",
          ],
        };
      case "tutorial":
        return {
          title: "Learning Mode",
          tips: [
            `📚 Content optimized for ${moodConfig.name} learners`,
            moodConfig.features.animations
              ? "✨ Enhanced with smooth animations for better engagement"
              : "🎯 Clean interface for maximum focus",
            `🎯 ${
              moodConfig.quizSettings.difficulty.charAt(0).toUpperCase() +
              moodConfig.quizSettings.difficulty.slice(1)
            } difficulty content recommended`,
          ],
        };
      default:
        return {
          title: "Experience Customized",
          tips: [
            `${moodConfig.name} mode active`,
            `${moodConfig.description}`,
            "Adjust anytime in settings for optimal learning",
          ],
        };
    }
  };

  const contextInfo = getContextualTips();

  if (!session || !showFeedback) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div
        className={`p-4 rounded-lg shadow-lg border-2 transition-all duration-500 ease-in-out transform translate-y-0 opacity-100 ${bg} ${border} ${gradient}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              <Icon className="w-5 h-5" />
            </span>
            <h3 className="font-semibold text-sm">{contextInfo.title}</h3>
          </div>
          <button
            title={contextInfo.title}
            onClick={() => setShowFeedback(false)}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Tips */}
        <div className="space-y-1 text-xs opacity-90 mb-3">
          {contextInfo.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-1">
              <span className={text}>•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <div className="flex gap-1">
            {Object.values(MOODS).map((mood) => (
              <button
                key={mood.id}
                onClick={() => {
                  setMood(mood.id);
                  onMoodChange?.(mood.id);
                  setShowFeedback(true);
                }}
                className={`p-1 rounded transition-all ${
                  currentMood.id === mood.id ? button : "hover:bg-white/20"
                }`}
                title={`Switch to ${mood.name}`}
              >
                <span className="text-sm">
                  {(() => {
                    const MoodIcon = getMoodIcon(mood.icon);
                    return <MoodIcon className="w-5 h-5" />;
                  })()}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/settings"
            className="flex items-center gap-1 text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            <Settings className="w-3 h-3" />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MoodChangeNotification({
  isVisible,
  newMoodId,
  onClose,
}: {
  isVisible: boolean;
  newMoodId: string;
  onClose: () => void;
}) {
  const newMoodConfig = MOODS[newMoodId.toLowerCase()];
  const Icon = getMoodIcon(newMoodConfig.icon);
  const { bg, border, text, gradient, button } = useMoodColors();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div
        className={`p-4 rounded-lg shadow-xl border-2 transform transition-all duration-300 ease-out ${bg} ${border}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <Zap className={`w-6 h-6 ${gradient}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <span className="text-lg">
                <Icon className="w-5 h-5" />
              </span>
              Switched to {newMoodConfig.name} Mode
            </h3>
            <p className="text-xs opacity-80 mt-1">
              Your experience is now optimized for{" "}
              {newMoodConfig.description.toLowerCase()}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span>
                {newMoodConfig.quizSettings.questionsPerTutorial} questions
              </span>
              <span>{newMoodConfig.quizSettings.difficulty} difficulty</span>
            </div>
          </div>
          <button
            title="close"
            onClick={onClose}
            className="flex-shrink-0 opacity-60 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
