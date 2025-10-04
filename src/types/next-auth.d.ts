import "next-auth";
import { Mood, Plan } from "@prisma/client";
import type { SubscriptionInfo } from "@/lib/subscriptionService";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mood?: Mood;
      subscription?: Plan;
      username: string;
      role: string;
      /** Full subscription info cached in session to prevent repeated DB queries */
      subscriptionInfo?: SubscriptionInfo;
    };
  }

  interface User {
    id: string;
    mood?: Mood;
    subscription?: Plan;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string;
  }
}
