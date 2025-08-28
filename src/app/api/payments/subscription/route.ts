import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  SubscriptionService,
  SubscriptionStatus,
  Plan,
} from "@/lib/subscriptionService";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
});

export async function GET() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Get user's subscription info
    const subscriptionInfo = await SubscriptionService.getUserSubscription(
      session.user.id
    );
    const accessSummary = await SubscriptionService.getUserAccessSummary(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        subscription: subscriptionInfo,
        access: accessSummary,
      },
    });
  } catch (error) {
    console.error("Error fetching subscription status:", error);
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

export async function DELETE(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Parse request body for cancellation options
    const body = await request.json().catch(() => ({}));
    const { reason = "user_requested" } = body;

    console.log("🎯 Processing subscription cancellation:", {
      userId: session.user.id,
      reason,
    });

    // Get current subscription info
    const currentSubscription = await SubscriptionService.getUserSubscription(
      session.user.id
    );

    if (currentSubscription.plan === Plan.FREE) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No active subscription to cancel" },
        },
        { status: 400 }
      );
    }

    if (!currentSubscription.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "Subscription is already cancelled or inactive" },
        },
        { status: 400 }
      );
    }

    // Handle trial cancellation
    if (currentSubscription.status === SubscriptionStatus.TRIAL) {
      console.log("📋 Cancelling trial subscription");

      // Check if this is a Stripe trial (from checkout) or local trial (instant)
      if (currentSubscription.stripeSubscriptionId) {
        console.log(
          "🔄 Cancelling Stripe trial subscription:",
          currentSubscription.stripeSubscriptionId
        );

        // Cancel the Stripe trial subscription at period end
        await stripe.subscriptions.update(
          currentSubscription.stripeSubscriptionId,
          {
            cancel_at_period_end: true,
            metadata: {
              plan: currentSubscription.plan,
              status: currentSubscription.status,
              cancellation_reason: reason,
              cancelled_by: session.user.id,
              cancelled_at: new Date().toISOString(),
            },
          }
        );

        console.log("✅ Stripe trial subscription set to cancel at period end");

        // Update our local database to reflect cancellation status
        await SubscriptionService.updateUserSubscription(
          session.user.id,
          currentSubscription.plan, // Keep current plan until trial expires
          SubscriptionStatus.CANCELLED,
          currentSubscription.subscriptionEndsAt || undefined
        );
      } else {
        console.log(
          "📋 Cancelling local trial subscription (no Stripe subscription)"
        );

        // For local trials, mark as cancelled locally - will be handled by background job
        await SubscriptionService.updateUserSubscription(
          session.user.id,
          currentSubscription.plan, // Keep current plan until trial expires
          SubscriptionStatus.CANCELLED,
          currentSubscription.subscriptionEndsAt || undefined
        );
      }

      const updatedSubscription = await SubscriptionService.getUserSubscription(
        session.user.id
      );

      return NextResponse.json({
        success: true,
        message:
          "Trial cancelled. You will retain premium access until your trial expires.",
        data: updatedSubscription,
        cancellation: {
          reason,
          effectiveDate: currentSubscription.subscriptionEndsAt?.toISOString(),
        },
      });
    }

    // Handle Stripe subscription cancellation
    if (!currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No Stripe subscription found to cancel" },
        },
        { status: 400 }
      );
    }

    try {
      console.log(
        "🔄 Cancelling Stripe subscription:",
        currentSubscription.stripeSubscriptionId
      );

      // Cancel at period end - user keeps access until billing period expires
      await stripe.subscriptions.update(
        currentSubscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
          metadata: {
            plan: currentSubscription.plan,
            status: currentSubscription.status,
            cancellation_reason: reason,
            cancelled_by: session.user.id,
            cancelled_at: new Date().toISOString(),
          },
        }
      );

      console.log("✅ Stripe subscription set to cancel at period end");

      // Update our database to mark as cancelled (but keep access until period end)
      await SubscriptionService.updateUserSubscription(
        session.user.id,
        currentSubscription.plan, // Keep current plan until period ends
        SubscriptionStatus.CANCELLED,
        currentSubscription.subscriptionEndsAt || undefined
      );

      // Get updated subscription info
      const updatedSubscription = await SubscriptionService.getUserSubscription(
        session.user.id
      );

      return NextResponse.json({
        success: true,
        message:
          "Subscription cancelled successfully. You will retain access until the end of your billing period.",
        data: updatedSubscription,
        cancellation: {
          reason,
          effectiveDate: currentSubscription.subscriptionEndsAt?.toISOString(),
        },
      });
    } catch (stripeError: unknown) {
      console.error("❌ Stripe cancellation error:", stripeError);

      // Handle case where Stripe subscription doesn't exist
      if (
        stripeError &&
        typeof stripeError === "object" &&
        "code" in stripeError &&
        stripeError.code === "resource_missing"
      ) {
        console.log(
          "⚠️ Stripe subscription not found, cancelling locally only"
        );

        // Cancel locally but keep access until original end date
        await SubscriptionService.updateUserSubscription(
          session.user.id,
          currentSubscription.plan,
          SubscriptionStatus.CANCELLED,
          currentSubscription.subscriptionEndsAt || undefined
        );

        const updatedSubscription =
          await SubscriptionService.getUserSubscription(session.user.id);

        return NextResponse.json({
          success: true,
          message:
            "Subscription cancelled. You will retain access until the end of your billing period.",
          data: updatedSubscription,
          cancellation: {
            reason,
            effectiveDate:
              currentSubscription.subscriptionEndsAt?.toISOString(),
          },
        });
      }

      throw stripeError;
    }
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to cancel subscription",
        },
      },
      { status: 500 }
    );
  }
}
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
    const { action } = body;

    if (action === "reactivate") {
      return await handleReactivation(session.user.id);
    }

    return NextResponse.json(
      { success: false, error: { message: "Unknown action" } },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Error in subscription POST:", error);
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

async function handleReactivation(userId: string) {
  try {
    console.log("🎯 Processing subscription reactivation for user:", userId);

    // Get current subscription info
    const currentSubscription = await SubscriptionService.getUserSubscription(
      userId
    );

    if (currentSubscription.plan === Plan.FREE) {
      return NextResponse.json(
        { success: false, error: { message: "No subscription to reactivate" } },
        { status: 400 }
      );
    }

    if (currentSubscription.status !== SubscriptionStatus.CANCELLED) {
      return NextResponse.json(
        { success: false, error: { message: "Subscription is not cancelled" } },
        { status: 400 }
      );
    }

    if (!currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "No Stripe subscription found to reactivate" },
        },
        { status: 400 }
      );
    }

    try {
      // Reactivate the Stripe subscription
      const subscription = await stripe.subscriptions.update(
        currentSubscription.stripeSubscriptionId,
        {
          cancel_at_period_end: false,
          metadata: {
            reactivated_by: userId,
            reactivated_at: new Date().toISOString(),
          },
        }
      );

      console.log("✅ Stripe subscription reactivated:", subscription.id);

      // Update our database
      await SubscriptionService.updateUserSubscription(
        userId,
        currentSubscription.plan,
        SubscriptionStatus.ACTIVE,
        currentSubscription.subscriptionEndsAt || undefined
      );

      // Get updated subscription info
      const updatedSubscription = await SubscriptionService.getUserSubscription(
        userId
      );

      return NextResponse.json({
        success: true,
        message:
          "Subscription reactivated successfully. Your premium access will continue.",
        data: updatedSubscription,
      });
    } catch (stripeError: unknown) {
      console.error("❌ Stripe reactivation error:", stripeError);

      if (
        stripeError &&
        typeof stripeError === "object" &&
        "code" in stripeError &&
        stripeError.code === "resource_missing"
      ) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Stripe subscription not found. Cannot reactivate.",
            },
          },
          { status: 400 }
        );
      }

      throw stripeError;
    }
  } catch (error) {
    console.error("❌ Error reactivating subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message:
            error instanceof Error
              ? error.message
              : "Failed to reactivate subscription",
        },
      },
      { status: 500 }
    );
  }
}
