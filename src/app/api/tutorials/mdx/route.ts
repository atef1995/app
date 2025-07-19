import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");

    if (!fileName) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_PARAMETER",
            message: "File parameter is required",
          },
        },
        { status: 400 }
      );
    }

    // Construct the path to the MDX file
    const filePath = path.join(
      process.cwd(),
      "src",
      "content",
      "tutorials",
      `${fileName}.mdx`
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "NOT_FOUND", message: "Tutorial file not found" },
        },
        { status: 404 }
      );
    }

    // Read the file content
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse frontmatter
    const { data: frontmatter, content } = matter(fileContent);

    // Clean up the content - ensure proper line endings and spacing
    const cleanContent = content
      .trim()
      .replace(/\r\n/g, "\n") // Normalize line endings
      .replace(/\n{3,}/g, "\n\n"); // Remove excessive line breaks

    return NextResponse.json({
      success: true,
      data: {
        frontmatter,
        content: cleanContent,
        rawContent: fileContent, // Also provide raw content for debugging
      },
    });
  } catch (error) {
    console.error("Error reading MDX file:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to read tutorial file",
        },
      },
      { status: 500 }
    );
  }
}
