import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/user/delete - Delete user account
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user ID first
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

    // Delete all user-related data in the correct order (due to foreign key constraints)
    await prisma.$transaction(async (tx) => {
      // Delete progress records first
      await tx.tutorialProgress.deleteMany({
        where: { userId: user.id },
      });

      await tx.challengeProgress.deleteMany({
        where: { userId: user.id },
      });

      await tx.progress.deleteMany({
        where: { userId: user.id },
      });

      // Delete attempts
      await tx.challengeAttempt.deleteMany({
        where: { userId: user.id },
      });

      await tx.quizAttempt.deleteMany({
        where: { userId: user.id },
      });

      // Delete payments and subscriptions
      await tx.payment.deleteMany({
        where: { userId: user.id },
      });

      await tx.subscription.deleteMany({
        where: { userId: user.id },
      });

      // Delete user sessions
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      // Delete accounts
      await tx.account.deleteMany({
        where: { userId: user.id },
      });

      // Finally delete the user
      await tx.user.delete({
        where: { id: user.id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
