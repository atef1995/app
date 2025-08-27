"use client";

import React from "react";
import Link from "next/link";
import { useMood } from "@/components/providers/MoodProvider";
import getMoodColors from "@/lib/getMoodColors";

interface TutorialErrorStateProps {
  error?: string;
  category: string;
}

export default function TutorialErrorState({ 
  error, 
  category 
}: TutorialErrorStateProps) {
  const { currentMood } = useMood();
  const moodColors = getMoodColors(currentMood.id);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error: {error || "Tutorial not found"}
            </p>
            <Link
              href={`/tutorials/category/${category}`}
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 mr-2"
            >
              Back to {category}
            </Link>
            <Link
              href="/tutorials"
              className="bg-gray-600 dark:bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800"
            >
              All Tutorials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}