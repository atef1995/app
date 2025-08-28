import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "ADMIN" && user?.role !== "INSTRUCTOR") {
      return NextResponse.json(
        { success: false, error: "Admin privileges required" },
        { status: 403 }
      );
    }

    // Fetch submissions with their review assignments and reviews
    const submissions = await prisma.projectSubmission.findMany({
      where: {
        status: { in: ["SUBMITTED", "UNDER_REVIEW", "REVIEWED"] },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            minReviews: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        reviewAssignments: {
          select: {
            id: true,
            status: true,
            type: true,
            reviewer: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            overallScore: true,
            status: true,
            reviewer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: [
        { submittedAt: "desc" },
      ],
      take: 100, // Limit to recent 100 submissions
    });

    return NextResponse.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    console.error("Error fetching admin submissions overview:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions overview" },
      { status: 500 }
    );
  }
}