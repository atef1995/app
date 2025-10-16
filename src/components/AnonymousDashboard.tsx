"use client";

import { MoodSelector } from "@/components/MoodSelector";
import { SignupCTA } from "@/components/SignupCTA";
import {
  BookOpen,
  Code,
  Brain,
  Building,
  Sparkles,
  GitPullRequest,
  ToolCase,
} from "lucide-react";
import Link from "next/link";

export function AnonymousDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Sparkles className="h-4 w-4" />
            Welcome to Vibed to Cracked
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Master JavaScript Your Way
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Choose your mood, pick your pace, and start learning JavaScript with
            interactive tutorials designed for your vibe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignupCTA variant="primary" message="Start Learning Free" />
            <Link
              href="/tutorials"
              className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Browse Tutorials →
            </Link>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            How are you feeling today?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Your mood shapes your learning experience - choose what fits your
            vibe
          </p>
          <MoodSelector showDescription={true} />
        </div>

        {/* Learning Paths */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Choose Your Learning Path
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/tutorials"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-400 dark:shadow-xl group"
            >
              <div className="mb-4 flex justify-center">
                <BookOpen className="h-12 w-12 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Tutorials
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Interactive JavaScript lessons with live code examples
              </p>
              <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold text-center">
                Start Learning →
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    5 free tutorials
                  </span>{" "}
                  without signup
                </p>
              </div>
            </Link>

            <Link
              href="/auth/signin?feature=practice"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-400 dark:shadow-xl group relative"
            >
              <div className="absolute top-4 right-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded-full">
                Signup Required
              </div>
              <div className="mb-4 flex justify-center">
                <Code className="h-12 w-12 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Practice
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Code challenges and exercises to test your skills
              </p>
              <div className="text-sm text-purple-600 dark:text-purple-400 font-semibold text-center">
                Start Coding →
              </div>
            </Link>

            <Link
              href="/auth/signin?feature=quizzes"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-green-200 dark:hover:border-green-400 dark:shadow-xl group relative"
            >
              <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-bold px-2 py-1 rounded-full">
                Signup Required
              </div>
              <div className="mb-4 flex justify-center">
                <Brain className="h-12 w-12 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Quizzes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Test your knowledge with mood-adapted questions
              </p>
              <div className="text-sm text-green-600 dark:text-green-400 font-semibold text-center">
                Take Quiz →
              </div>
            </Link>

            <Link
              href="/auth/signin?feature=projects"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-400 dark:shadow-xl group relative"
            >
              <div className="absolute top-4 right-4 bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded-full">
                Signup Required
              </div>
              <div className="mb-4 flex justify-center">
                <Building className="h-12 w-12 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Build real-world applications and get peer reviews
              </p>
              <div className="text-sm text-orange-600 dark:text-orange-400 font-semibold text-center">
                Start Building →
              </div>
            </Link>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Additional Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/auth/signin?feature=contributions"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-cyan-200 dark:hover:border-cyan-400 dark:shadow-xl group relative"
            >
              <div className="absolute top-4 right-4 bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300 text-xs font-bold px-2 py-1 rounded-full">
                Signup Required
              </div>
              <div className="mb-4 flex justify-center">
                <GitPullRequest className="h-12 w-12 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Contributions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Contribute to real projects, earn XP, and build your portfolio
              </p>
              <div className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold text-center">
                Start Contributing →
              </div>
            </Link>

            <Link
              href="/tools/complexity-visualizer"
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-red-200 dark:hover:border-red-400 dark:shadow-xl group"
            >
              <div className="mb-4 flex justify-center">
                <ToolCase className="h-12 w-12 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Algorithms Visualisation Tool
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-center text-sm">
                Take a look at our new algorithms time complexity visualiser
              </p>
              <div className="text-sm text-red-600 dark:text-red-400 font-semibold text-center">
                Explore →
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    Free tool
                  </span>{" "}
                  - no signup needed
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Signup Benefits Section */}
        <SignupCTA variant="banner" showBenefits={true} className="mb-8" />
      </div>
    </div>
  );
}
