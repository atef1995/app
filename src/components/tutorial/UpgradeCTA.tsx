"use client";

import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/useSubscription";
import Link from "next/link";
import { Sparkles, Lock, CheckCircle } from "lucide-react";

/**
 * UpgradeCTA Component
 *
 * Subscription-aware call-to-action for tutorial premium content
 * Shows different messages based on user's subscription status:
 * - Anonymous: Sign up CTA
 * - FREE: Free trial CTA
 * - VIBED/CRACKED: Confirmation message (already has access)
 *
 * Usage in MDX:
 * ```mdx
 * import { UpgradeCTA } from '@/components/tutorial/UpgradeCTA';
 *
 * <UpgradeCTA
 *   features={[
 *     "50+ practice problems",
 *     "Video solutions",
 *     "Live interviews"
 *   ]}
 *   requiredPlan="VIBED"
 * />
 * ```
 */

interface UpgradeCTAProps {
  /** List of premium features to display */
  features: string[];
  /** Minimum plan required for these features */
  requiredPlan?: "VIBED" | "CRACKED";
  /** Custom CTA text (optional) */
  ctaText?: string;
}

export function UpgradeCTA({
  features,
  requiredPlan = "VIBED",
  ctaText,
}: UpgradeCTAProps) {
  const { data: session, status } = useSession();
  const { data: subscription, isLoading } = useSubscription();

  // Don't show anything while loading
  if (status === "loading" || isLoading) {
    return (
      <div className="my-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const userPlan = subscription?.plan || "FREE";
  const isAnonymous = status === "unauthenticated";

  // Plan hierarchy for comparison
  const planHierarchy = { FREE: 0, VIBED: 1, CRACKED: 2 };
  const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel =
    planHierarchy[requiredPlan as keyof typeof planHierarchy];

  // If user already has required plan or higher, show access confirmation
  if (!isAnonymous && userPlanLevel >= requiredPlanLevel) {
    return (
      <div className="my-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-2 border-green-200 dark:border-green-800">
        <h4 className="text-lg font-bold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          You Have Access to Premium Content!
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200 mb-3">
          As a <span className="font-bold">{userPlan}</span> member, you can
          access all the premium features mentioned above.
        </p>
        <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
          <Sparkles className="w-4 h-4" />
          <span>Enjoying the content? Share it with your peers!</span>
        </div>
      </div>
    );
  }

  // Show upgrade CTA for FREE users or anonymous users
  return (
    <div className="my-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-shrink-0 p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
          <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Unlock Premium Features
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Get full access to advanced content and features
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="mb-5 space-y-2 bg-white/50 dark:bg-gray-900/30 rounded-lg p-4">
        {features.map((feature, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
          >
            <span className="flex-shrink-0 text-purple-600 dark:text-purple-400 mt-0.5">
              ✓
            </span>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      {isAnonymous ? (
        /* Anonymous Users: Sign Up CTA */
        <div className="space-y-2">
          <Link
            href="/auth/signin?callbackUrl=/tutorials"
            className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg"
          >
            Sign Up to Get Started
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      ) : (
        /* Authenticated FREE Users: Trial CTA */
        <div className="space-y-2">
          <Link
            href="/subscription/upgrade"
            className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg"
          >
            {ctaText || "Start Your Free 7-Day Trial"}
          </Link>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No credit card required • Cancel anytime
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            <Link
              href="/pricing"
              className="text-purple-600 dark:text-purple-400 hover:underline"
            >
              Compare all plans →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
