import { NextRequest, NextResponse } from "next/server";
import { ProgressService } from "@/lib/progressService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const tutorialId = searchParams.get("tutorialId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_USER_ID", message: "User ID is required" },
        },
        { status: 400 }
      );
    }

    if (tutorialId) {
      // Get specific tutorial progress
      const progress = await ProgressService.getTutorialProgress(
        userId,
        tutorialId
      );
      return NextResponse.json({ success: true, data: progress });
    }

    // Get all tutorial progress for user
    const allProgress = await ProgressService.getTutorialProgress(userId);
    return NextResponse.json({ success: true, data: allProgress });
  } catch (error) {
    console.error("Error fetching tutorial progress:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch tutorial progress",
        },
      },
      { status: 500 }
    );
  }
}
