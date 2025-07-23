"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { X, Crown, Sparkles, Check, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredPlan?: "VIBED" | "CRACKED";
  contentType?: "tutorial" | "challenge" | "quiz";
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
  const [loading, setLoading] = useState<string | null>(null);

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

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient: "from-orange-400 to-red-500",
          bg: "bg-orange-50 dark:bg-orange-900/20",
          button: "bg-orange-500 hover:bg-orange-600",
          text: "text-orange-700 dark:text-orange-300",
        };
      case "grind":
        return {
          gradient: "from-blue-400 to-indigo-500",
          bg: "bg-blue-50 dark:bg-blue-900/20",
          button: "bg-blue-500 hover:bg-blue-600",
          text: "text-blue-700 dark:text-blue-300",
        };
      default: // chill
        return {
          gradient: "from-purple-400 to-pink-500",
          bg: "bg-purple-50 dark:bg-purple-900/20",
          button: "bg-purple-500 hover:bg-purple-600",
          text: "text-purple-700 dark:text-purple-300",
        };
    }
  };

  const moodColors = getMoodColors();

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
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(
          data.error?.message || "Failed to create checkout session"
        );
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      alert("Failed to start checkout process. Please try again.");
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
                {requiredPlan === "CRACKED" ? (
                  <Sparkles className="w-6 h-6" />
                ) : (
                  <Crown className="w-6 h-6" />
                )}
                {currentMood.id === "rush" && "🔥 Get Vibed to Cracked!"}
                {currentMood.id === "grind" && "💪 Time to Get Cracked"}
                {currentMood.id === "chill" && "✨ Vibe Check: Premium Time"}
              </h2>
              {contentTitle && (
                <p className="text-white/90 mt-1">
                  To access &ldquo;{contentTitle}&rdquo; and other premium{" "}
                  {contentType}s
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
          {/* Required Plan Banner */}
          {contentTitle && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {requiredPlan === "CRACKED" ? (
                    <Sparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Crown className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {requiredPlan} Subscription Required
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    &ldquo;{contentTitle}&rdquo; requires a{" "}
                    <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                      {requiredPlan}
                    </span>{" "}
                    subscription to access. Choose the{" "}
                    <span className="font-semibold">
                      {plans.find((p) => p.id === requiredPlan)?.name}
                    </span>{" "}
                    plan below to unlock this {contentType} and many more!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mood-specific messaging */}
          <div className={`p-4 rounded-lg ${moodColors.bg} mb-6`}>
            <p className={`text-center ${moodColors.text} font-medium`}>
              {currentMood.id === "rush" &&
                "⚡ Skip the grind and get instant access to become absolutely cracked at JavaScript!"}
              {currentMood.id === "grind" &&
                "🎯 Invest in your coding journey and unlock the full potential of your grind mindset."}
              {currentMood.id === "chill" &&
                "🌟 Take your time and unlock premium vibes with unlimited learning content."}
            </p>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-6">
            {plans.map((plan) => (
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
                {/* Popular badge or Required badge */}
                {plan.id === requiredPlan && (
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
                    <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      /month
                    </span>
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
                      {plan.id === requiredPlan
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
