"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TutorialNavigationData } from "@/types/tutorial";

interface TutorialNavigationProps {
  category: string;
  navigationData?: TutorialNavigationData;
  isLoading: boolean;
}

export default function TutorialNavigation({
  category,
  navigationData,
  isLoading,
}: TutorialNavigationProps) {
  const truncateTitle = (title: string, maxLength: number = 16) => {
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mt-8">
      {isLoading ? (
        <div className="flex justify-between items-center animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          {/* Previous Tutorial / Back to Category */}
          {navigationData?.prev ? (
            <Link
              href={`/tutorials/category/${category}/${navigationData.prev.slug}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Previous
                </div>
                <div className="text-sm font-medium group-hover:underline">
                  {truncateTitle(navigationData.prev.title)}
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href={`/tutorials/category/${category}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm">Back to {category}</span>
            </Link>
          )}

          {/* Current Progress */}
          <div className="text-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {navigationData?.currentPosition || "?"} of{" "}
              {navigationData?.totalInCategory || "?"}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {navigationData?.category?.title || category}
            </div>
          </div>

          {/* Next Tutorial / Practice Challenges */}
          {navigationData?.next ? (
            <Link
              href={`/tutorials/category/${category}/${navigationData.next.slug}`}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Next
                </div>
                <div className="text-sm font-medium group-hover:underline">
                  {truncateTitle(navigationData.next.title)}
                </div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/practice"
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <span className="text-sm">Practice Challenges</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
