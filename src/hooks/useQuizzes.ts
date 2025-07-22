"use client";

import { useQuery } from "@tanstack/react-query";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Quiz {
  id: string;
  tutorialId: string;
  title: string;
  slug: string;
  questions: Question[];
  isPremium: boolean;
  requiredPlan: string;
}

interface QuizzesResponse {
  quizzes: Quiz[];
}

// Fetch function for quizzes
const fetchQuizzes = async (): Promise<Quiz[]> => {
  const response = await fetch("/api/quizzes");
  
  if (!response.ok) {
    throw new Error(`Failed to fetch quizzes: ${response.status}`);
  }
  
  const data: QuizzesResponse = await response.json();
  
  return data.quizzes || [];
};

// Hook for fetching all quizzes
export const useQuizzes = () => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: fetchQuizzes,
    staleTime: 5 * 60 * 1000, // 5 minutes - quizzes don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook for fetching a specific quiz by slug
export const useQuiz = (slug: string) => {
  return useQuery({
    queryKey: ["quiz", slug],
    queryFn: async (): Promise<Quiz> => {
      const response = await fetch(`/api/quizzes/slug/${slug}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch quiz: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.quiz;
    },
    enabled: !!slug, // Only run query if slug is provided
    staleTime: 10 * 60 * 1000, // 10 minutes - individual quiz data is more stable
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  });
};

export type { Quiz, Question };
