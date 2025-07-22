"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionInfo, setSubscriptionInfo] = useState<{
    subscription: {
      plan: string;
      status: string;
      subscriptionEndsAt?: string;
    };
  } | null>(null);
  
  const sessionId = searchParams.get("session_id");
  const success = searchParams.get("success");

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/payments/subscription");
        const data = await response.json();
        
        if (data.success) {
          setSubscriptionInfo(data.data);
        }
      } catch (error) {
        console.error("Error fetching subscription info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (success === "true" && sessionId) {
      fetchSubscriptionInfo();
    } else {
      setIsLoading(false);
    }
  }, [session, success, sessionId]);

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient: "from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20",
          accent: "text-orange-600 dark:text-orange-400",
          button: "bg-orange-500 hover:bg-orange-600",
          border: "border-orange-500",
        };
      case "grind":
        return {
          gradient: "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900/20 dark:via-slate-900/20 dark:to-blue-900/20",
          accent: "text-blue-600 dark:text-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          border: "border-blue-500",
        };
      default: // chill
        return {
          gradient: "from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-indigo-900/20",
          accent: "text-purple-600 dark:text-purple-400",
          button: "bg-purple-500 hover:bg-purple-600",
          border: "border-purple-500",
        };
    }
  };

  const moodColors = getMoodColors();

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  if (!success || !sessionId) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}>
        <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Something went wrong with your payment. Please try again.
          </p>
          <Link
            href="/pricing"
            className={`inline-flex items-center gap-2 px-6 py-3 ${moodColors.button} text-white rounded-lg font-semibold transition-colors`}
          >
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="relative mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-green-200 dark:border-green-800 animate-ping"></div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {currentMood.id === "rush" && "🚀 You're Now Absolutely Cracked!"}
            {currentMood.id === "grind" && "💪 Welcome to Pro Learning!"}
            {currentMood.id === "chill" && "✨ You're All Set!"}
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {currentMood.id === "rush" && "Time to dominate JavaScript like a total legend! 🔥"}
            {currentMood.id === "grind" && "Your serious learning journey begins now."}
            {currentMood.id === "chill" && "Take your time and enjoy the premium experience! 😊"}
          </p>

          {/* Subscription Info */}
          {subscriptionInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className={`w-5 h-5 ${moodColors.accent}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {subscriptionInfo.subscription.plan} Plan Active
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {subscriptionInfo.subscription.plan}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {subscriptionInfo.subscription.status}
                  </p>
                </div>
              </div>

              {subscriptionInfo.subscription.subscriptionEndsAt && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Next billing: {new Date(subscriptionInfo.subscription.subscriptionEndsAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {/* What's Next */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              What&apos;s unlocked for you:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Unlimited tutorials</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>All quizzes & assessments</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Advanced progress tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span>Priority support</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutorials"
              className={`inline-flex items-center gap-2 px-8 py-4 ${moodColors.button} text-white rounded-lg font-semibold transition-colors`}
            >
              Start Learning
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              View Dashboard
            </Link>
          </div>

          {/* Support */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Questions? We&apos;re here to help!{" "}
              <a href="mailto:support@example.com" className={`${moodColors.accent} hover:underline`}>
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
