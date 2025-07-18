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

export type MoodId = "chill" | "rush" | "grind";

export interface UserMoodPreferences {
  selectedMood: MoodId;
  customizations?: {
    disableMusic?: boolean;
    disableAnimations?: boolean;
    customTimeLimit?: number;
  };
}
