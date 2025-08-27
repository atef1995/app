"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import {
  X,
  Crown,
  Sparkles,
  Check,
  Star,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import getMoodColors from "@/lib/getMoodColors";
import { useSubscription } from "@/hooks/useSubscription";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: "VIBED" | "CRACKED";
  contentType?: "tutorial" | "challenge" | "quiz" | "project";
  contentTitle?: string;
}

interface Plan {
  id: "VIBED" | "CRACKED";
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  emoji?: string;
}

const plans: Plan[] = [
  {
    id: "VIBED",
    name: "Vibed",
    price: 9.99,
    description: "For the motivated learner ready to level up 🚀",
    popular: true,
    emoji: "🔥",
    features: [
      "Unlimited Tutorials & Challenges",
      "Advanced Progress Analytics",
      "Quizzes & Assessments",
      "Certificate of Completion",
      "Priority Support",
    ],
  },
  {
    id: "CRACKED",
    name: "Cracked",
    price: 19.99,
    description: "When you're ready to become absolutely cracked at coding 💪",
    emoji: "⚡",
    features: [
      "Everything in Vibed",
      "AI-Powered Code Reviews",
      "Advanced Analytics Dashboard",
      "Custom Learning Paths",
      "Offline Content Access",
      "1-on-1 Mentorship Sessions",
      "Early Access to New Features",
    ],
  },
];

