import { useMemo } from "react";
import { useMood } from "@/components/providers/MoodProvider";
import getMoodColors from "@/lib/getMoodColors";

export interface MoodColors {
  gradient: string;
  border: string;
  text: string;
  bg: string;
  button?: string;
  hover: string;
  badge: string;
}

export const useMoodColors = (): MoodColors => {
  const { currentMood } = useMood();

  return useMemo(() => {
    return getMoodColors(currentMood.id);
  }, [currentMood.id]);
};
