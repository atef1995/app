import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";
import { AchievementService } from "@/lib/achievementService";

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

    // Mark tutorial as started
    const progress = await ProgressService.markTutorialStarted(
      session.user.id,
      tutorialId
    );

    // Check for "first tutorial" achievement
    const achievements = await AchievementService.checkAndUnlockAchievements({
      userId: session.user.id,
      action: "TUTORIAL_STARTED",
      metadata: {
        tutorialId,
      }
    });

    return NextResponse.json({
      success: true,
      progress,
      achievements, // Include unlocked achievements in response
    });
  } catch (error) {
    console.error("Error marking tutorial as started:", error);
    return NextResponse.json(
      { error: "Failed to mark tutorial as started" },
      { status: 500 }
    );
  }
}
