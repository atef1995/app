"use client";

import {
  Crown,
  Check,
  X,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Plan, SubscriptionInfo } from "@/lib/subscriptionService";

interface SubscriptionActionsProps {
  subscription: SubscriptionInfo;
  currentPlan: Plan;
  isActive: boolean;
  cancelling: boolean;
  reactivating: boolean;
  onCancel: (reason?: string) => void;
  onReactivate: () => void;
  onUpgrade: (plan: Plan) => void;
  onViewAllPlans: () => void;
}

export function SubscriptionActions({
  subscription,
  currentPlan,
  isActive,
  cancelling,
  reactivating,
  onCancel,
  onReactivate,
  onUpgrade,
  onViewAllPlans,
}: SubscriptionActionsProps) {
  const isTrial = subscription.status === "TRIAL";
  const isCancelled = subscription.status === "CANCELLED";

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Upgrade Button - Only show for FREE users or VIBED users upgrading to CRACKED */}
        {(currentPlan === "FREE" || (currentPlan === "VIBED" && !isTrial)) && (
          <button
            onClick={() =>
              onUpgrade(currentPlan === "FREE" ? "VIBED" : "CRACKED")
            }
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Crown className="w-5 h-5" />
            {currentPlan === "FREE"
              ? "Upgrade to Vibed"
              : "Upgrade to Cracked"}
          </button>
        )}

        {/* Reactivate Button */}
        {isCancelled && isActive && (
          <button
            onClick={onReactivate}
            disabled={reactivating}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-green-400 disabled:to-green-500 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:cursor-not-allowed cursor-pointer"
          >
            {reactivating ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Check className="w-5 h-5" />
            )}
            {reactivating ? "Reactivating..." : "Reactivate Subscription"}
          </button>
        )}

        {/* Cancel Button - Available during trial and paid subscriptions */}
        {currentPlan !== "FREE" && isActive && !isCancelled && (
          <button
            onClick={() => onCancel()}
            disabled={cancelling}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          >
            {cancelling ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <X className="w-5 h-5" />
            )}
            {cancelling 
              ? "Cancelling..." 
              : isTrial 
                ? "Cancel Before Billing" 
                : "Cancel Subscription"}
          </button>
        )}

        {/* View All Plans */}
        <button
          onClick={onViewAllPlans}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
        >
          <ExternalLink className="w-5 h-5" />
          View All Plans
        </button>
      </div>

      {/* Additional Context Messages */}
      {isTrial && subscription.daysLeftInTrial && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                Trial Period Active
              </h4>
              <div className="space-y-2">
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  Your 7-day trial ends in {subscription.daysLeftInTrial} day
                  {subscription.daysLeftInTrial !== 1 ? "s" : ""}. After that, your subscription will automatically continue.
                </span>
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <Check className="w-3 h-3" />
                  <span>Cancel anytime during trial to avoid charges</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isCancelled && isActive && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-1">
                Subscription Cancelled
              </h4>
              <span className="text-sm text-orange-700 dark:text-orange-300">
                You still have access until{" "}
                {subscription.subscriptionEndsAt
                  ? new Date(
                      subscription.subscriptionEndsAt
                    ).toLocaleDateString()
                  : "the end of your billing period"}
                . You can reactivate anytime before then.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
