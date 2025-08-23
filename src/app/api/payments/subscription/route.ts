import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SubscriptionService, SubscriptionStatus } from "@/lib/subscriptionService";

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

export async function DELETE() {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Get current subscription info
    const currentSubscription = await SubscriptionService.getUserSubscription(session.user.id);
    
    if (currentSubscription.plan === "FREE") {
      return NextResponse.json(
        { success: false, error: { message: "No active subscription to cancel" } },
        { status: 400 }
      );
    }

    // Cancel the subscription (mark as cancelled but keep active until end date)
    await SubscriptionService.updateUserSubscription(
      session.user.id,
      currentSubscription.plan,
      SubscriptionStatus.CANCELLED,
      currentSubscription.subscriptionEndsAt || undefined
    );

    // Get updated subscription info
    const updatedSubscription = await SubscriptionService.getUserSubscription(session.user.id);

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully. You will retain access until the end of your billing period.",
      data: updatedSubscription,
    });

  } catch (error) {
    console.error("Error cancelling subscription:", error);
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
