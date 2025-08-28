import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TutorialService } from "@/lib/tutorialService";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = (page - 1) * limit;

    // Get user session to provide personalized stats
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Get optimized categories with tutorial counts and user progress
    const allCategoriesWithStats = await TutorialService.getCategoriesWithStats(userId);
    
    // Apply pagination
    const totalCount = allCategoriesWithStats.length;
    const paginatedCategories = limit && offset !== undefined 
      ? allCategoriesWithStats.slice(offset, offset + limit)
      : allCategoriesWithStats;

    // Get overall user stats if user is logged in
    let overallStats = null;
    if (userId) {
      const [totalTutorials, completedTutorials] = await Promise.all([
        prisma.tutorial.count({ where: { published: true } }),
        prisma.tutorialProgress.count({ 
          where: { 
            userId, 
            status: 'COMPLETED',
            quizPassed: true 
          } 
        })
      ]);

      overallStats = {
        totalTutorials,
        completedTutorials,
      };
    }
    
    return NextResponse.json({
      success: true,
      data: paginatedCategories,
      overallStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: offset + limit < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching tutorial categories with stats:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tutorial categories with stats",
      },
      { status: 500 }
    );
  }
}