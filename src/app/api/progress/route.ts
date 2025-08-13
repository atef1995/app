import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "tutorial" | "challenge" | "project" | "stats"
    const id = searchParams.get("id");

    if (type === "tutorial") {
      const progress = await ProgressService.getTutorialProgress(
        session.user.id,
        id || undefined
      );
      return NextResponse.json({ success: true, progress });
    }

    if (type === "challenge") {
      const progress = await ProgressService.getChallengeProgress(
        session.user.id,
        id || undefined
      );
      return NextResponse.json({ success: true, progress });
    }

    if (type === "project") {
      const progress = await ProgressService.getProjectProgress(
        session.user.id,
        id || undefined
      );
      return NextResponse.json({ success: true, progress });
    }

    if (type === "stats") {
      const stats = await ProgressService.getUserStats(session.user.id);
      return NextResponse.json({ success: true, stats });
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
