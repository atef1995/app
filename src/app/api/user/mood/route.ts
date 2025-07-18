import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { mood } = body;

    // Validate mood value
    const validMoods = ["CHILL", "RUSH", "GRIND"];
    if (!mood || !validMoods.includes(mood)) {
      return NextResponse.json(
        { error: "Invalid mood. Must be one of: CHILL, RUSH, GRIND" },
        { status: 400 }
      );
    }

    // Update user's mood in database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        mood: mood,
      },
      select: {
        id: true,
        mood: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user mood:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
