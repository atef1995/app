import { NextResponse } from "next/server";
import { TutorialService } from "@/lib/tutorialService";

export async function GET() {
  try {
    const categories = await TutorialService.getCategories();
    
    return NextResponse.json({
      success: true,
      categories,
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