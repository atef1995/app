"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { Lock, Crown, Sparkles, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumLockProps {
  requiredPlan?: "PREMIUM" | "PRO";
  isPremium?: boolean;
  contentType?: "tutorial" | "challenge" | "quiz";
  children: React.ReactNode;
  className?: string;
}

interface SubscriptionInfo {
  plan: string;
  status: string;
  canAccessPremium: boolean;
  subscriptionEndsAt: string | null;
}

export default function PremiumLock({
  requiredPlan = "PREMIUM",
  isPremium = false,
  contentType = "tutorial",
  children,
  className = "",
}: PremiumLockProps) {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/subscription`);
        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data.subscription);

          // Check if user can access this content
          const accessResponse = await fetch(
            `/api/user/can-access?requiredPlan=${requiredPlan}&isPremium=${isPremium}`
          );
          if (accessResponse.ok) {
            const accessData = await accessResponse.json();
            setCanAccess(accessData.canAccess);
          }
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [session, requiredPlan, isPremium]);

  // Get mood-specific styling
  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient: "from-orange-400 to-red-500",
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-300 dark:border-orange-600",
          text: "text-orange-700 dark:text-orange-300",
          button: "bg-orange-500 hover:bg-orange-600",
        };
      case "grind":
        return {
          gradient: "from-blue-400 to-indigo-500",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-300 dark:border-blue-600",
          text: "text-blue-700 dark:text-blue-300",
          button: "bg-blue-500 hover:bg-blue-600",
        };
      default: // chill
        return {
          gradient: "from-purple-400 to-pink-500",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-300 dark:border-purple-600",
          text: "text-purple-700 dark:text-purple-300",
          button: "bg-purple-500 hover:bg-purple-600",
        };
    }
  };

  const moodColors = getMoodColors();

  // Show loading state
  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
        {children}
      </div>
    );
  }

  // If user can access content, show it normally
  if (canAccess) {
    return <>{children}</>;
  }

  // Show premium lock overlay
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Original content - slightly dimmed */}
      <div className="opacity-20 pointer-events-none select-none">
        {children}
      </div>

      {/* Premium lock overlay - contained within card */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white/98 to-gray-50/98 dark:from-gray-900/98 dark:to-gray-800/98">
        {/* Compact lock icon */}
        <div className="mb-3">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${moodColors.gradient} text-white shadow-lg`}
          >
            {requiredPlan === "PRO" ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <Crown className="w-6 h-6" />
            )}
          </div>
        </div>

        {/* Compact title */}
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          {requiredPlan} Required
        </h4>

        {/* Compact message */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4 leading-relaxed">
          {currentMood.id === "rush" &&
            `🔥 Unlock premium ${contentType} to accelerate your learning!`}
          {currentMood.id === "grind" &&
            `💪 Premium access required for advanced ${contentType}`}
          {currentMood.id === "chill" &&
            `✨ Upgrade to access this premium ${contentType}`}
        </p>

        {/* Features list - compact */}
        <div className="flex flex-wrap justify-center gap-3 mb-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>Unlimited</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Advanced Features</span>
          </div>
          <div className="flex items-center gap-1">
            <Crown className="w-3 h-3" />
            <span>Priority Support</span>
          </div>
        </div>

        {/* Compact action button */}
        <Link
          href="/pricing"
          className={`${moodColors.button} text-white px-6 py-2 rounded-lg font-semibold transition-colors text-sm flex items-center gap-2 shadow-lg hover:shadow-xl`}
        >
          {currentMood.id === "rush" && "Upgrade! 🚀"}
          {currentMood.id === "grind" && "Get Access"}
          {currentMood.id === "chill" && "Unlock ✨"}
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Current plan info - very compact */}
        {subscriptionInfo && (
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Current:{" "}
              <span className="font-medium">{subscriptionInfo.plan}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
