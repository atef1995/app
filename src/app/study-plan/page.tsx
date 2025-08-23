"use client";

import { useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStudyPlan } from "@/hooks/useStudyPlan";
import { StudyPlanOverview } from "@/components/study-plan/StudyPlanOverview";
import { StudyPlanRoadmap } from "@/components/study-plan/StudyPlanRoadmap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle } from "lucide-react";

// Loading skeleton components
const StudyPlanSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header skeleton */}
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-blue-200 rounded w-64 mb-2"></div>
          <div className="h-5 bg-blue-200 rounded w-96"></div>
        </div>
        <div className="text-right">
          <div className="h-10 bg-blue-200 rounded w-16"></div>
          <div className="h-4 bg-blue-200 rounded w-20"></div>
        </div>
      </div>
      <div className="mt-6">
        <div className="bg-blue-500/30 rounded-full h-3">
          <div className="bg-white rounded-full h-3 w-1/3"></div>
        </div>
      </div>
    </div>

    {/* Stats grid skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

    {/* Content sections skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
  </div>
);

const RoadmapSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>

    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gray-300 dark:bg-gray-600 rounded-full h-2 w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function StudyPlanPage() {
  const { status } = useSession();
  const router = useRouter();
  const [navigatingStepId, setNavigatingStepId] = useState<string | null>(null);

  // TanStack Query hooks
  const { data, isLoading, error, refetch } = useStudyPlan();

  // Redirect to signin if not authenticated
  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleStartStep = (stepId: string) => {
    // Find the step to get its resource information
    const step = data?.studyPlan?.phases
      .flatMap((p) => [...p.steps, ...p.projects])
      .find((s) => s.id === stepId);

    if (!step) return;

    // Set loading state for this specific step
    setNavigatingStepId(stepId);

    // Navigate to the appropriate resource
    switch (step.type) {
      case "tutorial":
        if (step.slug) {
          router.push(`/tutorials/category/${step.category}/${step.slug}`);
        }
        break;
      case "challenge":
        if (step.slug) {
          router.push(`/practice/${step.slug}`);
        }
        break;
      case "quiz":
        if (step.slug) {
          router.push(`/quiz/${step.slug}`);
        }
        break;
      case "project":
        if (step.slug) {
          router.push(`/projects/${step.slug}`);
        }
        break;
      default:
        console.log("Starting step:", step.title);
        setNavigatingStepId(null); // Clear loading if no navigation
    }
  };

  const handleViewStep = (stepId: string) => {
    // Similar to handleStartStep but might have different behavior for completed steps
    handleStartStep(stepId);
  };


  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your study plan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error instanceof Error ? error.message : "Failed to load study plan. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show skeleton interface while initial data is loading
  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <StudyPlanSkeleton />
            </TabsContent>

            <TabsContent value="roadmap">
              <RoadmapSkeleton />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Destructure data for cleaner code
  const { studyPlan, userProgress } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Suspense fallback={<StudyPlanSkeleton />}>
              <StudyPlanOverview
                studyPlan={studyPlan}
                completedSteps={userProgress.completedSteps}
                hoursSpent={userProgress.hoursSpent}
                onStartStep={handleStartStep}
                navigatingStepId={navigatingStepId}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="roadmap">
            <Suspense fallback={<RoadmapSkeleton />}>
              <StudyPlanRoadmap
                studyPlan={studyPlan}
                completedSteps={userProgress.completedSteps}
                currentStepId={userProgress.currentStepId}
                onStartStep={handleStartStep}
                onViewStep={handleViewStep}
                navigatingStepId={navigatingStepId}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
