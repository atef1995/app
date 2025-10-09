import { NextRequest, NextResponse } from "next/server";
import { emailService } from "@/lib/services/emailService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type = "welcome" } = body;

    // Mock user data for testing
    const mockUser = {
      id: session.user.id,
      email: session.user.email || "test@example.com",
      name: session.user.name || "Test User",
      username: "testuser",
      mood: "CHILL",
      subscription: "FREE",
      createdAt: new Date(),
      updatedAt: new Date(),
      emailVerified: null,
      image: null,
      subscriptionStatus: "INACTIVE",
      subscriptionEndsAt: null,
      stripeCustomerId: null,
      role: "",
      // Anonymous conversion attribution fields
      conversionSource: null,
      conversionMedium: null,
      conversionCampaign: null,
      firstLandingPage: null,
      anonymousSessionId: null,
    };

    let result;

    switch (type) {
      case "welcome":
        result = await emailService.sendWelcomeEmail(mockUser);
        break;

      case "promotional":
        const promotion = {
          title: "Limited Time Offer",
          description: "Get 50% off premium features for your first month!",
          ctaText: "Claim Offer",
          ctaUrl: `${process.env.NEXTAUTH_URL}/pricing`,
        };
        result = await emailService.sendPromotionalEmail(mockUser, promotion);
        break;

      case "reminder":
        const reminderData = {
          lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          streak: 5,
          nextLesson: "JavaScript Arrays and Objects",
        };
        result = await emailService.sendStudyReminderEmail(
          mockUser,
          reminderData
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      type,
      result,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      {
        error: "Failed to send test email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
