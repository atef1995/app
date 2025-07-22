import { useMemo } from "react";
import { useMood } from "@/components/providers/MoodProvider";

export interface MoodColors {
  gradient: string;
  border: string;
  text: string;
  bg: string;
  button?: string;
}

export const useMoodColors = (): MoodColors => {
  const { currentMood } = useMood();

  return useMemo(() => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient:
            "from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20",
          border: "border-red-500 dark:border-red-400",
          text: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-900/20",
          button: "bg-orange-500 hover:bg-orange-600",
        };
      case "grind":
        return {
          gradient:
            "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-slate-900/20 dark:to-blue-900/20",
          border: "border-blue-500 dark:border-blue-400",
          text: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          button: "bg-blue-500 hover:bg-blue-600",
        };
      default: // chill
        return {
          gradient:
            "from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20",
          border: "border-purple-500 dark:border-purple-400",
          text: "text-purple-700 dark:text-purple-300",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          button: "bg-purple-500 hover:bg-purple-600",
        };
    }
  }, [currentMood.id]);
};
