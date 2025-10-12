/**
 * GitHub API Integration Service
 *
 * Provides methods for:
 * - Verifying pull requests exist and are valid
 * - Checking CI/CD status from GitHub Actions
 * - Fetching PR diffs for code review
 * - Adding automated comments to PRs
 * - Parsing GitHub URLs
 *
 * Uses Octokit (GitHub's official REST API client)
 */

import { Octokit } from "@octokit/rest";
import type {
  PRInfo,
  CIStatus,
  PRDiff,
  ParsedPRUrl,
  GitHubAPIError,
  RepositoryInfo,
  GitHubProfile,
} from "@/lib/types/github";

export class GitHubService {
  private octokit: Octokit;

  /**
   * Initialize GitHub service with access token
   * @param accessToken - GitHub personal access token or OAuth token
   */
  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * Verify a pull request exists and get its metadata
   *
   * @param prUrl - Full GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)
   * @returns PR information including status, branch, author, etc.
   * @throws {Error} If PR URL is invalid or PR doesn't exist
   */
  async verifyPR(prUrl: string): Promise<PRInfo> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: parsed.owner,
        repo: parsed.repo,
        pull_number: parsed.prNumber,
      });

      return {
        number: pr.number,
        title: pr.title,
        description: pr.body,
        state: pr.state as "open" | "closed",
        merged: pr.merged || false,
        mergeable: pr.mergeable,
        branch: pr.head.ref,
        baseBranch: pr.base.ref,
        forkUrl: pr.head.repo?.html_url || "",
        author: pr.user?.login || "unknown",
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        additions: pr.additions || 0,
        deletions: pr.deletions || 0,
        changedFiles: pr.changed_files || 0,
      };
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to verify PR: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Check the CI/CD status for a pull request
   *
   * @param prUrl - Full GitHub PR URL
   * @returns CI status including all check runs (tests, lint, build, etc.)
   */
  async checkCIStatus(prUrl: string): Promise<CIStatus> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      // Get the PR to find the head SHA
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: parsed.owner,
        repo: parsed.repo,
        pull_number: parsed.prNumber,
      });

      // Get check runs for the PR's head commit
      const { data: checks } = await this.octokit.rest.checks.listForRef({
        owner: parsed.owner,
        repo: parsed.repo,
        ref: pr.head.sha,
      });

      const checkRuns = checks.check_runs.map((check) => ({
        name: check.name,
        status: check.status as "queued" | "in_progress" | "completed",
        conclusion: check.conclusion as
          | "success"
          | "failure"
          | "neutral"
          | "cancelled"
          | "skipped"
          | "timed_out"
          | "action_required"
          | null,
        detailsUrl: check.details_url || undefined,
        startedAt: check.started_at || undefined,
        completedAt: check.completed_at || undefined,
      }));

      // Determine overall status
      const allCompleted = checkRuns.every(
        (check) => check.status === "completed"
      );
      const allSuccess = checkRuns.every(
        (check) => check.conclusion === "success"
      );
      const hasFailure = checkRuns.some(
        (check) => check.conclusion === "failure"
      );

      let conclusion: CIStatus["conclusion"];
      if (!allCompleted) {
        conclusion = "pending";
      } else if (allSuccess) {
        conclusion = "success";
      } else if (hasFailure) {
        conclusion = "failure";
      } else {
        conclusion = "neutral";
      }

      return {
        ciPassed: allSuccess && allCompleted,
        allChecksPassed: allSuccess,
        checks: checkRuns,
        conclusion,
      };
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to check CI status: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Get the diff (changed files) for a pull request
   *
   * @param prUrl - Full GitHub PR URL
   * @returns PR diff with file changes, additions, deletions
   */
  async getPRDiff(prUrl: string): Promise<PRDiff> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      const { data: files } = await this.octokit.rest.pulls.listFiles({
        owner: parsed.owner,
        repo: parsed.repo,
        pull_number: parsed.prNumber,
      });

      return {
        filesChanged: files.length,
        additions: files.reduce((sum, file) => sum + file.additions, 0),
        deletions: files.reduce((sum, file) => sum + file.deletions, 0),
        files: files.map((file) => ({
          filename: file.filename,
          status: file.status as
            | "added"
            | "removed"
            | "modified"
            | "renamed"
            | "copied"
            | "changed"
            | "unchanged",
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          patch: file.patch,
          blobUrl: file.blob_url,
          rawUrl: file.raw_url,
          contentsUrl: file.contents_url,
        })),
      };
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to get PR diff: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Add an automated comment to a pull request
   *
   * @param prUrl - Full GitHub PR URL
   * @param message - Comment message (supports markdown)
   */
  async addPRComment(prUrl: string, message: string): Promise<void> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      await this.octokit.rest.issues.createComment({
        owner: parsed.owner,
        repo: parsed.repo,
        issue_number: parsed.prNumber, // PR numbers are issue numbers in GitHub API
        body: message,
      });
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to add PR comment: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Get repository information
   *
   * @param owner - Repository owner
   * @param repo - Repository name
   * @returns Repository details
   */
  async getRepository(owner: string, repo: string): Promise<RepositoryInfo> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        owner: data.owner.login,
        repo: data.name,
        fullName: data.full_name,
        description: data.description,
        isPrivate: data.private,
        defaultBranch: data.default_branch,
        htmlUrl: data.html_url,
      };
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to get repository: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Get authenticated user's GitHub profile
   *
   * @returns GitHub profile information
   */
  async getProfile(): Promise<GitHubProfile> {
    try {
      const { data } = await this.octokit.rest.users.getAuthenticated();

      return {
        login: data.login,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatar_url,
        profileUrl: data.html_url,
        bio: data.bio,
        company: data.company,
        location: data.location,
        publicRepos: data.public_repos,
        followers: data.followers,
        following: data.following,
      };
    } catch (error) {
      const ghError = error as GitHubAPIError;
      throw new Error(
        `Failed to get profile: ${ghError.message || "Unknown error"}`
      );
    }
  }

  /**
   * Verify that a PR points to the correct base repository
   *
   * @param prUrl - Full GitHub PR URL
   * @param expectedOwner - Expected repository owner
   * @param expectedRepo - Expected repository name
   * @returns true if PR points to correct repo, false otherwise
   */
  async verifyPRTarget(
    prUrl: string,
    expectedOwner: string,
    expectedRepo: string
  ): Promise<boolean> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: parsed.owner,
        repo: parsed.repo,
        pull_number: parsed.prNumber,
      });

      // Check if base repo matches expected
      const baseOwner = pr.base.repo.owner.login.toLowerCase();
      const baseRepo = pr.base.repo.name.toLowerCase();

      return (
        baseOwner === expectedOwner.toLowerCase() &&
        baseRepo === expectedRepo.toLowerCase()
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Parse a GitHub PR URL into its components
   *
   * @param prUrl - Full GitHub PR URL
   * @returns Parsed owner, repo, and PR number
   * @throws {Error} If URL format is invalid
   */
  parsePRUrl(prUrl: string): ParsedPRUrl {
    // Match: https://github.com/owner/repo/pull/123
    // Also handle: github.com/owner/repo/pull/123 (without protocol)
    const match = prUrl.match(
      /(?:https?:\/\/)?github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
    );

    if (!match) {
      throw new Error(
        "Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123"
      );
    }

    return {
      owner: match[1],
      repo: match[2],
      prNumber: parseInt(match[3], 10),
      fullUrl: prUrl.startsWith("http") ? prUrl : `https://${prUrl}`,
    };
  }

  /**
   * Check if a PR is from a fork
   *
   * @param prUrl - Full GitHub PR URL
   * @returns true if PR is from a fork, false if from same repo
   */
  async isPRFromFork(prUrl: string): Promise<boolean> {
    const parsed = this.parsePRUrl(prUrl);

    try {
      const { data: pr } = await this.octokit.rest.pulls.get({
        owner: parsed.owner,
        repo: parsed.repo,
        pull_number: parsed.prNumber,
      });

      // Compare head repo with base repo
      return pr.head.repo?.id !== pr.base.repo.id;
    } catch (error) {
      return false;
    }
  }
}

/**
 * Create a GitHub service instance for a user
 *
 * @param accessToken - User's GitHub access token
 * @returns GitHubService instance
 */
export function createGitHubService(accessToken: string): GitHubService {
  return new GitHubService(accessToken);
}
