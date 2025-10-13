import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/unsubscribe
 *
 * Unsubscribe a user from promotional emails
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Check if already unsubscribed
    if (user.emailUnsubscribed) {
      return NextResponse.json({
        success: true,
        message: "You're already unsubscribed from promotional emails",
      });
    }

    // Update user to unsubscribe
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailUnsubscribed: true,
        emailUnsubscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from promotional emails",
    });
  } catch (error) {
    console.error("Error unsubscribing user:", error);
    return NextResponse.json(
      {
        error: "Failed to unsubscribe",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
