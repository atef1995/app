import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";
import { AchievementService } from "@/lib/achievementService";
import { StudyPlanService } from "@/lib/services/studyPlanService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { tutorialId } = body;

    if (!tutorialId) {
      return NextResponse.json(
        { error: "Missing required field: tutorialId" },
        { status: 400 }
      );
    }

    // Mark tutorial as completed
    const progress = await ProgressService.markTutorialCompleted(
      session.user.id,
      tutorialId
    );

    // Update study plan progress with time tracking
    try {
      await StudyPlanService.updateStudyPlanProgressOnCompletion(
        session.user.id,
        "tutorial", 
        tutorialId
      );
    } catch (error) {
      console.warn("Failed to update study plan progress:", error);
      // Don't fail the whole request if study plan update fails
    }

    // Check for tutorial completion achievements
    const achievements = await AchievementService.checkAndUnlockAchievements({
      userId: session.user.id,
      action: "TUTORIAL_COMPLETED",
      metadata: {
        tutorialId,
      },
    });

    return NextResponse.json({
      success: true,
      progress,
      achievements,
    });
  } catch (error) {
    console.error("Error marking tutorial as completed:", error);
    return NextResponse.json(
      { error: "Failed to mark tutorial as completed" },
      { status: 500 }
    );
  }
}
