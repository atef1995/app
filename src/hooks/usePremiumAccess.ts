"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface SubscriptionInfo {
  plan: string;
  status: string;
  canAccessPremium: boolean;
  subscriptionEndsAt: string | null;
}

interface UsePremiumAccessReturn {
  canAccess: (requiredPlan: "PREMIUM" | "PRO", isPremium?: boolean) => boolean;
  subscriptionInfo: SubscriptionInfo | null;
  loading: boolean;
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;
  checkPremiumAccess: (
    requiredPlan: "PREMIUM" | "PRO",
    isPremium?: boolean
  ) => boolean;
}

export function usePremiumAccess(): UsePremiumAccessReturn {
  const { data: session } = useSession();
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    async function fetchSubscriptionInfo() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/user/subscription`);
        if (response.ok) {
          const data = await response.json();
          setSubscriptionInfo(data.subscription);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscriptionInfo();
  }, [session]);

  const canAccess = (
    requiredPlan: "PREMIUM" | "PRO",
    isPremium = false
  ): boolean => {
    if (!isPremium) return true;
    if (!session?.user?.id) return false;
    if (!subscriptionInfo) return false;

    // Check if user's plan meets requirements
    const userPlan = subscriptionInfo.plan;

    if (requiredPlan === "PREMIUM") {
      return userPlan === "PREMIUM" || userPlan === "PRO";
    }

    if (requiredPlan === "PRO") {
      return userPlan === "PRO";
    }

    return false;
  };

  const checkPremiumAccess = (
    requiredPlan: "PREMIUM" | "PRO",
    isPremium = false
  ): boolean => {
    const hasAccess = canAccess(requiredPlan, isPremium);

    if (!hasAccess && isPremium) {
      setShowPremiumModal(true);
      return false;
    }

    return hasAccess;
  };

  return {
    canAccess,
    subscriptionInfo,
    loading,
    showPremiumModal,
    setShowPremiumModal,
    checkPremiumAccess,
  };
}
