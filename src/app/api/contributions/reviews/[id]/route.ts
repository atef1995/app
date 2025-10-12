/**
 * API Route: GET/POST /api/contributions/reviews/[id]
 *
 * Get or submit a code review for a submission
 *
 * GET: Fetch review details
 * POST: Submit a new review (peer or mentor)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const review = await prisma.contributionReview.findUnique({
      where: { id },
      include: {
        submission: {
          include: {
            project: {
              select: {
                title: true,
                reviewCriteria: true,
              },
            },
            user: {
              select: {
                username: true,
                image: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          error: "Review not found",
        },
        { status: 404 }
      );
    }

    // Check permissions
    const isReviewer = session?.user?.id === review.reviewerId;
    const isSubmitter = session?.user?.id === review.submission.userId;
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isReviewer && !isSubmitter && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to view this review",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch review",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    // id parameter not needed for POST - using submissionId from body instead
    await params; // Consume the params promise
    const body = await request.json();

    const {
      submissionId,
      type = "PEER",
      codeQualityScore,
      functionalityScore,
      documentationScore,
      bestPracticesScore,
      strengths,
      improvements,
      suggestions,
      filesReviewed = 0,
      commentsAdded = 0,
      githubReviewUrl,
    } = body;

    // Validate required fields
    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "submissionId is required",
        },
        { status: 400 }
      );
    }

    // Fetch submission
    const submission = await prisma.contributionSubmission.findUnique({
      where: { id: submissionId },
      include: {
        project: true,
      },
    });

    if (!submission) {
      return NextResponse.json(
        {
          success: false,
          error: "Submission not found",
        },
        { status: 404 }
      );
    }

    // Check reviewer can't review their own submission
    if (submission.userId === session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot review your own submission",
        },
        { status: 403 }
      );
    }

    // Check if user already reviewed this submission
    const existingReview = await prisma.contributionReview.findFirst({
      where: {
        submissionId,
        reviewerId: session.user.id,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this submission",
          reviewId: existingReview.id,
        },
        { status: 409 }
      );
    }

    // Check review type permissions
    if (type === "MENTOR" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Only mentors can submit mentor reviews",
        },
        { status: 403 }
      );
    }

    // Calculate overall score with weighted rubric
    // Functionality: 40%, Code Quality: 30%, Best Practices: 20%, Documentation: 10%
    const weights = {
      functionality: 0.4,
      codeQuality: 0.3,
      bestPractices: 0.2,
      documentation: 0.1,
    };

    const overallScore =
      functionalityScore !== null &&
      functionalityScore !== undefined &&
      codeQualityScore !== null &&
      codeQualityScore !== undefined &&
      documentationScore !== null &&
      documentationScore !== undefined &&
      bestPracticesScore !== null &&
      bestPracticesScore !== undefined
        ? functionalityScore * weights.functionality +
          codeQualityScore * weights.codeQuality +
          bestPracticesScore * weights.bestPractices +
          documentationScore * weights.documentation
        : null;

    // Determine review status based on score
    let status = "COMPLETED";
    if (overallScore && overallScore < 60) {
      status = "CHANGES_REQUESTED";
    } else if (overallScore && overallScore >= 80) {
      status = "APPROVED";
    }

    // Create review
    const review = await prisma.contributionReview.create({
      data: {
        submissionId,
        reviewerId: session.user.id,
        type,
        status,
        codeQualityScore,
        functionalityScore,
        documentationScore,
        bestPracticesScore,
        overallScore,
        strengths,
        improvements,
        suggestions,
        filesReviewed,
        commentsAdded,
        githubReviewUrl,
        submittedAt: new Date(),
      },
    });

    // Update submission review count
    const updatedSubmission = await prisma.contributionSubmission.update({
      where: { id: submissionId },
      data: {
        peerReviewsReceived: {
          increment: type === "PEER" ? 1 : 0,
        },
        mentorReviewStatus:
          type === "MENTOR"
            ? status === "APPROVED"
              ? "APPROVED"
              : "CHANGES_REQUESTED"
            : undefined,
      },
      include: {
        reviews: true,
      },
    });

    // Check if submission is ready for merge
    const peerReviewsComplete =
      updatedSubmission.peerReviewsReceived >= updatedSubmission.peerReviewsNeeded;
    const mentorApproved = updatedSubmission.mentorReviewStatus === "APPROVED";

    // Award XP to reviewer
    const { awardReviewXP } = await import("@/lib/services/xpService");
    const xpResult = await awardReviewXP(
      session.user.id,
      review.id,
      type as "PEER" | "MENTOR"
    );

    // Check for review achievements
    const { checkReviewAchievements, checkPerfectScoreAchievement } = await import("@/lib/services/achievementService");
    const reviewAchievements = await checkReviewAchievements(session.user.id);

    // Check for perfect score achievement (for submitter)
    if (overallScore === 100) {
      await checkPerfectScoreAchievement(submission.userId, overallScore);
    }

    // Send notification to submitter
    await prisma.notification.create({
      data: {
        userId: submission.userId,
        type: "CONTRIBUTION_REVIEW",
        title: `${type === "PEER" ? "Peer" : "Mentor"} Review Received`,
        message: `Your PR for "${submission.featureTitle}" received a review with an overall score of ${overallScore?.toFixed(0)}%`,
        data: {
          reviewId: review.id,
          submissionId: submission.id,
          overallScore,
          status,
        },
      },
    });

    return NextResponse.json({
      success: true,
      review,
      submissionStatus: {
        peerReviewsComplete,
        mentorApproved,
        readyForMerge: peerReviewsComplete && mentorApproved,
      },
      message: "Review submitted successfully. Thank you for contributing to the community!",
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit review",
      },
      { status: 500 }
    );
  }
}
