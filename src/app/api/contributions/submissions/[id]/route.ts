/**
 * API Route: GET/PUT /api/contributions/submissions/[id]
 *
 * Get or update a submission's status
 *
 * GET: Fetch submission details including reviews and CI status
 * PUT: Update submission (used for resubmissions after changes)
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGitHubService } from "@/lib/services/githubService";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const submission = await prisma.contributionSubmission.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            slug: true,
            title: true,
            githubRepoUrl: true,
            xpReward: true,
          },
        },
        user: {
          select: {
            username: true,
            githubUsername: true,
            image: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
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

    // Check if user has permission to view
    const isOwner = session?.user?.id === submission.userId;
    const isReviewer = submission.reviews.some(
      (r) => r.reviewerId === session?.user?.id
    );
    const isAdmin = session?.user?.role === "ADMIN";

    if (!isOwner && !isReviewer && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "You don't have permission to view this submission",
        },
        { status: 403 }
      );
    }

    // If user is logged in and has GitHub connected, refresh CI status
    let updatedCiStatus = null;
    if (session?.user?.id && isOwner) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { githubAccessToken: true },
      });

      if (user?.githubAccessToken) {
        try {
          const githubService = createGitHubService(user.githubAccessToken);
          const ciStatus = await githubService.checkCIStatus(
            submission.githubPrUrl
          );
          updatedCiStatus = ciStatus;

          // Update submission if CI status changed
          if (ciStatus.ciPassed !== submission.ciPassed) {
            await prisma.contributionSubmission.update({
              where: { id },
              data: {
                ciPassed: ciStatus.ciPassed,
                testsPassed: ciStatus.checks.some((c) =>
                  c.name.toLowerCase().includes("test")
                ),
                lintPassed: ciStatus.checks.some((c) =>
                  c.name.toLowerCase().includes("lint")
                ),
              },
            });
          }
        } catch (error) {
          console.error("Failed to refresh CI status:", error);
        }
      }
    }

    // Calculate review progress
    const reviewStats = {
      peerReviewsCompleted: submission.reviews.filter(
        (r) => r.type === "PEER" && r.status === "COMPLETED"
      ).length,
      peerReviewsNeeded: submission.peerReviewsNeeded,
      mentorReviewStatus: submission.mentorReviewStatus,
      averageScore:
        submission.reviews.filter((r) => r.overallScore !== null).length > 0
          ? submission.reviews
              .filter((r) => r.overallScore !== null)
              .reduce((sum, r) => sum + (r.overallScore || 0), 0) /
            submission.reviews.filter((r) => r.overallScore !== null).length
          : null,
    };

    return NextResponse.json({
      success: true,
      submission: {
        ...submission,
        reviewStats,
        ciStatus: updatedCiStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submission",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const { id } = await params;
    // Body could be used for partial updates in future
    await request.json();

    // Fetch existing submission
    const submission = await prisma.contributionSubmission.findUnique({
      where: { id },
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

    // Check ownership
    if (submission.userId !== session.user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "You can only update your own submissions",
        },
        { status: 403 }
      );
    }

    // Get user's GitHub token
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { githubAccessToken: true },
    });

    if (!user?.githubAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "GitHub account not connected",
        },
        { status: 400 }
      );
    }

    // Refresh PR information from GitHub
    const githubService = createGitHubService(user.githubAccessToken);

    let prInfo;
    try {
      prInfo = await githubService.verifyPR(submission.githubPrUrl);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to verify PR: ${(error as Error).message}`,
        },
        { status: 400 }
      );
    }

    // Check CI status
    const ciStatus = await githubService.checkCIStatus(submission.githubPrUrl);

    // Update submission
    const updated = await prisma.contributionSubmission.update({
      where: { id },
      data: {
        prStatus: prInfo.state === "open" ? "OPEN" : prInfo.merged ? "MERGED" : "CLOSED",
        prTitle: prInfo.title,
        prDescription: prInfo.description || "",
        ciPassed: ciStatus.ciPassed,
        testsPassed: ciStatus.checks.some((c) =>
          c.name.toLowerCase().includes("test")
        ),
        lintPassed: ciStatus.checks.some((c) =>
          c.name.toLowerCase().includes("lint")
        ),
        mergedAt: prInfo.merged ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      submission: updated,
      message: "Submission updated successfully",
    });
  } catch (error) {
    console.error("Error updating submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update submission",
      },
      { status: 500 }
    );
  }
}
