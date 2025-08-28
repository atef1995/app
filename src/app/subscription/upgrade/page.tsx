"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Zap, Crown } from "lucide-react";
import { useMood } from "@/components/providers/MoodProvider";
import { useState, useEffect, Suspense } from "react";
import getMoodColors from "@/lib/getMoodColors";

interface StripePriceData {
  id: string;
  planType: "VIBED" | "CRACKED";
  interval: string;
  amount: number;
  currency: string;
  productName: string;
}

interface StripePrices {
  VIBED: {
    monthly?: StripePriceData;
    annual?: StripePriceData;
  };
  CRACKED: {
    monthly?: StripePriceData;
    annual?: StripePriceData;
  };
}

function SubscriptionUpgradeContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const feature = searchParams.get("feature");
  const returnUrl = searchParams.get("returnUrl");
  const { currentMood } = useMood();
  const [stripePrices, setStripePrices] = useState<StripePrices | null>(null);

  // Fetch Stripe prices on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/payments/prices");
        const data = await response.json();
        if (data.success) {
          setStripePrices(data.prices);
        } else {
          console.error("Failed to fetch prices:", data.error);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    };

    fetchPrices();
  }, []);

  // Get real price from Stripe or fallback to hardcoded
  const getRealPrice = (
    planId: "VIBED" | "CRACKED",
    annual: boolean = false
  ) => {
    if (!stripePrices) {
      // Fallback prices (same as main pricing page)
      return planId === "VIBED" ? (annual ? 89 : 9.98) : annual ? 99 : 19.9;
    }

    const planPrices = stripePrices[planId];
    const priceData = annual ? planPrices.annual : planPrices.monthly;
    return priceData?.amount || 0;
  };

  const moodColors = getMoodColors(currentMood.id);

  const getFeatureTitle = () => {
    switch (feature) {
      case "tutorials":
        return "Premium Tutorials";
      case "challenges":
        return "Advanced Challenges";
      default:
        return "Premium Content";
    }
  };

  const plans = [
    {
      name: "VIBED",
      price: getRealPrice("VIBED"),
      period: "month",
      icon: <Star className="h-6 w-6" />,
      color: "bg-blue-600",
      popular: true,
      features: [
        "Unlimited tutorials",
        "Advanced quizzes",
        "Progress tracking",
        "Mood-based learning",
        "Email support",
      ],
    },
    {
      name: "CRACKED",
      price: getRealPrice("CRACKED"),
      period: "month",
      icon: <Crown className="h-6 w-6" />,
      color: "bg-purple-600",
      popular: false,
      features: [
        "Everything in VIBED",
        "Project reviews",
        "Priority support",
        "Early access to features",
      ],
    },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <div className="mb-6">
            <Link
              href={returnUrl || "/tutorials"}
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {feature || "content"}
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className={`${moodColors.accent} p-4 rounded-full`}>
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Unlock {getFeatureTitle()}
            </h1>

            {reason && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-yellow-800 dark:text-yellow-300">{reason}</p>
              </div>
            )}

            <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
              Choose a plan that fits your learning style and unlock unlimited
              access to premium content.
            </p>
          </div>

          {/* Pricing plans */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl p-8 ${
                  plan.popular ? "ring-2 ring-purple-500 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div
                    className={`${plan.color} p-3 rounded-full w-fit mx-auto mb-4`}
                  >
                    {plan.icon}
                    <span className="text-white sr-only">{plan.name}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      $
                      {typeof plan.price === "number"
                        ? plan.price.toFixed(2)
                        : plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /{plan.period}
                    </span>
                  </div>

                  {/* Loading indicator for prices */}
                  {!stripePrices && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <div className="animate-pulse">
                        Loading current pricing...
                      </div>
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="h-5 w-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/pricing?plan=${plan.name.toLowerCase()}&returnUrl=${encodeURIComponent(
                      returnUrl || "/tutorials"
                    )}`}
                    className={`w-full ${plan.color} hover:opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-opacity inline-block`}
                  >
                    Get {plan.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Need help choosing? All plans come with a 7-day free trial.
            </p>
            <Link
              href="/pricing"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Compare all plans →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionUpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      }
    >
      <SubscriptionUpgradeContent />
    </Suspense>
  );
}
