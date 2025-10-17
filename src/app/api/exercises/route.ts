import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 300; // 5 minutes

export async function GET(request: NextRequest) {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { published: true },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        estimatedTime: true,
        topics: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });

    return NextResponse.json({
      data: exercises,
      count: exercises.length,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    return NextResponse.json(
      { error: "Failed to fetch exercises" },
      { status: 500 }
    );
  }
}
