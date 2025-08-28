import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { emailService } from "@/lib/services/emailService";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      plan = "VIBED", 
      amount = 998, 
      currency = "usd", 
      isTestMode = true 
    } = body;

    if (!isTestMode && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { success: false, error: "Test mode required in production" },
        { status: 400 }
      );
    }

    // Get full user data from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    console.log("📧 Sending test payment confirmation email");

    const result = await emailService.sendPaymentConfirmationEmail(user, {
      plan: plan,
      amount: amount,
      currency: currency,
      subscriptionStatus: "ACTIVE",
      subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isTrialActive: plan === "TRIAL",
      trialEndsAt: plan === "TRIAL" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Payment confirmation email sent successfully",
        messageId: result.messageId
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || "Failed to send email" 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Internal server error" 
      },
      { status: 500 }
    );
  }
}