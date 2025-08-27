"use client";

import React from "react";
import Link from "next/link";
import { Crown, Zap } from "lucide-react";
import getMoodColors from "@/lib/getMoodColors";
import { useMood } from "@/components/providers/MoodProvider";

interface AccessResult {
  canAccess: boolean;
  needsUpgrade?: boolean;
  reason?: string;
}

interface AccessControlWrapperProps {
  children: React.ReactNode;
  accessCheck: AccessResult;
  category: string;
}

export default function AccessControlWrapper({
  children,
  accessCheck,
  category,
}: AccessControlWrapperProps) {
  const { currentMood } = useMood();
  const moodColors = getMoodColors(currentMood.id);

  // If user has access, render children
  if (accessCheck.canAccess) {
    return <>{children}</>;
  }

  // Full page access denied (usually for showing upgrade modal)
  if (accessCheck.needsUpgrade) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl text-center">
              <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Upgrade Required
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {accessCheck.reason}
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/pricing"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Upgrade Now
                </Link>
                <Link
                  href={`/tutorials/category/${category}`}
                  className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 font-semibold transition-colors"
                >
                  Browse Free Tutorials
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default access denied (shouldn't normally reach here)
  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl text-center">
            <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Access Restricted
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {accessCheck.reason || "You don't have access to this content."}
            </p>
            <Link
              href={`/tutorials/category/${category}`}
              className="bg-gray-600 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 font-semibold transition-colors"
            >
              Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}