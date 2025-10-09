"use client";

import { useSession } from "next-auth/react";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCategoriesWithStats,
  CategoryWithStats,
} from "@/hooks/useTutorialQueries";
import CategoryCard from "@/components/ui/CategoryCard";
import { PageLayout } from "@/components/ui/PageLayout";
import { ContentGrid } from "@/components/ui/ContentGrid";
import Pagination from "@/components/ui/Pagination";
import { useMood } from "@/components/providers/MoodProvider";
import {
  MoodImpactIndicator,
  QuickMoodSwitcher,
} from "@/components/ui/MoodImpactIndicator";
import ErrorBoundary, {
  ComponentErrorFallback,
} from "@/components/ErrorBoundary";
import {
  CategoriesGridSkeleton,
  MoodImpactSkeleton,
  StatsCardSkeleton,
} from "@/components/tutorial/TutorialSkeleton";
import CategoryLoading from "./category/loading";
import { SignupCTA } from "@/components/SignupCTA";

export default function TutorialsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null);

  // Detect anonymous user state
  const isAnonymous = !session;

  // Fetch optimized categories with stats (includes tutorial counts and user progress)
  const { data, error, isLoading } = useCategoriesWithStats(
    currentPage,
    itemsPerPage
  );

  // Get categories data from paginated response
  const categories = data?.data || [];
  const categoryPagination = data?.pagination;
  const overallStats = data?.overallStats;

  // Use server-side pagination data instead of client-side calculations
  const totalItems = categoryPagination?.totalCount || 0;
  const totalPages = categoryPagination?.totalPages || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to categories section
    const categoriesSection = document.getElementById("categories-section");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const handleCategoryClick = (categorySlug: string) => {
    setLoadingCategory(categorySlug);
    router.push(`/tutorials/category/${categorySlug}`);
  };

  // Clear loading state after a timeout to prevent stuck loading states
  useEffect(() => {
    if (loadingCategory) {
      const timeout = setTimeout(() => {
        setLoadingCategory(null);
      }, 5000); // Clear after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [loadingCategory]);

  // Optimized category stats - now comes from the server
  const getCategoryStats = (category: CategoryWithStats) => {
    return {
      total: category.tutorialStats?.total || 0,
      completed: category.tutorialStats?.completed || 0,
    };
  };

  if (isLoading) {
    return <CategoryLoading />;
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

  return (
    <PageLayout
      title="JavaScript Tutorials"
      subtitle={`Interactive lessons tailored to your ${currentMood.name.toLowerCase()} learning style`}
    >
      {/* Mood Impact */}
      <div className="mb-8">
        <ErrorBoundary fallback={ComponentErrorFallback}>
          <Suspense fallback={<MoodImpactSkeleton />}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <MoodImpactIndicator context="tutorial" />
                </div>
                <div className="ml-6">
                  <QuickMoodSwitcher />
                </div>
              </div>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Anonymous User Signup Banner */}
      {isAnonymous && (
        <div className="mb-8">
          <SignupCTA
            variant="banner"
            message="Create your free account to save progress and unlock all features"
            showBenefits={true}
          />
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-8" id="categories-section">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Choose a Learning Path
        </h2>
        <ErrorBoundary fallback={ComponentErrorFallback}>
          <Suspense fallback={<CategoriesGridSkeleton />}>
            <ContentGrid>
              {categories.map((category) => {
                const stats = getCategoryStats(category);

                return (
                  <CategoryCard
                    key={category.id}
                    category={category.slug}
                    title={category.title}
                    tutorialCount={stats.total}
                    completedCount={stats.completed}
                    totalDuration={category.duration}
                    difficulty={
                      category.difficulty as
                        | "beginner"
                        | "intermediate"
                        | "advanced"
                    }
                    description={category.description}
                    topics={category.topics}
                    onClick={() => handleCategoryClick(category.slug)}
                    isLoading={loadingCategory === category.slug}
                  />
                );
              })}
            </ContentGrid>
          </Suspense>
        </ErrorBoundary>

        {/* Categories Pagination */}
        {totalPages > 1 && (
          <ErrorBoundary fallback={ComponentErrorFallback}>
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                showInfo={true}
                showSizeSelector={true}
                sizeOptions={[3, 6, 9, 12]}
                onSizeChange={handleItemsPerPageChange}
                className="justify-center"
                compact={false}
              />
            </div>
          </ErrorBoundary>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <ErrorBoundary fallback={ComponentErrorFallback}>
          <Suspense fallback={<StatsCardSkeleton />}>
            {isAnonymous ? (
              // Anonymous user - show signup CTA
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Track Your Learning Progress
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Sign up to save your progress, earn achievements, and unlock
                  your full learning potential
                </p>
                <SignupCTA
                  variant="primary"
                  message="Start Tracking Progress Free"
                />
              </div>
            ) : (
              // Authenticated user - show actual stats
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Your Learning Progress
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {overallStats?.totalTutorials || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Tutorials
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {overallStats?.completedTutorials || 0}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {overallStats && overallStats.totalTutorials > 0
                        ? Math.round(
                            (overallStats.completedTutorials /
                              overallStats.totalTutorials) *
                              100
                          )
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Completion
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Coming Soon */}
      <div className="text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            More Content Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We&apos;re constantly adding new tutorials and categories. Have a
            topic you&apos;d like to see covered?
          </p>
          <button className="bg-purple-600 dark:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors">
            Suggest a Tutorial
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
