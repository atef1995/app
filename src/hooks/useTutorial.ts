"use client";

import { useQuery } from "@tanstack/react-query";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface TutorialMeta {
  title: string;
  description: string;
  level: string;
  estimatedTime: string;
  topics: string[];
  quizQuestions: number;
  order: number;
  isPremium?: boolean;
  requiredPlan?: "FREE" | "VIBED" | "CRACKED";
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface TutorialData {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  mdxFile: string | null;
  difficulty: number;
  order: number;
  meta: TutorialMeta;
  content: string;
  mdxSource: MDXRemoteSerializeResult;
  isPremium: boolean;
  requiredPlan?: "FREE" | "VIBED" | "CRACKED";
  quiz?: {
    id: string;
    title: string;
    slug: string;
    questions: QuizQuestion[];
  };
}

// Fetch function for tutorial data
const fetchTutorial = async (slug: string): Promise<TutorialData> => {
  // First, fetch tutorial metadata from database
  const tutorialResponse = await fetch(`/api/tutorials?slug=${slug}`);
  if (!tutorialResponse.ok) {
    throw new Error("Failed to fetch tutorial from database");
  }

  const tutorialDbData = await tutorialResponse.json();
  if (!tutorialDbData.success) {
    throw new Error(tutorialDbData.error?.message || "Tutorial not found");
  }

  const tutorialInfo = tutorialDbData.data;

  // If tutorial has an MDX file, load the content from it
  let mdxContent = "";
  let frontmatter = {};

  if (tutorialInfo.mdxFile) {
    const mdxResponse = await fetch(
      `/api/tutorials/mdx?file=${tutorialInfo.mdxFile}`
    );
    if (!mdxResponse.ok) {
      throw new Error("Failed to fetch MDX content");
    }

    const mdxData = await mdxResponse.json();
    if (mdxData.success) {
      mdxContent = mdxData.data.content;
      frontmatter = mdxData.data.frontmatter;
    }
  }

  // Use stored content if no MDX file
  const finalContent = mdxContent || tutorialInfo.content || "";

  // Serialize the MDX content
  const mdxSource = await serialize(finalContent, {
    parseFrontmatter: false, // We already parsed it in the API route
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      development: process.env.NODE_ENV === "development",
    },
  });

  return {
    id: tutorialInfo.id,
    slug: tutorialInfo.slug,
    title: tutorialInfo.title,
    description: tutorialInfo.description,
    mdxFile: tutorialInfo.mdxFile,
    difficulty: tutorialInfo.difficulty,
    order: tutorialInfo.order,
    meta: frontmatter as TutorialMeta,
    content: finalContent,
    mdxSource,
    quiz: tutorialInfo.quizzes && tutorialInfo.quizzes.length > 0 ? tutorialInfo.quizzes[0] : undefined,
    isPremium: tutorialInfo.isPremium,
    requiredPlan: tutorialInfo.requiredPlan || (frontmatter as TutorialMeta).requiredPlan,
  };
};

// Hook for fetching tutorial data with TanStack Query
export const useTutorial = (slug: string) => {
  return useQuery({
    queryKey: ["tutorial", slug],
    queryFn: () => fetchTutorial(slug),
    enabled: !!slug, // Only run if slug is provided
    staleTime: 10 * 60 * 1000, // 10 minutes - tutorials don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnection
  });
};
