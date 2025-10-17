/**
 * Anonymous Limit Reached Page
 *
 * Shown when anonymous users reach the 5-tutorial limit.
 * Encourages signup with benefits and strong CTAs.
 */

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Sparkles, CheckCircle, Zap } from "lucide-react";

interface AnonymousLimitReachedProps {
  category: string;
}

export default function AnonymousLimitReached({
  category,
}: AnonymousLimitReachedProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 rounded-full"></div>
            <Lock className="w-20 h-20 text-purple-600 relative" />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          You&apos;ve Discovered Quality Content!
        </h1>

        <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-8">
          You&apos;ve viewed{" "}
          <span className="font-bold text-purple-600">5 tutorials</span> —
          that&apos;s awesome! Ready to unlock unlimited learning?
        </p>

        {/* Benefits */}
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Unlimited Access to All Tutorials
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse our entire library of Web development tutorials
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Track Your Progress
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Save your progress, earn achievements, get certificates
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Interactive Quizzes & Challenges
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test your knowledge with hands-on coding challenges
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                100% FREE Forever
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No credit card required. Start learning immediately.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/auth/signin?callbackUrl=/tutorials/category/${category}`}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Sign Up Free - Continue Learning
          </Link>

          <Link
            href="/"
            className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-4 px-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-center"
          >
            Back to Home
          </Link>
        </div>

        {/* Fine print */}
        <p className="text-xs text-center text-gray-500 mt-6">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
