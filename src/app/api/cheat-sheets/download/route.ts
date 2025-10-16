import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const { sheetId } = await request.json();

    if (!sheetId) {
      return NextResponse.json(
        { error: "Sheet ID is required" },
        { status: 400 }
      );
    }

    // Get the cheat sheet
    const cheatSheet = await prisma.cheatSheet.findUnique({
      where: { id: sheetId },
    });

    if (!cheatSheet) {
      return NextResponse.json(
        { error: "Cheat sheet not found" },
        { status: 404 }
      );
    }

    // Check if premium and user has access
    if (cheatSheet.isPremium && token?.subscription === "FREE") {
      return NextResponse.json(
        { error: "Premium content requires subscription" },
        { status: 403 }
      );
    }

    // Increment download count
    await prisma.cheatSheet.update({
      where: { id: sheetId },
      data: { downloadCount: { increment: 1 } },
    });

    // Return download info
    return NextResponse.json({
      success: true,
      downloadUrl: cheatSheet.downloadUrl,
      fileName: `${cheatSheet.slug}.${cheatSheet.fileFormat.toLowerCase()}`,
    });
  } catch (error) {
    console.error("Error tracking download:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
