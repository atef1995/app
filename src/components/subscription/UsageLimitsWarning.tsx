"use client";

import { AlertTriangle } from "lucide-react";
import { Plan, SubscriptionInfo } from "@/lib/subscriptionService";

interface UsageLimitsWarningProps {
  access: {
    subscription: SubscriptionInfo;
    limits: {
      maxTutorials: number;
      maxChallenges: number;
      hasQuizzes: boolean;
      hasMoodAdaptation: boolean;
      hasProgressTracking: boolean;
      hasAdvancedFeatures: boolean;
    };
    tutorialLimits: { withinLimits: boolean; current: number; max: number };
    challengeLimits: { withinLimits: boolean; current: number; max: number };
    recommendations: {
      suggestedPlan: string;
      benefits: string[];
      price: number;
    } | null;
  };
  onUpgrade: (plan: Plan) => void;
  formatPrice: (cents: number) => string;
}

export function UsageLimitsWarning({
  access,
  onUpgrade,
  formatPrice,
}: UsageLimitsWarningProps) {
  const hasLimitReached =
    !access.tutorialLimits.withinLimits || !access.challengeLimits.withinLimits;

  if (!hasLimitReached) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
          Usage Limit Reached
        </h4>
      </div>
      <p className="text-yellow-700 dark:text-yellow-300 mb-3">
        You&apos;ve reached your plan limits. Consider upgrading to continue
        learning without restrictions.
      </p>
      {access.recommendations && (
        <button
          onClick={() =>
            onUpgrade(access.recommendations!.suggestedPlan as Plan)
          }
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Upgrade to {access.recommendations!.suggestedPlan} -{" "}
          {formatPrice(access.recommendations!.price)}/month
        </button>
      )}
    </div>
  );
}
