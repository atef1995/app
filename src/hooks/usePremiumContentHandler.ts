"use client";

import { useState, useCallback } from "react";
import { useSubscription } from "./useSubscription";
import { ContentType } from "@/types/common";

// Premium content interface
interface PremiumContent {
  title: string;
  type: "tutorial" | "challenge" | "quiz" | "project";
  requiredPlan: "VIBED" | "CRACKED";
}

// Simplified premium content handler that uses cached subscription data
export const usePremiumContentHandler = () => {
  const { data: subscription } = useSubscription();

  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumContent, setSelectedPremiumContent] =
    useState<PremiumContent | null>(null);

  // Check if user can access premium content
  const canAccess = useCallback(
    (requiredPlan: "VIBED" | "CRACKED", isPremium = false): boolean => {
      if (!isPremium) return true;
      if (!subscription) return false;

      const userPlan = subscription.plan;

      if (requiredPlan === "VIBED") {
        return userPlan === "VIBED" || userPlan === "CRACKED";
      }

      if (requiredPlan === "CRACKED") {
        return userPlan === "CRACKED";
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
        type: ContentType;
      },
      onAccess: () => void
    ) => {
      if (
        content.isPremium &&
        !canAccess(
          content.requiredPlan === "FREE"
            ? "VIBED"
            : (content.requiredPlan as "VIBED" | "CRACKED"),
          content.isPremium
        )
      ) {
        setSelectedPremiumContent({
          title: content.title,
          type: content.type,
          requiredPlan:
            content.requiredPlan === "FREE"
              ? "VIBED"
              : (content.requiredPlan as "VIBED" | "CRACKED"),
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
          ? "VIBED"
          : (content.requiredPlan as "VIBED" | "CRACKED"),
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
