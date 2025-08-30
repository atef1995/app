import { prisma } from "./prisma";
import { devMode } from "./services/envService";

const debugMode = devMode();

// Define the constants since they're not enums in the schema
export const Plan = {
  FREE: "FREE",
  VIBED: "VIBED",
  CRACKED: "CRACKED",
} as const;

export const SubscriptionStatus = {
  ACTIVE: "ACTIVE",
  TRIAL: "TRIAL",
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
export type Plan = (typeof Plan)[keyof typeof Plan];
export type SubscriptionStatus =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus];
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface SubscriptionInfo {
  plan: Plan;
  status: SubscriptionStatus;
  subscriptionEndsAt: Date | null;
  isActive: boolean;
  canAccessPremium: boolean;
  stripeSubscriptionId?: string | null;
  isTrialActive: boolean;
  trialEndsAt: Date | null;
  daysLeftInTrial: number | null;
  cancelAtPeriodEnd: boolean;
}

export interface PlanLimits {
  maxTutorials: number;
  maxChallenges: number;
  hasQuizzes: boolean;
  hasMoodAdaptation: boolean;
  hasProgressTracking: boolean;
  hasAdvancedFeatures: boolean;
  hasAIPoweredReviews?: boolean;
  hasMentorshipSessions?: boolean;
  hasEarlyAccess?: boolean;
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
  VIBED: {
    maxTutorials: Infinity,
    maxChallenges: Infinity,
    hasQuizzes: true,
    hasMoodAdaptation: true,
    hasProgressTracking: true,
    hasAdvancedFeatures: true,
    hasAIPoweredReviews: false,
    hasMentorshipSessions: false,
    hasEarlyAccess: false,
  },
  CRACKED: {
    maxTutorials: Infinity,
    maxChallenges: Infinity,
    hasQuizzes: true,
    hasMoodAdaptation: true,
    hasProgressTracking: true,
    hasAdvancedFeatures: true,
    // Additional premium features for CRACKED plan
    hasAIPoweredReviews: true,
    hasMentorshipSessions: true,
    hasEarlyAccess: true,
  },
};

export const PLAN_PRICES = {
  VIBED: 998, // $9.98 in cents
  CRACKED: 1990, // $19.90 in cents
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
        subscriptions: {
          where: {
            status: {
              in: ["ACTIVE", "TRIAL", "CANCELLED"],
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            stripeSubscriptionId: true,
            status: true,
            cancelAtPeriodEnd: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const isActive =
      (user.subscriptionStatus === SubscriptionStatus.ACTIVE ||
        user.subscriptionStatus === SubscriptionStatus.TRIAL ||
        user.subscriptionStatus === SubscriptionStatus.CANCELLED) &&
      (user.subscriptionEndsAt === null || user.subscriptionEndsAt > now);

    const latestSubscription = user.subscriptions[0];

    // Trial logic
    const isTrialActive =
      user.subscriptionStatus === SubscriptionStatus.TRIAL &&
      user.subscriptionEndsAt !== null &&
      user.subscriptionEndsAt > now;

    const trialEndsAt =
      user.subscriptionStatus === SubscriptionStatus.TRIAL
        ? user.subscriptionEndsAt
        : null;

    const daysLeftInTrial = trialEndsAt
      ? Math.ceil(
          (trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      plan: user.subscription as Plan,
      status: user.subscriptionStatus as SubscriptionStatus,
      subscriptionEndsAt: user.subscriptionEndsAt,
      isActive,
      canAccessPremium: isActive && user.subscription !== Plan.FREE,
      stripeSubscriptionId: latestSubscription?.stripeSubscriptionId,
      isTrialActive,
      trialEndsAt,
      daysLeftInTrial:
        daysLeftInTrial && daysLeftInTrial > 0 ? daysLeftInTrial : null,
      cancelAtPeriodEnd: latestSubscription?.cancelAtPeriodEnd || false,
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

    // Count user's progress in the specific content type
    const progressCount =
      contentType === "tutorial"
        ? await prisma.tutorialProgress.count({ where: { userId } })
        : await prisma.challengeProgress.count({ where: { userId } });
    if (debugMode) {
      console.log("user content limits", { progressCount });
    }
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
    const planHierarchy = [Plan.FREE, Plan.VIBED, Plan.CRACKED];
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
   * Check if user is eligible for trial
   */
  static async isEligibleForTrial(userId: string): Promise<boolean> {
    // Check if user has ever had a subscription (including trials)
    const existingSubscriptions = await prisma.subscription.findMany({
      where: { userId },
    });

    // User is eligible if they've never had any subscription
    return existingSubscriptions.length === 0;
  }

  /**
   * Start trial subscription for user
   */
  static async startTrial(userId: string, plan: Plan): Promise<void> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7); // 7 days trial

    await this.updateUserSubscription(
      userId,
      plan,
      SubscriptionStatus.TRIAL,
      trialEndsAt
    );

    // Create subscription record for trial
    await prisma.subscription.create({
      data: {
        userId,
        plan,
        status: SubscriptionStatus.TRIAL,
        currentPeriodStart: new Date(),
        currentPeriodEnd: trialEndsAt,
      },
    });
  }

  /**
   * Get upgrade recommendations based on current plan
   */
  private static getUpgradeRecommendations(
    currentPlan: Plan,
    limits: PlanLimits
  ) {
    if (debugMode) {
      console.log("Plan limits:", limits); // Use the parameter to avoid warning
    }
    if (currentPlan === Plan.FREE) {
      return {
        suggestedPlan: Plan.VIBED,
        benefits: [
          "Unlimited tutorials and challenges",
          "Quiz system for knowledge testing",
          "Advanced progress tracking",
          "Priority support",
        ],
        price: PLAN_PRICES.VIBED,
      };
    }

    if (currentPlan === Plan.VIBED) {
      return {
        suggestedPlan: Plan.CRACKED,
        benefits: [
          "Everything in Vibed",
          "AI-Powered Code Reviews",
          "1-on-1 Mentorship Sessions",
          "Early Access to New Features",
        ],
        price: PLAN_PRICES.CRACKED,
      };
    }

    return null;
  }
}
