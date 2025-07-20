"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { usePremiumAccess } from "@/hooks/usePremiumAccess";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TutorialWithQuiz } from "@/lib/tutorialService";
import Card from "@/components/ui/Card";
import PremiumModal from "@/components/ui/PremiumModal";
import {
  Sprout,
  Target,
  BarChart3,
  BookOpen,
  Clock,
  ChevronRight,
  CheckCircle,
  Circle,
  Trophy,
} from "lucide-react";

interface TutorialProgress {
  id: string;
  status: string;
  quizPassed: boolean;
  quizAttempts: number;
  bestScore: number | null;
  completedAt: Date | null;
}

interface TutorialWithProgress extends TutorialWithQuiz {
  progress?: TutorialProgress | null;
  level?: string;
  lessons?: number;
  estimatedTime?: string;
  topics?: string[];
  isPremium: boolean;
  requiredPlan: "FREE" | "PREMIUM" | "PRO";
}

// Helper function to get tutorial icon
const getTutorialIcon = (
  tutorial: TutorialWithProgress,
  size: string = "w-6 h-6"
) => {
  if (tutorial.order === 1 || tutorial.slug?.includes("variable")) {
    return <Sprout className={`${size} text-green-600 dark:text-green-400`} />;
  } else if (tutorial.order === 2 || tutorial.slug?.includes("function")) {
    return <Target className={`${size} text-blue-600 dark:text-blue-400`} />;
  } else if (
    tutorial.order === 3 ||
    tutorial.slug?.includes("array") ||
    tutorial.slug?.includes("object")
  ) {
    return (
      <BarChart3 className={`${size} text-purple-600 dark:text-purple-400`} />
    );
  }
  return <BookOpen className={`${size} text-gray-600 dark:text-gray-400`} />;
};

