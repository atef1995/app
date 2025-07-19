"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import InteractiveCodeBlock from "@/components/InteractiveCodeBlock";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import {
  Sprout,
  Target,
  BarChart3,
  BookOpen,
  Clock,
  Brain,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import SyntaxHighlighter from "@/components/SyntaxHighlighter";

// No more hardcoded mapping - we'll get this from the database

interface TutorialMeta {
  title: string;
  description: string;
  level: string;
  estimatedTime: string;
  topics: string[];
  quizQuestions: number;
  order: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface TutorialData {
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
  quiz?: {
    id: string;
    title: string;
    questions: QuizQuestion[];
  };
}

interface TutorialPageProps {
  params: Promise<{ id: string }>;
}

export default function TutorialPage({ params }: TutorialPageProps) {
  const { id } = use(params);
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [tutorial, setTutorial] = useState<TutorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tutorial from database, then fetch MDX content
  useEffect(() => {
    async function loadTutorial() {
      try {
        setLoading(true);

        // First, fetch tutorial metadata from database
        const tutorialResponse = await fetch(`/api/tutorials?id=${id}`);
        if (!tutorialResponse.ok) {
          throw new Error("Failed to fetch tutorial from database");
        }

        const tutorialDbData = await tutorialResponse.json();
        if (!tutorialDbData.success) {
          throw new Error(
            tutorialDbData.error?.message || "Tutorial not found"
          );
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

        // Serialize the MDX content (don't parse frontmatter again since we already did it)
        const mdxSource = await serialize(finalContent, {
          parseFrontmatter: false, // We already parsed it in the API route
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
            development: process.env.NODE_ENV === "development",
          },
        });

        setTutorial({
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
          quiz: tutorialInfo.quiz,
        });
      } catch (err) {
        console.error("Error loading tutorial:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load tutorial"
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadTutorial();
    }
  }, [id]);

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient:
            "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          border: "border-red-500",
          text: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-900/20",
          accent: "bg-red-600 dark:bg-red-700",
        };
      case "grind":
        return {
          gradient:
            "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          border: "border-blue-500",
          text: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          accent: "bg-blue-600 dark:bg-blue-700",
        };
      default: // chill
        return {
          gradient:
            "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          border: "border-purple-500",
          text: "text-purple-700 dark:text-purple-300",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          accent: "bg-purple-600 dark:bg-purple-700",
        };
    }
  };

  // Helper function to get icon based on tutorial data
  const getTutorialIcon = (tutorial: TutorialData) => {
    // Use order or slug to determine icon consistently
    if (tutorial.order === 1 || tutorial.slug?.includes("variable")) {
      return (
        <Sprout className="w-12 h-12 text-green-600 dark:text-green-400" />
      );
    } else if (tutorial.order === 2 || tutorial.slug?.includes("function")) {
      return <Target className="w-12 h-12 text-blue-600 dark:text-blue-400" />;
    } else if (
      tutorial.order === 3 ||
      tutorial.slug?.includes("array") ||
      tutorial.slug?.includes("object")
    ) {
      return (
        <BarChart3 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
      );
    }
    return <BookOpen className="w-12 h-12 text-gray-600 dark:text-gray-400" />; // default
  };

  const moodColors = getMoodColors();

