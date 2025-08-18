export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  slug: string;
  questions: Question[];
}

export interface QuizState {
  currentQuestion: number;
  answers: number[];
  showResults: boolean;
  timeLeft?: number;
  startTime: number;
  submissionResult?: {
    passed: boolean;
    score: number;
    status: "COMPLETED" | "IN_PROGRESS";
  };
}

export interface UnlockedAchievement {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

export interface TutorialNavigation {
  current: { id: string; slug: string; title: string; order: number; category: string };
  prev: { id: string; slug: string; title: string; order: number; category: string } | null;
  next: { id: string; slug: string; title: string; order: number; category: string } | null;
}

export interface QuizSubmissionResult {
  success: boolean;
  passed: boolean;
  score: number;
  error?: string;
  achievements?: UnlockedAchievement[];
}