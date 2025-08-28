import { ContentGrid } from "../ui/ContentGrid";

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

export {
  MoodImpactSkeleton,
  CategoryCardSkeleton,
  CategoriesGridSkeleton,
  StatsCardSkeleton,
};
