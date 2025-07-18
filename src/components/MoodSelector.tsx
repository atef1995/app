"use client";

import React from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import { MoodId } from "@/types/mood";
import { MoodCard } from "@/components/MoodCard";

interface MoodSelectorProps {
  className?: string;
  showDescription?: boolean;
}

export function MoodSelector({
  className = "",
  showDescription = true,
}: MoodSelectorProps) {
  const { currentMood, setMood } = useMood();

  const handleMoodSelect = async (moodId: MoodId) => {
    try {
      await setMood(moodId);
    } catch (error) {
      console.error("Failed to update mood:", error);
      // You could add a toast notification here
    }
  };

  return (
    <div className={`mood-selector ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(MOODS).map((mood) => {
          const isSelected = currentMood.id === mood.id;

          return (
            <MoodCard
              key={mood.id}
              mood={mood}
              variant="selector"
              isSelected={isSelected}
              onClick={() => handleMoodSelect(mood.id as MoodId)}
              showDescription={showDescription}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MoodSelector;
