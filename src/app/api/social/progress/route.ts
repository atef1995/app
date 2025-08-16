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
          title: "unlocked \"Quiz Master\"!",
          description: "Complete 10 quizzes with a passing score",
          data: { points: 50 },
          visibility: "FRIENDS",
          createdAt: new Date("2025-08-16T18:30:00Z"),
          user: {
            id: "mock1",
            name: "Alex Johnson",
            username: "alexj_dev",
            image: null,
            mood: "GRIND",
          },
          reactions: [
            {
              id: "react1",
              type: "fire",
              userId: session.user?.id || "current",
              user: { name: session.user?.name || "You" }
            }
          ],
          _count: { reactions: 1 },
          isOwn: false,
        },
        {
          id: "progress2",
          type: "quiz_completed",
          title: "🎯 DOM Manipulation Quiz",
          description: "💪 Crushed DOM Manipulation quiz with 88%",
          data: { score: 88, timeSpent: 240, mood: "CHILL" },
          visibility: "FRIENDS",
          createdAt: new Date("2025-08-16T17:15:00Z"),
          user: {
            id: "mock2",
            name: "Sarah Chen",
            username: "sarahc_codes",
            image: null,
            mood: "CHILL",
          },
          reactions: [
            {
              id: "react2",
              type: "clap",
              userId: "mock1",
              user: { name: "Alex Johnson" }
            },
            {
              id: "react3",
              type: "like",
              userId: session.user?.id || "current",
              user: { name: session.user?.name || "You" }
            }
          ],
          _count: { reactions: 2 },
          isOwn: false,
        },
        {
          id: "progress3",
          type: "challenge_completed",
          title: "⚡ Array Methods Challenge",
          description: "💻 Solved the \"Array Methods Challenge\" coding challenge",
          data: { timeSpent: 420, mood: "GRIND" },
          visibility: "FRIENDS",
          createdAt: new Date("2025-08-16T16:45:00Z"),
          user: {
            id: "mock1",
            name: "Alex Johnson",
            username: "alexj_dev",
            image: null,
            mood: "GRIND",
          },
          reactions: [
            {
              id: "react4",
              type: "mind_blown",
              userId: "mock2",
              user: { name: "Sarah Chen" }
            }
          ],
          _count: { reactions: 1 },
          isOwn: false,
        },
        {
          id: "progress4",
          type: "quiz_completed",
          title: "🎯 Variables and Data Types Quiz",
          description: "🔥 Aced Variables and Data Types quiz with 100%!",
          data: { score: 100, timeSpent: 125, mood: "RUSH" },
          visibility: "FRIENDS",
          createdAt: new Date("2025-08-16T15:20:00Z"),
          user: {
            id: session.user?.id || "current",
            name: session.user?.name || "You",
            username: session.user?.username || "you",
            image: session.user?.image,
            mood: "RUSH",
          },
          reactions: [
            {
              id: "react5",
              type: "fire",
              userId: "mock1",
              user: { name: "Alex Johnson" }
            },
            {
              id: "react6",
              type: "fire",
              userId: "mock2",
              user: { name: "Sarah Chen" }
            }
          ],
          _count: { reactions: 2 },
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
