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
      return NextResponse.json({ quiz });
    }

    if (tutorialId) {
      // Get quizzes by tutorial ID
      const quizzes = await QuizService.getQuizzesByTutorialId(tutorialId);
      return NextResponse.json({ quizzes });
    }

    // Get all quizzes
    const quizzes = await QuizService.getAllQuizzes();
    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
