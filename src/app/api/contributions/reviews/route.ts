/**
 * API Route: GET /api/contributions/reviews
 *
 * Get all review assignments for the authenticated user
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

    // Fetch all review assignments for this user
    const assignments = await prisma.contributionReview.findMany({
      where: {
        reviewerId: session.user.id,
      },
      orderBy: [
        { status: "asc" }, // PENDING first
        { createdAt: "desc" },
      ],
      include: {
        submission: {
          select: {
            id: true,
            prTitle: true,
            featureTitle: true,
            githubPrUrl: true,
            ciPassed: true,
            testsPassed: true,
            lintPassed: true,
            project: {
              select: {
                title: true,
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
      },
    });

    // Calculate statistics
    const pending = assignments.filter((a) => a.status === "PENDING").length;
    const totalCompleted = assignments.filter(
      (a) => a.status !== "PENDING" && a.submittedAt !== null
    ).length;

    // Completed this week (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const completedThisWeek = assignments.filter(
      (a) =>
        a.status !== "PENDING" &&
        a.submittedAt !== null &&
        new Date(a.submittedAt) >= oneWeekAgo
    ).length;

    // Calculate average score from completed reviews
    const completedWithScores = assignments.filter(
      (a) => a.overallScore !== null && a.submittedAt !== null
    );
    const averageScore =
      completedWithScores.length > 0
        ? completedWithScores.reduce((sum, a) => sum + (a.overallScore || 0), 0) /
          completedWithScores.length
        : 0;

    // Format assignments for frontend
    const formattedAssignments = assignments.map((a) => ({
      id: a.id,
      submissionId: a.submissionId,
      status: a.status,
      type: a.type,
      createdAt: a.createdAt.toISOString(),
      submittedAt: a.submittedAt?.toISOString() || null,
      overallScore: a.overallScore,
      submission: {
        prTitle: a.submission.prTitle,
        featureTitle: a.submission.featureTitle,
        githubPrUrl: a.submission.githubPrUrl,
        ciPassed: a.submission.ciPassed,
        testsPassed: a.submission.testsPassed,
        lintPassed: a.submission.lintPassed,
        project: {
          title: a.submission.project.title,
        },
        user: {
          username: a.submission.user.username,
          image: a.submission.user.image,
        },
      },
    }));

    return NextResponse.json({
      success: true,
      data: {
        assignments: formattedAssignments,
        stats: {
          pending,
          completedThisWeek,
          totalCompleted,
          averageScore,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching review queue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch review queue",
      },
      { status: 500 }
    );
  }
}
