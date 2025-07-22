import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/friends - Get user's friends and friend requests
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

    // For now, return mock data until Prisma client is regenerated
    const mockFriends = [
      {
        id: "friend1",
        name: "Alice Johnson",
        email: "alice@example.com",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612c2d5?w=64&h=64&fit=crop&crop=face",
        totalPoints: 850,
        currentStreak: 5,
        mood: "GRIND",
        lastActive: new Date("2025-07-21"),
        friendsSince: new Date("2025-07-10"),
      },
      {
        id: "friend2",
        name: "Bob Smith",
        email: "bob@example.com", 
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
        totalPoints: 1200,
        currentStreak: 12,
        mood: "CHILL",
        lastActive: new Date("2025-07-20"),
        friendsSince: new Date("2025-07-05"),
      },
    ];

    const mockFriendRequests = [
      {
        id: "req1",
        sender: {
          id: "user3",
          name: "Charlie Brown",
          email: "charlie@example.com",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
        },
        message: "Hey! Found you through the leaderboard. Let's learn together!",
        createdAt: new Date("2025-07-21"),
      },
    ];

    return NextResponse.json({
      success: true,
      friends: mockFriends,
      friendRequests: mockFriendRequests,
      friendCount: mockFriends.length,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/friends - Send friend request
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
    const { email } = body;
    // TODO: Use message when creating actual friend request
    // const { message } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Current user not found" },
        { status: 404 }
      );
    }

    if (currentUser.id === targetUser.id) {
      return NextResponse.json(
        { success: false, error: "Cannot send friend request to yourself" },
        { status: 400 }
      );
    }

    // For now, just return success until Prisma client is regenerated
    // TODO: Create actual friend request in database
    return NextResponse.json({
      success: true,
      message: "Friend request sent successfully!",
      targetUser: {
        name: targetUser.name,
        email: targetUser.email,
      },
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
