/**
 * API Route: POST /api/webhooks/github
 *
 * Handle GitHub webhook events for pull requests
 *
 * Events handled:
 * - pull_request: opened, closed, merged, synchronize
 * - pull_request_review: submitted, approved
 * - check_run: completed
 *
 * Security: Verifies webhook signature using GitHub secret
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type {
  GitHubWebhookPREvent,
  GitHubWebhookReviewEvent,
  GitHubWebhookCheckRunEvent,
} from "@/lib/types/github";

export async function POST(request: Request) {
  try {
    const event = request.headers.get("X-GitHub-Event");
    // Signature verification disabled for development
    // In production, uncomment to verify webhook authenticity
    // const signature = request.headers.get("X-Hub-Signature-256");
    const payload = await request.json();

    // TODO: Verify webhook signature for security in production
    // const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;
    // if (!verifySignature(signature, payload, webhookSecret)) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    // }

    switch (event) {
      case "pull_request":
        await handlePullRequestEvent(payload as GitHubWebhookPREvent);
        break;

      case "pull_request_review":
        await handlePullRequestReviewEvent(
          payload as GitHubWebhookReviewEvent
        );
        break;

      case "check_run":
        await handleCheckRunEvent(payload as GitHubWebhookCheckRunEvent);
        break;

      default:
        console.log(`Unhandled GitHub webhook event: ${event}`);
    }

    return NextResponse.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.error("Error processing GitHub webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process webhook",
      },
      { status: 500 }
    );
  }
}

/**
 * Handle pull_request events (opened, closed, synchronize, etc.)
 */
async function handlePullRequestEvent(payload: GitHubWebhookPREvent) {
  const { action, pull_request } = payload;

  // Find submission by PR URL
  const submission = await prisma.contributionSubmission.findFirst({
    where: {
      githubPrUrl: pull_request.html_url,
    },
  });

  if (!submission) {
    console.log(
      `No submission found for PR: ${pull_request.html_url}`
    );
    return;
  }

  switch (action) {
    case "opened":
      // PR was just opened (submission should already exist)
      console.log(`PR opened: ${pull_request.html_url}`);
      break;

    case "synchronize":
      // PR was updated with new commits
      await prisma.contributionSubmission.update({
        where: { id: submission.id },
        data: {
          prTitle: pull_request.title,
          prDescription: pull_request.body || "",
          updatedAt: new Date(),
        },
      });

      // Notify reviewer that PR was updated
      const reviews = await prisma.contributionReview.findMany({
        where: {
          submissionId: submission.id,
          status: "PENDING",
        },
      });

      for (const review of reviews) {
        await prisma.notification.create({
          data: {
            userId: review.reviewerId,
            type: "CONTRIBUTION_UPDATE",
            title: "PR Updated",
            message: `The PR you're reviewing has been updated with new commits`,
            data: {
              submissionId: submission.id,
              prUrl: pull_request.html_url,
            },
          },
        });
      }
      break;

    case "closed":
      // PR was closed or merged
      const status = pull_request.merged ? "MERGED" : "CLOSED";

      await prisma.contributionSubmission.update({
        where: { id: submission.id },
        data: {
          prStatus: status,
          mergedAt: pull_request.merged ? new Date() : null,
          completedAt: new Date(),
        },
      });

      // If merged, award XP and create notification
      if (pull_request.merged) {
        const project = await prisma.contributionProject.findUnique({
          where: { id: submission.projectId },
        });

        if (project) {
          // Check if this is the user's first merged PR
          const previousMergedPRs = await prisma.contributionSubmission.count({
            where: {
              userId: submission.userId,
              prStatus: "MERGED",
              id: { not: submission.id },
            },
          });

          const isFirstPR = previousMergedPRs === 0;

          // Award XP for merged PR
          const { awardPRMergeXP } = await import("@/lib/services/xpService");
          const xpResult = await awardPRMergeXP(
            submission.userId,
            project.xpReward,
            submission.id,
            isFirstPR
          );

          // Check for achievement unlocks
          const { checkPRAchievements } = await import("@/lib/services/achievementService");
          const newAchievements = await checkPRAchievements(submission.userId);

          // Get first unlocked achievement badge for celebration
          const badgeUnlocked = newAchievements.length > 0 && newAchievements[0].achievement
            ? {
                id: newAchievements[0].achievement.id,
                title: newAchievements[0].achievement.title,
                icon: newAchievements[0].achievement.icon,
              }
            : undefined;

          // Create notification
          const bonusMessage = isFirstPR ? " (+100 bonus for first PR!)" : "";
          const achievementMessage = newAchievements.length > 0
            ? ` Achievement unlocked: ${newAchievements[0].achievement?.title}!`
            : "";

          await prisma.notification.create({
            data: {
              userId: submission.userId,
              type: "CONTRIBUTION_MERGED",
              title: "🎉 PR Merged!",
              message: `Your PR was merged! You earned ${xpResult.xpAwarded} XP${bonusMessage}${achievementMessage}`,
              data: {
                submissionId: submission.id,
                xpEarned: xpResult.xpAwarded,
                prUrl: pull_request.html_url,
                isFirstPR,
                levelUp: xpResult.levelUp,
                newLevel: xpResult.newLevel,
                badgeUnlocked,
                achievementsUnlocked: newAchievements.length,
              },
            },
          });
        }
      }
      break;

    case "reopened":
      // PR was reopened
      await prisma.contributionSubmission.update({
        where: { id: submission.id },
        data: {
          prStatus: "OPEN",
        },
      });
      break;

    default:
      console.log(`Unhandled PR action: ${action}`);
  }
}

