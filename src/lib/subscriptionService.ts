import { prisma } from "./prisma";

// Define the constants since they're not enums in the schema
export const Plan = {
  FREE: "FREE",
  PREMIUM: "PREMIUM", 
  PRO: "PRO",
} as const;

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE", 
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
} as const;

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED", 
  CANCELLED: "CANCELLED",
} as const;

// Define the types from the constants
export type Plan = typeof Plan[keyof typeof Plan];
export type SubscriptionStatus = typeof SubscriptionStatus[keyof typeof SubscriptionStatus];
export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface SubscriptionInfo {
  plan: Plan;
  status: SubscriptionStatus;
  subscriptionEndsAt: Date | null;
  isActive: boolean;
  canAccessPremium: boolean;
}

export interface PlanLimits {
  maxTutorials: number;
  maxChallenges: number;
  hasQuizzes: boolean;
  hasMoodAdaptation: boolean;
  hasProgressTracking: boolean;
  hasAdvancedFeatures: boolean;
}

// Plan configurations
export const PLAN_CONFIGS: Record<Plan, PlanLimits> = {
  FREE: {
    maxTutorials: 3,
    maxChallenges: 5,
    hasQuizzes: false,
    hasMoodAdaptation: true,
    hasProgressTracking: true,
    hasAdvancedFeatures: false,
  },
  PREMIUM: {
    maxTutorials: Infinity,
    maxChallenges: Infinity,
    hasQuizzes: true,
    hasMoodAdaptation: true,
    hasProgressTracking: true,
    hasAdvancedFeatures: true,
  },
  PRO: {
    maxTutorials: Infinity,
    maxChallenges: Infinity,
    hasQuizzes: true,
    hasMoodAdaptation: true,
    hasProgressTracking: true,
    hasAdvancedFeatures: true,
  },
};

export const PLAN_PRICES = {
  PREMIUM: 999, // $9.99 in cents
  PRO: 1999, // $19.99 in cents
};

export class SubscriptionService {
  /**
   * Get user's current subscription info
   */
  static async getUserSubscription(userId: string): Promise<SubscriptionInfo> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription: true,
        subscriptionStatus: true,
        subscriptionEndsAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const isActive =
      user.subscriptionStatus === SubscriptionStatus.ACTIVE &&
      (user.subscriptionEndsAt === null || user.subscriptionEndsAt > now);

    return {
      plan: user.subscription as Plan,
      status: user.subscriptionStatus as SubscriptionStatus,
      subscriptionEndsAt: user.subscriptionEndsAt,
      isActive,
      canAccessPremium: isActive && user.subscription !== Plan.FREE,
    };
  }

  /**
   * Check if user can access specific content
   */
  static async canUserAccessContent(
    userId: string,
    requiredPlan: Plan,
    isPremium: boolean = false
  ): Promise<{ canAccess: boolean; reason?: string }> {
    const subscription = await this.getUserSubscription(userId);

    // Free content is always accessible
    if (!isPremium && requiredPlan === Plan.FREE) {
      return { canAccess: true };
    }

    // Premium content requires active subscription
    if (isPremium || requiredPlan !== Plan.FREE) {
      if (!subscription.canAccessPremium) {
        return {
          canAccess: false,
          reason: "Premium subscription required",
        };
      }

      // Check if user's plan meets the required plan level
      if (!this.planMeetsRequirement(subscription.plan, requiredPlan)) {
        return {
          canAccess: false,
          reason: `${requiredPlan} plan or higher required`,
        };
      }
    }

    return { canAccess: true };
  }

  /**
   * Get plan limits for a user
   */
  static async getUserPlanLimits(userId: string): Promise<PlanLimits> {
    const subscription = await this.getUserSubscription(userId);
    return PLAN_CONFIGS[subscription.plan];
  }

  /**
   * Check if user has reached their content limits
   */
  static async checkContentLimits(
    userId: string,
    contentType: "tutorial" | "challenge"
  ): Promise<{ withinLimits: boolean; current: number; max: number }> {
    const limits = await this.getUserPlanLimits(userId);
    const maxAllowed =
      contentType === "tutorial" ? limits.maxTutorials : limits.maxChallenges;

    if (maxAllowed === Infinity) {
      return { withinLimits: true, current: 0, max: Infinity };
    }

    // Count user's progress in this content type
    const progressCount = await prisma.tutorialProgress.count({
      where: { userId },
    });

    return {
      withinLimits: progressCount < maxAllowed,
      current: progressCount,
      max: maxAllowed,
    };
  }

  /**
   * Update user subscription
   */
  static async updateUserSubscription(
    userId: string,
    plan: Plan,
    status: SubscriptionStatus,
    subscriptionEndsAt?: Date
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: plan,
        subscriptionStatus: status,
        subscriptionEndsAt,
      },
    });
  }

  /**
   * Create a payment record
   */
  static async createPayment(
    userId: string,
    plan: Plan,
    amount: number,
    currency: string = "usd",
    stripeSessionId?: string
  ) {
    return await prisma.payment.create({
      data: {
        userId,
        plan,
        amount,
        currency,
        status: PaymentStatus.PENDING,
        stripeSessionId,
      },
    });
  }

  /**
   * Process successful payment
   */
  static async processSuccessfulPayment(paymentId: string): Promise<void> {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { user: true },
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: PaymentStatus.COMPLETED },
    });

    // Calculate subscription end date (30 days from now)
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + 30);

    // Update user subscription
    await this.updateUserSubscription(
      payment.userId,
      payment.plan as Plan,
      SubscriptionStatus.ACTIVE,
      subscriptionEndsAt
    );

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: payment.userId,
        plan: payment.plan,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(),
        currentPeriodEnd: subscriptionEndsAt,
      },
    });
  }

  /**
   * Check if one plan meets the requirement of another
   */
  private static planMeetsRequirement(
    userPlan: Plan,
    requiredPlan: Plan
  ): boolean {
    const planHierarchy = [Plan.FREE, Plan.PREMIUM, Plan.PRO];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    return userPlanIndex >= requiredPlanIndex;
  }

  /**
   * Get user's content access summary
   */
  static async getUserAccessSummary(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    const limits = await this.getUserPlanLimits(userId);
    const tutorialLimits = await this.checkContentLimits(userId, "tutorial");
    const challengeLimits = await this.checkContentLimits(userId, "challenge");

    return {
      subscription,
      limits,
      tutorialLimits,
      challengeLimits,
      recommendations: this.getUpgradeRecommendations(
        subscription.plan,
        limits
      ),
    };
  }

  /**
   * Get upgrade recommendations based on current plan
   */
  private static getUpgradeRecommendations(
    currentPlan: Plan,
    limits: PlanLimits
  ) {
    console.log('Plan limits:', limits); // Use the parameter to avoid warning
    
    if (currentPlan === Plan.FREE) {
      return {
        suggestedPlan: Plan.PREMIUM,
        benefits: [
          "Unlimited tutorials and challenges",
          "Quiz system for knowledge testing",
          "Advanced progress tracking",
          "Priority support",
        ],
        price: PLAN_PRICES.PREMIUM,
      };
    }

    if (currentPlan === Plan.PREMIUM) {
      return {
        suggestedPlan: Plan.PRO,
        benefits: [
          "Everything in Vibed",
          "AI-Powered Code Reviews",
          "1-on-1 Mentorship Sessions",
          "Early Access to New Features",
        ],
        price: PLAN_PRICES.PRO,
      };
    }

    return null;
  }
}
