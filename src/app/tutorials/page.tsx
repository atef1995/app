"use client";

import { useSession } from "next-auth/react";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCategories,
  useTutorials,
  useTutorialProgress,
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

// Skeleton Components for Suspense fallbacks
function MoodImpactSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="ml-6 flex space-x-2">
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div className="h-10 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-pulse">
      <div className="mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      </div>
      <div className="mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-18"></div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

function CategoriesGridSkeleton() {
  return (
    <ContentGrid>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </ContentGrid>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-12 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TutorialsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Fetch data with server-side pagination
  const categoriesQuery = useCategories(currentPage, itemsPerPage);
  const allTutorialsQuery = useTutorials(1, 10, true); // Get all tutorials for stats

  // Get categories data from paginated response
  const categories = categoriesQuery.data?.data || [];
  const categoryPagination = categoriesQuery.data?.pagination;

  // Progress data
  const allTutorials = allTutorialsQuery.data?.data || [];
  const { tutorialsWithProgress } = useTutorialProgress(
    allTutorials,
    session?.user?.id
  );

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

  // Calculate category stats based on tutorials
  const getCategoryStats = (categorySlug: string) => {
    if (!allTutorials.length) {
      // Fallback when tutorials are not loaded yet
      return {
        total: 0,
        completed: 0,
      };
    }

    const categoryTuts = allTutorials.filter(
      (t) => t.category.slug === categorySlug
    );
    const completed = categoryTuts.filter((t) => {
      const progress = tutorialsWithProgress.find(
        (tp) => tp.id === t.id
      )?.progress;
      return progress?.quizPassed;
    }).length;

    return {
      total: categoryTuts.length,
      completed,
    };
  };

  if (!session) {
    return (
      <PageLayout
        title="Programming Tutorials"
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

  // Remove the loading state since it's handled by loading.tsx

  if (categoriesQuery.error || allTutorialsQuery.error) {
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
      </div>

      {/* Categories Grid */}
      <div className="mb-8" id="categories-section">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Choose a Learning Path
        </h2>
        <Suspense fallback={<CategoriesGridSkeleton />}>
          <ContentGrid>
            {categories.map((category) => {
              const stats = getCategoryStats(category.slug);

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
                  onClick={() =>
                    router.push(`/tutorials/category/${category.slug}`)
                  }
                />
              );
            })}
          </ContentGrid>
        </Suspense>

        {/* Categories Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>

      {/* Quick Stats */}
      <div className="mb-8">
        <Suspense fallback={<StatsCardSkeleton />}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your Learning Progress
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {allTutorials.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Tutorials
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {
                    tutorialsWithProgress.filter((t) => t.progress?.quizPassed)
                      .length
                  }
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {categories.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Categories
                </div>
              </div>
            </div>
          </div>
        </Suspense>
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
