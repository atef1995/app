/**
 * API Route: GET /api/contributions/submissions/[id]/diff
 *
 * Fetch PR diff for code review
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGitHubService } from "@/lib/services/githubService";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const submissionId = params.id;

    // Fetch submission
    const submission = await prisma.contributionSubmission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          select: {
            githubAccessToken: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Submission not found" },
        { status: 404 }
      );
    }

    // Get GitHub token (use submitter's or reviewer's token)
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { githubAccessToken: true },
    });

    const githubToken = user?.githubAccessToken || submission.user.githubAccessToken;

    if (!githubToken) {
      return NextResponse.json(
        { success: false, error: "GitHub access token not available" },
        { status: 400 }
      );
    }

    // Fetch PR diff from GitHub
    const githubService = createGitHubService(githubToken);
    const diff = await githubService.getPRDiff(submission.githubPrUrl);

    return NextResponse.json({
      success: true,
      diff,
    });
  } catch (error) {
    console.error("Error fetching PR diff:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch PR diff",
      },
      { status: 500 }
    );
  }
}
