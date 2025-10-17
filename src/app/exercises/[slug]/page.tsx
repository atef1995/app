"use client";

import { useEffect, use, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ValidatedExercise } from "@/components/ui/ValidatedExercise";

interface ExerciseData {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  estimatedTime: number;
  instructions: string;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  showCssEditor: boolean;
  showJsEditor: boolean;
  testCases: Array<{
    description: string;
    validate: (html?: string, css?: string, js?: string) => boolean;
  }>;
  hints: string[];
  solution: {
    html?: string;
    css?: string;
    js?: string;
  };
  topics: string[];
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ExercisePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const { data: session } = useSession();
  const [exercise, setExercise] = useState<ExerciseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(
          `/api/exercises/slug/${resolvedParams.slug}`
        );
        if (!response.ok) throw new Error("Exercise not found");
        const data = await response.json();
        setExercise(data.exercise);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load exercise"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading exercise...
          </p>
        </div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {error || "Exercise Not Found"}
          </h1>
          <Link
            href="/exercises"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Exercises
          </Link>
        </div>
      </div>
    );
  }

  // Convert test cases from stored format to function format
  const testCasesWithFunctions = (exercise.testCases?.map(
    (tc: { description: string; validate: unknown }) => ({
      description: tc.description,
      validate: (
        html: string,
        css: string,
        js: string,
        iframeWindow?: Window | null
      ): boolean => {
        try {
          // If validate is a string (arrow function code), evaluate it
          if (typeof tc.validate === "string") {
            // Create function from string: "(html, css, js, iframeWindow) => ..."
            const fn = new Function("return " + tc.validate)();
            return fn(html, css, js, iframeWindow);
          }
          // If it's already a function, use it directly
          else if (typeof tc.validate === "function") {
            return tc.validate(html, css, js);
          }
          return false;
        } catch (err) {
          console.error("Error running validation:", err);
          return false;
        }
      },
    })
  ) || []) as Array<{
    description: string;
    validate: (
      html: string,
      css: string,
      js: string,
      iframeWindow?: Window | null
    ) => boolean | Promise<boolean>;
  }>;

  const difficultyLabel =
    exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/exercises"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
          >
            ← Back to Exercises
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {exercise.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    DIFFICULTY_COLORS[exercise.difficulty]
                  }`}
                >
                  {difficultyLabel}
                </span>
                <span>📚 {exercise.category}</span>
                <span>⏱️ {exercise.estimatedTime} minutes</span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-700 dark:text-gray-300">
            {exercise.description}
          </p>
        </div>

        {/* Guest Banner */}
        {!session?.user && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              You&apos;re working on this exercise as a guest. Sign up to save
              your progress and earn badges!
            </p>
          </div>
        )}

        {/* Exercise Component */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ValidatedExercise
            title={exercise.title}
            instructions={exercise.instructions}
            initialHtml={exercise.initialHtml || ""}
            initialCss={exercise.initialCss || ""}
            initialJs={exercise.initialJs || ""}
            showCssEditor={exercise.showCssEditor}
            showJsEditor={exercise.showJsEditor}
            testCases={testCasesWithFunctions}
            hints={exercise.hints}
            solution={exercise.solution}
            exerciseId={exercise.id}
          />
        </div>

        {/* Topics */}
        {exercise.topics && exercise.topics.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Topics Covered
            </h3>
            <div className="flex flex-wrap gap-2">
              {exercise.topics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Link
            href="/exercises"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Exercises
          </Link>
          <Link
            href="/tutorials"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View Tutorials →
          </Link>
        </div>
      </div>
    </div>
  );
}
