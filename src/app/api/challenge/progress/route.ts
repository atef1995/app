import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ChallengeCodeProgressService } from "@/lib/services/challengeCodeProgressService";

// GET - Load saved code progress for a challenge
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get("challengeId");

    if (!challengeId) {
      return NextResponse.json(
        { error: "Challenge ID is required" },
        { status: 400 }
      );
    }

    // Find saved code progress
    const savedProgress = await ChallengeCodeProgressService.loadCodeProgress({
      userId: session.user.id,
      challengeId: challengeId,
    });

    return NextResponse.json({
      success: true,
      data: savedProgress,
    });
  } catch (error) {
    console.error("Error loading code progress:", error);
    return NextResponse.json(
      { error: "Failed to load code progress" },
      { status: 500 }
    );
  }
}

// POST - Save code progress for a challenge
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, code } = body;

    if (!challengeId || typeof code !== "string") {
      return NextResponse.json(
        { error: "Challenge ID and code are required" },
        { status: 400 }
      );
    }

    // Save or update code progress
    await ChallengeCodeProgressService.saveCodeProgress({
      userId: session.user.id,
      challengeId: challengeId,
      code: code,
    });

    return NextResponse.json({
      success: true,
      message: "Code progress saved successfully",
    });
  } catch (error) {
    console.error("Error saving code progress:", error);
    return NextResponse.json(
      { error: "Failed to save code progress" },
      { status: 500 }
    );
  }
}