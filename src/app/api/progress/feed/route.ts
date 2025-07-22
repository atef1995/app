import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/progress/feed - Get progress updates from friends
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

    // For now, return mock progress feed until Prisma client is regenerated
    const mockProgressFeed = [
      {
        id: "progress1",
        user: {
          id: "friend1",
          name: "Alice Johnson",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612c2d5?w=64&h=64&fit=crop&crop=face",
        },
        type: "achievement",
        title: "Unlocked Speed Demon ⚡",
        description: "Completed a quiz in under 2 minutes",
        data: { points: 100, category: "speed" },
        createdAt: new Date("2025-07-21T10:30:00"),
      },
      {
        id: "progress2",
        user: {
          id: "friend2",
          name: "Bob Smith",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        },
        type: "quiz_completed",
        title: "Aced JavaScript Basics Quiz",
        description: "Perfect score in 3 minutes!",
        data: { score: 100, timeSpent: 180, mood: "GRIND" },
        createdAt: new Date("2025-07-21T09:15:00"),
      },
      {
        id: "progress3",
        user: {
          id: "friend1",
          name: "Alice Johnson",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612c2d5?w=64&h=64&fit=crop&crop=face",
        },
        type: "streak",
        title: "5-Day Learning Streak! 🔥",
        description: "Consistency is key!",
        data: { streakDays: 5 },
        createdAt: new Date("2025-07-20T18:00:00"),
      },
      {
        id: "progress4",
        user: {
          id: "friend2",
          name: "Bob Smith",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        },
        type: "challenge_solved",
        title: "Solved Array Manipulation Challenge",
        description: "First try success in chill mode 😌",
        data: { difficulty: "medium", attempts: 1, mood: "CHILL" },
        createdAt: new Date("2025-07-20T14:22:00"),
      },
    ];

    return NextResponse.json({
      success: true,
      feed: mockProgressFeed,
    });
  } catch (error) {
    console.error("Error fetching progress feed:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/progress/share - Share a progress update
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
    const { type, title, description, visibility = "FRIENDS" } = body;
    // TODO: Use data when creating actual progress share
    // const { data } = body;

    if (!type || !title) {
      return NextResponse.json(
        { success: false, error: "Type and title are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // For now, just return success until Prisma client is regenerated
    // TODO: Create actual progress share in database
    return NextResponse.json({
      success: true,
      message: "Progress shared successfully!",
      share: {
        type,
        title,
        description,
        visibility,
        userName: user.name,
      },
    });
  } catch (error) {
    console.error("Error sharing progress:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
