"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Plan } from "@/lib/subscriptionService";
import {
  useSubscriptionWithAccess,
  useSubscriptionCancellation,
  useSubscriptionReactivation,
} from "@/hooks/useSubscription";
import { useToast } from "@/hooks/useToast";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscriptionActions } from "./SubscriptionActions";
import { UsageLimitsWarning } from "./UsageLimitsWarning";
import { UpgradeRecommendations } from "./UpgradeRecommendations";
import {
  formatDate,
  formatPrice,
  getPlanIcon,
  getPlanColor,
} from "@/lib/subscriptionUtils";

interface SubscriptionManagerProps {
  onUpgrade?: (plan: Plan) => void;
}

export function SubscriptionManager({ onUpgrade }: SubscriptionManagerProps) {
  const router = useRouter();
  const {
    data,
    isLoading: loading,
    error: queryError,
    refetch,
  } = useSubscriptionWithAccess();
  const cancelMutation = useSubscriptionCancellation();
  const reactivationMutation = useSubscriptionReactivation();
  const { success, error: showError, info } = useToast();
  const error = queryError?.message || null;

  const handleCancelSubscription = async (reason?: string) => {
    if (!data?.subscription) return;

    const isTrial = data.subscription.status === "TRIAL";
    const confirmMessage = isTrial
      ? "Are you sure you want to cancel your trial? You will lose access to premium features when your trial expires."
      : "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.";

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    console.log("🎯 Starting cancellation process...");
    info("Cancelling subscription...");

    cancelMutation.mutate(
      { reason },
      {
        onSuccess: (result) => {
          console.log("✅ Cancellation successful:", result);
          success(
            result.message ||
              (isTrial
                ? "Trial cancelled successfully"
                : "Subscription cancelled successfully")
          );
          // Refetch data to update UI
          refetch();
        },
        onError: (error: Error) => {
          console.error("❌ Cancellation failed:", error);
          showError(error.message || "Failed to cancel subscription");
        },
      }
    );
  };

  const handleReactivateSubscription = async () => {
    if (!data?.subscription) return;

    const confirmed = window.confirm(
      "Are you sure you want to reactivate your subscription? Your premium access will continue and billing will resume."
    );

    if (!confirmed) return;

    console.log("🎯 Starting reactivation process...", data.subscription);
    info("Reactivating subscription...");

    reactivationMutation.mutate(undefined, {
      onSuccess: (result) => {
        console.log("✅ Reactivation successful:", result);
        success(result.message || "Subscription reactivated successfully");
        // Refetch data to update UI
        refetch();
      },
      onError: (error: Error) => {
        console.error("❌ Reactivation failed:", error);
        showError(error.message || "Failed to reactivate subscription");
      },
    });
  };

  const handleUpgrade = (targetPlan: Plan) => {
    if (onUpgrade) {
      onUpgrade(targetPlan);
    } else {
      router.push(`/pricing?plan=${targetPlan.toLowerCase()}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error Loading Subscription</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { subscription, access } = data;
  const currentPlan = subscription.plan;
  const isActive = subscription.isActive;
  console.log({ data });

  return (
    <div className="space-y-8">
      {/* Current Plan Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
              {(() => {
                const IconComponent = getPlanIcon(currentPlan);
                const iconColor =
                  currentPlan === "CRACKED"
                    ? "text-purple-600"
                    : currentPlan === "VIBED"
                    ? "text-yellow-600"
                    : "text-gray-600";
                return <IconComponent className={`w-6 h-6 ${iconColor}`} />;
              })()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {currentPlan} Plan
                </h2>
                {currentPlan !== "FREE" && isActive && (
                  <div
                    className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlanColor(
                      currentPlan
                    )} text-white text-xs font-semibold uppercase tracking-wider shadow-sm`}
                  >
                    Active
                  </div>
                )}
              </div>
              <SubscriptionStatus
                subscription={subscription}
                access={access}
                currentPlan={currentPlan}
                formatDate={formatDate}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <SubscriptionActions
            subscription={subscription}
            currentPlan={currentPlan}
            isActive={isActive}
            cancelling={cancelMutation.isPending}
            reactivating={reactivationMutation.isPending}
            onCancel={handleCancelSubscription}
            onReactivate={handleReactivateSubscription}
            onUpgrade={handleUpgrade}
            onViewAllPlans={() => router.push("/pricing")}
          />
        </div>
      </div>

      {/* Usage Warnings */}
      <UsageLimitsWarning
        access={access}
        onUpgrade={handleUpgrade}
        formatPrice={formatPrice}
      />

      {/* Upgrade Recommendations */}
      <UpgradeRecommendations
        access={access}
        currentPlan={currentPlan}
        onUpgrade={handleUpgrade}
        formatPrice={formatPrice}
      />
    </div>
  );
}
