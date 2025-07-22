"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Core subscription interface
export interface SubscriptionInfo {
  plan: "FREE" | "PREMIUM" | "PRO";
  status: string;
  subscriptionEndsAt: Date | null;
  isActive: boolean;
  canAccessPremium: boolean;
}

interface SubscriptionResponse {
  success: boolean;
  data: SubscriptionInfo;
}

// Fetch function for subscription data
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

// Hook for fetching subscription data with TanStack Query
export const useSubscription = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id; // Cast to access custom id field
  
  return useQuery({
    queryKey: ["subscription", userId],
    queryFn: fetchSubscription,
    enabled: !!userId, // Only run if user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes - subscription doesn't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Don't refetch when component mounts if data exists
    refetchOnReconnect: false, // Don't refetch on network reconnection
  });
};
