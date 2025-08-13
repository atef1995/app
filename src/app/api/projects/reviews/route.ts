import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ProjectService } from "@/lib/projectService";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    
    const statusFilter = statusParam ? statusParam.split(",") : ["ASSIGNED", "ACCEPTED"];

    const assignments = await ProjectService.getReviewAssignments(
      session.user.id,
      statusFilter
    );

    return NextResponse.json({
      success: true,
      data: assignments,
      count: assignments.length,
    });
  } catch (error) {
    console.error("Error fetching review assignments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch review assignments",
      },
      { status: 500 }
    );
  }
}