import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";
import { SubscriptionService, Plan } from "@/lib/subscriptionService";
import { StripeHelpers } from "@/lib/stripeHelpers";
import { StripeError } from "@stripe/stripe-js";

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
    const { plan, annual = false, startTrial = false } = body;

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

    // Handle trial request
    if (startTrial) {
      const isEligible = await SubscriptionService.isEligibleForTrial(
        session.user.id
      );

      if (!isEligible) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "You are not eligible for a trial. Trial is only available for new users.",
            },
          },
          { status: 400 }
        );
      }

      // Start trial directly without Stripe
      await SubscriptionService.startTrial(session.user.id, plan as Plan);

      return NextResponse.json({
        success: true,
        trial: true,
        message: `Your 7-day free trial for ${plan} has started! Enjoy full access to all premium features.`,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Prevent users from purchasing the same plan they already have
    if (
      userSubscription.plan === plan &&
      userSubscription.status === "ACTIVE"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `You already have an active ${plan} subscription. Please cancel your current subscription first if you want to change billing cycles.`,
          },
        },
        { status: 400 }
      );
    }

    // Check if this is an upgrade from an existing subscription
    // Include CANCELLED status for users in grace period who want to upgrade
    const isUpgrade =
      (userSubscription.status === "ACTIVE" ||
        userSubscription.status === "CANCELLED") &&
      userSubscription.stripeSubscriptionId &&
      userSubscription.plan !== plan &&
      userSubscription.isActive; // This checks if subscription is still valid (not expired)

    console.log({ isUpgrade, userSubscription, plan });

    // Handle upgrade through subscription modification instead of checkout
    if (isUpgrade) {
      try {
        // Get the existing subscription from Stripe
        const existingSubscription = (await stripe.subscriptions.retrieve(
          userSubscription.stripeSubscriptionId as string
        )) as Stripe.Subscription;

        console.log(
          `Successfully retrieved subscription: ${existingSubscription.id}, status: ${existingSubscription.status}`
        );

        // Update the subscription to the new plan with proration
        const updatedSubscription = (await stripe.subscriptions.update(
          userSubscription.stripeSubscriptionId as string,
          {
            items: [
              {
                id: existingSubscription.items.data[0].id,
                price: priceId,
              },
            ],
            proration_behavior: "create_prorations", // This creates prorated charges
            metadata: {
              userId: session.user.id,
              plan: plan,
              upgradedFrom: userSubscription.plan,
              upgradedAt: new Date().toISOString(),
            },
          }
        )) as Stripe.Subscription;

        // Update the subscription in our database
        // Use the existing subscription's end date since it's just an upgrade
        const subscriptionItem = existingSubscription.items.data[0];
        const subscriptionEndDate = new Date(
          subscriptionItem.current_period_end * 1000
        );
        await SubscriptionService.updateUserSubscription(
          session.user.id,
          plan as "VIBED" | "CRACKED",
          "ACTIVE",
          subscriptionEndDate
        );

        return NextResponse.json({
          success: true,
          upgraded: true,
          message: `Successfully upgraded to ${plan}! You'll only be charged the prorated difference.`,
          subscriptionId: updatedSubscription.id,
        });
      } catch (stripeError: unknown) {
        console.error("Error upgrading subscription:", stripeError);

        // If the subscription doesn't exist in Stripe, fall back to normal checkout
        if (stripeError && typeof stripeError === 'object' && 'code' in stripeError && stripeError.code === "resource_missing") {
          console.log(
            "Stripe subscription not found, falling back to checkout flow"
          );
          // Don't return here, let it continue to the normal checkout flow below
        } else {
          return NextResponse.json(
            {
              success: false,
              error: {
                message:
                  "Failed to upgrade subscription. Please try again or contact support.",
              },
            },
            { status: 500 }
          );
        }
      }
    }

    // Validate and get/create Stripe customer
    const customerId = await StripeHelpers.validateAndGetCustomer(
      session.user.id,
      session.user.email!,
      session.user.name || undefined
    );

    // Check if user qualifies for trial period on subscription
    const isEligibleForTrialPeriod = await SubscriptionService.isEligibleForTrial(
      session.user.id
    );

    // Create checkout session
    const checkoutSessionData: Stripe.Checkout.SessionCreateParams = {
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
        hasTrialPeriod: isEligibleForTrialPeriod.toString(),
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
    };

    // Add trial period if eligible (7 days)
    if (isEligibleForTrialPeriod) {
      checkoutSessionData.subscription_data = {
        ...checkoutSessionData.subscription_data,
        trial_period_days: 7,
      };
      checkoutSessionData.metadata = {
        ...checkoutSessionData.metadata,
        trialDays: "7",
      };
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionData);

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
