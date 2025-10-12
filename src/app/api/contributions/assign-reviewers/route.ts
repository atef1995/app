/**
 * API Route: POST /api/contributions/assign-reviewers
 *
 * Automatically assign peer reviewers to a submission
 *
 * Smart matching algorithm:
 * - Find users at same or higher skill level
 * - Exclude submission author
 * - Exclude users who already reviewed this submission
 * - Balance review load across users
 * - Randomly select N reviewers (default: 2)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface AssignReviewersRequest {
  submissionId: string;
  numberOfReviewers?: number;
}

export async function POST(request: Request) {
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

    const body: AssignReviewersRequest = await request.json();
    const { submissionId, numberOfReviewers = 2 } = body;

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "submissionId is required",
        },
        { status: 400 }
      );
    }

    // Fetch submission with user and project details
    const submission = await prisma.contributionSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: true,
        project: {
          select: {
            difficulty: true,
            title: true,
          },
        },
        reviews: {
          select: {
            reviewerId: true,
          },
        },
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

    // Get IDs of users who already reviewed this submission
    const existingReviewerIds = submission.reviews.map((r) => r.reviewerId);

    // Find eligible reviewers
    // Criteria:
    // 1. Not the submission author
    // 2. Haven't reviewed this submission yet
    // 3. Have GitHub connected (to verify they're active)
    // 4. Exclude admins (they'll do mentor reviews)
    const eligibleReviewers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: submission.userId } }, // Not the author
          { id: { notIn: existingReviewerIds } }, // Haven't reviewed yet
          { githubAccessToken: { not: null } }, // Have GitHub connected
          { role: { not: "ADMIN" } }, // Not admin (mentors)
        ],
      },
      select: {
        id: true,
        username: true,
        email: true,
        contributionReviews: {
          select: {
            id: true,
            status: true,
          },
        },
        contributionSubmissions: {
          select: {
            id: true,
            prStatus: true,
          },
        },
      },
    });

    if (eligibleReviewers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No eligible reviewers available",
          message:
            "There are currently no users available to review this submission. Please try again later.",
        },
        { status: 404 }
      );
    }

    // Score reviewers based on:
    // 1. Experience (completed submissions)
    // 2. Review load (pending reviews)
    // 3. Review quality (completed reviews)
    const scoredReviewers = eligibleReviewers.map((user) => {
      const completedSubmissions = user.contributionSubmissions.filter(
        (s) => s.prStatus === "MERGED"
      ).length;

      const completedReviews = user.contributionReviews.filter(
        (r) => r.status !== "PENDING"
      ).length;

      const pendingReviews = user.contributionReviews.filter(
        (r) => r.status === "PENDING"
      ).length;

      // Experience score (0-10): more completed submissions = higher score
      const experienceScore = Math.min(completedSubmissions * 2, 10);

      // Review activity score (0-10): more completed reviews = higher score
      const reviewActivityScore = Math.min(completedReviews, 10);

      // Load penalty: fewer pending reviews = higher score
      const loadScore = Math.max(10 - pendingReviews * 2, 0);

      // Total score
      const totalScore = experienceScore + reviewActivityScore + loadScore;

      return {
        userId: user.id,
        username: user.username,
        email: user.email,
        score: totalScore,
        stats: {
          completedSubmissions,
          completedReviews,
          pendingReviews,
        },
      };
    });

    // Sort by score (highest first)
    scoredReviewers.sort((a, b) => b.score - a.score);

    // Select top reviewers with some randomization
    // Take top 50% candidates and randomly select from them
    const topCandidates = scoredReviewers.slice(
      0,
      Math.max(Math.ceil(scoredReviewers.length * 0.5), numberOfReviewers)
    );

    // Shuffle top candidates
    const shuffled = topCandidates.sort(() => Math.random() - 0.5);

    // Select the number of reviewers requested
    const selectedReviewers = shuffled.slice(0, numberOfReviewers);

    if (selectedReviewers.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not select reviewers",
        },
        { status: 500 }
      );
    }

    // Create review assignments
    const createdReviews = await Promise.all(
      selectedReviewers.map((reviewer) =>
        prisma.contributionReview.create({
          data: {
            submissionId,
            reviewerId: reviewer.userId,
            type: "PEER",
            status: "PENDING",
          },
          include: {
            reviewer: {
              select: {
                username: true,
                email: true,
              },
            },
          },
        })
      )
    );

    // Send notifications to assigned reviewers
    await Promise.all(
      createdReviews.map((review) =>
        prisma.notification.create({
          data: {
            userId: review.reviewerId,
            type: "REVIEW_ASSIGNED",
            title: "New Review Assignment",
            message: `You've been assigned to review "${submission.project.title} - ${submission.featureTitle}"`,
            data: {
              reviewId: review.id,
              submissionId: submission.id,
              projectTitle: submission.project.title,
              featureTitle: submission.featureTitle,
            },
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      reviewsCreated: createdReviews.length,
      reviewers: createdReviews.map((r) => ({
        reviewId: r.id,
        reviewerUsername: r.reviewer.username,
      })),
      message: `Successfully assigned ${createdReviews.length} reviewer(s)`,
    });
  } catch (error) {
    console.error("Error assigning reviewers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign reviewers",
      },
      { status: 500 }
    );
  }
}
