export interface MoodConfig {
  id: "chill" | "rush" | "grind";
  name: string;
  description: string;
  emoji: string;
  theme: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  quizSettings: {
    timeLimit?: number; // in seconds, undefined means no limit
    questionsPerTutorial: number;
    difficulty: "easy" | "medium" | "hard";
  };
  features: {
    music?: string;
    animations: boolean;
    notifications: boolean;
  };
}

export const MOODS: Record<string, MoodConfig> = {
  chill: {
    id: "chill",
    name: "Chill",
    description: "Relaxed learning at your own pace",
    emoji: "😌",
    theme: {
      primary: "#3B82F6", // blue-500
      secondary: "#93C5FD", // blue-300
      background: "#F0F9FF", // blue-50
      text: "#1E293B", // slate-800
      accent: "#06B6D4", // cyan-500
    },
    quizSettings: {
      timeLimit: undefined, // no time limit
      questionsPerTutorial: 3,
      difficulty: "easy",
    },
    features: {
      music: "lo-fi",
      animations: true,
      notifications: false,
    },
  },
  rush: {
    id: "rush",
    name: "Rush",
    description: "Fast-paced learning with energy",
    emoji: "⚡",
    theme: {
      primary: "#F59E0B", // amber-500
      secondary: "#FCD34D", // amber-300
      background: "#FFFBEB", // amber-50
      text: "#1E293B", // slate-800
      accent: "#EF4444", // red-500
    },
    quizSettings: {
      timeLimit: 30, // 30 seconds per question
      questionsPerTutorial: 5,
      difficulty: "medium",
    },
    features: {
      music: "upbeat",
      animations: true,
      notifications: true,
    },
  },
  grind: {
    id: "grind",
    name: "Grind",
    description: "Intense focus and challenging content",
    emoji: "🔥",
    theme: {
      primary: "#DC2626", // red-600
      secondary: "#FCA5A5", // red-300
      background: "#1F2937", // gray-800
      text: "#F9FAFB", // gray-50
      accent: "#8B5CF6", // violet-500
    },
    quizSettings: {
      timeLimit: 15, // 15 seconds per question
      questionsPerTutorial: 7,
      difficulty: "hard",
    },
    features: {
      music: undefined, // no music for focus
      animations: false,
      notifications: true,
    },
  },
};
