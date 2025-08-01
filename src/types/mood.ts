export interface MoodConfig {
  id: MoodId;
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

// export type MoodId = "chill" | "rush" | "grind";
export enum MoodId {
  CHILL = "chill",
  RUSH = "rush",
  GRIND = "grind",
  CRACKED = "cracked",
  FOCUSED = "FOCUSED",
}

export interface UserMoodPreferences {
  selectedMood: MoodId;
  customizations?: {
    disableMusic?: boolean;
    disableAnimations?: boolean;
    customTimeLimit?: number;
  };
}
