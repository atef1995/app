import Stripe from "stripe";
import {
  SubscriptionService,
  Plan,
  SubscriptionStatus,
} from "@/lib/subscriptionService";
import { prisma } from "@/lib/prisma";

// Type for Stripe Invoice parent with subscription details
interface InvoiceParentWithSubscription {
  type: string;
  subscription_details?: {
    subscription: string;
    metadata?: Record<string, string>;
  };
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

/**
 * Service for handling Stripe webhook events
 */
export class WebhookService {
  /**
   * Handle checkout.session.completed event
   */
  static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ): Promise<void> {
    try {
      console.log("🎯 Processing checkout session completed:", session.id);
      console.log("📊 Session data:", {
        customer: session.customer,
        metadata: session.metadata,
        paymentStatus: session.payment_status,
        subscriptionId: session.subscription,
      });

      if (!session.customer || !session.metadata?.userId) {
        console.error("❌ Missing customer or userId in session metadata:", {
          hasCustomer: !!session.customer,
          metadata: session.metadata,
        });
        return;
      }

      const userId = session.metadata.userId;
      const plan = session.metadata.plan as Plan;

      console.log(`💳 Processing payment for user ${userId}, plan ${plan}`);

      // Update payment record
      const payment = await prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (payment) {
        console.log("📝 Updating payment record:", payment.id);
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED" },
        });
      } else {
        console.warn("⚠️  No payment record found for session:", session.id);
      }

      // If there's a subscription, it will be handled by subscription.created event
      // But we can also check subscription status here for immediate updates
      if (session.subscription) {
        console.log(
          "🔄 Session has subscription, will be handled by subscription events"
        );
      }

