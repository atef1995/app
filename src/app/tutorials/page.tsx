"use client";

import { useSession } from "next-auth/react";
import { useTutorials, useTutorialProgress, type TutorialWithProgress } from "@/hooks/useTutorialQueries";
import { useCallback } from "react";
import Link from "next/link";
import Card, { CardAction } from "@/components/ui/Card";
import PremiumModal from "@/components/ui/PremiumModal";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { useMood } from "@/components/providers/MoodProvider";
import { usePremiumContentHandler } from "@/hooks/usePremiumContentHandler";
import {
  Sprout,
  Target,
  BarChart3,
  BookOpen,
  CheckCircle,
  Circle,
  Trophy,
} from "lucide-react";

// Constants for styling
const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  intermediate: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  advanced: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
} as const;

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
  const {
    handlePremiumContent,
    isPremiumLocked,
    selectedPremiumContent,
    showPremiumModal,
    setShowPremiumModal,
  } = usePremiumContentHandler();

  // Use TanStack Query hooks
  const tutorialsQuery = useTutorials();
  const tutorials = tutorialsQuery.data || [];
  const isLoading = tutorialsQuery.isLoading;
  const error = tutorialsQuery.error;

  // Get tutorials with progress
  const { tutorialsWithProgress, isProgressLoading } = useTutorialProgress(
    tutorials,
    session?.user?.id
  );

  // Handle tutorial click
  const handleTutorialClick = useCallback((tutorial: TutorialWithProgress) => {
    handlePremiumContent(
      {
        title: tutorial.title,
        isPremium: tutorial.isPremium,
        requiredPlan: tutorial.requiredPlan,
        type: "tutorial",
      },
      () => {
        window.location.href = `/tutorials/${tutorial.slug}`;
      }
    );
  }, [handlePremiumContent]);

  if (!session) {
    return (
      <PageLayout
        title="JavaScript Tutorials"
        subtitle="Interactive lessons tailored to your learning style"
      >
        <div className="flex items-center justify-center h-64">
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
      </PageLayout>
    );
  }

  if (isLoading || isProgressLoading) {
    return (
      <PageLayout
        title="JavaScript Tutorials"
        subtitle="Interactive lessons tailored to your learning style"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading tutorials...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout
        title="JavaScript Tutorials"
        subtitle="Interactive lessons tailored to your learning style"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error: {error?.message || "Failed to load tutorials"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="JavaScript Tutorials"
      subtitle={`Interactive lessons tailored to your ${currentMood.name.toLowerCase()} learning style`}
    >
      {/* Mood Info Card */}
      <MoodInfoCard className="mb-8" />

      {/* Tutorials Grid */}
      <ContentGrid>
        {tutorialsWithProgress.map((tutorial) => {
          const isLocked = isPremiumLocked(tutorial);

          return (
            <Card
              key={tutorial.id}
              isPremium={isLocked}
              requiredPlan={tutorial.requiredPlan === "FREE" ? "PREMIUM" : (tutorial.requiredPlan as "PREMIUM" | "PRO")}
              onPremiumClick={() => handleTutorialClick(tutorial)}
              onClick={!isLocked ? () => handleTutorialClick(tutorial) : undefined}
              title={tutorial.title}
              description={tutorial.description || ""}
              className="h-full"
              actions={
                <div className="flex items-center justify-between w-full">
                  <CardAction.TimeInfo time={tutorial.estimatedTime || "5 min"} />
                  <CardAction.Primary onClick={() => handleTutorialClick(tutorial)}>
                    {isLocked ? "Unlock" : tutorial.progress?.quizPassed ? "Review" : "Start"} Tutorial
                  </CardAction.Primary>
                </div>
              }
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex justify-center">
                  {getTutorialIcon(tutorial, "w-8 h-8")}
                </div>
                <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${DIFFICULTY_COLORS[tutorial.level as keyof typeof DIFFICULTY_COLORS]}`}>
                  {tutorial.level}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {tutorial.title}
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                {tutorial.description}
              </p>

              {/* Progress Badge */}
              {tutorial.progress?.quizPassed && (
                <div className="mb-4">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium w-fit">
                    <CheckCircle className="w-3 h-3" /> Completed
                  </span>
                </div>
              )}
              {tutorial.progress?.quizAttempts && !tutorial.progress.quizPassed && (
                <div className="mb-4">
                  <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium w-fit">
                    <Circle className="w-3 h-3" /> In Progress
                  </span>
                </div>
              )}

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <BookOpen className="w-4 h-4 flex-shrink-0" />
                  <span>{tutorial.lessons} lessons</span>
                </div>
                {tutorial.progress && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Trophy className="w-4 h-4 flex-shrink-0" />
                    <span>
                      Best: {tutorial.progress.bestScore?.toFixed(0) || 0}%
                      {tutorial.progress.quizAttempts > 0 && (
                        <> • {tutorial.progress.quizAttempts} attempts</>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Topics */}
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Topics covered:
                </div>
                <div className="flex flex-wrap gap-1">
                  {tutorial.topics?.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                  {tutorial.topics && tutorial.topics.length > 3 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                      +{tutorial.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </ContentGrid>

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

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        requiredPlan={selectedPremiumContent?.requiredPlan || "PREMIUM"}
        contentType={selectedPremiumContent?.type || "tutorial"}
        contentTitle={selectedPremiumContent?.title}
      />
    </PageLayout>
  );
}
