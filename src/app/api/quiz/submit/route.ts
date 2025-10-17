import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";
import { StudyPlanService } from "@/lib/services/studyPlanService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized - please sign up to submit quizzes",
          code: "AUTHENTICATION_REQUIRED",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tutorialId, answers, timeSpent, quizData, quizId } = body;
    console.log({ body });

    if (!tutorialId || !answers || !quizData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await ProgressService.submitQuizAttempt(
      session.user.id,
      {
        quizId,
        tutorialId,
        answers,
        timeSpent: timeSpent || 0,
        ChallengeMoodAdaptation: session.user.mood || "CHILL",
      },
      quizData
    );

    // Update study plan progress if quiz was passed
    if (result.passed && quizId) {
      try {
        await StudyPlanService.updateStudyPlanProgressOnCompletion(
          session.user.id,
          "quiz",
          quizId
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
    console.error("Error submitting quiz:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}
