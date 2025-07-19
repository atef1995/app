import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SubscriptionService } from "@/lib/subscriptionService";
import { Plan } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: { message: "Authentication required" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requiredPlan = searchParams.get("requiredPlan") as Plan;
    const isPremium = searchParams.get("isPremium") === "true";

    if (!requiredPlan) {
      return NextResponse.json(
        {
          success: false,
          error: { message: "requiredPlan parameter is required" },
        },
        { status: 400 }
      );
    }

    const accessResult = await SubscriptionService.canUserAccessContent(
      session.user.id,
      requiredPlan,
      isPremium
    );

    return NextResponse.json({
      success: true,
      ...accessResult,
    });
  } catch (error) {
    console.error("Error checking content access:", error);
    return NextResponse.json(
      {
        success: false,
        error: { message: "Failed to check content access" },
      },
      { status: 500 }
    );
  }
}
