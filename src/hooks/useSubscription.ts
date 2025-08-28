"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { SubscriptionInfo } from "@/lib/subscriptionService";

// Re-export for convenience
export type { SubscriptionInfo };

interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionInfo;
}

interface ExtendedSubscriptionResponse {
  success: boolean;
  data: {
    subscription: SubscriptionInfo;
    access: {
      subscription: SubscriptionInfo;
      limits: {
        maxTutorials: number;
        maxChallenges: number;
        hasQuizzes: boolean;
        hasMoodAdaptation: boolean;
        hasProgressTracking: boolean;
        hasAdvancedFeatures: boolean;
      };
      tutorialLimits: { withinLimits: boolean; current: number; max: number };
      challengeLimits: { withinLimits: boolean; current: number; max: number };
      recommendations: {
        suggestedPlan: string;
        benefits: string[];
        price: number;
      } | null;
    };
  };
}

// Fetch function for basic subscription data
const fetchSubscription = async (): Promise<SubscriptionInfo> => {
  const response = await fetch("/api/user/subscription");

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription: ${response.status}`);
  }

  const data: SubscriptionResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch subscription from API");
  }

  return data.data;
};

// Fetch function for extended subscription data with access info
const fetchExtendedSubscription = async () => {
  const response = await fetch("/api/payments/subscription");

  if (!response.ok) {
    throw new Error(`Failed to fetch subscription: ${response.status}`);
  }

  const data: ExtendedSubscriptionResponse = await response.json();

  if (!data.success) {
    throw new Error("Failed to fetch subscription from API");
  }

  return data.data;
};

// Basic subscription hook
export const useSubscription = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: fetchSubscription,
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// Extended subscription hook with access information
export const useSubscriptionWithAccess = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  return useQuery({
    queryKey: ["subscription-access", userId],
    queryFn: fetchExtendedSubscription,
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes - access info changes more frequently
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

// Subscription cancellation mutation
export const useSubscriptionCancellation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  return useMutation({
    mutationFn: async (options?: { reason?: string }) => {
      const response = await fetch("/api/payments/subscription", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: options?.reason || "user_requested",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to cancel subscription: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to cancel subscription");
      }

      return data;
    },
    onSuccess: async () => {
      // Invalidate and refetch both subscription queries to ensure UI updates
      await queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
      await queryClient.invalidateQueries({ queryKey: ["subscription-access", userId] });
      
      // Force refetch to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ["subscription", userId] });
      await queryClient.refetchQueries({ queryKey: ["subscription-access", userId] });
    },
  });
};

// Subscription reactivation mutation
export const useSubscriptionReactivation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id;

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/payments/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reactivate",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to reactivate subscription: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || "Failed to reactivate subscription");
      }

      return data;
    },
    onSuccess: async () => {
      // Invalidate and refetch both subscription queries to ensure UI updates
      await queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
      await queryClient.invalidateQueries({ queryKey: ["subscription-access", userId] });
      
      // Force refetch to ensure fresh data
      await queryClient.refetchQueries({ queryKey: ["subscription", userId] });
      await queryClient.refetchQueries({ queryKey: ["subscription-access", userId] });
    },
  });
};

// Utility functions for subscription checks
export const checkContentAccess = (
  subscription: SubscriptionInfo | undefined,
  requiredPlan?: string,
  isPremium?: boolean
) => {
  if (!subscription) return { canAccess: false, reason: 'Subscription not loaded' };

  // Free content is always accessible
  if (!isPremium && (!requiredPlan || requiredPlan === 'FREE')) {
    return { canAccess: true };
  }

  // Premium content requires active subscription
  if (isPremium || (requiredPlan && requiredPlan !== 'FREE')) {
    if (!subscription.canAccessPremium) {
      return {
        canAccess: false,
        reason: 'Premium subscription required',
        needsUpgrade: true
      };
    }

    // Check if user's plan meets the required plan level
    if (requiredPlan && !planMeetsRequirement(subscription.plan, requiredPlan)) {
      return {
        canAccess: false,
        reason: `${requiredPlan} plan or higher required`,
        needsUpgrade: true
      };
    }
  }

  return { canAccess: true };
};

export const planMeetsRequirement = (userPlan: string, requiredPlan: string): boolean => {
  const planHierarchy = ['FREE', 'VIBED', 'CRACKED'];
  const userPlanIndex = planHierarchy.indexOf(userPlan);
  const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
  return userPlanIndex >= requiredPlanIndex;
};

// Utility functions for subscription status
export const getSubscriptionStatusInfo = (subscription: SubscriptionInfo | undefined) => {
  if (!subscription) return { message: "Loading...", color: "gray", isActionable: false };

  const now = new Date();
  const endsAt = subscription.subscriptionEndsAt ? new Date(subscription.subscriptionEndsAt) : null;
  
  switch (subscription.status) {
    case "TRIAL":
      const daysLeft = subscription.daysLeftInTrial;
      return {
        message: daysLeft ? `${daysLeft} days left in trial` : "Trial active",
        color: "blue",
        isActionable: true,
        actionType: "cancel-trial" as const,
      };
    
    case "ACTIVE":
      return {
        message: "Active subscription",
        color: "green",
        isActionable: true,
        actionType: "cancel" as const,
      };
    
    case "CANCELLED":
      if (endsAt && endsAt > now) {
        const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          message: `Cancelled • ${daysLeft} days of access left`,
          color: "orange",
          isActionable: true,
          actionType: "reactivate" as const,
        };
      }
      return {
        message: "Cancelled",
        color: "red",
        isActionable: false,
      };
    
    case "EXPIRED":
      return {
        message: "Expired",
        color: "red",
        isActionable: false,
      };
    
    default:
      return {
        message: subscription.status,
        color: "gray",
        isActionable: false,
      };
  }
};
