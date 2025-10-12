/**
 * GitHub API Integration Types
 *
 * Type definitions for GitHub PR verification, CI/CD checking,
 * and webhook event handling for the contribution system.
 */

/**
 * Pull Request information extracted from GitHub API
 */
export interface PRInfo {
  number: number;
  title: string;
  description: string | null;
  state: "open" | "closed";
  merged: boolean;
  mergeable: boolean | null;
  branch: string;
  baseBranch: string;
  forkUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

/**
 * CI/CD check status from GitHub Actions or other CI providers
 */
export interface CIStatus {
  ciPassed: boolean;
  allChecksPassed: boolean;
  checks: CheckRun[];
  conclusion: "success" | "failure" | "pending" | "cancelled" | "neutral";
}

/**
 * Individual check run (test, lint, build, etc.)
 */
export interface CheckRun {
  name: string;
  status: "queued" | "in_progress" | "completed";
  conclusion: "success" | "failure" | "neutral" | "cancelled" | "skipped" | "timed_out" | "action_required" | null;
  detailsUrl?: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * PR diff information for code review
 */
export interface PRDiff {
  filesChanged: number;
  additions: number;
  deletions: number;
  files: PRFile[];
}

/**
 * Individual file change in a PR
 */
export interface PRFile {
  filename: string;
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
  additions: number;
  deletions: number;
  changes: number;
  patch?: string; // Git diff patch
  blobUrl: string;
  rawUrl: string;
  contentsUrl: string;
}

/**
 * Parsed GitHub PR URL components
 */
export interface ParsedPRUrl {
  owner: string;
  repo: string;
  prNumber: number;
  fullUrl: string;
}

/**
 * GitHub webhook event payload for pull request events
 */
export interface GitHubWebhookPREvent {
  action: "opened" | "closed" | "reopened" | "synchronize" | "edited" | "review_requested" | "review_request_removed";
  pull_request: {
    number: number;
    title: string;
    body: string | null;
    state: "open" | "closed";
    merged: boolean;
    html_url: string;
    head: {
      ref: string;
      sha: string;
      repo: {
        html_url: string;
        full_name: string;
      };
    };
    base: {
      ref: string;
      repo: {
        full_name: string;
      };
    };
    user: {
      login: string;
      avatar_url: string;
    };
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

/**
 * GitHub webhook event payload for pull request review events
 */
export interface GitHubWebhookReviewEvent {
  action: "submitted" | "edited" | "dismissed";
  review: {
    id: number;
    user: {
      login: string;
    };
    body: string | null;
    state: "approved" | "changes_requested" | "commented" | "dismissed";
    html_url: string;
    submitted_at: string;
  };
  pull_request: {
    number: number;
    html_url: string;
  };
}

/**
 * GitHub webhook event payload for check run events
 */
export interface GitHubWebhookCheckRunEvent {
  action: "created" | "completed" | "rerequested" | "requested_action";
  check_run: {
    id: number;
    name: string;
    status: "queued" | "in_progress" | "completed";
    conclusion: "success" | "failure" | "neutral" | "cancelled" | "skipped" | "timed_out" | "action_required" | null;
    started_at: string | null;
    completed_at: string | null;
    html_url: string;
  };
  pull_requests: Array<{
    number: number;
    html_url: string;
  }>;
}

/**
 * GitHub API error response
 */
export interface GitHubAPIError {
  message: string;
  status: number;
  documentation_url?: string;
}

/**
 * Repository information
 */
export interface RepositoryInfo {
  owner: string;
  repo: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  defaultBranch: string;
  htmlUrl: string;
}

/**
 * User's GitHub profile information
 */
export interface GitHubProfile {
  login: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
  profileUrl: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  publicRepos: number;
  followers: number;
  following: number;
}
