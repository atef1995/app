import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ProjectService } from "@/lib/projectService";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: NextRequest,
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

    const { id: assignmentId } = await params;
    const body = await request.json();
    
    const {
      action,
      overallScore,
      criteriaScores,
      strengths,
      improvements,
      suggestions,
      timeSpent,
    } = body;

    if (action === "accept") {
      await ProjectService.acceptReviewAssignment(assignmentId, session.user.id);
      
      return NextResponse.json({
        success: true,
        message: "Review assignment accepted",
      });
    } else if (action === "reject") {
      const { reason } = body;
      await ProjectService.rejectReviewAssignment(assignmentId, session.user.id, reason);
      
      return NextResponse.json({
        success: true,
        message: "Review assignment rejected",
      });
    } else if (action === "submit") {
      // Validate review data
      if (overallScore === undefined || overallScore < 0 || overallScore > 100) {
        return NextResponse.json(
          {
            success: false,
            error: "Overall score must be between 0 and 100",
          },
          { status: 400 }
        );
      }

      if (!criteriaScores || typeof criteriaScores !== "object") {
        return NextResponse.json(
          {
            success: false,
            error: "Criteria scores are required",
          },
          { status: 400 }
        );
      }

      await ProjectService.submitReview(assignmentId, session.user.id, {
        overallScore,
        criteriaScores,
        strengths,
        improvements,
        suggestions,
        timeSpent,
      });

      return NextResponse.json({
        success: true,
        message: "Review submitted successfully",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid action. Must be 'accept', 'reject', or 'submit'",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing review action:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process review action",
      },
      { status: 500 }
    );
  }
}