"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useTutorialsByCategory,
  useTutorialProgress,
  useCategoryBySlug,
  type TutorialWithProgress,
} from "@/hooks/useTutorialQueries";
import Card, { CardAction } from "@/components/ui/Card";
import PremiumModal from "@/components/ui/PremiumModal";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import Pagination from "@/components/ui/Pagination";
import { usePremiumContentHandler } from "@/hooks/usePremiumContentHandler";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Trophy,
  Grid,
  List,
  BookOpen,
  Clock,
  Loader2,
} from "lucide-react";


export default function CategoryPage() {
  const params = useParams();
  const category = params?.category as string;
  const { data: session } = useSession();
  // const { currentMood } = useMood(); // Removed unused variable
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [navigatingToTutorial, setNavigatingToTutorial] = useState<string | null>(null);

  const {
    handlePremiumContent,
    isPremiumLocked,
    selectedPremiumContent,
    showPremiumModal,
    setShowPremiumModal,
  } = usePremiumContentHandler();

  // Fetch tutorials for this category with server-side pagination
  const categoryTutorialsQuery = useTutorialsByCategory(category, currentPage, itemsPerPage);
  const tutorialsData = categoryTutorialsQuery.data?.data || [];
  const pagination = categoryTutorialsQuery.data?.pagination;

  // Fetch category metadata from database
  const categoryQuery = useCategoryBySlug(category);
  const categoryMeta = categoryQuery.data;

  // Progress data
  const { tutorialsWithProgress } = useTutorialProgress(
    tutorialsData,
    session?.user?.id
  );

  // Use server-side pagination data instead of client-side calculations
  const totalItems = pagination?.totalCount || 0;
  const totalPages = pagination?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of tutorials list
    const tutorialsSection = document.getElementById('tutorials-section');
    if (tutorialsSection) {
      tutorialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate stats
  const completedCount = tutorialsWithProgress.filter(
    (t) => t.progress?.quizPassed
  ).length;
  const inProgressCount = tutorialsWithProgress.filter(
    (t) => t.progress?.quizAttempts && !t.progress.quizPassed
  ).length;

  // Handle tutorial click
  const handleTutorialClick = (tutorial: TutorialWithProgress) => {
    handlePremiumContent(
      {
        title: tutorial.title,
        isPremium: tutorial.isPremium,
        requiredPlan: tutorial.requiredPlan,
        type: "tutorial",
      },
      () => {
        setNavigatingToTutorial(tutorial.slug);
        // Use Next.js router for better navigation
        window.location.href = `/tutorials/category/${category}/${tutorial.slug}`;
      }
    );
  };

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

  if (categoryTutorialsQuery.isLoading || categoryQuery.isLoading) {
    return (
      <PageLayout
        title={categoryMeta?.title || category}
        subtitle="Loading tutorials..."
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

  if (categoryTutorialsQuery.error || categoryQuery.error) {
    return (
      <PageLayout
        title={categoryMeta?.title || category}
        subtitle="Error loading tutorials"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading tutorials. Please try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!categoryMeta) {
    return (
      <PageLayout
        title="Category Not Found"
        subtitle="The requested category does not exist"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Category {category} not found.
            </p>
            <Link
              href="/tutorials"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-block"
            >
              Back to Tutorials
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }


  return (
    <PageLayout
      title={categoryMeta.title}
      subtitle={`${categoryMeta.description} • ${tutorialsWithProgress.length} tutorials`}
    >
      {/* Mood Info Card */}
      <MoodInfoCard className="mb-8" />

      {/* Back Navigation */}
      <div className="mb-6">
        <Link
          href="/tutorials"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
      </div>

      {/* Category Header */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl ${categoryMeta.iconBg} flex items-center justify-center`}
              >
                <BookOpen className={`w-6 h-6 ${categoryMeta.iconColor}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {categoryMeta.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${categoryMeta.badgeBg} ${categoryMeta.badgeColor} capitalize`}
                  >
                    {categoryMeta.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {categoryMeta.duration}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {categoryMeta.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {categoryMeta.topics.map((topic, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full font-medium"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-6">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 shadow-sm"
                  : "hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${categoryMeta.dotColor}`}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {tutorialsWithProgress.length} Total
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} Completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {inProgressCount} In Progress
            </span>
          </div>
        </div>
      </div>

      {/* Tutorials List */}
      <div id="tutorials-section">
      {tutorialsWithProgress.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No tutorials available in this category yet.
            </p>
          </div>
        </div>
      ) : (
        <ContentGrid className={viewMode === "list" ? "grid-cols-1" : ""}>
          {tutorialsWithProgress.map((tutorial, index) => {
            // Calculate the actual index in the full list for numbering
            const actualIndex = ((currentPage - 1) * itemsPerPage) + index;
            const isLocked = isPremiumLocked(tutorial);

            return (
              <Card
                key={tutorial.id}
                isPremium={isLocked}
                requiredPlan={tutorial.requiredPlan as "VIBED" | "CRACKED"}
                onPremiumClick={() => handleTutorialClick(tutorial)}
                onClick={
                  !isLocked ? () => handleTutorialClick(tutorial) : undefined
                }
                title={`${actualIndex + 1}. ${tutorial.title}`}
                description={tutorial.description || ""}
                className="h-full"
                actions={
                  <div className="flex items-center justify-between w-full">
                    <CardAction.TimeInfo
                      time={tutorial.estimatedTime || "15 min"}
                    />
                    <CardAction.Primary
                      onClick={() => handleTutorialClick(tutorial)}
                      disabled={navigatingToTutorial === tutorial.slug}
                    >
                      {navigatingToTutorial === tutorial.slug ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Loading...
                        </>
                      ) : (
                        <>
                          {isLocked
                            ? "Unlock"
                            : tutorial.progress?.quizPassed
                            ? "Review"
                            : "Start"}{" "}
                          Tutorial
                        </>
                      )}
                    </CardAction.Primary>
                  </div>
                }
              >
                {/* Tutorial Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {actualIndex + 1}. {tutorial.title}
                  </h3>
                  {tutorial.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {tutorial.description}
                    </p>
                  )}
                </div>

                {/* Tutorial Content */}
                <div className="space-y-4">
                  {/* Progress Badge */}
                  {tutorial.progress?.quizPassed && (
                    <div>
                      <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium w-fit">
                        <CheckCircle className="w-3 h-3" /> Completed
                      </span>
                    </div>
                  )}
                  {tutorial.progress?.quizAttempts &&
                  !tutorial.progress.quizPassed ? (
                    <div>
                      <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium w-fit">
                        <Circle className="w-3 h-3" /> In Progress
                      </span>
                    </div>
                  ) : null}

                  {/* Difficulty */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-md font-medium ${categoryMeta.badgeBg} ${categoryMeta.badgeColor}`}
                    >
                      Difficulty: {tutorial.difficulty}/5
                    </span>
                  </div>

                  {/* Stats */}
                  {tutorial.progress && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        <span>
                          Best: {tutorial.progress.bestScore?.toFixed(0) || 0}%
                        </span>
                      </div>
                      {tutorial.progress.quizAttempts > 0 && (
                        <span>{tutorial.progress.quizAttempts} attempts</span>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </ContentGrid>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showInfo={true}
            showSizeSelector={true}
            sizeOptions={[6, 12, 18, 24]}
            onSizeChange={handleItemsPerPageChange}
            className="justify-center"
          />
        </div>
      )}
      </div>

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        requiredPlan={selectedPremiumContent?.requiredPlan || "VIBED"}
        contentType={selectedPremiumContent?.type || "tutorial"}
        contentTitle={selectedPremiumContent?.title}
      />
    </PageLayout>
  );
}
