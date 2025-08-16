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

    // Get user basic info and settings
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        mood: true,
        userSettings: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Use actual settings from database or defaults
    const userSettings = user.userSettings;
    const settings = {
      preferredMood: user.mood.toLowerCase(),
      notifications: {
        email: userSettings?.emailNotifications ?? true,
        reminders: userSettings?.reminderNotifications ?? true,
        achievements: userSettings?.achievementNotifications ?? true,
        weeklyProgress: userSettings?.weeklyProgressReports ?? false,
      },
      privacy: {
        showProfile: userSettings?.showPublicProfile ?? true,
        shareProgress: userSettings?.shareProgress ?? true,
        allowAnalytics: userSettings?.allowAnalytics ?? true,
      },
      learning: {
        dailyGoal: userSettings?.dailyGoalMinutes ?? 30,
        reminderTime: userSettings?.reminderTime ?? "18:00",
        difficulty: userSettings?.difficulty?.toLowerCase() ?? "medium",
        autoSubmit: userSettings?.autoSubmit ?? false,
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
    const { name, preferredMood, notifications, privacy, learning } = body;

    // Validate the settings data
    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
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

    // Update user's basic info (name and mood)
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: name.trim(),
        mood: preferredMood?.toUpperCase() || "CHILL",
      },
    });

    // Update or create user settings
    await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        emailNotifications: notifications?.email ?? true,
        reminderNotifications: notifications?.reminders ?? true,
        achievementNotifications: notifications?.achievements ?? true,
        weeklyProgressReports: notifications?.weeklyProgress ?? false,
        showPublicProfile: privacy?.showProfile ?? true,
        shareProgress: privacy?.shareProgress ?? true,
        allowAnalytics: privacy?.allowAnalytics ?? true,
        dailyGoalMinutes: learning?.dailyGoal ?? 30,
        reminderTime: learning?.reminderTime ?? "18:00",
        difficulty: learning?.difficulty?.toUpperCase() ?? "MEDIUM",
        autoSubmit: learning?.autoSubmit ?? false,
      },
      create: {
        userId: user.id,
        emailNotifications: notifications?.email ?? true,
        reminderNotifications: notifications?.reminders ?? true,
        achievementNotifications: notifications?.achievements ?? true,
        weeklyProgressReports: notifications?.weeklyProgress ?? false,
        showPublicProfile: privacy?.showProfile ?? true,
        shareProgress: privacy?.shareProgress ?? true,
        allowAnalytics: privacy?.allowAnalytics ?? true,
        dailyGoalMinutes: learning?.dailyGoal ?? 30,
        reminderTime: learning?.reminderTime ?? "18:00",
        difficulty: learning?.difficulty?.toUpperCase() ?? "MEDIUM",
        autoSubmit: learning?.autoSubmit ?? false,
      },
    });

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
