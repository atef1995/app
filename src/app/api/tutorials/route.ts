import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");

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
      const tutorials = await TutorialService.searchTutorials(search);
      return NextResponse.json({ success: true, data: tutorials });
    }

    // Get all tutorials
    const tutorials = await TutorialService.getAllTutorials();
    return NextResponse.json({ success: true, data: tutorials });
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
