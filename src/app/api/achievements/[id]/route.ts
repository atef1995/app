import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/achievements/[id] - Get a specific achievement (public endpoint)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const sharedBy = searchParams.get('sharedBy'); // Optional user ID who shared this

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Achievement ID is required" },
        { status: 400 }
      );
    }

    // Get the achievement from database (public info only)
    const achievement = await prisma.achievement.findUnique({
      where: { id },
      select: {
        id: true,
        key: true,
        title: true,
        description: true,
        icon: true,
        category: true,
        rarity: true,
        points: true,
        requirementValue: true,
      },
    });

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: "Achievement not found" },
        { status: 404 }
      );
    }

    // Get sharer information if provided
    let sharer = null;
    if (sharedBy) {
      const sharerData = await prisma.user.findUnique({
        where: { id: sharedBy },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          // Check if they actually have this achievement
          achievements: {
            where: { achievementId: id },
            select: {
              unlockedAt: true,
            },
          },
        },
      });

      if (sharerData && sharerData.achievements.length > 0) {
        sharer = {
          id: sharerData.id,
          name: sharerData.name,
          username: sharerData.username,
          image: sharerData.image,
          unlockedAt: sharerData.achievements[0].unlockedAt,
        };
      }
    }

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: "Achievement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      achievement: {
        ...achievement,
        maxProgress: achievement.requirementValue,
        isUnlocked: false, // Default for public view
        unlockedAt: null,
        progress: 0,
      },
      sharer, // Include sharer information
    });
  } catch (error) {
    console.error("Error fetching achievement:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
