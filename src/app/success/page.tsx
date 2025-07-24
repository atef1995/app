"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<{
    subscription: { plan: string };
  } | null>(null);

  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "true" && sessionId) {
      // Fetch updated subscription info
      fetch("/api/payments/subscription")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setSubscriptionData(data.data);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [sessionId, success]);

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

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!success || success !== "true") {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-6xl mb-6">😅</div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              It looks like there was an issue with your payment. Don&apos;t
              worry, you haven&apos;t been charged!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className={`${moodColors.button} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}
              >
                Try Again
              </Link>
              <Link
                href="/dashboard"
                className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plan = subscriptionData?.subscription?.plan || "VIBED";
  const planName = plan === "CRACKED" ? "Cracked" : "Vibed";
  const planEmoji = plan === "CRACKED" ? "⚡" : "🔥";

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Success Animation */}
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center">
              <div
                className={`w-24 h-24 rounded-full ${moodColors.button} flex items-center justify-center mb-4 animate-pulse`}
              >
                <Check className="w-12 h-12 text-white" />
              </div>
              <Sparkles
                className={`absolute -top-2 -right-2 w-6 h-6 ${moodColors.accent} animate-bounce`}
              />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentMood.id === "rush" && "🚀 You're Officially Cracked!"}
            {currentMood.id === "grind" &&
              "💪 Welcome to Your Learning Journey!"}
            {currentMood.id === "chill" && "✨ You're All Set to Vibe!"}
          </h1>

          <div className="text-6xl mb-6">{planEmoji}</div>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Welcome to {planName}! Your subscription is now active.
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {currentMood.id === "rush" &&
              "Time to absolutely demolish those coding challenges! Your unlimited access is ready and waiting. Let's goooo! 🔥"}
            {currentMood.id === "grind" &&
              "Your systematic approach to learning just got a massive upgrade. Access all tutorials, challenges, and quizzes to build rock-solid fundamentals."}
            {currentMood.id === "chill" &&
              "Take your time and enjoy the journey! You now have access to everything at your own pace. No pressure, just pure learning vibes. 😊"}
          </p>

          {/* What's Included */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              What&apos;s included in your {planName} subscription:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Unlimited Tutorials
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Unlimited Challenges
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Quizzes & Assessments
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Progress Analytics
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Priority Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className={`w-5 h-5 ${moodColors.accent}`} />
                <span className="text-gray-700 dark:text-gray-300">
                  Mood-Adaptive Learning
                </span>
              </div>
              {plan === "CRACKED" && (
                <>
                  <div className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${moodColors.accent}`} />
                    <span className="text-gray-700 dark:text-gray-300">
                      AI Code Reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${moodColors.accent}`} />
                    <span className="text-gray-700 dark:text-gray-300">
                      1-on-1 Mentorship
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutorials"
              className={`${moodColors.button} text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2`}
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          {/* Receipt Info */}
          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>A receipt has been sent to {session?.user?.email}</p>
            <p>Session ID: {sessionId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
