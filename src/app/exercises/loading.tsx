import { ContentGrid } from "@/components/ui/ContentGrid";
import { PageLayout } from "@/components/ui/PageLayout";
import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";

export default function Loading() {
  return (
    <PageLayout title="" subtitle="">
      <div className="rounded-2xl p-6 shadow-lg animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="ml-4">
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"
            ></div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-24"></div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg  mb-8 animate-pulse mt-5">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-32"></div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-20"
            ></div>
          ))}
        </div>
      </div>

      <ContentGrid className="my-5">
        {[1, 2, 3, 4, 5].map((element, i) => (
          <CardSkeleton key={i} />
        ))}
      </ContentGrid>
    </PageLayout>
  );
}