  if (!session) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}
      >
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Please sign in to access tutorials.
          </p>
          <Link
            href="/auth/signin"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center gap-1 mt-2"
          >
            Sign in here <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading tutorial...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutorial) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error: {error || "Tutorial not found"}
              </p>
              <Link
                href="/tutorials"
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                Back to Tutorials
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tutorial Header */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0">{getTutorialIcon(tutorial)}</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {tutorial.meta.title || tutorial.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {tutorial.meta.description || tutorial.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tutorial.meta.level === "beginner" ||
                      tutorial.difficulty === 1
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : tutorial.meta.level === "intermediate" ||
                          tutorial.difficulty === 2
                        ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {tutorial.meta.level
                      ? tutorial.meta.level.charAt(0).toUpperCase() +
                        tutorial.meta.level.slice(1)
                      : tutorial.difficulty === 1
                      ? "Beginner"
                      : tutorial.difficulty === 2
                      ? "Intermediate"
                      : "Advanced"}
                  </span>
                  {tutorial.meta.estimatedTime && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-4 h-4" />{" "}
                      {tutorial.meta.estimatedTime}
                    </span>
                  )}
                  {tutorial.meta.topics && tutorial.meta.topics.length > 0 && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />{" "}
                      {tutorial.meta.topics.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tutorial Content */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8">
            {tutorial.mdxSource ? (
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote
                  {...tutorial.mdxSource}
                  components={{
                    InteractiveCodeBlock,
                    // Add custom heading components to ensure they work
                    h1: (props) => (
                      <h1
                        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4"
                        {...props}
                      />
                    ),
                    h3: (props) => (
                      <h3
                        className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3"
                        {...props}
                      />
                    ),
                    h4: (props) => (
                      <h4
                        className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2"
                        {...props}
                      />
                    ),
                    p: (props) => (
                      <p
                        className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4"
                        {...props}
                      />
                    ),
                    code: (props) => {
                      // Check if this is an inline code or a code block
                      const isInline = !props.className;

                      if (isInline) {
                        // Inline code styling
                        return (
                          <code
                            className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-2 py-1 rounded text-sm font-mono border border-gray-200 dark:border-gray-700"
                            {...props}
                          />
                        );
                      } else {
                        // Block code - use SyntaxHighlighter
                        return <SyntaxHighlighter {...props} />;
                      }
                    },
                    pre: (props) => {
                      // Handle code blocks wrapped in <pre>
                      const hasCodeChild = React.Children.toArray(
                        props.children
                      ).some(
                        (child) =>
                          React.isValidElement(child) && child.type === "code"
                      );

                      if (hasCodeChild) {
                        // Let the code component handle it
                        return <>{props.children}</>;
                      } else {
                        // Regular pre block
                        return (
                          <pre
                            className="m-2 shadow-inner bg-gray-900/20 dark:bg-gray-950/20 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap"
                            {...props}
                          />
                        );
                      }
                    },
                    ul: (props) => (
                      <ul
                        className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4 ml-4"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-4 ml-4"
                        {...props}
                      />
                    ),
                    li: (props) => (
                      <li
                        className="text-gray-600 dark:text-gray-400 leading-relaxed"
                        {...props}
                      />
                    ),
                    strong: (props) => (
                      <strong
                        className="font-bold text-gray-900 dark:text-gray-100"
                        {...props}
                      />
                    ),
                    em: (props) => (
                      <em
                        className="italic text-gray-700 dark:text-gray-300"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4 border-blue-400 dark:border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300 italic my-4 rounded-r-lg"
                        {...props}
                      />
                    ),
                    a: (props) => (
                      <a
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline font-medium transition-colors"
                        {...props}
                      />
                    ),
                    hr: (props) => (
                      <hr
                        className="border-gray-300 dark:border-gray-600 my-8"
                        {...props}
                      />
                    ),
                  }}
                />
              </article>
            ) : (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>

          {/* Quiz Section */}
          {(tutorial.meta.quizQuestions > 0 || tutorial.quiz) && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Ready for the Quiz?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Test your knowledge with{" "}
                    {tutorial.meta.quizQuestions ||
                      tutorial.quiz?.questions.length ||
                      0}{" "}
                    questions. You need 70% or higher to complete this tutorial.
                  </p>
                </div>
                <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              </div>

              <div
                className={`p-4 rounded-lg ${moodColors.bg} border-2 ${moodColors.border} mb-6`}
              >
                <h3 className={`font-bold mb-2 ${moodColors.text}`}>
                  {currentMood.name} Mode Quiz Settings
                </h3>
                <ul className={`text-sm ${moodColors.text} space-y-1`}>
                  <li>• Difficulty: {currentMood.quizSettings.difficulty}</li>
                  <li>
                    • Questions: {currentMood.quizSettings.questionsPerTutorial}
                  </li>
                  {currentMood.quizSettings.timeLimit && (
                    <li>
                      • Time Limit: {currentMood.quizSettings.timeLimit} seconds
                    </li>
                  )}
                  <li>• Passing Score: 70%</li>
                </ul>
              </div>

              <Link
                href={`/quiz/${tutorial.id}`}
                className={`inline-flex items-center gap-2 ${moodColors.accent} text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
              >
                Start Quiz <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Tutorial Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mt-8">
            <div className="flex justify-between items-center">
              <Link
                href="/tutorials"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back to Tutorials</span>
              </Link>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Tutorial {id}
              </div>

              <Link
                href="/practice"
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <span className="text-sm">Practice Challenges</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
