// Practice challenge types and interfaces
export interface Challenge {
  id: string;
  slug: string; // SEO-friendly URL slug
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  type: "algorithm" | "function" | "array" | "object" | "logic";
  estimatedTime: string;
  isPremium: boolean;
  requiredPlan: string;
  moodAdapted: {
    chill: string;
    rush: string;
    grind: string;
  };
  starter: string;
  solution: string;
  tests: Array<{
    input: unknown;
    expected: unknown;
    description: string;
  }>;
}

export interface TestResult {
  passed: boolean;
  description: string;
  expected: unknown;
  actual: unknown;
  error?: string;
}
