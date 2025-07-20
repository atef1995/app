import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get("tutorialId");

    if (!tutorialId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_PARAMETER", message: "Tutorial ID is required" },
        },
        { status: 400 }
      );
    }

    // Get the current tutorial
    const currentTutorial = await TutorialService.getTutorialById(tutorialId);
    if (!currentTutorial) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Tutorial not found" },
        },
        { status: 404 }
      );
    }

    // Get all tutorials to determine navigation
    const allTutorials = await TutorialService.getAllTutorials();
    const sortedTutorials = allTutorials.sort((a, b) => a.order - b.order);

    // Find current tutorial index
    const currentIndex = sortedTutorials.findIndex(t => t.id === tutorialId);
    
    // Get previous and next tutorials
    const prevTutorial = currentIndex > 0 ? sortedTutorials[currentIndex - 1] : null;
    const nextTutorial = currentIndex < sortedTutorials.length - 1 ? sortedTutorials[currentIndex + 1] : null;

    const navigationInfo = {
      current: {
        id: currentTutorial.id,
        slug: currentTutorial.slug,
        title: currentTutorial.title,
        order: currentTutorial.order
      },
      prev: prevTutorial ? {
        id: prevTutorial.id,
        slug: prevTutorial.slug,
        title: prevTutorial.title,
        order: prevTutorial.order
      } : null,
      next: nextTutorial ? {
        id: nextTutorial.id,
        slug: nextTutorial.slug,
        title: nextTutorial.title,
        order: nextTutorial.order
      } : null
    };

    return NextResponse.json({
      success: true,
      data: navigationInfo
    });

  } catch (error) {
    console.error("Error getting tutorial navigation:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to get tutorial navigation",
        },
      },
      { status: 500 }
    );
  }
}
