"use client";

import { Crown, Sparkles, Lock } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isPremium?: boolean;
  requiredPlan?: "PREMIUM" | "PRO";
  onPremiumClick?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  description?: string;
}

export default function Card({
  children,
  className = "",
  isPremium = false,
  requiredPlan = "PREMIUM",
  onPremiumClick,
  onClick,
  disabled = false,
  title,
  description,
}: CardProps) {
  const { currentMood } = useMood();

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient: "from-orange-400 to-red-500",
          border: "border-orange-300 dark:border-orange-600",
          premiumBg: "bg-orange-100 dark:bg-orange-900/30",
          lockBg: "bg-orange-500",
        };
      case "grind":
        return {
          gradient: "from-blue-400 to-indigo-500",
          border: "border-blue-300 dark:border-blue-600",
          premiumBg: "bg-blue-100 dark:bg-blue-900/30",
          lockBg: "bg-blue-500",
        };
      default: // chill
        return {
          gradient: "from-purple-400 to-pink-500",
          border: "border-purple-300 dark:border-purple-600",
          premiumBg: "bg-purple-100 dark:bg-purple-900/30",
          lockBg: "bg-purple-500",
        };
    }
  };

  const moodColors = getMoodColors();

  const handleClick = () => {
    if (disabled) return;

    if (isPremium && onPremiumClick) {
      onPremiumClick();
    } else if (onClick) {
      onClick();
    }
  };

  const baseCardClasses = `
    relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl 
    transition-all duration-300 border-2 border-transparent
    ${
      !disabled && !isPremium
        ? "hover:shadow-xl dark:hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-600"
        : ""
    }
    ${(onClick || onPremiumClick) && !disabled ? "cursor-pointer" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
    ${
      isPremium
        ? `${moodColors.premiumBg} border-dashed ${moodColors.border}`
        : ""
    }
    ${className}
  `;

  return (
    <div className={baseCardClasses} onClick={handleClick}>
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 font-medium shadow-lg">
            {requiredPlan === "PRO" ? (
              <Sparkles className="w-3 h-3" />
            ) : (
              <Crown className="w-3 h-3" />
            )}
            {requiredPlan}
          </span>
        </div>
      )}

      {/* Premium Lock Overlay */}
      {isPremium && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 flex items-center justify-center backdrop-blur-sm z-20">
          <div className="text-center p-6">
            {/* Lock Icon */}
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${moodColors.gradient} text-white shadow-lg mb-4`}
            >
              <Lock className="w-8 h-8" />
            </div>

            {/* Premium Text */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
              {requiredPlan} Content
            </h3>

            {title && (
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-1">
                {title}
              </h4>
            )}

            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {description}
              </p>
            )}

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {currentMood.id === "rush" &&
                "🔥 Click to unlock premium features!"}
              {currentMood.id === "grind" && "💪 Upgrade for advanced content"}
              {currentMood.id === "chill" && "✨ Tap to see upgrade options"}
            </p>

            {/* Click hint */}
            <div
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${moodColors.lockBg} animate-pulse`}
            >
              Click to upgrade
            </div>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className={isPremium ? "opacity-30 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
