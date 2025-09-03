import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";
import { StudyPlanService } from "@/lib/services/studyPlanService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, code, passed, timeSpent } = body;

    if (!challengeId || !code || typeof passed !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await ProgressService.submitChallengeAttempt(
      session.user.id,
      {
        challengeId,
        code,
        passed,
        timeSpent: timeSpent || 0,
        ChallengeMoodAdaptation: session.user.mood || "CHILL",
      }
    );

    // Update study plan progress if challenge was passed
    if (passed && challengeId) {
      try {
        await StudyPlanService.updateStudyPlanProgressOnCompletion(
          session.user.id,
          "challenge",
          challengeId
        );
      } catch (error) {
        console.warn("Failed to update study plan progress:", error);
        // Don't fail the whole request if study plan update fails
      }
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error submitting challenge:", error);
    return NextResponse.json(
      { error: "Failed to submit challenge" },
      { status: 500 }
    );
  }
}
