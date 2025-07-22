"use client";

import { useState, useCallback } from "react";
import { useSubscription } from "./useSubscription";

// Premium content interface
interface PremiumContent {
  title: string;
  type: "tutorial" | "challenge" | "quiz";
  requiredPlan: "PREMIUM" | "PRO";
}

// Simplified premium content handler that uses cached subscription data
export const usePremiumContentHandler = () => {
  const { data: subscription } = useSubscription();
  
  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumContent, setSelectedPremiumContent] = useState<PremiumContent | null>(null);

  // Check if user can access premium content
  const canAccess = useCallback(
    (requiredPlan: "PREMIUM" | "PRO", isPremium = false): boolean => {
      if (!isPremium) return true;
      if (!subscription) return false;

      const userPlan = subscription.plan;

      if (requiredPlan === "PREMIUM") {
        return userPlan === "PREMIUM" || userPlan === "PRO";
      }

      if (requiredPlan === "PRO") {
        return userPlan === "PRO";
      }

      return false;
    },
    [subscription]
  );

  // Premium content handler
  const handlePremiumContent = useCallback(
    (
      content: {
        title: string;
        isPremium?: boolean;
        requiredPlan?: string;
        type: "tutorial" | "challenge" | "quiz";
      },
      onAccess: () => void
    ) => {
      if (
        content.isPremium &&
        !canAccess(
          content.requiredPlan === "FREE"
            ? "PREMIUM"
            : (content.requiredPlan as "PREMIUM" | "PRO"),
          content.isPremium
        )
      ) {
        setSelectedPremiumContent({
          title: content.title,
          type: content.type,
          requiredPlan:
            content.requiredPlan === "FREE"
              ? "PREMIUM"
              : (content.requiredPlan as "PREMIUM" | "PRO"),
        });
        setShowPremiumModal(true);
      } else {
        onAccess();
      }
    },
    [canAccess]
  );

  // Check if premium content is locked
  const isPremiumLocked = useCallback(
    (content: { isPremium?: boolean; requiredPlan?: string }): boolean => {
      if (!content.isPremium) return false;
      
      return !canAccess(
        content.requiredPlan === "FREE"
          ? "PREMIUM"
          : (content.requiredPlan as "PREMIUM" | "PRO"),
        content.isPremium
      );
    },
    [canAccess]
  );

  return {
    handlePremiumContent,
    isPremiumLocked,
    selectedPremiumContent,
    showPremiumModal,
    setShowPremiumModal,
    canAccess,
    subscription,
  };
};
