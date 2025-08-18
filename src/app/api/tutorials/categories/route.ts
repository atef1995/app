import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const allCategories = await TutorialService.getCategories();
    
    // Apply pagination to categories
    const totalCount = allCategories.length;
    const paginatedCategories = limit && offset !== undefined 
      ? allCategories.slice(offset, offset + limit)
      : allCategories;
    
    return NextResponse.json({
      success: true,
      data: paginatedCategories,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching tutorial categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tutorial categories",
      },
      { status: 500 }
    );
  }
}