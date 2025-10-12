/**
 * API Route: GET /api/contributions/dashboard
 *
 * Get dashboard data for authenticated user
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
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

    // Fetch user's submissions
    const submissions = await prisma.contributionSubmission.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        submittedAt: "desc",
      },
      include: {
        project: {
          select: {
            slug: true,
            title: true,
            xpReward: true,
          },
        },
      },
    });

    // Fetch review assignments (reviews assigned to this user)
    const reviewAssignments = await prisma.contributionReview.findMany({
      where: {
        reviewerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        submission: {
          select: {
            id: true,
            prTitle: true,
            featureTitle: true,
            project: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    // Calculate stats
    const totalSubmissions = submissions.length;
    const mergedPRs = submissions.filter((s) => s.prStatus === "MERGED").length;
    const reviewsGiven = reviewAssignments.filter((r) => r.submittedAt !== null).length;

    // Calculate XP earned from merged PRs
    const xpEarned = submissions
      .filter((s) => s.prStatus === "MERGED")
      .reduce((sum, s) => sum + s.project.xpReward, 0);

    // Calculate streak (consecutive days with activity)
    // For simplicity, counting as 0 - implement proper streak logic later
    const currentStreak = 0;

    // Format submissions for frontend
    const submissionSummaries = submissions.map((s) => ({
      id: s.id,
      prTitle: s.prTitle,
      prStatus: s.prStatus,
      featureTitle: s.featureTitle,
      projectTitle: s.project.title,
      githubPrUrl: s.githubPrUrl,
      submittedAt: s.submittedAt.toISOString(),
      peerReviewsReceived: s.peerReviewsReceived,
      peerReviewsNeeded: s.peerReviewsNeeded,
      ciPassed: s.ciPassed,
    }));

    // Format review assignments for frontend
    const reviewAssignmentSummaries = reviewAssignments.map((r) => ({
      id: r.id,
      submissionId: r.submissionId,
      prTitle: r.submission.prTitle,
      featureTitle: r.submission.featureTitle,
      projectTitle: r.submission.project.title,
      status: r.status,
      assignedAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissionSummaries,
        reviewAssignments: reviewAssignmentSummaries,
        stats: {
          totalSubmissions,
          mergedPRs,
          reviewsGiven,
          xpEarned,
          currentStreak,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
      },
      { status: 500 }
    );
  }
}
