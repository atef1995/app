// Mood Info Card Skeleton
function MoodInfoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 animate-pulse mb-8">
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

// Back Navigation Skeleton
function BackNavigationSkeleton() {
  return (
    <div className="mb-6 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    </div>
  );
}

// Category Header Skeleton
function CategoryHeaderSkeleton() {
  return (
    <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-48"></div>
              <div className="flex items-center gap-3">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-md w-20"></div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>

          {/* Topics */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
              ></div>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-6">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

// Tutorial Card Skeleton
function TutorialCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-pulse h-full">
      {/* Tutorial Header */}
      <div className="mb-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
      </div>

      {/* Content */}
      <div className="space-y-4 mb-6">
        {/* Progress Badge */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
        
        {/* Difficulty */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-24"></div>
        
        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
      </div>
    </div>
  );
}

// Tutorials Grid Skeleton
function TutorialsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <TutorialCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Pagination Skeleton
function PaginationSkeleton() {
  return (
    <div className="mt-8 animate-pulse">
      <div className="flex items-center justify-center gap-2">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    </div>
  );
}

export default function CategoryTutorialsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        {/* PageLayout Header */}
        <div className="mb-8">
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-1/3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2 animate-pulse"></div>
        </div>

        {/* Mood Info Card */}
        <MoodInfoCardSkeleton />

        {/* Back Navigation */}
        <BackNavigationSkeleton />

        {/* Category Header */}
        <CategoryHeaderSkeleton />

        {/* Tutorials Section */}
        <div id="tutorials-section">
          {/* Tutorials Grid */}
          <TutorialsGridSkeleton />

          {/* Pagination */}
          <PaginationSkeleton />
        </div>
      </div>
    </div>
  );
}
