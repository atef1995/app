import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ProjectService } from "@/lib/projectService";
import { authOptions } from "@/lib/auth";

interface Params {
  slug: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { slug } = params;
    const body = await request.json();
    
    // Get the project to validate it exists
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

    // Validate submission data based on project requirements
    const { title, description, submissionUrl, sourceCode, notes, status } = body;
    
    if (!title && !submissionUrl && !sourceCode) {
      return NextResponse.json(
        {
          success: false,
          error: "At least one of title, submission URL, or source code is required",
        },
        { status: 400 }
      );
    }

    // Create or update the submission
    const submission = await ProjectService.upsertSubmission(
      session.user.id,
      project.id,
      {
        title,
        description,
        submissionUrl,
        sourceCode,
        notes,
        status: status || "DRAFT",
      }
    );

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Error submitting project:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit project",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required",
        },
        { status: 401 }
      );
    }

    const { slug } = params;
    
    // Get the project to get its ID
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

    // Get user's submission for this project
    const submission = await ProjectService.getUserSubmission(
      session.user.id,
      project.id
    );

    return NextResponse.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    console.error("Error fetching user submission:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch submission",
      },
      { status: 500 }
    );
  }
}