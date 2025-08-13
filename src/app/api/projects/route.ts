import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/projectService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let projects;
    if (category) {
      projects = await ProjectService.getProjectsByCategory(category);
    } else {
      projects = await ProjectService.getAllProjects();
    }

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}