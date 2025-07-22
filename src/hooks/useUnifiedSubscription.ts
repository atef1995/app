import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSubscription } from "./useSubscription";

// Core subscription interface
export interface SubscriptionInfo {
  plan: "FREE" | "VIBED" | "CRACKED";
  status: string;
  subscriptionEndsAt: Date | null;
  isActive: boolean;
  canAccessPremium: boolean;
}

// Premium content interface
interface PremiumContent {
  title: string;
  type: "tutorial" | "challenge" | "quiz";
  requiredPlan: "VIBED" | "CRACKED";
}

// Unified return interface that combines all hook functionalities
export interface UnifiedSubscriptionReturn {
  // Core subscription data
  subscription: SubscriptionInfo | null;
  loading: boolean;
  isAuthenticated: boolean;
  isPremium: boolean;

  // Access checking functions
  canAccess: (
    requiredPlan: "VIBED" | "CRACKED",
    isPremium?: boolean
  ) => boolean;
  canAccessContent: (
    requiredPlan: "FREE" | "VIBED" | "CRACKED",
    isPremium?: boolean
  ) => Promise<{ canAccess: boolean; reason?: string }>;
  checkPremiumAccess: (
    requiredPlan: "VIBED" | "CRACKED",
    isPremium?: boolean
  ) => boolean;

  // Premium modal state management
  showPremiumModal: boolean;
  setShowPremiumModal: (show: boolean) => void;

  // Premium content handling
  selectedPremiumContent: PremiumContent | null;
  handlePremiumContent: (
    content: {
      title: string;
      isPremium?: boolean;
      requiredPlan?: string;
      type: "tutorial" | "challenge" | "quiz";
    },
    onAccess: () => void
  ) => void;
  isPremiumLocked: (content: {
    isPremium?: boolean;
    requiredPlan?: string;
  }) => boolean;

  // Legacy compatibility
  subscriptionInfo: SubscriptionInfo | null; // Alias for subscription
}

export function useUnifiedSubscription(): UnifiedSubscriptionReturn {
  const { data: session } = useSession();

  // Use centralized subscription hook with TanStack Query caching
  const { data: subscription, isLoading: loading } = useSubscription();

  // Premium modal state
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedPremiumContent, setSelectedPremiumContent] =
    useState<PremiumContent | null>(null);

  // Synchronous access check (from usePremiumAccess)
  const canAccess = useCallback(
    (requiredPlan: "VIBED" | "CRACKED", isPremium = false): boolean => {
      if (!isPremium) return true;
      if (!session?.user?.id) return false;
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
    [session, subscription]
  );

  // Asynchronous access check with API call (from useSubscription)
  const canAccessContent = useCallback(
    async (
      requiredPlan: "FREE" | "VIBED" | "CRACKED",
      isPremium = false
    ): Promise<{ canAccess: boolean; reason?: string }> => {
      if (!session?.user?.id) {
        return { canAccess: false, reason: "Not authenticated" };
      }

      try {
        const response = await fetch("/api/content/access", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requiredPlan, isPremium }),
        });

        if (response.ok) {
          const data = await response.json();
          return data.success
            ? data.data
            : { canAccess: false, reason: "Unknown error" };
        }
      } catch (error) {
        console.error("Error checking content access:", error);
      }

      return { canAccess: false, reason: "Error checking access" };
    },
    [session]
  );

  // Premium access check with modal trigger (from usePremiumAccess)
  const checkPremiumAccess = useCallback(
    (requiredPlan: "VIBED" | "CRACKED", isPremium = false): boolean => {
      const hasAccess = canAccess(requiredPlan, isPremium);

      if (!hasAccess && isPremium) {
        setShowPremiumModal(true);
      }

      return hasAccess;
    },
    [canAccess]
  );

  // Premium content handler (from usePremiumContentHandler)
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
    // Core subscription data
    subscription: subscription || null,
    loading,
    isAuthenticated: !!session?.user?.id,
    isPremium: subscription?.canAccessPremium || false,

    // Access checking functions
    canAccess,
    canAccessContent,
    checkPremiumAccess,

    // Premium modal state
    showPremiumModal,
    setShowPremiumModal,

    // Premium content handling
    selectedPremiumContent,
    handlePremiumContent,
    isPremiumLocked,

    // Legacy compatibility
    subscriptionInfo: subscription || null, // Alias for backward compatibility
  };
}
