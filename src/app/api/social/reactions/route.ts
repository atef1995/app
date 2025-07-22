import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { progressShareId, type } = await request.json();

    if (!progressShareId || !type) {
      return NextResponse.json(
        { error: "Progress share ID and reaction type are required" },
        { status: 400 }
      );
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already reacted with this type
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        userId_progressShareId: {
          userId: user.id,
          progressShareId: progressShareId,
        },
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if same type clicked again
        await prisma.reaction.delete({
          where: { id: existingReaction.id },
        });
        return NextResponse.json({ message: "Reaction removed" });
      } else {
        // Update reaction type if different type clicked
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type },
        });
        return NextResponse.json({ message: "Reaction updated" });
      }
    } else {
      // Create new reaction
      await prisma.reaction.create({
        data: {
          userId: user.id,
          progressShareId,
          type,
        },
      });

      // Create notification for the progress share owner
      const progressShare = await prisma.progressShare.findUnique({
        where: { id: progressShareId },
        select: { userId: true, title: true },
      });

      if (progressShare && progressShare.userId !== user.id) {
        await prisma.notification.create({
          data: {
            userId: progressShare.userId,
            type: "reaction",
            title: "Someone reacted to your progress",
            message: `${session.user.name} reacted to "${progressShare.title}"`,
            data: {
              progressShareId,
              reactionType: type,
              fromUserId: user.id,
              fromUserName: session.user.name,
            },
          },
        });
      }

      return NextResponse.json({ message: "Reaction added" });
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
