import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { StudyPlanService } from "@/lib/services/studyPlanService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get("language") || "web-development";

    // For now, only web development is supported
    if (language !== "web-development" && language !== "javascript") {
      return NextResponse.json(
        { error: "Language not supported yet" },
        { status: 400 }
      );
    }

    // Generate dynamic study plan from database content
    const studyPlan = await StudyPlanService.getWebDevelopmentStudyPlan();

    // Get or sync user progress with the dynamic study plan
    let userProgress = await StudyPlanService.getUserStudyPlanProgress(
      session.user.id,
      studyPlan.id
    );

    if (!userProgress) {
      // Sync existing progress with new study plan
      userProgress = await StudyPlanService.syncUserProgressWithStudyPlan(
        session.user.id,
        studyPlan
      );
    }

    return NextResponse.json({
      studyPlan,
      userProgress,
    });
  } catch (error) {
    console.error("Error fetching study plan:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
