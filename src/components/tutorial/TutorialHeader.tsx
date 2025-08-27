"use client";

import React from "react";
import { 
  Sprout, 
  Target, 
  BarChart3, 
  BookOpen, 
  Clock, 
  Crown, 
  Star, 
  Zap 
} from "lucide-react";
import { type TutorialData } from "@/hooks/useTutorial";

interface TutorialHeaderProps {
  tutorial: TutorialData;
  category: string;
}

export default function TutorialHeader({ tutorial, category }: TutorialHeaderProps) {
  // Helper function to get premium badge
  const getPremiumBadge = (tutorial: TutorialData) => {
    const requiredPlan = tutorial.requiredPlan || tutorial.meta.requiredPlan;
    const isPremium = tutorial.isPremium || tutorial.meta.isPremium;

    if (!isPremium && !requiredPlan) return null;

    let badgeClass = "";
    let icon = null;
    let text = "";

    switch (requiredPlan) {
      case "VIBED":
        badgeClass = "bg-gradient-to-r from-purple-500 to-pink-500";
        icon = <Star className="w-3 h-3" />;
        text = "VIBED";
        break;
      case "CRACKED":
        badgeClass = "bg-gradient-to-r from-yellow-400 to-orange-500";
        icon = <Crown className="w-3 h-3" />;
        text = "CRACKED";
        break;
      default:
        if (isPremium) {
          badgeClass = "bg-gradient-to-r from-blue-500 to-purple-500";
          icon = <Zap className="w-3 h-3" />;
          text = "PREMIUM";
        }
        break;
    }

    if (!text) return null;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white ${badgeClass}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  // Helper function to get icon based on tutorial data
  const getTutorialIcon = (tutorial: TutorialData) => {
    // Use order or slug to determine icon consistently
    if (tutorial.order === 1 || tutorial.slug?.includes("variable")) {
      return (
        <Sprout className="w-12 h-12 text-green-600 dark:text-green-400" />
      );
    } else if (tutorial.order === 2 || tutorial.slug?.includes("function")) {
      return <Target className="w-12 h-12 text-blue-600 dark:text-blue-400" />;
    } else if (
      tutorial.order === 3 ||
      tutorial.slug?.includes("array") ||
      tutorial.slug?.includes("object")
    ) {
      return (
        <BarChart3 className="w-12 h-12 text-purple-600 dark:text-purple-400" />
      );
    }
    return <BookOpen className="w-12 h-12 text-gray-600 dark:text-gray-400" />; // default
  };

  const getDifficultyBadge = () => {
    const level = tutorial.meta.level;
    const difficulty = tutorial.difficulty;

    let badgeClass = "";
    let text = "";

    if (level === "beginner" || difficulty === 1) {
      badgeClass = "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      text = "Beginner";
    } else if (level === "intermediate" || difficulty === 2) {
      badgeClass = "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
      text = "Intermediate";
    } else {
      badgeClass = "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      text = "Advanced";
    }

    if (level && level !== "beginner" && level !== "intermediate") {
      text = level.charAt(0).toUpperCase() + level.slice(1);
    }

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badgeClass}`}>
        {text}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg dark:shadow-xl mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">{getTutorialIcon(tutorial)}</div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium capitalize">
              {category} Tutorial
            </span>
            {getPremiumBadge(tutorial)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {tutorial.meta.title || tutorial.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {tutorial.meta.description || tutorial.description}
          </p>
          <div className="flex items-center gap-4 mt-2">
            {getDifficultyBadge()}
            {tutorial.meta.estimatedTime && (
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {tutorial.meta.estimatedTime}
              </span>
            )}
            {tutorial.meta.topics && tutorial.meta.topics.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {tutorial.meta.topics.join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}