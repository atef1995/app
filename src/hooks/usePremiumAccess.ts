"use client";

import { useSubscription } from "./useSubscription";

export interface AccessCheck {
  canAccess: boolean;
  needsUpgrade: boolean;
  currentPlan: string | null;
  requiredPlan: string;
  isExistingSubscriber: boolean;
}

export const usePremiumAccess = (
  requiredPlan: string = "VIBED",
  isPremium: boolean = false
): AccessCheck => {
  const { data: subscription, isLoading } = useSubscription();

  // If still loading subscription data, assume no access
  if (isLoading) {
    return {
      canAccess: false,
      needsUpgrade: false,
      currentPlan: null,
      requiredPlan,
      isExistingSubscriber: false,
    };
  }

  // If content is not premium, everyone can access
  if (!isPremium) {
    return {
      canAccess: true,
      needsUpgrade: false,
      currentPlan: subscription?.plan || "FREE",
      requiredPlan,
      isExistingSubscriber: subscription?.plan !== "FREE",
    };
  }

  const currentPlan = subscription?.plan || "FREE";
  const isExistingSubscriber = currentPlan !== "FREE";

  // Define plan hierarchy
  const planHierarchy = {
    FREE: 0,
    VIBED: 1,
    CRACKED: 2,
  } as const;

  const currentPlanLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] || 0;
  const requiredPlanLevel = planHierarchy[requiredPlan as keyof typeof planHierarchy] || 1;

  const canAccess = currentPlanLevel >= requiredPlanLevel;
  const needsUpgrade = !canAccess;

  return {
    canAccess,
    needsUpgrade,
    currentPlan,
    requiredPlan,
    isExistingSubscriber,
  };
};