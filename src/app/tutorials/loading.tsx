// Category Card Skeleton
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

// Mood Impact Skeleton
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

// Stats Card Skeleton
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

// Coming Soon Skeleton
function ComingSoonSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-pulse">
      <div className="text-center">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 mx-auto"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto"></div>
      </div>
    </div>
  );
}

// Main Loading Component
export default function TutorialsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header Skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3 w-1/3"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mood Impact Skeleton */}
        <div className="mb-8">
          <MoodImpactSkeleton />
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="animate-pulse mb-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/4"></div>
          </div>

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Progress Stats Skeleton */}
        <div className="mb-8">
          <StatsCardSkeleton />
        </div>

        {/* Coming Soon Skeleton */}
        <div className="text-center">
          <ComingSoonSkeleton />
        </div>
      </div>
    </div>
  );
}
