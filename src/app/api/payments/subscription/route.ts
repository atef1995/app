import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SubscriptionService, SubscriptionStatus, Plan } from "@/lib/subscriptionService";
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
    const subscriptionInfo = await SubscriptionService.getUserSubscription(session.user.id);
    const accessSummary = await SubscriptionService.getUserAccessSummary(session.user.id);

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
          message: error instanceof Error ? error.message : "Internal server error" 
        } 
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
    const { immediate = false, reason = "user_requested" } = body;

    console.log("🎯 Processing subscription cancellation:", {
      userId: session.user.id,
      immediate,
      reason,
    });

    // Get current subscription info
    const currentSubscription = await SubscriptionService.getUserSubscription(session.user.id);
    
    if (currentSubscription.plan === Plan.FREE) {
      return NextResponse.json(
        { success: false, error: { message: "No active subscription to cancel" } },
        { status: 400 }
      );
    }

    if (!currentSubscription.isActive) {
      return NextResponse.json(
        { success: false, error: { message: "Subscription is already cancelled or inactive" } },
        { status: 400 }
      );
    }

    // Handle trial cancellation (no Stripe subscription to cancel)
    if (currentSubscription.status === SubscriptionStatus.TRIAL) {
      console.log("📋 Cancelling trial subscription");
      
      const endDate = immediate ? new Date() : currentSubscription.subscriptionEndsAt;
      
      await SubscriptionService.updateUserSubscription(
        session.user.id,
        immediate ? Plan.FREE : currentSubscription.plan,
        immediate ? SubscriptionStatus.EXPIRED : SubscriptionStatus.CANCELLED,
        endDate || undefined
      );

      const updatedSubscription = await SubscriptionService.getUserSubscription(session.user.id);

      return NextResponse.json({
        success: true,
        message: immediate 
          ? "Trial cancelled immediately. You now have free access."
          : "Trial cancelled. You will retain premium access until your trial expires.",
        data: updatedSubscription,
      });
    }

    // Handle Stripe subscription cancellation
    if (!currentSubscription.stripeSubscriptionId) {
      return NextResponse.json(
        { success: false, error: { message: "No Stripe subscription found to cancel" } },
        { status: 400 }
      );
    }

    try {
      console.log("🔄 Cancelling Stripe subscription:", currentSubscription.stripeSubscriptionId);

      if (immediate) {
        // Cancel immediately - subscription ends right now
        await stripe.subscriptions.cancel(currentSubscription.stripeSubscriptionId, {
          prorate: true, // Give partial refund for unused time
        });
        
        console.log("✅ Stripe subscription cancelled immediately");
      } else {
        // Cancel at period end - user keeps access until billing period expires
        await stripe.subscriptions.update(currentSubscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
          metadata: {
            plan: currentSubscription.plan,
            status: currentSubscription.status,
            cancellation_reason: reason,
            cancelled_by: session.user.id,
            cancelled_at: new Date().toISOString(),
          },
        });
        
        console.log("✅ Stripe subscription set to cancel at period end");
      }

      // Update our database
      const endDate = immediate ? new Date() : currentSubscription.subscriptionEndsAt;
      const newStatus = immediate ? SubscriptionStatus.EXPIRED : SubscriptionStatus.CANCELLED;
      const newPlan = immediate ? Plan.FREE : currentSubscription.plan;

      await SubscriptionService.updateUserSubscription(
        session.user.id,
        newPlan,
        newStatus,
        endDate || undefined
      );

      // Get updated subscription info
      const updatedSubscription = await SubscriptionService.getUserSubscription(session.user.id);

      const message = immediate
        ? "Subscription cancelled immediately. A prorated refund will be processed if applicable."
        : "Subscription cancelled successfully. You will retain access until the end of your billing period.";

      return NextResponse.json({
        success: true,
        message,
        data: updatedSubscription,
        cancellation: {
          immediate,
          reason,
          effectiveDate: endDate?.toISOString(),
        },
      });

    } catch (stripeError: unknown) {
      console.error("❌ Stripe cancellation error:", stripeError);
      
      // Handle case where Stripe subscription doesn't exist
      if (stripeError && typeof stripeError === 'object' && 'code' in stripeError && stripeError.code === "resource_missing") {
        console.log("⚠️ Stripe subscription not found, cancelling locally only");
        
        await SubscriptionService.updateUserSubscription(
          session.user.id,
          Plan.FREE,
          SubscriptionStatus.EXPIRED,
          new Date()
        );

        const updatedSubscription = await SubscriptionService.getUserSubscription(session.user.id);

        return NextResponse.json({
          success: true,
          message: "Subscription cancelled locally. No active Stripe subscription found.",
          data: updatedSubscription,
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
          message: error instanceof Error ? error.message : "Failed to cancel subscription" 
        } 
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
          message: error instanceof Error ? error.message : "Internal server error" 
        } 
      },
      { status: 500 }
    );
  }
}

async function handleReactivation(userId: string) {
  try {
    console.log("🎯 Processing subscription reactivation for user:", userId);

    // Get current subscription info
    const currentSubscription = await SubscriptionService.getUserSubscription(userId);
    
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
        { success: false, error: { message: "No Stripe subscription found to reactivate" } },
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
      const updatedSubscription = await SubscriptionService.getUserSubscription(userId);

      return NextResponse.json({
        success: true,
        message: "Subscription reactivated successfully. Your premium access will continue.",
        data: updatedSubscription,
      });

    } catch (stripeError: unknown) {
      console.error("❌ Stripe reactivation error:", stripeError);
      
      if (stripeError && typeof stripeError === 'object' && 'code' in stripeError && stripeError.code === "resource_missing") {
        return NextResponse.json(
          { success: false, error: { message: "Stripe subscription not found. Cannot reactivate." } },
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
          message: error instanceof Error ? error.message : "Failed to reactivate subscription" 
        } 
      },
      { status: 500 }
    );
  }
}