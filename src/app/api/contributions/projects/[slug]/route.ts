/**
 * API Route: GET /api/contributions/projects/[slug]
 *
 * Get detailed information about a specific contribution project
 * including features, requirements, review criteria, and user's submissions
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await params;

    // Fetch project
    const project = await prisma.contributionProject.findUnique({
      where: { slug },
      include: {
        submissions: {
          select: {
            id: true,
            userId: true,
            featureId: true,
            prStatus: true,
            grade: true,
            submittedAt: true,
            mergedAt: true,
            user: {
              select: {
                username: true,
                image: true,
              },
            },
          },
          orderBy: {
            submittedAt: "desc",
          },
          take: 10, // Recent submissions showcase
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // Check access permissions
    const userSubscription = session?.user?.subscription || "FREE";
    const hasAccess =
      !project.isPremium ||
      project.requiredPlan === "FREE" ||
      userSubscription === project.requiredPlan ||
      (project.requiredPlan === "VIBED" && userSubscription === "CRACKED");

    if (!hasAccess) {
      return NextResponse.json(
        {
          success: false,
          error: "Premium subscription required",
          requiredPlan: project.requiredPlan,
        },
        { status: 403 }
      );
    }

    // Get user's submissions for this project if logged in
    let userSubmissions = null;
    if (session?.user?.id) {
      userSubmissions = await prisma.contributionSubmission.findMany({
        where: {
          userId: session.user.id,
          projectId: project.id,
        },
        include: {
          reviews: {
            select: {
              id: true,
              type: true,
              status: true,
              overallScore: true,
              submittedAt: true,
            },
          },
        },
        orderBy: {
          submittedAt: "desc",
        },
      });
    }

    // Calculate project statistics
    const stats = {
      totalSubmissions: project.submissions.length,
      mergedSubmissions: project.submissions.filter((s) => s.prStatus === "MERGED")
        .length,
      avgGrade:
        project.submissions.filter((s) => s.grade !== null).length > 0
          ? project.submissions
              .filter((s) => s.grade !== null)
              .reduce((sum, s) => sum + (s.grade || 0), 0) /
            project.submissions.filter((s) => s.grade !== null).length
          : null,
    };

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        stats,
      },
      userSubmissions,
      hasAccess,
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project details",
      },
      { status: 500 }
    );
  }
}
