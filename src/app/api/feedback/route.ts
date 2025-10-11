/**
 * Feedback API Endpoint
 *
 * Handles feedback submission and retrieval for tutorials.
 * Manages database operations through Prisma and returns
 * appropriate responses with achievement tracking.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FeedbackSubmissionPayload } from "@/types/feedback";

/**
 * POST /api/feedback
 * Submit new feedback for a tutorial
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body: FeedbackSubmissionPayload = await request.json();

    // Validate required fields
    if (!body.tutorialId || !body.rating) {
      return NextResponse.json(
        { success: false, message: "Tutorial ID and rating are required" },
        { status: 400 }
      );
    }

    // Validate rating range
    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if tutorial exists
    const tutorial = await prisma.tutorial.findUnique({
      where: { id: body.tutorialId },
      select: { id: true, title: true },
    });

    if (!tutorial) {
      return NextResponse.json(
        { success: false, message: "Tutorial not found" },
        { status: 404 }
      );
    }

    // Check if user has already submitted feedback for this tutorial
    const existingFeedback = await prisma.tutorialFeedback.findUnique({
      where: {
        userId_tutorialId: {
          userId: session.user.id,
          tutorialId: body.tutorialId,
        },
      },
    });

    if (existingFeedback) {
      return NextResponse.json(
        { success: false, message: "You have already submitted feedback for this tutorial" },
        { status: 409 }
      );
    }

    // Create feedback record
    const feedback = await prisma.tutorialFeedback.create({
      data: {
        userId: session.user.id,
        tutorialId: body.tutorialId,
        quizId: body.quizId || null,
        rating: body.rating,
        helpful: body.helpful,
        difficulty: body.difficulty,
        completion: body.completion,
        feedback: body.feedback,
        tags: body.tags || [],
        quizHelpful: body.quizHelpful,
        improvementAreas: body.improvementAreas || [],
        positiveAspects: body.positiveAspects || [],
        isAnonymous: body.isAnonymous || false,
      },
    });

    // Note: Feedback-specific achievements can be added later
    // For now, we just track the submission
    const achievementUnlocked = undefined;

    return NextResponse.json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
        createdAt: feedback.createdAt,
      },
      achievementUnlocked,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feedback
 * Get user's feedback history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get("tutorialId");

    // If tutorialId is provided, check if user has submitted feedback for it
    if (tutorialId) {
      const feedback = await prisma.tutorialFeedback.findUnique({
        where: {
          userId_tutorialId: {
            userId: session.user.id,
            tutorialId,
          },
        },
        include: {
          tutorial: {
            select: {
              title: true,
              slug: true,
            },
          },
        },
      });

      return NextResponse.json({
        hasSubmitted: !!feedback,
        feedback: feedback || null,
      });
    }

    // Otherwise, return all user's feedback
    const feedbackList = await prisma.tutorialFeedback.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        tutorial: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      feedback: feedbackList,
      total: feedbackList.length,
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
