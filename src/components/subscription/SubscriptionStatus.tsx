"use client";

import { Calendar, TrendingUp, CreditCard } from "lucide-react";
import { Plan, PLAN_CONFIGS, SubscriptionInfo } from "@/lib/subscriptionService";
import { getSubscriptionStatusInfo } from "@/hooks/useSubscription";
import { Check, X } from "lucide-react";

interface SubscriptionStatusProps {
  subscription: SubscriptionInfo;
  access: {
    tutorialLimits: { current: number; max: number | null };
    challengeLimits: { current: number; max: number | null };
  };
  currentPlan: Plan;
  formatDate: (date: Date | null) => string;
}

export function SubscriptionStatus({ 
  subscription, 
  access, 
  currentPlan, 
  formatDate 
}: SubscriptionStatusProps) {
  const statusInfo = getSubscriptionStatusInfo(subscription);

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            colorClasses[statusInfo.color as keyof typeof colorClasses]
          }`}
        >
          {statusInfo.message}
        </span>
        {subscription.isTrialActive && (
          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
            TRIAL
          </div>
        )}
      </div>

      {/* Subscription Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {subscription.isTrialActive ? "Trial Ends" : "Subscription Ends"}
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {subscription.isTrialActive
              ? formatDate(subscription.trialEndsAt)
              : formatDate(subscription.subscriptionEndsAt)}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tutorials Used
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {access.tutorialLimits.current} /{" "}
            {access.tutorialLimits.max === null ? "Unlimited" : access.tutorialLimits.max}
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Challenges Used
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {access.challengeLimits.current} /{" "}
            {access.challengeLimits.max === null ? "Unlimited" : access.challengeLimits.max}
          </p>
        </div>
      </div>

      {/* Current Plan Features */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Your Plan Includes:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Object.entries(PLAN_CONFIGS[currentPlan as Plan]).map(([key, value]) => {
            const featureLabels = {
              maxTutorials: value === Infinity ? "Unlimited Tutorials" : `${value} Tutorials`,
              maxChallenges: value === Infinity ? "Unlimited Challenges" : `${value} Challenges`,
              hasQuizzes: "Quiz System",
              hasMoodAdaptation: "Mood Adaptation",
              hasProgressTracking: "Progress Tracking",
              hasAdvancedFeatures: "Advanced Features",
            };

            const label = featureLabels[key as keyof typeof featureLabels];
            const included = typeof value === "boolean" ? value : true;

            return (
              <div key={key} className="flex items-center gap-2">
                {included ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${
                    included
                      ? "text-gray-900 dark:text-gray-100"
                      : "text-gray-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}