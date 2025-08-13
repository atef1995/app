import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

interface Params {
  category: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { category } = params;
    
    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Category parameter is required",
        },
        { status: 400 }
      );
    }

    const tutorials = await TutorialService.getTutorialsByCategory(decodeURIComponent(category));
    
    return NextResponse.json({
      success: true,
      category,
      tutorials,
      count: tutorials.length,
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