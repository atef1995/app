import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/settings - Get user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Get user basic info
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        mood: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // For now, return default settings based on user's current mood
    // TODO: Replace with actual UserSettings table data
    const settings = {
      preferredMood: user.mood.toLowerCase(),
      notifications: {
        email: true,
        reminders: true,
        achievements: true,
        weeklyProgress: false,
      },
      privacy: {
        showProfile: true,
        shareProgress: false,
        allowAnalytics: true,
      },
      learning: {
        dailyGoal: 30,
        reminderTime: "18:00",
        difficulty: "medium",
        autoSubmit: false,
      },
    };

    return NextResponse.json({
      success: true,
      settings: settings,
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/user/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, preferredMood } = body;
    // TODO: Extract other settings when UserSettings model is fully integrated
    // const { notifications, privacy, learning } = body;

    // Validate the settings data
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    // Update user's basic info (name and mood)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        mood: preferredMood?.toUpperCase() || "CHILL",
        // TODO: Add other settings to UserSettings table
      },
    });

    // TODO: Store other settings in a separate UserSettings table
    // For now, we'll just acknowledge the update

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
