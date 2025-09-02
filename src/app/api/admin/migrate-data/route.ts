import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DataMigrationService } from "@/lib/services/dataMigrationService";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admins to run migrations
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    let result;

    switch (action) {
      case "fix-prerequisites":
        await DataMigrationService.fixPrerequisiteFormats();
        result = { message: "Prerequisites fixed successfully" };
        break;

      case "clean-progress":
        await DataMigrationService.cleanUserStudyProgress();
        result = { message: "User progress cleaned successfully" };
        break;

      case "validate":
        result = await DataMigrationService.validateDataIntegrity();
        break;

      case "complete":
        await DataMigrationService.runCompleteMigration();
        result = { message: "Complete migration executed successfully" };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action. Use: fix-prerequisites, clean-progress, validate, or complete" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      action,
      result
    });

  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { 
        error: "Migration failed", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}