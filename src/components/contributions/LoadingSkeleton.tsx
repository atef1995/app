export const ProjectDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 animate-pulse">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Features Skeleton */}
        <div className="space-y-8">
          <div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                >
                  <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      {[...Array(3)].map((_, j) => (
                        <div
                          key={j}
                          className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
