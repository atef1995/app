import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProgressService } from "@/lib/progressService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: "Missing required field: challengeId" },
        { status: 400 }
      );
    }

    // Mark challenge as started
    const progress = await ProgressService.markChallengeStarted(
      session.user.id,
      challengeId
    );

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Error marking challenge as started:", error);
    return NextResponse.json(
      { error: "Failed to mark challenge as started" },
      { status: 500 }
    );
  }
}
