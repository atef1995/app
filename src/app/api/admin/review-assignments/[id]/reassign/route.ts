import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProjectService } from "@/lib/projectService";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id: assignmentId } = await params;

    // Get the assignment details
    const assignment = await prisma.projectReviewAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        submission: {
          include: {
            project: {
              select: {
                minReviews: true,
                category: true,
                difficulty: true,
              },
            },
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        { success: false, error: "Assignment not found" },
        { status: 404 }
      );
    }

    // Cancel the current assignment
    await prisma.projectReviewAssignment.update({
      where: { id: assignmentId },
      data: {
        status: "CANCELLED",
      },
    });

    // Find and assign a new reviewer
    const potentialReviewers = await ProjectService['findPotentialReviewers'](
      assignment.submission.userId,
      assignment.submission.project.category,
      assignment.submission.project.difficulty,
      1
    );

    if (potentialReviewers.length > 0) {
      // Assign new peer reviewer
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      await prisma.projectReviewAssignment.create({
        data: {
          submissionId: assignment.submissionId,
          reviewerId: potentialReviewers[0],
          priority: assignment.priority,
          dueDate,
          status: "ASSIGNED",
          type: "PEER",
          expiredAt: new Date(),
          rejectedAt: new Date(),
          rejectionReason: "",
        },
      });
    } else {
      // Assign admin reviewer as fallback
      await ProjectService.assignAdminReviewer(assignment.submissionId);
    }

    return NextResponse.json({
      success: true,
      message: "Assignment reassigned successfully",
    });
  } catch (error) {
    console.error("Error reassigning review assignment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reassign assignment" },
      { status: 500 }
    );
  }
}