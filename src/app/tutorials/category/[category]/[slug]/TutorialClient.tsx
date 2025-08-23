"use client";

import React, { useEffect, useState } from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/components/providers/ToastProvider";
import { startTutorialAction } from "@/lib/actions";
import Link from "next/link";
import InteractiveCodeBlock from "@/components/InteractiveCodeBlock";
import { DOMInteractiveBlock } from "@/components/ui/DOMInteractiveBlock";
import TableOfContents from "@/components/TableOfContents";
import { MDXRemote } from "next-mdx-remote";
import { useTutorial, type TutorialData } from "@/hooks/useTutorial";
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
import { HTMLPreviewWindow } from "@/components/ui/HTMLPreviewWindow";
import { HTMLEditorPreview } from "@/components/ui/HTMLEditorPreview";
import { SeparatedEditorPreview } from "@/components/ui/SeparatedEditorPreview";

interface UnlockedAchievement {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

interface TutorialClientProps {
  category: string;
  slug: string;
}

export default function TutorialClient({
  category,
  slug,
}: TutorialClientProps) {
  const { currentMood } = useMood();
  const { data: session } = useSession();
  const toast = useToastContext();
  const [contentLoaded, setContentLoaded] = useState(false);

  // Use TanStack Query hook for tutorial data
  const { data: tutorial, isLoading, error, isError } = useTutorial(slug);

  // Track tutorial start when tutorial loads
  useEffect(() => {
    if (tutorial && session?.user?.id) {
      // Mark tutorial as started for progress tracking and achievements using server action
      startTutorialAction(tutorial.id)
        .then((result) => {
          if (
            result.success &&
            result.achievements &&
            result.achievements.length > 0
          ) {
            // Show achievement notifications
            result.achievements.forEach((achievement: UnlockedAchievement) => {
              toast.achievement(
                `🏆 Achievement Unlocked!`,
                `${achievement.achievement.icon} ${achievement.achievement.title} - ${achievement.achievement.description}`
              );
            });
          }

          if (!result.success && result.error) {
            console.error("Failed to mark tutorial as started:", result.error);
          }
        })
        .catch((error) => {
          console.error("Failed to mark tutorial as started:", error);
        });
    }
  }, [tutorial, session?.user?.id, toast]);

  // Progressive content loading
  useEffect(() => {
    if (tutorial?.mdxSource) {
      // Simulate progressive loading for better UX
      const timer = setTimeout(() => {
        setContentLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [tutorial?.mdxSource]);

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

  // Helper function to generate anchor IDs from text
  const generateAnchorId = (text: string): string => {
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    return id;
  };

  // Create heading components with anchor IDs
  const createHeadingComponent = (level: 1 | 2 | 3 | 4) => {
    const HeadingComponent = (
      props: React.HTMLAttributes<HTMLHeadingElement>
    ) => {
      const text =
        typeof props.children === "string"
          ? props.children
          : React.Children.toArray(props.children).join("");

      const id = generateAnchorId(text);

      const baseClasses = {
        1: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4",
        2: "text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4 scroll-mt-20",
        3: "text-xl font-semibold text-gray-700 dark:text-gray-300 mt-6 mb-3 scroll-mt-20",
        4: "text-lg font-medium text-gray-700 dark:text-gray-300 mt-4 mb-2 scroll-mt-20",
      };

      const className = `${baseClasses[level]} group`;

      const headingProps = {
        id,
        className,
        ...props,
      };

      const anchorLink =
        level >= 2 ? (
          <a
            href={`#${id}`}
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
            aria-label={`Link to ${text}`}
          >
            #
          </a>
        ) : null;

      switch (level) {
        case 1:
          return (
            <h1 {...headingProps}>
              {props.children}
              {anchorLink}
            </h1>
          );
        case 2:
          return (
            <h2 {...headingProps}>
              {props.children}
              {anchorLink}
            </h2>
          );
        case 3:
          return (
            <h3 {...headingProps}>
              {props.children}
              {anchorLink}
            </h3>
          );
        case 4:
          return (
            <h4 {...headingProps}>
              {props.children}
              {anchorLink}
            </h4>
          );
        default:
          return (
            <h2 {...headingProps}>
              {props.children}
              {anchorLink}
            </h2>
          );
      }
    };

    HeadingComponent.displayName = `Heading${level}`;
    return HeadingComponent;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Tutorial Header Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutorial Content Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>

                <div className="my-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>

                <div className="my-6 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>

            {/* Quiz Section Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl animate-pulse">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
            </div>

            {/* Navigation Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mt-8 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !tutorial) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error: {error?.message || "Tutorial not found"}
              </p>
              <Link
                href={`/tutorials/category/${category}`}
                className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 mr-2"
              >
                Back to {category}
              </Link>
              <Link
                href="/tutorials"
                className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800"
              >
                All Tutorials
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium capitalize">
                    {category} Tutorial
                  </span>
                </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 relative">
            {/* Add Table of Contents */}
            {tutorial.content && contentLoaded && (
              <TableOfContents content={tutorial.content} />
            )}

            {!contentLoaded ? (
              <div className="animate-pulse space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                <div className="my-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ) : tutorial.mdxSource ? (
              <article className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote
                  {...tutorial.mdxSource}
                  components={{
                    InteractiveCodeBlock,
                    DOMInteractiveBlock,
                    HTMLPreviewWindow,
                    HTMLEditorPreview,
                    SeparatedEditorPreview,
                    // Use custom heading components with anchor IDs
                    h1: createHeadingComponent(1),
                    h2: createHeadingComponent(2),
                    h3: createHeadingComponent(3),
                    h4: createHeadingComponent(4),
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
                    li: (props) => {
                      const LiComponent = "li" as const;
                      return (
                        <LiComponent
                          className="text-gray-600 dark:text-gray-400 leading-relaxed"
                          {...props}
                        />
                      );
                    },
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
              {!contentLoaded ? (
                <div className="animate-pulse">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  </div>
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
                </div>
              ) : (
                <>
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
                        questions. You need 70% or higher to complete this
                        tutorial.
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
                      <li>
                        • Difficulty: {currentMood.quizSettings.difficulty}
                      </li>
                      <li>
                        • Questions:{" "}
                        {currentMood.quizSettings.questionsPerTutorial}
                      </li>
                      {currentMood.quizSettings.timeLimit && (
                        <li>
                          • Time Limit: {currentMood.quizSettings.timeLimit}{" "}
                          seconds
                        </li>
                      )}
                      <li>• Passing Score: 70%</li>
                    </ul>
                  </div>

                  <Link
                    href={
                      tutorial.quiz?.slug ? `/quiz/${tutorial.quiz.slug}` : "#"
                    }
                    className={`inline-flex items-center gap-2 ${moodColors.accent} text-white py-3 px-8 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
                  >
                    Start Quiz <ChevronRight className="w-5 h-5" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Tutorial Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mt-8">
            <div className="flex justify-between items-center">
              <Link
                href={`/tutorials/category/${category}`}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">Back to {category}</span>
              </Link>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                {category} / {tutorial.slug}
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
