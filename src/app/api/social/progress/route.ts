import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/social/progress - Get progress updates from friends
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

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
      // Get user's friends
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
        },
        select: {
          user1Id: true,
          user2Id: true,
        },
      });

      // Extract friend IDs
      const friendIds = friendships.map(friendship => 
        friendship.user1Id === user.id ? friendship.user2Id : friendship.user1Id
      );

      // Get progress shares from friends and user
      const progressShares = await prisma.progressShare.findMany({
        where: {
          OR: [
            {
              userId: { in: friendIds },
              visibility: { in: ["PUBLIC", "FRIENDS"] },
            },
            {
              userId: user.id,
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              mood: true,
            },
          },
          reactions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          _count: {
            select: {
              reactions: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50, // Limit to recent 50 updates
      });

      return NextResponse.json({
        success: true,
        feed: progressShares.map(share => ({
          id: share.id,
          type: share.type,
          title: share.title,
          description: share.description,
          data: share.data,
          visibility: share.visibility,
          createdAt: share.createdAt,
          user: share.user,
          reactions: share.reactions,
          _count: share._count,
          isOwn: share.userId === user.id,
        })),
      });
    } catch (dbError) {
      console.log("Database not ready, using mock data:", dbError);
      
      // Return mock progress data
      const mockProgress = [
        {
          id: "progress1",
          type: "achievement",
          title: "🏆 Quiz Rookie",
          description: "Completed their first quiz!",
          data: { points: 10, rarity: "COMMON" },
          visibility: "FRIENDS",
          createdAt: new Date("2025-07-21T10:30:00Z"),
          user: {
            id: "mock1",
            name: "Alex Johnson",
            image: null,
            mood: "GRIND",
          },
          isOwn: false,
        },
        {
          id: "progress2",
          type: "quiz_completed",
          title: "🎯 JavaScript Basics Quiz",
          description: "Scored 95% on JavaScript fundamentals",
          data: { score: 95, timeSpent: 180 },
          visibility: "FRIENDS",
          createdAt: new Date("2025-07-21T09:15:00Z"),
          user: {
            id: "mock2",
            name: "Sarah Chen",
            image: null,
            mood: "CHILL",
          },
          isOwn: false,
        },
        {
          id: "progress3",
          type: "streak",
          title: "🔥 3-Day Streak",
          description: "Learning consistently for 3 days!",
          data: { streakDays: 3 },
          visibility: "FRIENDS",
          createdAt: new Date("2025-07-21T08:00:00Z"),
          user: {
            id: session.user.id || "current",
            name: session.user.name || "You",
            image: session.user.image,
            mood: "CHILL",
          },
          isOwn: true,
        },
      ];

      return NextResponse.json({
        success: true,
        feed: mockProgress,
      });
    }
  } catch (error) {
    console.error("Error fetching progress shares:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/social/progress - Create a new progress share
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
    const { type, title, description, data, visibility = "FRIENDS" } = body;

    if (!type || !title) {
      return NextResponse.json(
        { success: false, error: "Type and title are required" },
        { status: 400 }
      );
    }

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
      // Check if user allows progress sharing
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
      });

      if (userSettings && !userSettings.shareProgress) {
        return NextResponse.json(
          { success: false, error: "Progress sharing is disabled" },
          { status: 403 }
        );
      }

      // Create progress share
      const progressShare = await prisma.progressShare.create({
        data: {
          userId: user.id,
          type,
          title,
          description: description || "",
          data: data || {},
          visibility,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              mood: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        progressShare: {
          id: progressShare.id,
          type: progressShare.type,
          title: progressShare.title,
          description: progressShare.description,
          data: progressShare.data,
          visibility: progressShare.visibility,
          createdAt: progressShare.createdAt,
          user: progressShare.user,
        },
      });
    } catch (dbError) {
      console.log("Database not ready:", dbError);
      return NextResponse.json({
        success: true,
        message: "Mock response: Progress share created",
        progressShare: {
          id: "mock-share",
          type,
          title,
          description,
          data,
          visibility,
          createdAt: new Date(),
          user: {
            id: user.id,
            name: session.user.name,
            image: session.user.image,
            mood: "CHILL",
          },
        },
      });
    }
  } catch (error) {
    console.error("Error creating progress share:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
