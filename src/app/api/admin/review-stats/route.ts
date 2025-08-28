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

    // Get review assignment statistics
    const [
      totalAssignments,
      pendingAssignments,
      acceptedAssignments,
      completedAssignments,
      expiredAssignments,
      rejectedAssignments,
      submissionsAwaitingReview,
    ] = await Promise.all([
      prisma.projectReviewAssignment.count(),
      prisma.projectReviewAssignment.count({ where: { status: "ASSIGNED" } }),
      prisma.projectReviewAssignment.count({ where: { status: "ACCEPTED" } }),
      prisma.projectReviewAssignment.count({ where: { status: "COMPLETED" } }),
      prisma.projectReviewAssignment.count({ where: { status: "EXPIRED" } }),
      prisma.projectReviewAssignment.count({ where: { status: "REJECTED" } }),
      prisma.projectSubmission.count({
        where: {
          status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
        },
      }),
    ]);

    // Calculate average completion time for completed assignments
    const completedAssignmentsWithTimes = await prisma.projectReviewAssignment.findMany({
      where: {
        status: "COMPLETED",
        acceptedAt: { not: null },
        completedAt: { not: null },
      },
      select: {
        acceptedAt: true,
        completedAt: true,
      },
    });

    let averageCompletionTime = 0;
    if (completedAssignmentsWithTimes.length > 0) {
      const totalTime = completedAssignmentsWithTimes.reduce((sum, assignment) => {
        if (assignment.acceptedAt && assignment.completedAt) {
          return sum + (assignment.completedAt.getTime() - assignment.acceptedAt.getTime());
        }
        return sum;
      }, 0);
      
      averageCompletionTime = Math.round(totalTime / completedAssignmentsWithTimes.length / (1000 * 60 * 60)); // in hours
    }

    const stats = {
      totalAssignments,
      pendingAssignments,
      acceptedAssignments,
      completedAssignments,
      expiredAssignments,
      rejectedAssignments,
      averageCompletionTime,
      submissionsAwaitingReview,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching admin review stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch review stats" },
      { status: 500 }
    );
  }
}