import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tutorialIds = searchParams.get("tutorialIds")?.split(",").filter(Boolean);

    if (!tutorialIds?.length) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    // Fetch all tutorial progress in a single query
    const progressData = await prisma.tutorialProgress.findMany({
      where: {
        userId: session.user.id,
        tutorialId: {
          in: tutorialIds,
        },
      },
      select: {
        id: true,
        tutorialId: true,
        status: true,
        quizPassed: true,
        quizAttempts: true,
        bestScore: true,
        completedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error("Error fetching bulk tutorial progress:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tutorial progress",
      },
      { status: 500 }
    );
  }
}