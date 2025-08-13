import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/projectService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "20");

    const submissions = await ProjectService.getPublicSubmissions(
      category || undefined,
      Math.min(limit, 50) // Cap at 50 for performance
    );

    return NextResponse.json({
      success: true,
      data: submissions,
      count: submissions.length,
    });
  } catch (error) {
    console.error("Error fetching showcase submissions:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch showcase submissions",
      },
      { status: 500 }
    );
  }
}