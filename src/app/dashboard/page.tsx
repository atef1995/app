"use client";

import { useSession, signOut } from "next-auth/react";
import { MoodSelector } from "@/components/MoodSelector";
import { MoodIndicator } from "@/components/MoodIndicator";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-blue-600">Vibed</span> to{" "}
            <span className="text-purple-600">Cracked</span>
          </Link>
          <div className="flex items-center gap-4">
            <MoodIndicator />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
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
        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Progress
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">0</div>
              <div className="text-gray-600">Tutorials Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-gray-600">Quizzes Taken</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Code Challenges</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
