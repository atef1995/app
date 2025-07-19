import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface SubscriptionInfo {
  plan: "FREE" | "PREMIUM" | "PRO";
  status: string;
  subscriptionEndsAt: Date | null;
  isActive: boolean;
  canAccessPremium: boolean;
}

export function useSubscription() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/subscription");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSubscription(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [session]);

  const canAccessContent = async (
    requiredPlan: "FREE" | "PREMIUM" | "PRO",
    isPremium = false
  ) => {
    if (!session?.user?.id)
      return { canAccess: false, reason: "Not authenticated" };

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
  };

  return {
    subscription,
    loading,
    canAccessContent,
    isAuthenticated: !!session?.user?.id,
    isPremium: subscription?.canAccessPremium || false,
  };
}