      console.log(`✅ Checkout completed for user ${userId}, plan ${plan}`);
    } catch (error) {
      console.error("❌ Error handling checkout session completed:", error);
      throw error;
    }
  }

  /**
   * Handle customer.subscription.created event
   */
  static async handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      console.log("🎯 Processing subscription created:", subscription.id);
      console.log("📊 Subscription data:", {
        customerId: subscription.customer,
        status: subscription.status,
        metadata: subscription.metadata,
        priceId: subscription.items.data[0]?.price.id,
      });

      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        console.error("❌ Customer is deleted");
        return;
      }

      console.log("👤 Customer data:", {
        id: customer.id,
        metadata: customer.metadata,
      });

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error(
          "❌ No userId found in customer metadata:",
          customer.metadata
        );
        return;
      }

      // Get plan from subscription metadata or price
      let plan: Plan = Plan.VIBED;
      if (subscription.metadata?.plan) {
        plan = subscription.metadata.plan as Plan;
      } else {
        // Determine plan from price ID
        const priceId = subscription.items.data[0]?.price.id;
        if (
          priceId === process.env.STRIPE_CRACKED_PRICE_ID ||
          priceId === process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID
        ) {
          plan = Plan.CRACKED;
        } else if (
          priceId === process.env.STRIPE_VIBED_PRICE_ID ||
          priceId === process.env.STRIPE_VIBED_ANNUAL_PRICE_ID
        ) {
          plan = Plan.VIBED;
        }
      }

      // Get billing cycle dates from subscription
      const billingCycleAnchor = subscription.billing_cycle_anchor;
      const subscriptionItem = subscription.items.data[0];
      
      // Calculate subscription end date from subscription item
      const subscriptionEndsAt = new Date(
        subscriptionItem.current_period_end * 1000
      );
      const subscriptionStartsAt = new Date(
        subscriptionItem.current_period_start * 1000
      );

      console.log("📅 Subscription dates:", {
        billing_cycle_anchor: billingCycleAnchor,
        item_current_period_end: subscriptionItem.current_period_end,
        item_current_period_start: subscriptionItem.current_period_start,
        subscriptionEndsAt: subscriptionEndsAt.toISOString(),
        subscriptionStartsAt: subscriptionStartsAt.toISOString(),
        isValidEndDate: !isNaN(subscriptionEndsAt.getTime()),
        isValidStartDate: !isNaN(subscriptionStartsAt.getTime()),
      });

      // Validate dates before updating
      if (
        isNaN(subscriptionEndsAt.getTime()) ||
        isNaN(subscriptionStartsAt.getTime())
      ) {
        console.error(
          "❌ Invalid subscription dates, cannot update subscription"
        );
        return;
      }

      console.log(
        `🔄 Updating user subscription: userId=${userId}, plan=${plan}, endsAt=${subscriptionEndsAt.toISOString()}`
      );

      // Update user subscription
      await SubscriptionService.updateUserSubscription(
        userId,
        plan,
        SubscriptionStatus.ACTIVE,
        subscriptionEndsAt
      );

      // Create subscription record
      await prisma.subscription.create({
        data: {
          userId,
          plan,
          status: SubscriptionStatus.ACTIVE,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price.id,
          currentPeriodStart: subscriptionStartsAt,
          currentPeriodEnd: subscriptionEndsAt,
        },
      });

      console.log(`✅ Subscription created for user ${userId}, plan ${plan}`);
    } catch (error) {
      console.error("❌ Error handling subscription created:", error);
      throw error;
    }
  }

  /**
   * Handle customer.subscription.updated event
   */
  static async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      console.log("🎯 Processing subscription updated:", subscription.id);

      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        console.error("❌ Customer is deleted");
        return;
      }

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error("❌ No userId found in customer metadata");
        return;
      }

      // Determine new status
      let status: SubscriptionStatus;
      if (subscription.status === "active") {
        status = SubscriptionStatus.ACTIVE;
      } else if (subscription.status === "canceled") {
        status = SubscriptionStatus.CANCELLED;
      } else if (
        subscription.status === "past_due" ||
        subscription.status === "unpaid"
      ) {
        status = SubscriptionStatus.EXPIRED;
      } else {
        status = SubscriptionStatus.INACTIVE;
      }

      // Get plan from subscription metadata or price
      let plan: Plan = Plan.VIBED;
      if (subscription.metadata?.plan) {
        plan = subscription.metadata.plan as Plan;
      } else {
        const priceId = subscription.items.data[0]?.price.id;
        if (
          priceId === process.env.STRIPE_CRACKED_PRICE_ID ||
          priceId === process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID
        ) {
          plan = Plan.CRACKED;
        } else if (
          priceId === process.env.STRIPE_VIBED_PRICE_ID ||
          priceId === process.env.STRIPE_VIBED_ANNUAL_PRICE_ID
        ) {
          plan = Plan.VIBED;
        }
      }

      // Get dates from subscription item
      const subscriptionItem = subscription.items.data[0];
      const subscriptionEndsAt = new Date(
        subscriptionItem.current_period_end * 1000
      );
      const subscriptionStartsAt = new Date(
        subscriptionItem.current_period_start * 1000
      );

      // Validate dates
      if (
        isNaN(subscriptionEndsAt.getTime()) ||
        isNaN(subscriptionStartsAt.getTime())
      ) {
        console.error("❌ Invalid subscription dates in update, skipping");
        return;
      }

      // Update user subscription
      await SubscriptionService.updateUserSubscription(
        userId,
        status === SubscriptionStatus.ACTIVE ? plan : Plan.FREE,
        status,
        subscriptionEndsAt
      );

      // Update subscription record
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status,
          currentPeriodStart: subscriptionStartsAt,
          currentPeriodEnd: subscriptionEndsAt,
          stripePriceId: subscription.items.data[0]?.price.id,
        },
      });

      console.log(
        `✅ Subscription updated for user ${userId}, status ${status}`
      );
    } catch (error) {
      console.error("❌ Error handling subscription updated:", error);
      throw error;
    }
  }

  /**
   * Handle customer.subscription.deleted event
   */
  static async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    try {
      console.log("🎯 Processing subscription deleted:", subscription.id);

      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        console.error("❌ Customer is deleted");
        return;
      }

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error("❌ No userId found in customer metadata");
        return;
      }

      // Use canceled_at timestamp or current date
      const canceledAt = subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : new Date();

      console.log("📅 Cancellation date:", {
        canceled_at: subscription.canceled_at,
        canceledAtDate: canceledAt.toISOString(),
      });

      // Update user to free plan
      await SubscriptionService.updateUserSubscription(
        userId,
        Plan.FREE,
        SubscriptionStatus.CANCELLED,
        canceledAt
      );

      // Update subscription record
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: SubscriptionStatus.CANCELLED,
        },
      });

      console.log(`✅ Subscription deleted for user ${userId}`);
    } catch (error) {
      console.error("❌ Error handling subscription deleted:", error);
      throw error;
    }
  }

  /**
   * Handle invoice.payment_succeeded event
   */
  static async handleInvoicePaymentSucceeded(
    invoice: Stripe.Invoice
  ): Promise<void> {
    try {
      console.log("🎯 Processing invoice payment succeeded:", invoice.id);

      // Check for subscription ID in the correct location
      const invoiceParent = invoice.parent as InvoiceParentWithSubscription;
      const subscriptionId = invoiceParent?.subscription_details?.subscription;
      
      console.log("📊 Invoice parent data:", {
        parentType: invoiceParent?.type,
        hasSubscriptionDetails: !!invoiceParent?.subscription_details,
        subscriptionId: subscriptionId
      });

      if (!subscriptionId) {
        console.log("⏭️ Skipping non-subscription invoice");
        return; // Skip non-subscription invoices
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        console.error("❌ Customer is deleted");
        return;
      }

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error("❌ No userId found in customer metadata");
        return;
      }

      // Record successful payment
      await prisma.payment.create({
        data: {
          userId,
          plan: subscription.metadata?.plan || "VIBED",
          amount: invoice.amount_paid,
          currency: invoice.currency,
          status: "COMPLETED",
        },
      });

      console.log(
        `✅ Invoice payment succeeded for user ${userId}, amount ${invoice.amount_paid}`
      );
    } catch (error) {
      console.error("❌ Error handling invoice payment succeeded:", error);
      throw error;
    }
  }

  /**
   * Handle invoice.payment_failed event
   */
  static async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<void> {
    try {
      console.log("🎯 Processing invoice payment failed:", invoice.id);

      // Check for subscription ID in the correct location
      const invoiceParent = invoice.parent as InvoiceParentWithSubscription;
      const subscriptionId = invoiceParent?.subscription_details?.subscription;
      
      console.log("📊 Invoice parent data (failed):", {
        parentType: invoiceParent?.type,
        hasSubscriptionDetails: !!invoiceParent?.subscription_details,
        subscriptionId: subscriptionId
      });

      if (!subscriptionId) {
        console.log("⏭️ Skipping non-subscription invoice");
        return; // Skip non-subscription invoices
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const customerId = subscription.customer as string;
      const customer = await stripe.customers.retrieve(customerId);

      if (customer.deleted) {
        console.error("❌ Customer is deleted");
        return;
      }

      const userId = customer.metadata?.userId;
      if (!userId) {
        console.error("❌ No userId found in customer metadata");
        return;
      }

      // Record failed payment
      await prisma.payment.create({
        data: {
          userId,
          plan: subscription.metadata?.plan || "VIBED",
          amount: invoice.amount_due,
          currency: invoice.currency,
          status: "FAILED",
        },
      });

      // #TODO: Send email notification about failed payment
      // #TODO: Implement dunning management

      console.log(
        `✅ Invoice payment failed for user ${userId}, amount ${invoice.amount_due}`
      );
    } catch (error) {
      console.error("❌ Error handling invoice payment failed:", error);
      throw error;
    }
  }
}
