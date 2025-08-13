"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCategories,
  useTutorials,
  useTutorialProgress,
} from "@/hooks/useTutorialQueries";
import CategoryCard from "@/components/ui/CategoryCard";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { useMood } from "@/components/providers/MoodProvider";

// Category metadata
const categoryMetadata = {
  fundamentals: {
    description:
      "Master the essential building blocks of JavaScript programming",
    difficulty: "beginner" as const,
    topics: ["Variables", "Functions", "Arrays", "Objects"],
    duration: "4-6 hours",
  },
  oop: {
    description:
      "Learn object-oriented programming concepts and patterns in JavaScript",
    difficulty: "intermediate" as const,
    topics: ["Objects", "Prototypes", "Classes", "Inheritance"],
    duration: "3-4 hours",
  },
  async: {
    description:
      "Handle asynchronous operations with promises, async/await, and more",
    difficulty: "intermediate" as const,
    topics: ["Promises", "Async/Await", "Fetch API", "Error Handling"],
    duration: "2-3 hours",
  },
  dom: {
    description:
      "Manipulate web pages dynamically using the Document Object Model",
    difficulty: "intermediate" as const,
    topics: ["DOM Selection", "Event Handling", "Element Creation", "Styling"],
    duration: "2-3 hours",
  },
  advanced: {
    description: "Explore advanced JavaScript concepts and modern patterns",
    difficulty: "advanced" as const,
    topics: ["Closures", "Modules", "Design Patterns", "Performance"],
    duration: "5-8 hours",
  },
};

export default function TutorialsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const router = useRouter();


  // Fetch data
  const categoriesQuery = useCategories();
  const allTutorialsQuery = useTutorials();

  // Progress data
  const allTutorials = allTutorialsQuery.data || [];
  const { tutorialsWithProgress } = useTutorialProgress(
    allTutorials,
    session?.user?.id
  );


  // Calculate category stats
  const getCategoryStats = (category: string) => {
    const categoryTuts = allTutorials.filter((t) => t.category === category);
    const completed = categoryTuts.filter((t) => {
      const progress = tutorialsWithProgress.find(
        (tp) => tp.id === t.id
      )?.progress;
      return progress?.quizPassed;
    }).length;

    return {
      total: categoryTuts.length,
      completed,
      duration:
        categoryMetadata[category as keyof typeof categoryMetadata]?.duration ||
        "2-3 hours",
    };
  };

  if (!session) {
    return (
      <PageLayout
        title="JavaScript Tutorials"
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

  if (categoriesQuery.isLoading || allTutorialsQuery.isLoading) {
    return (
      <PageLayout
        title="JavaScript Tutorials"
        subtitle="Interactive lessons tailored to your learning style"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading tutorials...
            </p>
          </div>
        </div>
      </PageLayout>
    );
  }

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

  const categories = categoriesQuery.data || [];

  return (
    <PageLayout
      title="JavaScript Tutorials"
      subtitle={`Interactive lessons tailored to your ${currentMood.name.toLowerCase()} learning style`}
    >
      {/* Mood Info Card */}
      <MoodInfoCard className="mb-8" />

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Choose a Learning Path
        </h2>
        <ContentGrid>
          {categories.map((category) => {
            const metadata =
              categoryMetadata[category as keyof typeof categoryMetadata];
            const stats = getCategoryStats(category);

            return (
              <CategoryCard
                key={category}
                category={category}
                tutorialCount={stats.total}
                completedCount={stats.completed}
                totalDuration={stats.duration}
                difficulty={metadata?.difficulty || "beginner"}
                description={
                  metadata?.description || "Learn JavaScript concepts"
                }
                topics={metadata?.topics || []}
                onClick={() => router.push(`/tutorials/category/${category}`)}
              />
            );
          })}
        </ContentGrid>
      </div>

      {/* Quick Stats */}
      <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
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

      {/* Coming Soon */}
      <div className="text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            More Content Coming Soon!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We're constantly adding new tutorials and categories. Have a
            topic you{"'"}d like to see covered?
          </p>
          <button className="bg-purple-600 dark:bg-purple-700 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-800 transition-colors">
            Suggest a Tutorial
          </button>
        </div>
      </div>

    </PageLayout>
  );
}
