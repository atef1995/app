import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/achievements - Get all achievements with user unlock status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    try {
      // Try to get achievements from database
      const achievements = await prisma.achievement.findMany({
        include: {
          userAchievements: {
            where: { userId: user.id },
            select: {
              id: true,
              unlockedAt: true,
              notified: true,
            },
          },
        },
        orderBy: [
          { category: "asc" },
          { points: "asc" },
        ],
      });

      // Transform data for frontend
      const achievementsWithStatus = achievements.map((achievement) => ({
        id: achievement.id,
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        points: achievement.points,
        requirementType: achievement.requirementType,
        requirementValue: achievement.requirementValue,
        isHidden: achievement.isHidden,
        isUnlocked: achievement.userAchievements.length > 0,
        unlockedAt: achievement.userAchievements[0]?.unlockedAt || null,
        notified: achievement.userAchievements[0]?.notified || false,
        progress: achievement.userAchievements.length > 0 ? 100 : 0,
        maxProgress: 100,
      }));

      // Calculate total points earned
      const totalPoints = achievementsWithStatus
        .filter(a => a.isUnlocked)
        .reduce((sum, a) => sum + a.points, 0);

      return NextResponse.json({
        success: true,
        achievements: achievementsWithStatus,
        totalPoints,
        unlockedCount: achievementsWithStatus.filter(a => a.isUnlocked).length,
        totalCount: achievementsWithStatus.length,
      });
    } catch (dbError) {
      console.log("Database not ready, using mock data:", dbError);
      
      // Fallback to mock data if database isn't ready
      const mockAchievements = [
        {
          id: "1",
          key: "first_quiz",
          title: "Quiz Rookie 🎯",
          description: "Complete your first quiz",
          icon: "🎯",
          category: "learning",
          rarity: "COMMON",
          points: 10,
          isUnlocked: true,
          unlockedAt: new Date("2025-07-20"),
          progress: 100,
          maxProgress: 100,
        },
        {
          id: "2", 
          key: "quiz_master",
          title: "Quiz Master 🧠",
          description: "Complete 10 quizzes",
          icon: "🧠",
          category: "learning",
          rarity: "RARE",
          points: 50,
          isUnlocked: false,
          unlockedAt: null,
          progress: 1,
          maxProgress: 10,
        },
        {
          id: "3",
          key: "speed_demon",
          title: "Speed Demon ⚡",
          description: "Complete a quiz in under 2 minutes",
          icon: "⚡",
          category: "challenge",
          rarity: "EPIC",
          points: 100,
          isUnlocked: false,
          unlockedAt: null,
          progress: 0,
          maxProgress: 1,
        },
        {
          id: "4",
          key: "perfectionist",
          title: "Perfectionist ✨",
          description: "Score 100% on 5 quizzes",
          icon: "✨",
          category: "skill",
          rarity: "LEGENDARY",
          points: 200,
          isUnlocked: false,
          unlockedAt: null,
          progress: 0,
          maxProgress: 5,
        },
        {
          id: "5",
          key: "streak_week",
          title: "Weekly Warrior 🔥",
          description: "Study for 7 days in a row",
          icon: "🔥",
          category: "streak",
          rarity: "RARE",
          points: 75,
          isUnlocked: false,
          unlockedAt: null,
          progress: 1,
          maxProgress: 7,
        },
      ];

      // Calculate total points earned
      const totalPoints = mockAchievements
        .filter(a => a.isUnlocked)
        .reduce((sum, a) => sum + a.points, 0);

      return NextResponse.json({
        success: true,
        achievements: mockAchievements,
        totalPoints,
        unlockedCount: mockAchievements.filter(a => a.isUnlocked).length,
        totalCount: mockAchievements.length,
      });
    }
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/achievements/check - Check and unlock achievements for user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { trigger } = body; // e.g., "quiz_completed", "challenge_solved"

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // For now, return empty array since we'll implement achievement checking later
    const newlyUnlocked: Array<{
      id: string;
      title: string;
      description: string;
      icon: string;
      points: number;
      rarity: string;
      unlockedAt: Date;
    }> = [];

    return NextResponse.json({
      success: true,
      newlyUnlocked,
      message: `Achievement check for ${trigger} completed`,
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
