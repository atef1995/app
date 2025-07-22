import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { SubscriptionService } from "@/lib/subscriptionService";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { plan, annual = false } = body;

    // Validate plan
    if (!plan || !["VIBED", "CRACKED"].includes(plan)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid plan specified. Must be VIBED or CRACKED.",
          },
        },
        { status: 400 }
      );
    }

    // Get price ID based on plan and billing cycle
    const getPriceId = (planType: string, isAnnual: boolean) => {
      if (planType === "CRACKED") {
        return isAnnual
          ? process.env.STRIPE_CRACKED_ANNUAL_PRICE_ID
          : process.env.STRIPE_CRACKED_PRICE_ID;
      }
      if (planType === "VIBED") {
        return isAnnual
          ? process.env.STRIPE_VIBED_ANNUAL_PRICE_ID
          : process.env.STRIPE_VIBED_PRICE_ID;
      }
      return null;
    };

    const priceId = getPriceId(plan, annual);
    if (!priceId) {
      return NextResponse.json(
        { success: false, error: { message: "Price configuration not found" } },
        { status: 500 }
      );
    }

    // Check current subscription status
    const userSubscription = await SubscriptionService.getUserSubscription(
      session.user.id
    );

    // Get user's Stripe customer ID from database
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    // Create customer if doesn't exist
    let customerId = dbUser?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan: plan,
        annual: annual.toString(),
        upgradeFrom: userSubscription.plan,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan: plan,
        },
      },
      // Allow promotion codes
      allow_promotion_codes: true,
      // Set billing address collection to required for tax calculation
      billing_address_collection: "required",
      // Customer updates for tax calculation
      customer_update: {
        address: "auto", // Automatically save address from checkout
        shipping: "auto", // Automatically save shipping from checkout
      },
      // Add customer email if no existing customer
      customer_email: !customerId ? session.user.email! : undefined,
      // Automatic tax calculation with proper customer address handling
      automatic_tax: { enabled: true },
    });

    // Create payment record for tracking
    await SubscriptionService.createPayment(
      session.user.id,
      plan,
      annual
        ? plan === "CRACKED"
          ? 9900 // $99/year for Cracked
          : 8900 // $89/year for Vibed
        : plan === "CRACKED"
        ? 1990 // $19.90/month for Cracked
        : 998, // $9.98/month for Vibed
      "usd",
      checkoutSession.id
    );

    return NextResponse.json({
      success: true,
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}
