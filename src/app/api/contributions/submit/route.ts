/**
 * API Route: POST /api/contributions/submit
 *
 * Submit a pull request for review
 *
 * This endpoint:
 * 1. Validates the user is authenticated and has GitHub connected
 * 2. Verifies the PR exists and points to the correct repository
 * 3. Checks CI/CD status
 * 4. Creates a submission record
 * 5. Assigns peer reviewers
 * 6. Sends automated comment to GitHub PR
 *
 * Request body:
 * {
 *   projectSlug: string;
 *   featureId: string;
 *   prUrl: string;
 * }
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createGitHubService } from "@/lib/services/githubService";
import { parseProjectFeatures } from "@/lib/types/contribution";

export async function POST(request: Request) {
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

    const body = await request.json();
    const { projectSlug, featureId, prUrl } = body;

    // Validate required fields
    if (!projectSlug || !featureId || !prUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: projectSlug, featureId, prUrl",
        },
        { status: 400 }
      );
    }

    // Get user's GitHub credentials
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        githubAccessToken: true,
        githubUsername: true,
        subscription: true,
      },
    });

    if (!user?.githubAccessToken) {
      return NextResponse.json(
        {
          success: false,
          error: "GitHub account not connected. Please sign in with GitHub first.",
        },
        { status: 400 }
      );
    }

    // Fetch project
    const project = await prisma.contributionProject.findUnique({
      where: { slug: projectSlug },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    // Check if feature exists in project
    const features = parseProjectFeatures(project.features);
    const feature = features.find((f) => f.id === featureId);

    if (!feature) {
      return NextResponse.json(
        {
          success: false,
          error: "Feature not found in project",
        },
        { status: 404 }
      );
    }

    // Check subscription limits
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const submissionsThisMonth = await prisma.contributionSubmission.count({
      where: {
        userId: session.user.id,
        submittedAt: {
          gte: new Date(currentYear, currentMonth, 1),
          lt: new Date(currentYear, currentMonth + 1, 1),
        },
      },
    });

    const limits = {
      FREE: 5,
      VIBED: 20,
      CRACKED: Infinity,
    };

    const userLimit = limits[user.subscription as keyof typeof limits] || 5;

    if (submissionsThisMonth >= userLimit) {
      return NextResponse.json(
        {
          success: false,
          error: `Monthly submission limit reached (${userLimit} PRs). Upgrade to submit more.`,
          limit: userLimit,
          used: submissionsThisMonth,
        },
        { status: 429 }
      );
    }

    // Check for duplicate submission
    const existingSubmission = await prisma.contributionSubmission.findUnique({
      where: {
        userId_projectId_featureId: {
          userId: session.user.id,
          projectId: project.id,
          featureId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already submitted this feature. Use the update endpoint to resubmit.",
          submissionId: existingSubmission.id,
        },
        { status: 409 }
      );
    }

    // Verify PR using GitHub API
    const githubService = createGitHubService(user.githubAccessToken);

    let prInfo;
    try {
      prInfo = await githubService.verifyPR(prUrl);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to verify PR: ${(error as Error).message}`,
        },
        { status: 400 }
      );
    }

    // Verify PR points to correct repository
    const targetValid = await githubService.verifyPRTarget(
      prUrl,
      project.githubOwner,
      project.githubRepo
    );

    if (!targetValid) {
      return NextResponse.json(
        {
          success: false,
          error: `PR must be submitted to ${project.githubOwner}/${project.githubRepo}`,
        },
        { status: 400 }
      );
    }

    // Check PR is from a fork
    const isFromFork = await githubService.isPRFromFork(prUrl);

    if (!isFromFork) {
      return NextResponse.json(
        {
          success: false,
          error: "PR must be from your fork, not from a branch in the main repository",
        },
        { status: 400 }
      );
    }

    // Check CI/CD status
    const ciStatus = await githubService.checkCIStatus(prUrl);

    // Create submission
    const submission = await prisma.contributionSubmission.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        githubPrUrl: prUrl,
        githubPrNumber: prInfo.number,
        githubBranch: prInfo.branch,
        githubForkUrl: prInfo.forkUrl,
        prStatus: prInfo.state === "open" ? "OPEN" : "CLOSED",
        prTitle: prInfo.title,
        prDescription: prInfo.description || "",
        featureId,
        featureTitle: feature.title,
        ciPassed: ciStatus.ciPassed,
        testsPassed: ciStatus.checks.some((c) => c.name.toLowerCase().includes("test")),
        lintPassed: ciStatus.checks.some((c) => c.name.toLowerCase().includes("lint")),
      },
    });

    // Add automated comment to PR
    const platformUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const commentMessage = `
🎉 **Submission Received!**

Your pull request has been submitted to **Vibed to Cracked** for review!

**Project:** ${project.title}
**Feature:** ${feature.title}
**Submission ID:** \`${submission.id}\`

## What's Next?

1. ✅ **Automated Checks:** CI/CD is ${ciStatus.ciPassed ? "passing ✓" : "running..."}
2. 👥 **Peer Review:** 2 peer reviewers will be assigned within 24 hours
3. 👨‍🏫 **Mentor Review:** Final approval after peer reviews
4. 🎊 **Merge & Reward:** Earn ${project.xpReward} XP when your PR is merged!

[View Submission Status](${platformUrl}/contribute/submissions/${submission.id})

---
*Powered by [Vibed to Cracked](${platformUrl}) - Where your homework becomes your portfolio*
`;

    try {
      await githubService.addPRComment(prUrl, commentMessage);
    } catch (error) {
      console.error("Failed to add PR comment:", error);
      // Don't fail the submission if comment fails
    }

    // Assign peer reviewers automatically
    try {
      const assignResponse = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/contributions/assign-reviewers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: request.headers.get("Cookie") || "",
          },
          body: JSON.stringify({
            submissionId: submission.id,
            numberOfReviewers: 2,
          }),
        }
      );

      const assignData = await assignResponse.json();

      if (!assignData.success) {
        console.warn("Failed to assign reviewers:", assignData.error);
        // Don't fail submission if reviewer assignment fails
        // Reviewers can be assigned manually later
      }
    } catch (error) {
      console.error("Error assigning reviewers:", error);
      // Don't fail submission if reviewer assignment fails
    }

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        prNumber: prInfo.number,
        status: submission.prStatus,
        ciPassed: ciStatus.ciPassed,
        submittedAt: submission.submittedAt,
      },
      message: "PR submitted successfully! Peer reviewers are being assigned.",
    });
  } catch (error) {
    console.error("Error submitting PR:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit PR",
      },
      { status: 500 }
    );
  }
}