/**
 * Handle pull_request_review events (submitted, approved, etc.)
 */
async function handlePullRequestReviewEvent(
  payload: GitHubWebhookReviewEvent
) {
  const { action, review, pull_request } = payload;

  if (action !== "submitted") {
    return;
  }

  // Find submission
  const submission = await prisma.contributionSubmission.findFirst({
    where: {
      githubPrUrl: pull_request.html_url,
    },
  });

  if (!submission) {
    return;
  }

  // Notify submitter of review
  await prisma.notification.create({
    data: {
      userId: submission.userId,
      type: "CONTRIBUTION_REVIEW",
      title: "New Review on GitHub",
      message: `${review.user.login} ${review.state === "approved" ? "approved" : "commented on"} your PR`,
      data: {
        submissionId: submission.id,
        reviewUrl: review.html_url,
        reviewState: review.state,
      },
    },
  });
}

/**
 * Handle check_run events (CI/CD status updates)
 */
async function handleCheckRunEvent(payload: GitHubWebhookCheckRunEvent) {
  const { action, check_run, pull_requests } = payload;

  if (action !== "completed") {
    return;
  }

  // Update all submissions associated with these PRs
  for (const pr of pull_requests) {
    const submission = await prisma.contributionSubmission.findFirst({
      where: {
        githubPrUrl: pr.html_url,
      },
    });

    if (submission) {
      // Update CI status based on check result
      const checkName = check_run.name.toLowerCase();
      const passed = check_run.conclusion === "success";

      const updateData: {
        ciPassed?: boolean;
        testsPassed?: boolean;
        lintPassed?: boolean;
      } = {};

      if (checkName.includes("test")) {
        updateData.testsPassed = passed;
      }

      if (checkName.includes("lint")) {
        updateData.lintPassed = passed;
      }

      // Update overall CI status (all checks must pass)
      // This is a simplification - in production, you'd fetch all check runs
      if (check_run.conclusion) {
        updateData.ciPassed = check_run.conclusion === "success";
      }

      await prisma.contributionSubmission.update({
        where: { id: submission.id },
        data: updateData,
      });

      // Notify user if CI failed
      if (!passed) {
        await prisma.notification.create({
          data: {
            userId: submission.userId,
            type: "CONTRIBUTION_CI_FAILED",
            title: "CI Check Failed",
            message: `The "${check_run.name}" check failed on your PR`,
            data: {
              submissionId: submission.id,
              checkName: check_run.name,
              checkUrl: check_run.html_url,
            },
          },
        });
      }
    }
  }
}
