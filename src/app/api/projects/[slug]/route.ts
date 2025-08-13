import { NextRequest, NextResponse } from "next/server";
import { ProjectService } from "@/lib/projectService";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: "Project slug is required",
        },
        { status: 400 }
      );
    }

    const project = await ProjectService.getProjectBySlug(slug);
    
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
      },
      { status: 500 }
    );
  }
}