export default function TutorialsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const { canAccess, showPremiumModal, setShowPremiumModal } =
    usePremiumAccess();
  const [tutorials, setTutorials] = useState<TutorialWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPremiumContent, setSelectedPremiumContent] = useState<{
    title: string;
    type: "tutorial" | "challenge" | "quiz";
    requiredPlan: "PREMIUM" | "PRO";
  } | null>(null);

  // Fetch tutorials from API
  useEffect(() => {
    async function fetchTutorials() {
      try {
        setLoading(true);
        const response = await fetch("/api/tutorials");
        if (!response.ok) {
          throw new Error("Failed to fetch tutorials");
        }
        const data = await response.json();

        if (data.success) {
          // Map database tutorials and load MDX metadata if available
          const mappedTutorials: TutorialWithProgress[] = await Promise.all(
            data.data.map(async (tutorial: TutorialWithQuiz) => {
              let estimatedTime = "2 hours"; // default
              let topics: string[] = ["JavaScript", "Programming"]; // default

              // If tutorial has MDX file, load its frontmatter for rich metadata
              if (tutorial.mdxFile) {
                try {
                  const mdxResponse = await fetch(
                    `/api/tutorials/mdx?file=${tutorial.mdxFile}`
                  );
                  if (mdxResponse.ok) {
                    const mdxData = await mdxResponse.json();
                    if (mdxData.success && mdxData.data.frontmatter) {
                      const frontmatter = mdxData.data.frontmatter as {
                        estimatedTime?: string;
                        topics?: string[];
                      };
                      // Use MDX frontmatter if available
                      estimatedTime =
                        frontmatter.estimatedTime || estimatedTime;
                      topics = frontmatter.topics || topics;
                    }
                  }
                } catch (error) {
                  console.warn(
                    `Failed to load MDX metadata for ${tutorial.mdxFile}:`,
                    error
                  );
                }
              }

              return {
                ...tutorial,
                level:
                  tutorial.difficulty === 1
                    ? "beginner"
                    : tutorial.difficulty === 2
                    ? "intermediate"
                    : "advanced",
                lessons: 8, // Default for display - could be extracted from MDX content
                estimatedTime,
                topics,
                isPremium: tutorial.isPremium || false,
                requiredPlan: tutorial.requiredPlan || "FREE",
              };
            })
          );

          setTutorials(mappedTutorials);

          // Fetch progress for each tutorial if user is logged in
          if (session?.user?.id) {
            fetchProgress(mappedTutorials);
          }
        } else {
          throw new Error(data.error?.message || "Failed to fetch tutorials");
        }
      } catch (err) {
        console.error("Error fetching tutorials:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load tutorials"
        );
      } finally {
        setLoading(false);
      }
    }

    async function fetchProgress(tutorialList: TutorialWithProgress[]) {
      if (!session?.user?.id) return;

      try {
        const progressPromises = tutorialList.map(async (tutorial) => {
          const response = await fetch(
            `/api/progress/tutorial?tutorialId=${tutorial.id}&userId=${session.user.id}`
          );
          if (response.ok) {
            const progressData = await response.json();
            return { tutorialId: tutorial.id, progress: progressData.data };
          }
          return { tutorialId: tutorial.id, progress: null };
        });

        const progressResults = await Promise.all(progressPromises);
        const progressMap = new Map(
          progressResults.map((r) => [r.tutorialId, r.progress])
        );

        setTutorials((prev) =>
          prev.map((tutorial) => ({
            ...tutorial,
            progress: progressMap.get(tutorial.id) || null,
          }))
        );
      } catch (err) {
        console.error("Error fetching progress:", err);
        // Don't show error for progress, just continue without it
      }
    }

    fetchTutorials();
  }, [session]);

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient:
            "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          border: "border-red-500",
          text: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-900/20",
        };
      case "grind":
        return {
          gradient:
            "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          border: "border-blue-500",
          text: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        };
      default: // chill
        return {
          gradient:
            "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          border: "border-purple-500",
          text: "text-purple-700 dark:text-purple-300",
          bg: "bg-purple-50 dark:bg-purple-900/20",
        };
    }
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
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Sign in here
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
                Loading tutorials...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error: {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Retry
              </button>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            JavaScript Tutorials
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive lessons tailored to your{" "}
            {currentMood.name.toLowerCase()} learning style
          </p>
        </div>

        {/* Mood Info Card */}
        <div
          className={`mb-8 p-6 rounded-2xl ${moodColors.bg} border-2 ${moodColors.border}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{currentMood.emoji}</span>
            <div>
              <h3 className={`text-xl font-bold mb-2 ${moodColors.text}`}>
                {currentMood.name} Mode Active
              </h3>
              <p className={moodColors.text}>{currentMood.description}</p>
              <div className={`mt-2 text-sm ${moodColors.text}`}>
                Quiz difficulty: {currentMood.quizSettings.difficulty} •
                Questions per tutorial:{" "}
                {currentMood.quizSettings.questionsPerTutorial}
                {currentMood.quizSettings.timeLimit && (
                  <> • Time limit: {currentMood.quizSettings.timeLimit}s</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((tutorial) => {
            const handleTutorialClick = () => {
              if (
                tutorial.isPremium &&
                !canAccess(
                  tutorial.requiredPlan === "FREE"
                    ? "PREMIUM"
                    : tutorial.requiredPlan,
                  tutorial.isPremium
                )
              ) {
                setSelectedPremiumContent({
                  title: tutorial.title,
                  type: "tutorial",
                  requiredPlan:
                    tutorial.requiredPlan === "FREE"
                      ? "PREMIUM"
                      : (tutorial.requiredPlan as "PREMIUM" | "PRO"),
                });
                setShowPremiumModal(true);
              } else {
                window.location.href = `/tutorials/${tutorial.slug}`;
              }
            };

            return (
              <Card
                key={tutorial.id}
                isPremium={
                  tutorial.isPremium &&
                  !canAccess(
                    tutorial.requiredPlan === "FREE"
                      ? "PREMIUM"
                      : tutorial.requiredPlan,
                    tutorial.isPremium
                  )
                }
                requiredPlan={
                  tutorial.requiredPlan === "FREE"
                    ? "PREMIUM"
                    : tutorial.requiredPlan
                }
                onPremiumClick={handleTutorialClick}
                onClick={!tutorial.isPremium ? handleTutorialClick : undefined}
                title={tutorial.title}
                description={tutorial.description || undefined}
                className="p-6"
              >
                {/* Progress Badge */}
                {tutorial.progress?.quizPassed && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                  </div>
                )}
                {tutorial.progress?.quizAttempts &&
                  !tutorial.progress.quizPassed && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Circle className="w-3 h-3" /> In Progress
                      </span>
                    </div>
                  )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0">
                    {getTutorialIcon(tutorial, "w-8 h-8")}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {tutorial.title}
                    </h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        tutorial.level === "beginner"
                          ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          : tutorial.level === "intermediate"
                          ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                          : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                      }`}
                    >
                      {tutorial.level}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {tutorial.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-4 h-4" />
                    <span>{tutorial.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{tutorial.estimatedTime}</span>
                  </div>
                  {tutorial.progress && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Trophy className="w-4 h-4" />
                      <span>
                        Best Score:{" "}
                        {tutorial.progress.bestScore?.toFixed(0) || 0}%
                        {tutorial.progress.quizAttempts > 0 && (
                          <> • {tutorial.progress.quizAttempts} attempts</>
                        )}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Topics covered:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {tutorial.topics?.map((topic, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tutorial Access Button */}
                <Link
                  href={`/tutorials/${tutorial.slug}`}
                  className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-center flex items-center justify-center gap-2"
                  onClick={(e) => {
                    if (
                      tutorial.isPremium &&
                      !canAccess(
                        tutorial.requiredPlan === "FREE"
                          ? "PREMIUM"
                          : tutorial.requiredPlan,
                        tutorial.isPremium
                      )
                    ) {
                      e.preventDefault();
                      handleTutorialClick();
                    }
                  }}
                >
                  {tutorial.progress?.quizPassed ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Review Tutorial
                    </>
                  ) : (
                    <>
                      Start Tutorial
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              More Tutorials Coming Soon!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We&apos;re constantly adding new content. Have a topic you&apos;d
              like to see covered?
            </p>
            <button className="bg-purple-600 dark:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors">
              Suggest a Tutorial
            </button>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        requiredPlan={selectedPremiumContent?.requiredPlan || "PREMIUM"}
        contentType={selectedPremiumContent?.type || "tutorial"}
        contentTitle={selectedPremiumContent?.title}
      />
    </div>
  );
}
