import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService, Plan, SubscriptionStatus } from "@/lib/subscriptionService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { plan } = body;

    if (!plan || !["VIBED", "CRACKED"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    console.log(`🔧 Manual subscription update for user ${session.user.id} to plan ${plan}`);

    // Update user subscription manually
    const subscriptionEndsAt = new Date();
    subscriptionEndsAt.setMonth(subscriptionEndsAt.getMonth() + 1); // 1 month from now

    await SubscriptionService.updateUserSubscription(
      session.user.id,
      plan as Plan,
      SubscriptionStatus.ACTIVE,
      subscriptionEndsAt
    );

    console.log(`✅ Manual subscription update completed for user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated subscription to ${plan}`,
      endsAt: subscriptionEndsAt
    });
  } catch (error) {
    console.error("Manual update error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}