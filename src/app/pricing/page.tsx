"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { Check, ArrowRight, Star } from "lucide-react";
import Link from "next/link";

interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface StripePriceData {
  id: string;
  planType: 'PREMIUM' | 'PRO';
  interval: string;
  amount: number;
  currency: string;
  productName: string;
}

interface StripePrices {
  PREMIUM: {
    monthly?: StripePriceData;
    annual?: StripePriceData;
  };
  PRO: {
    monthly?: StripePriceData;
    annual?: StripePriceData;
  };
}

interface PricingPlan {
  id: "FREE" | "PREMIUM" | "PRO";
  name: string;
  price: number;
  period: string;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  cta: string;
  emoji?: string;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [stripePrices, setStripePrices] = useState<StripePrices | null>(null);

  // Fetch Stripe prices on component mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/payments/prices');
        const data = await response.json();
        if (data.success) {
          setStripePrices(data.prices);
        } else {
          console.error('Failed to fetch prices:', data.error);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    fetchPrices();
  }, []);

  // Get real price from Stripe or fallback to hardcoded
  const getRealPrice = (planId: "PREMIUM" | "PRO", annual: boolean) => {
    if (!stripePrices) {
      // Fallback prices
      return planId === "PREMIUM" ? (annual ? 89 : 9.98) : (annual ? 99 : 19.9);
    }

    const planPrices = stripePrices[planId];
    const priceData = annual ? planPrices.annual : planPrices.monthly;
    return priceData?.amount || 0;
  };

  // Create plans with dynamic pricing - now inside the component
  const getPlansWithDynamicPricing = (): PricingPlan[] => [
    {
      id: "FREE",
      name: "Starter",
      price: 0,
      period: "forever",
      description:
        "Perfect for testing the waters and getting your first taste 🌊",
      emoji: "🎯",
      features: [
        { text: "3 Basic Tutorials", included: true },
        { text: "5 Practice Challenges", included: true },
        { text: "Mood-Adaptive Learning", included: true },
        { text: "Progress Tracking", included: true },
        { text: "Interactive Code Editor", included: true },
        { text: "Quizzes & Assessments", included: false },
        { text: "Advanced Tutorials", included: false },
        { text: "Unlimited Challenges", included: false },
        { text: "Priority Support", included: false },
      ],
      cta: "Start Free",
    },
    {
      id: "PREMIUM",
      name: "Vibed",
      price: getRealPrice("PREMIUM", false),
      period: "month",
      description: "For the motivated learner ready to level up their game 🚀",
      popular: true,
      emoji: "🔥",
      features: [
        { text: "Unlimited Tutorials", included: true, highlight: true },
        { text: "Unlimited Challenges", included: true, highlight: true },
        { text: "Quizzes & Assessments", included: true, highlight: true },
        { text: "Advanced Progress Analytics", included: true },
        { text: "Mood-Adaptive Learning", included: true },
        { text: "Interactive Code Editor", included: true },
        { text: "Priority Support", included: true },
        { text: "Certificate of Completion", included: true },
        { text: "AI Code Reviews", included: false },
      ],
      cta: "Get Vibed",
    },
    {
      id: "PRO",
      name: "Cracked",
      price: getRealPrice("PRO", false),
      period: "month",
      description: "When you're ready to become absolutely cracked at coding 💪",
      emoji: "⚡",
      features: [
        { text: "Everything in Vibed", included: true },
        { text: "AI-Powered Code Reviews", included: true, highlight: true },
        { text: "Advanced Analytics Dashboard", included: true, highlight: true },
        { text: "Custom Learning Paths", included: true },
        { text: "Offline Content Access", included: true },
        { text: "1-on-1 Mentorship Sessions", included: true },
        { text: "Early Access to New Features", included: true },
        { text: "Priority Discord Access", included: true },
        { text: "Custom Integrations", included: true },
      ],
      cta: "Get Cracked",
    },
  ];

  const plans = getPlansWithDynamicPricing();

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient:
            "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          accent: "text-orange-600 dark:text-orange-400",
          button: "bg-orange-500 hover:bg-orange-600",
          border: "border-orange-500",
        };
      case "grind":
        return {
          gradient:
            "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          accent: "text-blue-600 dark:text-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          border: "border-blue-500",
        };
      default: // chill
        return {
          gradient:
            "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          accent: "text-purple-600 dark:text-purple-400",
          button: "bg-purple-500 hover:bg-purple-600",
          border: "border-purple-500",
        };
    }
  };

  const moodColors = getMoodColors();

  const handleUpgrade = async (planId: string) => {
    if (!session) {
      window.location.href = "/auth/signin";
      return;
    }

    if (planId === "FREE") {
      return;
    }

    setLoading(planId);

    try {
      const response = await fetch("/api/payments/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          annual: isAnnual,
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

  const getDiscountedPrice = (plan: PricingPlan) => {
    if (plan.id === "FREE") return 0;
    
    const monthlyPrice = getRealPrice(plan.id as "PREMIUM" | "PRO", false);
    const annualPrice = getRealPrice(plan.id as "PREMIUM" | "PRO", true);
    
    return isAnnual ? annualPrice : monthlyPrice;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentMood.id === "rush" && "🔥 Time to Get Absolutely Cracked!"}
            {currentMood.id === "grind" && "💪 Invest in Your Coding Journey"}
            {currentMood.id === "chill" &&
              "✨ Find Your Vibe, Choose Your Plan"}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {currentMood.id === "rush" &&
              "Skip the grind and unlock instant access to become a JavaScript legend! 🚀"}
            {currentMood.id === "grind" &&
              "Level up your skills with comprehensive resources designed for the serious learner."}
            {currentMood.id === "chill" &&
              "Take your time and pick the perfect plan for your learning journey. No pressure! 😊"}
          </p>
          
          {/* Loading indicator for prices */}
          {!stripePrices && (
            <div className="mt-4 text-sm text-gray-500">
              <div className="animate-pulse">Loading current pricing...</div>
            </div>
          )}
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <div className="flex items-center">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  !isAnnual
                    ? `${moodColors.button} text-white`
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-4 py-2 rounded-md font-medium transition-colors relative ${
                  isAnnual
                    ? `${moodColors.button} text-white`
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Annual
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  20% off
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? `ring-2 ${moodColors.border} scale-105` : ""
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 ${moodColors.button} text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}
                >
                  <Star className="w-4 h-4" /> Most Popular
                </div>
              )}

              <div className="p-8">
                {/* Plan header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-4xl">{plan.emoji}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      $
                      {plan.id === "FREE"
                        ? 0
                        : getDiscountedPrice(plan).toFixed(2)}
                    </span>
                    {plan.id !== "FREE" && (
                      <span className="text-gray-600 dark:text-gray-400">
                        /{isAnnual ? "year" : plan.period}
                      </span>
                    )}
                  </div>
                  {isAnnual && plan.id !== "FREE" && (
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Save ${(getRealPrice(plan.id as "PREMIUM" | "PRO", false) * 12 - getRealPrice(plan.id as "PREMIUM" | "PRO", true)).toFixed(2)} per year!
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included
                            ? feature.highlight
                              ? `${moodColors.button} text-white`
                              : "bg-green-100 dark:bg-green-900"
                            : "bg-gray-100 dark:bg-gray-700"
                        }`}
                      >
                        <Check
                          className={`w-3 h-3 ${
                            feature.included
                              ? feature.highlight
                                ? "text-white"
                                : "text-green-600 dark:text-green-400"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-400 dark:text-gray-500"
                        } ${feature.highlight ? "font-semibold" : ""}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                    plan.popular || plan.id === "PREMIUM"
                      ? `${moodColors.button} text-white`
                      : plan.id === "FREE"
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {loading === plan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      {plan.cta}
                      {plan.id !== "FREE" && <ArrowRight className="w-4 h-4" />}
                    </>
                  )}
                </button>

                {/* Free trial note for premium plans */}
                {plan.id === "PREMIUM" && (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            FAQ - Let&apos;s Clear Things Up! 💭
          </h2>
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Can I switch plans anytime? 🔄
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Absolutely! You can upgrade, downgrade, or cancel your
                subscription at any time. Changes take effect at the next
                billing cycle. No stress!
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                What&apos;s included in the free trial? 🎁
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                The 7-day free trial gives you full access to all Vibed
                features. No credit card required to start - just pure learning
                vibes!
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                How does the mood-adaptive learning actually work? 🧠
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our system adapts content presentation, pacing, and interaction
                style based on your selected mood (Chill, Rush, or Grind) to
                optimize your learning experience. It&apos;s like having a
                personal tutor who gets your vibe!
              </p>
            </div>
          </div>
        </div>

        {/* Back to tutorials link */}
        <div className="text-center mt-12">
          <Link
            href="/tutorials"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            ← Back to Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
}
