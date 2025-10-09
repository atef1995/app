"use client";

import { useSession } from "next-auth/react";
import { MoodSelector } from "@/components/MoodSelector";
import { useProgressStats } from "@/hooks/useProgress";
import { ProgressStats } from "@/components/ProgressComponents";
import { AnonymousDashboard } from "@/components/AnonymousDashboard";
import { BookOpen, Code, Brain, Hand, Building } from "lucide-react";
import Link from "next/link";

interface ProgressStats {
  tutorials: {
    completed: number;
    inProgress: number;
    notStarted: number;
    total: number;
  };
  challenges: {
    completed: number;
    inProgress: number;
    failed: number;
    notStarted: number;
    total: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();

  // Use TanStack Query hook for progress stats
  const {
    data: progressStats,
    isLoading: loadingProgress,
    error: progressError,
    isError: hasProgressError,
  } = useProgressStats(session?.user?.id);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show anonymous dashboard for unauthenticated users
  if (status === "unauthenticated" || !session) {
    return <AnonymousDashboard />;
  }

  // Authenticated dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            Welcome back, {session?.user.name?.split(" ")[0]}!{" "}
            <Hand className="h-8 w-8 text-yellow-500" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ready to continue your JavaScript journey? Choose your learning path
            below.
          </p>
        </div>

        {/* Mood Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How are you feeling today?
          </h2>
          <MoodSelector showDescription={true} />
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/tutorials"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-400 dark:shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Tutorials
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Interactive JavaScript lessons with code examples
            </p>
            <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Start Learning →
            </div>
          </Link>

          <Link
            href="/practice"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-400 dark:shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <Code className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Practice
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Code challenges and exercises to test your skills
            </p>
            <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
              Start Coding →
            </div>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-200 dark:hover:border-green-400 dark:shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <Brain className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Quizzes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Test your knowledge with mood-adapted questions
            </p>
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
              Take Quiz →
            </div>
          </Link>

          <Link
            href="/projects"
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-400 dark:shadow-xl"
          >
            <div className="mb-4 flex justify-center">
              <Building className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Build real-world applications and get peer reviews
            </p>
            <div className="text-sm text-orange-600 dark:text-orange-400 font-semibold">
              Start Building →
            </div>
          </Link>
        </div>

        {/* Progress Section */}
        <div className="mt-12">
          {loadingProgress ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading your progress...
              </p>
            </div>
          ) : hasProgressError ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Error loading progress:{" "}
                {progressError?.message || "Unknown error"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : progressStats ? (
            <ProgressStats
              tutorialStats={progressStats.tutorials}
              challengeStats={progressStats.challenges}
              projectStats={progressStats.projects}
            />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Your Progress
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Start learning to see your progress here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
