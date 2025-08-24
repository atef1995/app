// This file handles /api/payments/webhook (without trailing slash)
// Next.js will serve this for the exact path that Stripe is calling

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import {
  SubscriptionService,
  Plan,
  SubscriptionStatus,
} from "@/lib/subscriptionService";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Webhook endpoint called (webhook.ts)");
    
    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    console.log("📝 Webhook details:", {
      bodyLength: body.length,
      hasSignature: !!sig,
      endpointSecretSet: !!endpointSecret,
      stripeKeySet: !!process.env.STRIPE_SECRET_KEY
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
      console.log("✅ Webhook signature verified successfully");
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "Webhook signature verification failed" },
        { status: 400 }
      );
    }

    console.log(`🎯 Processing webhook event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(
          event.data.object as Stripe.Invoice
        );
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    console.log("🎯 Processing checkout session completed:", session.id);
    console.log("📊 Session data:", {
      customer: session.customer,
      metadata: session.metadata,
      paymentStatus: session.payment_status,
      subscriptionId: session.subscription
    });

    if (!session.customer || !session.metadata?.userId) {
      console.error("❌ Missing customer or userId in session metadata:", {
        hasCustomer: !!session.customer,
        metadata: session.metadata
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
      console.log("🔄 Session has subscription, will be handled by subscription events");
    }

    console.log(`✅ Checkout completed for user ${userId}, plan ${plan}`);
  } catch (error) {
    console.error("❌ Error handling checkout session completed:", error);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    console.log("🎯 Processing subscription created:", subscription.id);
    console.log("📊 Subscription data:", {
      customerId: subscription.customer,
      status: subscription.status,
      metadata: subscription.metadata,
      priceId: subscription.items.data[0]?.price.id
    });

    const customerId = subscription.customer as string;
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      console.error("❌ Customer is deleted");
      return;
    }

    console.log("👤 Customer data:", {
      id: customer.id,
      metadata: customer.metadata
    });

    const userId = customer.metadata?.userId;
    if (!userId) {
      console.error("❌ No userId found in customer metadata:", customer.metadata);
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

    // Calculate subscription end date - using type assertion to access Stripe properties
    const stripeData = subscription as unknown as {
      current_period_end: number;
      current_period_start: number;
    };
    const subscriptionEndsAt = new Date(stripeData.current_period_end * 1000);

    console.log(`🔄 Updating user subscription: userId=${userId}, plan=${plan}, endsAt=${subscriptionEndsAt}`);

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
        currentPeriodStart: new Date(stripeData.current_period_start * 1000),
        currentPeriodEnd: subscriptionEndsAt,
      },
    });

    console.log(`✅ Subscription created for user ${userId}, plan ${plan}`);
  } catch (error) {
    console.error("❌ Error handling subscription created:", error);
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
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

    const stripeData = subscription as unknown as {
      current_period_end: number;
      current_period_start: number;
    };
    const subscriptionEndsAt = new Date(stripeData.current_period_end * 1000);

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
        currentPeriodStart: new Date(stripeData.current_period_start * 1000),
        currentPeriodEnd: subscriptionEndsAt,
        stripePriceId: subscription.items.data[0]?.price.id,
      },
    });

    console.log(`✅ Subscription updated for user ${userId}, status ${status}`);
  } catch (error) {
    console.error("❌ Error handling subscription updated:", error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
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

    const stripeData = subscription as unknown as { canceled_at?: number };

    // Update user to free plan
    await SubscriptionService.updateUserSubscription(
      userId,
      Plan.FREE,
      SubscriptionStatus.CANCELLED,
      stripeData.canceled_at
        ? new Date(stripeData.canceled_at * 1000)
        : new Date()
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
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log("🎯 Processing invoice payment succeeded:", invoice.id);

    const invoiceData = invoice as unknown as { subscription?: string };
    if (!invoiceData.subscription) {
      return; // Skip non-subscription invoices
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoiceData.subscription
    );
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
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log("🎯 Processing invoice payment failed:", invoice.id);

    const invoiceData = invoice as unknown as { subscription?: string };
    if (!invoiceData.subscription) {
      return; // Skip non-subscription invoices
    }

    const subscription = await stripe.subscriptions.retrieve(
      invoiceData.subscription
    );
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
  }
}