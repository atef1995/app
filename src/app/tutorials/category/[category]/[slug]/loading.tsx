import { useMoodColors } from "@/hooks/useMoodColors";

export function TutorialHeaderSkeleton() {
  return (
    /* Tutorial Header Skeleton */
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-96 mb-2"></div>
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="flex items-center gap-4 mt-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* Tutorial Content Skeleton */
}
<div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 animate-pulse">
  <div className="space-y-4">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>

    <div className="my-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>

    <div className="my-6 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
  </div>
</div>;

export default function TutorialLoading() {
  return (
    <div className={`min-h-screen bg-gradient-to-br `}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {TutorialHeaderSkeleton()}
          {/* Tutorial Content Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8 animate-pulse">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>

              <div className="my-6 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>

              <div className="my-6 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>

              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
          {/* Quiz Section Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
          </div>

          {/* Navigation Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mt-8 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
