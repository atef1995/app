/**
 * Feedback Types
 *
 * Types for the tutorial and quiz feedback system.
 * Allows users to provide ratings, comments, and specific feedback
 * to help improve learning content.
 */

export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackDifficulty = "too-easy" | "just-right" | "too-hard";

export type FeedbackCompletion = "finished" | "partial" | "abandoned";

export interface FeedbackTag {
  id: string;
  label: string;
  emoji?: string;
}

export const IMPROVEMENT_AREAS: FeedbackTag[] = [
  { id: "pace-too-fast", label: "Pace too fast", emoji: "⚡" },
  { id: "concepts-unclear", label: "Concepts unclear", emoji: "❓" },
  { id: "examples-confusing", label: "Examples confusing", emoji: "🤔" },
  { id: "too-advanced", label: "Too advanced", emoji: "🎓" },
  { id: "needs-more-examples", label: "Needs more examples", emoji: "📝" },
  { id: "better-visualizations", label: "Better visualizations", emoji: "📊" },
];

export const POSITIVE_ASPECTS: FeedbackTag[] = [
  { id: "clear-explanations", label: "Clear explanations", emoji: "✨" },
  { id: "interactive-examples", label: "Interactive examples", emoji: "🎮" },
  { id: "good-pacing", label: "Good pacing", emoji: "👌" },
  { id: "helpful-visualizations", label: "Helpful visualizations", emoji: "📈" },
  { id: "practical-examples", label: "Practical examples", emoji: "🔧" },
  { id: "engaging-content", label: "Engaging content", emoji: "🎯" },
];

export const QUICK_TAGS: FeedbackTag[] = [
  { id: "too-easy", label: "#too-easy" },
  { id: "too-hard", label: "#too-hard" },
  { id: "perfect", label: "#perfect" },
  { id: "needs-examples", label: "#needs-examples" },
  { id: "loved-it", label: "#loved-it" },
  { id: "confusing", label: "#confusing" },
];

export interface FeedbackFormData {
  // Step 1: Rating
  rating: FeedbackRating | null;

  // Step 2: Conditional questions
  improvementAreas?: string[]; // For low ratings
  positiveAspects?: string[]; // For high ratings
  quizHelpful?: boolean; // If quiz was taken
  difficulty?: FeedbackDifficulty;

  // Step 3: Open feedback
  feedback?: string;
  tags?: string[];

  // Metadata
  completion?: FeedbackCompletion;
  isAnonymous?: boolean;
}

export interface TutorialFeedback {
  id: string;
  userId: string;
  tutorialId: string;
  quizId?: string | null;
  rating: number;
  helpful?: boolean | null;
  difficulty?: string | null;
  completion?: string | null;
  feedback?: string | null;
  tags?: string[] | null;
  quizHelpful?: boolean | null;
  improvementAreas?: string[] | null;
  positiveAspects?: string[] | null;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FeedbackSubmissionPayload {
  tutorialId: string;
  quizId?: string;
  rating: FeedbackRating;
  helpful?: boolean;
  difficulty?: FeedbackDifficulty;
  completion?: FeedbackCompletion;
  feedback?: string;
  tags?: string[];
  quizHelpful?: boolean;
  improvementAreas?: string[];
  positiveAspects?: string[];
  isAnonymous?: boolean;
}

export interface FeedbackCheckResponse {
  hasSubmitted: boolean;
  eligibleToSubmit: boolean;
  feedback?: TutorialFeedback;
}

export interface FeedbackSubmissionResponse {
  success: boolean;
  message?: string;
  feedback?: TutorialFeedback;
  achievementUnlocked?: {
    id: string;
    title: string;
    description: string;
  };
}

export interface FeedbackStats {
  averageRating: number;
  totalResponses: number;
  ratingDistribution: Record<FeedbackRating, number>;
  topImprovementAreas: Array<{ area: string; count: number }>;
  topPositiveAspects: Array<{ aspect: string; count: number }>;
  difficultyDistribution: Record<FeedbackDifficulty, number>;
}
