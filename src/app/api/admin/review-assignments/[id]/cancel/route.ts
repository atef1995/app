import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

    // Update assignment status to cancelled
    const assignment = await prisma.projectReviewAssignment.update({
      where: { id: assignmentId },
      data: {
        status: "CANCELLED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Assignment cancelled successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error cancelling review assignment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel assignment" },
      { status: 500 }
    );
  }
}