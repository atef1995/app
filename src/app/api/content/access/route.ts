import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscriptionService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { requiredPlan = "FREE", isPremium = false } = await request.json();

    // Check if user can access the content
    const accessCheck = await SubscriptionService.canUserAccessContent(
      session.user.id,
      requiredPlan as "FREE" | "VIBED" | "CRACKED",
      isPremium
    );

    const subscription = await SubscriptionService.getUserSubscription(
      session.user.id
    );

    return NextResponse.json({
      success: true,
      data: {
        canAccess: accessCheck.canAccess,
        reason: accessCheck.reason,
        userPlan: subscription.plan,
        requiredPlan,
        subscription,
      },
    });
  } catch (error) {
    console.error("Error checking content access:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Failed to check content access",
          details: error instanceof Error ? error.message : "Unknown error",
        },
      },
      { status: 500 }
    );
  }
}
