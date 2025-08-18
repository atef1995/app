import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    const { searchParams } = new URL(request.url);
    
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category parameter is required",
        },
        { status: 400 }
      );
    }

    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    const decodedCategory = decodeURIComponent(category);
    const tutorials = await TutorialService.getTutorialsByCategory(
      decodedCategory,
      limit,
      offset
    );
    const totalCount = await TutorialService.getTutorialsCount({ category: decodedCategory });
    
    return NextResponse.json({
      success: true,
      category: decodedCategory,
      data: tutorials,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching tutorials by category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tutorials for category",
      },
      { status: 500 }
    );
  }
}