export default function PremiumModal({
  isOpen,
  onClose,
  requiredPlan = "VIBED",
  contentType = "tutorial",
  contentTitle,
}: PremiumModalProps) {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const { data: subscription } = useSubscription();
  const [loading, setLoading] = useState<string | null>(null);
  const [upgradePreview, setUpgradePreview] = useState<{
    proratedAmount: number;
    remainingDays: number;
  } | null>(null);

  // Check current subscription status
  const currentPlan = subscription?.plan || "FREE";
  const isExistingSubscriber = currentPlan !== "FREE";

  // Define plan hierarchy for upgrade detection
  const planHierarchy = { FREE: 0, VIBED: 1, CRACKED: 2 } as const;
  const currentPlanLevel =
    planHierarchy[currentPlan as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel =
    planHierarchy[requiredPlan as keyof typeof planHierarchy] || 1;

  const needsUpgrade =
    isExistingSubscriber && currentPlanLevel < requiredPlanLevel;

  // Fetch upgrade preview when modal opens and user needs upgrade
  useEffect(() => {
    const fetchUpgradePreview = async () => {
      if (!needsUpgrade || !session?.user?.id) return;

      try {
        const response = await fetch("/api/payments/calculate-upgrade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: requiredPlan,
            annual: false,
          }),
        });

        const data = await response.json();
        if (data.success) {
          setUpgradePreview({
            proratedAmount: data.proratedAmount,
            remainingDays: data.remainingDays,
          });
        }
      } catch (error) {
        console.error("Error fetching upgrade preview:", error);
      }
    };

    if (isOpen && needsUpgrade) {
      fetchUpgradePreview();
    }
  }, [isOpen, needsUpgrade, requiredPlan, session?.user?.id]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const moodColors = getMoodColors(currentMood.id);

  const handleUpgrade = async (planId: string) => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          annual: false,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (data.upgraded) {
          // Handle successful upgrade (no redirect needed)
          alert(data.message || `Successfully upgraded to ${planId}!`);
          // Refresh the page or update subscription state
          window.location.reload();
        } else if (data.url) {
          // Handle new subscription checkout
          window.location.href = data.url;
        }
      } else {
        throw new Error(
          data.error?.message || "Failed to process request"
        );
      }
    } catch (error) {
      console.error("Error processing upgrade:", error);
      alert("Failed to process request. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div
          className={`p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r ${moodColors.gradient} text-white rounded-t-2xl`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {needsUpgrade ? (
                  <TrendingUp className="w-6 h-6" />
                ) : requiredPlan === "CRACKED" ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <Crown className="w-6 h-6" />
                )}
                {needsUpgrade ? (
                  <>
                    {currentMood.id === "rush" && "🚀 Ready to Get Cracked?"}
                    {currentMood.id === "grind" &&
                      "💪 Time to Upgrade Your Grind"}
                    {currentMood.id === "chill" && "✨ Level Up Your Vibes"}
                  </>
                ) : (
                  <>
                    {currentMood.id === "rush" && "🔥 Get Vibed to Cracked!"}
                    {currentMood.id === "grind" && "💪 Time to Get Cracked"}
                    {currentMood.id === "chill" &&
                      "✨ Vibe Check: Premium Time"}
                  </>
                )}
              </h2>
              {contentTitle && (
                <p className="text-white/90 mt-1">
                  {needsUpgrade ? (
                    <>
                      You&apos;re currently on the{" "}
                      <span className="font-semibold">{currentPlan}</span> plan.
                      To access &ldquo;{contentTitle}&rdquo; and other{" "}
                      {requiredPlan}-tier {contentType}s, upgrade to{" "}
                      {requiredPlan}.
                    </>
                  ) : (
                    <>
                      To access &ldquo;{contentTitle}&rdquo; and other premium{" "}
                      {contentType}s
                    </>
                  )}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current Status Banner */}
          {contentTitle && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                needsUpgrade
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700"
                  : "bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {needsUpgrade ? (
                    <TrendingUp
                      className={`w-6 h-6 ${
                        needsUpgrade
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    />
                  ) : requiredPlan === "CRACKED" ? (
                    <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {needsUpgrade
                      ? `Upgrade to ${requiredPlan}`
                      : `${requiredPlan} Subscription Required`}
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {needsUpgrade ? (
                      <>
                        You&apos;re currently enjoying the{" "}
                        <span className="font-semibold text-blue-700 dark:text-blue-300">
                          {currentPlan}
                        </span>{" "}
                        plan! To access &ldquo;{contentTitle}&rdquo; and other
                        advanced {contentType}s, upgrade to{" "}
                        <span className="font-semibold">
                          {plans.find((p) => p.id === requiredPlan)?.name}
                        </span>{" "}
                        below. <strong>You&apos;ll only pay the prorated difference</strong> and your existing plan benefits continue.
                      </>
                    ) : (
                      <>
                        &ldquo;{contentTitle}&rdquo; requires a{" "}
                        <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                          {requiredPlan}
                        </span>{" "}
                        subscription to access. Choose the{" "}
                        <span className="font-semibold">
                          {plans.find((p) => p.id === requiredPlan)?.name}
                        </span>{" "}
                        plan below to unlock this {contentType} and many more!
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mood-specific messaging */}
          <div className={`p-4 rounded-lg ${moodColors.bg} mb-6`}>
            <p className={`text-center ${moodColors.text} font-medium`}>
              {needsUpgrade ? (
                <>
                  {currentMood.id === "rush" &&
                    "🚀 You're already vibed! Now get ready to become absolutely CRACKED with advanced features!"}
                  {currentMood.id === "grind" &&
                    "💪 Time to level up your grind! Upgrade to unlock the most advanced content and features."}
                  {currentMood.id === "chill" &&
                    "✨ Loving the vibes? Take it to the next level with our most comprehensive plan!"}
                </>
              ) : (
                <>
                  {currentMood.id === "rush" &&
                    "⚡ Skip the grind and get instant access to become absolutely cracked at JavaScript!"}
                  {currentMood.id === "grind" &&
                    "🎯 Invest in your coding journey and unlock the full potential of your grind mindset."}
                  {currentMood.id === "chill" &&
                    "🌟 Take your time and unlock premium vibes with unlimited learning content."}
                </>
              )}
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans
              .filter((plan) => {
                // If user needs upgrade, only show the required plan
                if (needsUpgrade) {
                  return plan.id === requiredPlan;
                }
                // Otherwise show all plans (no FREE plan exists in our plans array)
                return true;
              })
              .map((plan) => (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-xl p-6 transition-all ${
                    plan.id === requiredPlan
                      ? `border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg ring-2 ring-yellow-200 dark:ring-yellow-700`
                      : plan.popular && requiredPlan === "VIBED"
                      ? `border-blue-500 bg-blue-50 dark:bg-blue-900/20`
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {/* Popular badge, Required badge, or Upgrade badge */}
                  {plan.id === requiredPlan && needsUpgrade && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Upgrade Plan
                      </span>
                    </div>
                  )}
                  {plan.id === requiredPlan && !needsUpgrade && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Crown className="w-4 h-4" /> Required Plan
                      </span>
                    </div>
                  )}
                  {plan.popular && plan.id !== requiredPlan && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="w-4 h-4" /> Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-4xl">{plan.emoji}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {plan.name}
                    </h3>
                    <div className="mt-2">
                      {needsUpgrade && plan.id === requiredPlan && upgradePreview ? (
                        <>
                          <div className="text-center">
                            <div className="text-lg text-gray-500 dark:text-gray-400 line-through">
                              ${plan.price}/month
                            </div>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              ${upgradePreview.proratedAmount.toFixed(2)}
                            </div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                              Prorated for remaining {upgradePreview.remainingDays} days
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Then ${plan.price}/month
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            ${plan.price}
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            /month
                          </span>
                          {needsUpgrade && plan.id === requiredPlan && !upgradePreview && (
                            <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                              Calculating upgrade cost...
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                      plan.id === requiredPlan
                        ? `${moodColors.button} text-white shadow-lg`
                        : plan.popular && requiredPlan === "VIBED"
                        ? `${moodColors.button} text-white`
                        : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        {needsUpgrade && plan.id === requiredPlan
                          ? upgradePreview 
                            ? `Upgrade for $${upgradePreview.proratedAmount.toFixed(2)}`
                            : `Upgrade to ${plan.name}`
                          : plan.id === requiredPlan
                          ? `Get ${plan.name} (Required)`
                          : plan.popular && requiredPlan === "VIBED"
                          ? `Get ${plan.name}`
                          : `Choose ${plan.name}`}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ))}
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              7-day free trial • Cancel anytime • Secure payment
            </p>
            <Link
              href="/pricing"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              onClick={onClose}
            >
              View detailed pricing →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
