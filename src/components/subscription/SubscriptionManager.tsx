"use client";

import { useRouter } from "next/navigation";
import {
  Crown,
  Zap,
  Check,
  X,
  Calendar,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Settings,
} from "lucide-react";
import {
  Plan,
  PLAN_CONFIGS,
  SubscriptionInfo,
} from "@/lib/subscriptionService";
import {
  useSubscriptionWithAccess,
  useSubscriptionCancellation,
  useSubscriptionReactivation,
  getSubscriptionStatusInfo,
} from "@/hooks/useSubscription";
import { useToast } from "@/hooks/useToast";

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
  const { mutate: cancelSubscription, isPending: cancelling } =
    useSubscriptionCancellation();
  const { mutate: reactivateSubscription, isPending: reactivating } =
    useSubscriptionReactivation();
  const { success, error: showError } = useToast();

  const error = queryError?.message || null;

  const handleCancelSubscription = async (reason?: string) => {
    if (!data?.subscription) return;

    const isTrial = data.subscription.status === "TRIAL";
    const confirmMessage = isTrial
      ? "Are you sure you want to cancel your trial? You will lose access to premium features when your trial expires."
      : "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.";

    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;

    cancelSubscription(
      { reason },
      {
        onSuccess: (result) => {
          success(
            result.message ||
              (isTrial
                ? "Trial cancelled successfully"
                : "Subscription cancelled successfully")
          );
        },
        onError: (error) => {
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

    reactivateSubscription(undefined, {
      onSuccess: (result) => {
        success(result.message || "Subscription reactivated successfully");
      },
      onError: (error) => {
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

  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getPlanIcon = (plan: Plan) => {
    switch (plan) {
      case "CRACKED":
        return <Zap className="w-5 h-5 text-purple-500" />;
      case "VIBED":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanColor = (plan: Plan) => {
    switch (plan) {
      case "CRACKED":
        return "from-purple-500 to-pink-500";
      case "VIBED":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
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
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getPlanIcon(currentPlan)}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {currentPlan} Plan
              </h3>
              <div className="flex items-center gap-2">
                <StatusBadge subscription={subscription} />
                {subscription.isTrialActive && (
                  <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                    TRIAL
                  </div>
                )}
              </div>
            </div>
          </div>

          {currentPlan !== "FREE" && isActive && (
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${getPlanColor(
                currentPlan
              )} text-white text-sm font-medium`}
            >
              Paid
            </div>
          )}
        </div>

        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {subscription.isTrialActive
                  ? "Trial Ends"
                  : "Subscription Ends"}
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
              {access.tutorialLimits.max === null
                ? "Unlimited"
                : access.tutorialLimits.max}
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
              {access.challengeLimits.max === null
                ? "Unlimited"
                : access.challengeLimits.max}
            </p>
          </div>
        </div>

        {/* Current Plan Features */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Your Plan Includes:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(PLAN_CONFIGS[currentPlan as Plan]).map(
              ([key, value]) => {
                const featureLabels = {
                  maxTutorials:
                    value === Infinity
                      ? "Unlimited Tutorials"
                      : `${value} Tutorials`,
                  maxChallenges:
                    value === Infinity
                      ? "Unlimited Challenges"
                      : `${value} Challenges`,
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
              }
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <ActionButtons
          subscription={subscription}
          currentPlan={currentPlan}
          isActive={isActive}
          cancelling={cancelling}
          reactivating={reactivating}
          onCancel={handleCancelSubscription}
          onReactivate={handleReactivateSubscription}
          onUpgrade={handleUpgrade}
          onViewAllPlans={() => router.push("/pricing")}
        />
      </div>

      {/* Usage Warnings */}
      {(!access.tutorialLimits.withinLimits ||
        !access.challengeLimits.withinLimits) && (
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
                handleUpgrade(access.recommendations!.suggestedPlan as Plan)
              }
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Upgrade to {access.recommendations!.suggestedPlan} -{" "}
              {formatPrice(access.recommendations!.price)}/month
            </button>
          )}
        </div>
      )}

      {/* Upgrade Recommendations */}
      {access.recommendations && currentPlan !== "CRACKED" && (
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
            onClick={() =>
              handleUpgrade(access.recommendations!.suggestedPlan as Plan)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Upgrade Now
          </button>
        </div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ subscription }: { subscription: SubscriptionInfo }) {
  const statusInfo = getSubscriptionStatusInfo(subscription);

  const colorClasses = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    orange:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        colorClasses[statusInfo.color as keyof typeof colorClasses]
      }`}
    >
      {statusInfo.message}
    </span>
  );
}

// Action Buttons Component
function ActionButtons({
  subscription,
  currentPlan,
  isActive,
  cancelling,
  reactivating,
  onCancel,
  onReactivate,
  onUpgrade,
  onViewAllPlans,
}: {
  subscription: SubscriptionInfo;
  currentPlan: Plan;
  isActive: boolean;
  cancelling: boolean;
  reactivating: boolean;
  onCancel: (reason?: string) => void;
  onReactivate: () => void;
  onUpgrade: (plan: Plan) => void;
  onViewAllPlans: () => void;
}) {
  const isTrial = subscription.status === "TRIAL";
  const isCancelled = subscription.status === "CANCELLED";

  return (
    <div className="space-y-3">
      {/* Primary Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Upgrade Button */}
        {currentPlan !== "CRACKED" && (
          <button
            onClick={() =>
              onUpgrade(currentPlan === "FREE" ? "VIBED" : "CRACKED")
            }
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Crown className="w-4 h-4" />
            {isTrial
              ? `Upgrade from Trial`
              : currentPlan === "FREE"
              ? "Upgrade to Vibed"
              : "Upgrade to Cracked"}
          </button>
        )}

        {/* Reactivate Button */}
        {isCancelled && isActive && (
          <button
            onClick={onReactivate}
            disabled={reactivating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {reactivating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {reactivating ? "Reactivating..." : "Reactivate Subscription"}
          </button>
        )}

        {/* Cancel Button */}
        {currentPlan !== "FREE" && isActive && !isCancelled && (
          <button
            onClick={() => onCancel()}
            disabled={cancelling}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {cancelling ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            {cancelling
              ? "Cancelling..."
              : isTrial
              ? "Cancel Trial"
              : "Cancel Subscription"}
          </button>
        )}

        {/* View All Plans */}
        <button
          onClick={onViewAllPlans}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View All Plans
        </button>
      </div>

      {/* Additional Context Messages */}
      {isTrial && subscription.daysLeftInTrial && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              Your trial expires in {subscription.daysLeftInTrial} day
              {subscription.daysLeftInTrial !== 1 ? "s" : ""}. Upgrade now to
              continue with premium features.
            </span>
          </div>
        </div>
      )}

      {isCancelled && isActive && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
            <span className="text-sm text-orange-800 dark:text-orange-200">
              Your subscription is cancelled but you still have access until{" "}
              {subscription.subscriptionEndsAt
                ? new Date(subscription.subscriptionEndsAt).toLocaleDateString()
                : "the end of your billing period"}
              . You can reactivate anytime before then.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
