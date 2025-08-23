import { NextRequest, NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const categorySlug = searchParams.get("category");
    const tutorialId = searchParams.get("tutorialId"); // Keep backward compatibility

    // Support both new slug-based and old ID-based requests
    if (!slug && !tutorialId) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "MISSING_PARAMETER", message: "Tutorial slug or ID is required" },
        },
        { status: 400 }
      );
    }

    let currentTutorial;
    
    if (slug) {
      // Get the current tutorial by slug
      currentTutorial = await prisma.tutorial.findUnique({
        where: { slug },
        include: { category: true },
      });
    } else {
      // Get the current tutorial by ID (backward compatibility)
      currentTutorial = await TutorialService.getTutorialById(tutorialId!);
    }

    if (!currentTutorial) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Tutorial not found" },
        },
        { status: 404 }
      );
    }

    let allTutorials;
    
    if (categorySlug || currentTutorial.category) {
      // Get tutorials in the same category
      const targetCategory = categorySlug || currentTutorial.category?.slug;
      
      allTutorials = await prisma.tutorial.findMany({
        where: {
          category: {
            slug: targetCategory,
          },
          published: true,
        },
        include: {
          category: true,
        },
        orderBy: {
          order: "asc",
        },
      });
    } else {
      // Fallback to all tutorials (backward compatibility)
      allTutorials = await TutorialService.getAllTutorials();
      allTutorials.sort((a, b) => a.order - b.order);
    }

    // Find current tutorial index
    const currentIndex = allTutorials.findIndex(t => 
      slug ? t.slug === slug : t.id === tutorialId
    );
    
    // Get previous and next tutorials
    const prevTutorial = currentIndex > 0 ? allTutorials[currentIndex - 1] : null;
    const nextTutorial = currentIndex < allTutorials.length - 1 ? allTutorials[currentIndex + 1] : null;

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
        order: prevTutorial.order,
        difficulty: prevTutorial.difficulty,
        estimatedTime: prevTutorial.estimatedTime
      } : null,
      next: nextTutorial ? {
        id: nextTutorial.id,
        slug: nextTutorial.slug,
        title: nextTutorial.title,
        order: nextTutorial.order,
        difficulty: nextTutorial.difficulty,
        estimatedTime: nextTutorial.estimatedTime
      } : null,
      category: currentTutorial.category ? {
        slug: currentTutorial.category.slug,
        title: currentTutorial.category.title,
      } : null,
      totalInCategory: allTutorials.length,
      currentPosition: currentIndex + 1,
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
