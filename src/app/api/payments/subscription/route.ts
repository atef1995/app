import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscriptionService";

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
