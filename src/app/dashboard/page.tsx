"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MoodSelector } from "@/components/MoodSelector";
import { ProgressStats } from "@/components/ProgressComponents";
import Link from "next/link";

interface ProgressStats {
  tutorials: {
    completed: number;
    inProgress: number;
    notStarted: number;
  };
  challenges: {
    completed: number;
    inProgress: number;
    failed: number;
  };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(
    null
  );
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetchProgressStats();
    }
  }, [session]);

  const fetchProgressStats = async () => {
    try {
      const response = await fetch("/api/progress?type=stats");
      if (response.ok) {
        const data = await response.json();
        setProgressStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      setLoadingProgress(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Middleware will handle redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {session.user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your JavaScript journey? Choose your learning path
            below.
          </p>
        </div>

        {/* Mood Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How are you feeling today?
          </h2>
          <MoodSelector showDescription={true} />
        </div>

        {/* Learning Paths */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/tutorials"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200"
          >
            <div className="text-3xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tutorials</h3>
            <p className="text-gray-600 mb-4">
              Interactive JavaScript lessons with code examples
            </p>
            <div className="text-sm text-blue-600 font-semibold">
              Start Learning →
            </div>
          </Link>

          <Link
            href="/practice"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
          >
            <div className="text-3xl mb-4">💻</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Practice</h3>
            <p className="text-gray-600 mb-4">
              Code challenges and exercises to test your skills
            </p>
            <div className="text-sm text-purple-600 font-semibold">
              Start Coding →
            </div>
          </Link>

          <Link
            href="/quizzes"
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-200"
          >
            <div className="text-3xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quizzes</h3>
            <p className="text-gray-600 mb-4">
              Test your knowledge with mood-adapted questions
            </p>
            <div className="text-sm text-green-600 font-semibold">
              Take Quiz →
            </div>
          </Link>
        </div>

        {/* Progress Section */}
        <div className="mt-12">
          {loadingProgress ? (
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your progress...</p>
            </div>
          ) : progressStats ? (
            <ProgressStats
              tutorialStats={progressStats.tutorials}
              challengeStats={progressStats.challenges}
            />
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Your Progress
              </h2>
              <p className="text-gray-600 text-center">
                Start learning to see your progress here!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
