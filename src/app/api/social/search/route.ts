import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    // Search for users by username or name (case insensitive, partial match)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
            },
          },
          {
            name: {
              contains: query,
            },
          },
        ],
        NOT: {
          email: session.user.email, // Exclude current user
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        updatedAt: true, // Use updatedAt as last active indicator
      },
      take: 10, // Limit results to prevent overwhelming UI
    });

    // Filter out users who are already friends or have pending requests
    const currentUserId = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get existing friend relationships and pending requests
    const existingRelationships = await prisma.friendRequest.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId.id,
            receiverId: { in: users.map(u => u.id) },
          },
          {
            senderId: { in: users.map(u => u.id) },
            receiverId: currentUserId.id,
          },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
        status: true,
      },
    });

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          {
            user1Id: currentUserId.id,
            user2Id: { in: users.map(u => u.id) },
          },
          {
            user1Id: { in: users.map(u => u.id) },
            user2Id: currentUserId.id,
          },
        ],
      },
      select: {
        user1Id: true,
        user2Id: true,
      },
    });

    // Create sets of user IDs to exclude
    const requestUserIds = new Set(
      existingRelationships.map(rel => 
        rel.senderId === currentUserId.id ? rel.receiverId : rel.senderId
      )
    );

    const friendUserIds = new Set(
      friendships.map(friendship => 
        friendship.user1Id === currentUserId.id ? friendship.user2Id : friendship.user1Id
      )
    );

    // Filter out users with existing relationships
    const availableUsers = users.filter(user => 
      !requestUserIds.has(user.id) && !friendUserIds.has(user.id)
    ).map(user => ({
      ...user,
      lastActive: user.updatedAt,
      isOnline: new Date().getTime() - new Date(user.updatedAt).getTime() < 5 * 60 * 1000, // Online if active within 5 minutes
    }));

    return NextResponse.json({ users: availableUsers });
  } catch (error) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
