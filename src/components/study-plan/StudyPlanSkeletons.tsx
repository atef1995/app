// Loading skeletons for individual sections
const HeaderSkeleton = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 bg-blue-200/20 rounded w-64 mb-2"></div>
        <div className="h-5 bg-blue-200/20 rounded w-96"></div>
      </div>
      <div className="text-right">
        <div className="h-10 bg-blue-200/20 rounded w-16 mb-1"></div>
        <div className="h-4 bg-blue-200/20 rounded w-20"></div>
      </div>
    </div>
    <div className="mt-6">
      <div className="bg-blue-500/30 rounded-full h-3">
        <div className="bg-white/50 rounded-full h-3 w-1/3"></div>
      </div>
    </div>
  </div>
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12 mb-1"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ProgressSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

const SkillsSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
    <div className="flex flex-wrap gap-2">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full w-20"
        ></div>
      ))}
    </div>
  </div>
);

export { HeaderSkeleton, ProgressSkeleton, SkillsSkeleton, StatsSkeleton };
