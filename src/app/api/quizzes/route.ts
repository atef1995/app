import { NextRequest, NextResponse } from "next/server";
import { QuizService } from "@/lib/quizService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tutorialId = searchParams.get("tutorialId");
    const id = searchParams.get("id");

    if (id) {
      // Get a specific quiz by ID
      const quiz = await QuizService.getQuizById(id);
      if (!quiz) {
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
      }

      const response = NextResponse.json({ quiz });
      // Cache for 5 minutes for individual quizzes
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );
      return response;
    }

    if (tutorialId) {
      // Get quizzes by tutorial ID
      const quizzes = await QuizService.getQuizzesByTutorialId(tutorialId);
      const response = NextResponse.json({ quizzes });
      response.headers.set(
        "Cache-Control",
        "public, s-maxage=300, stale-while-revalidate=600"
      );
      return response;
    }

    // Get all quizzes
    const quizzes = await QuizService.getAllQuizzes();
    const response = NextResponse.json({ quizzes });
    // Cache for 10 minutes for all quizzes
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=1200"
    );
    return response;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
