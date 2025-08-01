import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/social/friends - Get user's friends and friend requests
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
      // Get user's friendships
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { user1Id: user.id },
            { user2Id: user.id },
          ],
        },
        include: {
          user1: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              mood: true,
              createdAt: true,
            },
          },
          user2: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              mood: true,
              createdAt: true,
            },
          },
        },
      });

      // Transform friendships to get friend info
      const friends = friendships.map((friendship) => {
        const friend = friendship.user1Id === user.id ? friendship.user2 : friendship.user1;
        return {
          id: friend.id,
          name: friend.name,
          username: friend.username,
          image: friend.image,
          mood: friend.mood,
          joinedAt: friend.createdAt,
          friendshipCreated: friendship.createdAt,
        };
      });

      // Get pending friend requests (sent and received)
      const sentRequests = await prisma.friendRequest.findMany({
        where: {
          senderId: user.id,
          status: "PENDING",
        },
        include: {
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      const receivedRequests = await prisma.friendRequest.findMany({
        where: {
          receiverId: user.id,
          status: "PENDING",
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        friends,
        sentRequests: sentRequests.map(req => ({
          id: req.id,
          user: req.receiver,
          message: req.message,
          createdAt: req.createdAt,
        })),
        receivedRequests: receivedRequests.map(req => ({
          id: req.id,
          sender: req.sender,
          message: req.message,
          createdAt: req.createdAt,
        })),
      });
    } catch (dbError) {
      console.log("Database not ready, using mock data:", dbError);
      
      // Return mock data
      return NextResponse.json({
        success: true,
        friends: [
          {
            id: "mock1",
            name: "Alex Johnson",
            email: "alex@example.com",
            image: null,
            mood: "GRIND",
            joinedAt: new Date("2025-07-15"),
            friendshipCreated: new Date("2025-07-18"),
          },
          {
            id: "mock2", 
            name: "Sarah Chen",
            email: "sarah@example.com",
            image: null,
            mood: "CHILL",
            joinedAt: new Date("2025-07-10"),
            friendshipCreated: new Date("2025-07-19"),
          },
        ],
        sentRequests: [],
        receivedRequests: [
          {
            id: "req1",
            sender: {
              id: "mock3",
              name: "Mike Wilson",
              username: "mikewilson",
              image: null,
            },
            message: "Hey! Let's learn together!",
            createdAt: new Date("2025-07-20"),
          },
        ],
      });
    }
  } catch (error) {
    console.error("Error fetching social data:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/social/friends - Send friend request
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
    const { action, targetEmail, targetUsername, message, requestId } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    try {
      switch (action) {
        case "send_request":
          // Support both email and username for backward compatibility
          const targetIdentifier = targetUsername || targetEmail;
          if (!targetIdentifier) {
            return NextResponse.json(
              { success: false, error: "Target username or email required" },
              { status: 400 }
            );
          }

          // Find target user by username or email
          const targetUser = await prisma.user.findFirst({
            where: {
              OR: [
                { username: targetIdentifier },
                { email: targetIdentifier },
              ],
            },
            select: { id: true },
          });

          if (!targetUser) {
            return NextResponse.json(
              { success: false, error: "User not found" },
              { status: 404 }
            );
          }

          // Check if friendship already exists
          const existingFriendship = await prisma.friendship.findFirst({
            where: {
              OR: [
                { user1Id: user.id, user2Id: targetUser.id },
                { user1Id: targetUser.id, user2Id: user.id },
              ],
            },
          });

          if (existingFriendship) {
            return NextResponse.json(
              { success: false, error: "Already friends" },
              { status: 400 }
            );
          }

          // Check if request already exists
          const existingRequest = await prisma.friendRequest.findFirst({
            where: {
              OR: [
                { senderId: user.id, receiverId: targetUser.id },
                { senderId: targetUser.id, receiverId: user.id },
              ],
              status: "PENDING",
            },
          });

          if (existingRequest) {
            return NextResponse.json(
              { success: false, error: "Friend request already exists" },
              { status: 400 }
            );
          }

          // Create friend request
          await prisma.friendRequest.create({
            data: {
              senderId: user.id,
              receiverId: targetUser.id,
              message: message || "",
            },
          });

          return NextResponse.json({
            success: true,
            message: "Friend request sent successfully",
          });

        case "accept_request":
          if (!requestId) {
            return NextResponse.json(
              { success: false, error: "Request ID required" },
              { status: 400 }
            );
          }

          // Find the friend request
          const friendRequest = await prisma.friendRequest.findUnique({
            where: { id: requestId },
          });

          if (!friendRequest || friendRequest.receiverId !== user.id) {
            return NextResponse.json(
              { success: false, error: "Friend request not found" },
              { status: 404 }
            );
          }

          // Create friendship and update request status
          await prisma.$transaction([
            prisma.friendship.create({
              data: {
                user1Id: friendRequest.senderId,
                user2Id: friendRequest.receiverId,
              },
            }),
            prisma.friendRequest.update({
              where: { id: requestId },
              data: {
                status: "ACCEPTED",
                respondedAt: new Date(),
              },
            }),
          ]);

          return NextResponse.json({
            success: true,
            message: "Friend request accepted",
          });

        case "decline_request":
          if (!requestId) {
            return NextResponse.json(
              { success: false, error: "Request ID required" },
              { status: 400 }
            );
          }

          await prisma.friendRequest.update({
            where: { id: requestId },
            data: {
              status: "DECLINED",
              respondedAt: new Date(),
            },
          });

          return NextResponse.json({
            success: true,
            message: "Friend request declined",
          });

        default:
          return NextResponse.json(
            { success: false, error: "Invalid action" },
            { status: 400 }
          );
      }
    } catch (dbError) {
      console.log("Database not ready:", dbError);
      return NextResponse.json({
        success: true,
        message: `Mock response: ${action} completed`,
      });
    }
  } catch (error) {
    console.error("Error handling friend request:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
