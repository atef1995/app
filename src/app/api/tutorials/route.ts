import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Get specific tutorial by ID
    if (id) {
      const tutorial = await TutorialService.getTutorialById(id);
      if (!tutorial) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Tutorial not found" },
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: tutorial });
    }

    // Get specific tutorial by slug
    if (slug) {
      const tutorial = await TutorialService.getTutorialBySlug(slug);
      if (!tutorial) {
        return NextResponse.json(
          {
            success: false,
            error: { code: "NOT_FOUND", message: "Tutorial not found" },
          },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: tutorial });
    }

    // Search tutorials
    if (search) {
      const tutorials = await TutorialService.searchTutorials(search, limit, offset);
      const totalCount = await TutorialService.getTutorialsCount({ search });
      return NextResponse.json({
        success: true,
        data: tutorials,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasMore: offset + limit < totalCount,
        },
      });
    }

    // Get all tutorials with pagination
    const tutorials = await TutorialService.getAllTutorials(limit, offset);
    const totalCount = await TutorialService.getTutorialsCount();
    return NextResponse.json({
      success: true,
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
    console.error("Error fetching tutorials:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch tutorials",
        },
      },
      { status: 500 }
    );
  }
}
