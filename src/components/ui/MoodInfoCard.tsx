import React from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { useMoodColors } from "@/hooks/useMoodColors";
import { getMoodIcon } from "@/lib/getMoodIcon";

interface MoodInfoCardProps {
  className?: string;
  showQuizSettings?: boolean;
}

export const MoodInfoCard: React.FC<MoodInfoCardProps> = ({
  className = "",
  showQuizSettings = true,
}) => {
  const { currentMood } = useMood();
  const moodColors = useMoodColors();
  const Icon = getMoodIcon(currentMood.icon);

  return (
    <div
      className={`p-6 rounded-2xl ${moodColors.bg} border-2 ${moodColors.border} ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">
          <Icon className="w-5 h-5" />
        </span>
        <div>
          <h3 className={`text-xl font-bold mb-2 ${moodColors.text}`}>
            {currentMood.name} Mode Active
          </h3>
          <p className={moodColors.text}>{currentMood.description}</p>
          {showQuizSettings && (
            <div className={`mt-2 text-sm ${moodColors.text}`}>
              Quiz difficulty: {currentMood.quizSettings.difficulty} • Questions
              per tutorial: {currentMood.quizSettings.questionsPerTutorial}
              {currentMood.quizSettings.timeLimit && (
                <> • Time limit: {currentMood.quizSettings.timeLimit}s</>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
