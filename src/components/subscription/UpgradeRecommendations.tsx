"use client";

import { Crown, Check } from "lucide-react";
import { Plan, SubscriptionInfo } from "@/lib/subscriptionService";

interface UpgradeRecommendationsProps {
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
  currentPlan: Plan;
  onUpgrade: (plan: Plan) => void;
  formatPrice: (cents: number) => string;
}

export function UpgradeRecommendations({
  access,
  currentPlan,
  onUpgrade,
  formatPrice,
}: UpgradeRecommendationsProps) {
  if (!access.recommendations || currentPlan === "CRACKED") return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Crown className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Unlock More with {access.recommendations!.suggestedPlan}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatPrice(access.recommendations!.price)}/month
          </p>
        </div>
      </div>

      <ul className="space-y-2 mb-4">
        {access.recommendations!.benefits.map(
          (benefit: string, index: number) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              {benefit}
            </li>
          )
        )}
      </ul>

      <button
        onClick={() => onUpgrade(access.recommendations!.suggestedPlan as Plan)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer"
      >
        Upgrade Now
      </button>
    </div>
  );
}
