"use client";

import { useSession } from "next-auth/react";
import { ComplexityVisualizerClient } from "./ComplexityVisualizerClient";
import { useSubscription } from "@/hooks/useSubscription";

/**
 * Complexity Visualizer Page
 *
 * Client component that handles:
 * - Session management (allows anonymous users)
 * - Subscription tier detection via API
 * - Shows preview mode for FREE users
 */
export default function ComplexityVisualizerPage() {
  const { status } = useSession();
  const { data: subscription, isLoading: loadingSubscription } = useSubscription();

  // Show loading state while checking auth and subscription
  if (status === "loading" || loadingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading Complexity Visualizer...
          </p>
        </div>
      </div>
    );
  }

  // Get user's subscription plan (default to FREE for anonymous users)
  const userPlan = (subscription?.plan as "FREE" | "VIBED" | "CRACKED") || "FREE";

  return <ComplexityVisualizerClient plan={userPlan} />;
}
