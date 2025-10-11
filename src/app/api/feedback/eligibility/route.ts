/**
 * Feedback Eligibility API Endpoint
 *
 * Checks if a user is eligible to submit feedback for a tutorial.
 * Considers submission history and platform rules.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/feedback/eligibility?tutorialId=xxx
 * Check if user can submit feedback for a tutorial
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          eligible: false,
          hasSubmittedForTutorial: false,
          totalSubmissions: 0,
          reason: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get("tutorialId");

    if (!tutorialId) {
      return NextResponse.json(
        {
          eligible: false,
          hasSubmittedForTutorial: false,
          totalSubmissions: 0,
          reason: "Tutorial ID is required",
        },
        { status: 400 }
      );
    }

    // Check if user has already submitted feedback for this tutorial
    const existingFeedback = await prisma.tutorialFeedback.findUnique({
      where: {
        userId_tutorialId: {
          userId: session.user.id,
          tutorialId,
        },
      },
    });

    // Get total feedback submissions by user
    const totalSubmissions = await prisma.tutorialFeedback.count({
      where: {
        userId: session.user.id,
      },
    });

    // Check if tutorial exists
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: tutorialId },
      select: { id: true },
    });

    if (!tutorial) {
      return NextResponse.json(
        {
          eligible: false,
          hasSubmittedForTutorial: false,
          totalSubmissions,
          reason: "Tutorial not found",
        },
        { status: 404 }
      );
    }

    // User is eligible if they haven't submitted feedback for this tutorial
    const eligible = !existingFeedback;

    return NextResponse.json({
      eligible,
      hasSubmittedForTutorial: !!existingFeedback,
      totalSubmissions,
      reason: eligible ? "Eligible to submit" : "Already submitted for this tutorial",
    });
  } catch (error) {
    console.error("Error checking feedback eligibility:", error);
    return NextResponse.json(
      {
        eligible: false,
        hasSubmittedForTutorial: false,
        totalSubmissions: 0,
        reason: "Failed to check eligibility",
      },
      { status: 500 }
    );
  }
}
