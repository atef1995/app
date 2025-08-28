import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ProjectService } from "@/lib/projectService";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
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

    // Check if user is admin (you can implement your own admin check logic)
    const isAdmin = await ProjectService.isUserAdmin(session.user.id);
    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Admin privileges required",
        },
        { status: 403 }
      );
    }

    const { submissionId, adminUserId } = await request.json();

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          error: "Submission ID is required",
        },
        { status: 400 }
      );
    }

    await ProjectService.assignAdminReviewer(submissionId, adminUserId || session.user.id);

    return NextResponse.json({
      success: true,
      message: "Admin reviewer assigned successfully",
    });
  } catch (error) {
    console.error("Error assigning admin reviewer:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to assign admin reviewer",
      },
      { status: 500 }
    );
  }
}