# 🚀 GitHub PR-Based Project Submission & Open-Source Contribution System

**Status**: Implementation Phase - UI Components Complete
**Date Created**: 2025-10-12
**Goal**: Transform "Vibed to Cracked" from passive learning into active coding bootcamp with real PR submissions

---

## Mission Statement

Transform "Vibed to Cracked" from a passive learning platform into an **active coding bootcamp** where students contribute to real open-source projects through GitHub PRs, building portfolios while learning.

---

## 🎯 Core Concept: "Learn by Contributing"

### The Big Idea

Instead of submitting project links or code snippets, students **fork a real codebase, implement features, and submit Pull Requests**. Their PRs get peer-reviewed by other students AND mentors, creating a realistic development workflow.

**Marketing Angle**: *"The only coding platform where your homework becomes your portfolio. Every assignment is a GitHub PR. Every project is open-source contribution."*

---

## 📋 System Architecture

### 1. Database Schema Changes

**New Models to Add to `prisma/schema.prisma`:**

```prisma
model ContributionProject {
  id              String   @id @default(cuid())
  slug            String   @unique
  title           String
  description     String
  githubRepoUrl   String   // Main repo students fork from
  githubOwner     String   // e.g., "vibed-to-cracked"
  githubRepo      String   // e.g., "student-portfolio-site"
  category        String   // "frontend", "backend", "fullstack"
  difficulty      Int      // 1-5
  estimatedHours  Int

  // Feature-based assignments
  features        Json     // Array of feature specs

  // PR Requirements
  prTemplate      String   // Template for PR descriptions
  requiredChecks  Json     // CI/CD checks required
  reviewCriteria  Json     // What reviewers should look for

  // Gamification
  xpReward        Int      @default(100)
  badgeId         String?  // Award badge on completion

  isPremium       Boolean  @default(false)
  requiredPlan    String   @default("FREE")
  published       Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  submissions     ContributionSubmission[]

  @@map("contribution_projects")
}

model ContributionSubmission {
  id                  String   @id @default(cuid())
  userId              String
  projectId           String

  // GitHub Integration
  githubPrUrl         String   // Full PR URL
  githubPrNumber      Int
  githubBranch        String   // Their feature branch
  githubForkUrl       String   // Their fork URL

  // PR Status
  prStatus            String   @default("OPEN") // OPEN, MERGED, CLOSED, CHANGES_REQUESTED
  prTitle             String
  prDescription       String

  // Feature Implementation
  featureId           String   // Which feature they implemented
  featureTitle        String

  // Automated Checks
  ciPassed            Boolean  @default(false)
  lintPassed          Boolean  @default(false)
  testsPassed         Boolean  @default(false)

  // Review Process
  peerReviewsNeeded   Int      @default(2)
  peerReviewsReceived Int      @default(0)
  mentorReviewStatus  String   @default("PENDING") // PENDING, APPROVED, CHANGES_REQUESTED

  // Grading
  codeQuality         Float?   // 0-100
  implementsSpec      Boolean  @default(false)
  followsStandards    Boolean  @default(false)
  grade               Float?   // Final grade

  // Timestamps
  submittedAt         DateTime @default(now())
  mergedAt            DateTime?
  completedAt         DateTime?

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  project             ContributionProject @relation(fields: [projectId], references: [id])
  user                User @relation(fields: [userId], references: [id])
  reviews             ContributionReview[]

  @@unique([userId, projectId, featureId])
  @@map("contribution_submissions")
}

model ContributionReview {
  id                String   @id @default(cuid())
  submissionId      String
  reviewerId        String

  // Review Content
  type              String   @default("PEER") // PEER or MENTOR
  status            String   @default("PENDING") // PENDING, APPROVED, CHANGES_REQUESTED, COMPLETED

  // Code Review
  filesReviewed     Int      @default(0)
  commentsAdded     Int      @default(0)
  githubReviewUrl   String?  // Link to GitHub review

  // Scoring (using rubric)
  codeQualityScore  Float?   // 0-100
  functionalityScore Float?  // 0-100
  documentationScore Float?  // 0-100
  overallScore      Float?   // 0-100

  // Feedback
  strengths         String?
  improvements      String?
  suggestions       String?

  // XP Rewards
  xpAwarded         Int      @default(25) // Reviewer gets XP too!

  submittedAt       DateTime?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  submission        ContributionSubmission @relation(fields: [submissionId], references: [id])
  reviewer          User @relation(fields: [reviewerId], references: [id])

  @@map("contribution_reviews")
}
```

### 2. User Model Updates

Add these relations to the existing `User` model:

```prisma
model User {
  // ... existing fields ...

  // New relations for contribution system
  contributionSubmissions      ContributionSubmission[]
  contributionReviewsGiven     ContributionReview[]     @relation("ReviewerRelation")

  // GitHub integration
  githubUsername               String?
  githubAccessToken            String?  // Encrypted
  githubProfileUrl             String?

  @@map("users")
}
```

### 3. GitHub Integration Layer

**New Service: `src/lib/services/githubService.ts`**

```typescript
/**
 * GitHub API integration for PR tracking and verification
 *
 * Features:
 * - Verify PR exists and is open
 * - Check CI/CD status
 * - Get PR diff for review
 * - Track PR lifecycle (open → merged)
 * - Auto-comment on PRs
 */
export class GitHubService {
  private octokit: Octokit;

  constructor(accessToken: string) {
    this.octokit = new Octokit({ auth: accessToken });
  }

  /**
   * Verify PR exists and get metadata
   */
  async verifyPR(prUrl: string): Promise<PRInfo> {
    const { owner, repo, number } = this.parsePRUrl(prUrl);

    const { data: pr } = await this.octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: number,
    });

    return {
      number: pr.number,
      title: pr.title,
      description: pr.body,
      status: pr.state, // 'open', 'closed'
      merged: pr.merged,
      branch: pr.head.ref,
      forkUrl: pr.head.repo.html_url,
    };
  }

  /**
   * Check CI/CD status
   */
  async checkCIStatus(prUrl: string): Promise<CIStatus> {
    const { owner, repo, number } = this.parsePRUrl(prUrl);

    const { data: checks } = await this.octokit.rest.checks.listForRef({
      owner,
      repo,
      ref: `pull/${number}/head`,
    });

    return {
      ciPassed: checks.check_runs.every(check => check.conclusion === 'success'),
      checks: checks.check_runs.map(check => ({
        name: check.name,
        status: check.status,
        conclusion: check.conclusion,
      })),
    };
  }

  /**
   * Get PR diff
   */
  async getPRDiff(prUrl: string): Promise<PRDiff> {
    const { owner, repo, number } = this.parsePRUrl(prUrl);

    const { data: files } = await this.octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: number,
    });

    return {
      filesChanged: files.length,
      additions: files.reduce((sum, file) => sum + file.additions, 0),
      deletions: files.reduce((sum, file) => sum + file.deletions, 0),
      files: files.map(file => ({
        filename: file.filename,
        status: file.status,
        patch: file.patch,
      })),
    };
  }

  /**
   * Add automated comment to PR
   */
  async addPRComment(prUrl: string, message: string): Promise<void> {
    const { owner, repo, number } = this.parsePRUrl(prUrl);

    await this.octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: number,
      body: message,
    });
  }

  /**
   * Subscribe to PR events via webhooks
   */
  async watchPRStatus(prUrl: string, webhookUrl: string): Promise<void> {
    const { owner, repo } = this.parsePRUrl(prUrl);

    await this.octokit.rest.repos.createWebhook({
      owner,
      repo,
      config: {
        url: webhookUrl,
        content_type: 'json',
      },
      events: ['pull_request', 'pull_request_review', 'check_run'],
    });
  }

  private parsePRUrl(prUrl: string): { owner: string; repo: string; number: number } {
    // Parse: https://github.com/owner/repo/pull/123
    const match = prUrl.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
    if (!match) throw new Error('Invalid PR URL');

    return {
      owner: match[1],
      repo: match[2],
      number: parseInt(match[3]),
    };
  }
}

// Types
interface PRInfo {
  number: number;
  title: string;
  description: string | null;
  status: 'open' | 'closed';
  merged: boolean;
  branch: string;
  forkUrl: string;
}

interface CIStatus {
  ciPassed: boolean;
  checks: Array<{
    name: string;
    status: string;
    conclusion: string | null;
  }>;
}

interface PRDiff {
  filesChanged: number;
  additions: number;
  deletions: number;
  files: Array<{
    filename: string;
    status: string;
    patch?: string;
  }>;
}
```

---

## 🎨 User Flow: "From Tutorial to Pull Request"

### Phase 1: Choose a Feature

1. Student completes tutorial (e.g., "React Components")
2. Platform shows **real projects needing that skill**:
   - "Add dark mode toggle to Portfolio Site" (Beginner)
   - "Implement user authentication" (Intermediate)
   - "Build analytics dashboard" (Advanced)

### Phase 2: Fork & Setup

1. Student clicks "Start Contributing"
2. Platform guides them:
   ```bash
   1. Fork this repo: github.com/vibed-to-cracked/portfolio-template
   2. Clone your fork: git clone [your-fork-url]
   3. Create feature branch: git checkout -b feature/dark-mode
   4. Install dependencies: npm install
   ```

### Phase 3: Implement Feature

1. Student codes the feature
2. Platform provides **live guidance**:
   - Feature spec checklist
   - Code examples
   - Debugging tips
   - Testing instructions

### Phase 4: Submit PR

1. Student pushes code: `git push origin feature/dark-mode`
2. Opens PR on GitHub
3. **Pastes PR URL into platform**
4. Platform **auto-validates**:
   - ✅ PR is open
   - ✅ Points to correct branch
   - ✅ CI/CD passing
   - ✅ Follows PR template

### Phase 5: Peer Review

1. Platform assigns **2 peer reviewers** (students at same/higher level)
2. Reviewers see:
   - GitHub PR diff (embedded iframe)
   - Review rubric
   - Code quality checklist
3. They leave feedback **on GitHub** (authentic experience!)
4. Platform tracks review completion

### Phase 6: Mentor Approval

1. After 2 peer approvals, mentor reviews
2. Mentor can:
   - Approve & merge
   - Request changes
   - Leave learning feedback

### Phase 7: Merge & Reward

1. PR gets **merged to main branch**
2. Student earns:
   - ✨ **XP** (100-500 based on difficulty)
   - 🏆 **"Open Source Contributor" badge**
   - 📜 **Certificate** (with PR link)
   - 🌟 **Portfolio item** (auto-added to their profile)

---

## 💰 Marketing Strategy: "Your Code in Production"

### Tagline Options

1. **"Learn. Code. Ship. Repeat."**
2. **"Where Homework Becomes Portfolio"**
3. **"The Only Bootcamp Where You're Actually Coding"**
4. **"From Tutorial to Pull Request in One Click"**
5. **"Build Real Projects, Not Todo Apps"** ⚡ **BEST**

### Social Media Launch Strategy

#### Week 1: Teaser Campaign

**Platform**: Twitter/X, LinkedIn, TikTok, Instagram

**Post 1** (Day 1):
```
🚨 NEW FEATURE DROP 🚨

Tired of coding bootcamps where you build the same calculator 100 times?

What if every assignment was a REAL open-source contribution?

Introducing: Contribution Mode 🔥

[Video showing student submitting PR and getting it merged]
```

**Post 2** (Day 3):
```
Most bootcamps: "Build a to-do app"
Us: "Implement authentication for a production app used by 10K users"

Your homework = Your portfolio 📈

[Screenshot of merged PR with 10K+ app usage stats]
```

**Post 3** (Day 5):
```
❌ OLD WAY: Submit a zip file to your instructor
✅ NEW WAY: Open a PR, get peer-reviewed, merge to production

Learn like you're already hired.

Contribution Mode launches Monday.
[countdown timer GIF]
```

#### Week 2: Launch Day Content

**Launch Post** (Twitter Thread):
```
🧵 We just solved the biggest problem in coding education.

Introducing "Contribution Mode" - where every assignment is a GitHub PR.

Here's how it works: 👇

1/ Traditional bootcamps have you build fake projects that get deleted after grading.

Meanwhile, you're "learning" how to code but never experiencing real dev workflow.

2/ With Contribution Mode, you fork REAL codebases.

Like @vercel's portfolio template. Or our open-source projects with 10K+ stars.

3/ Each tutorial ends with: "Now implement this in a real app"

You pick a feature from our backlog (yes, actual features users want).

4/ You code. You push. You open a PR.

But here's where it gets wild...

5/ Two students at your level peer-review your code.

(On GitHub, just like real devs do)

They leave comments. You fix issues. You learn.

6/ Once approved, a mentor does final review.

Then your code MERGES TO MAIN and goes LIVE.

Your code is now running in production. Used by real users.

7/ You earn:
- XP (100-500)
- "Open Source Contributor" badge
- A certificate with your PR link
- A portfolio item that recruiters can VERIFY

8/ Every student gets 5 PRs/month free.

VIBED tier (20/month): $29
CRACKED tier (unlimited): $49

But here's the kicker...

9/ Your merged PRs count as REAL open-source contributions on your GitHub profile.

That green square chart? 🟩🟩🟩

Now it's full. Because you were learning.

10/ "But what if my code isn't good enough?"

That's the POINT. You'll learn by:
- Reading peer reviews
- Fixing issues
- Iterating

Just like a real job.

11/ Launch today. 100 spots.

Link in bio 🔗

Tag someone who needs to see this. 👇
```

**TikTok Video** (60 seconds):
```
[Scene 1: Split screen]
LEFT: Student submitting .zip file to LMS
RIGHT: Developer opening PR on GitHub

Text: "One of these is how REAL developers work..."

[Scene 2: Student opening PR]
Shows: Pasting PR URL into platform

[Scene 3: Automated checks]
✅ CI Passing
✅ Tests Passing
✅ Lint Passing
*Chef's kiss*

[Scene 4: Peer reviews]
Shows actual GitHub comments from other students

[Scene 5: THE MERGE]
Green "Merged" button
Confetti animation
+250 XP
Badge unlock

[Scene 6: The kicker]
Zoom into student's GitHub profile
GREEN SQUARES EVERYWHERE

Text: "Your homework is now your portfolio"

[End screen]
"Vibed to Cracked - Contribution Mode"
"Link in bio"
```

#### Week 3+: Social Proof Campaign

**User-Generated Content Strategy**:
1. **#FirstPRMerged** - Students share their first merged PR
2. **#MyCodeInProduction** - Screenshots of their code running live
3. **Before/After GitHub profiles** - Empty vs. full contribution graphs
4. **Peer review highlights** - Best code review comments

**Influencer Partnerships**:
- Reach out to coding YouTubers (Traversy Media, Web Dev Simplified, Fireship)
- Pitch: "Want to show your audience real project-based learning?"
- Offer: Free CRACKED tier for them + 20% discount code for audience

---

## 🎮 Gamification Layer

### Leaderboards

1. **Most PRs Merged** (weekly/monthly)
2. **Best Code Reviewer** (based on review quality)
3. **Fastest Merger** (time from PR open to merge)
4. **Longest Streak** (consecutive days with active PRs)

### Achievements

1. 🌱 **"First PR"** - Merge your first PR
2. 🔥 **"Hot Streak"** - 7 PRs in 7 days
3. 👥 **"Code Reviewer Pro"** - Complete 50 peer reviews
4. ⚡ **"Speed Demon"** - PR merged within 24 hours
5. 🏆 **"Open Source Hero"** - 100 PRs merged
6. 💯 **"Perfect Score"** - Get 100% on 10 submissions

### XP System

- Tutorial completion: 50 XP
- PR opened: 25 XP
- PR merged: 100-500 XP (based on difficulty)
- Peer review completed: 25 XP
- First-time contributor bonus: 2x XP

---

## 🛠️ Implementation Plan

### Phase 1: MVP (Week 1-2)

**Scope**: Single project with 5 features

1. **Project**: Student Portfolio Template
   - Feature 1: Dark mode toggle (Beginner)
   - Feature 2: Contact form (Beginner)
   - Feature 3: Blog section (Intermediate)
   - Feature 4: Admin dashboard (Advanced)
   - Feature 5: Analytics integration (Advanced)

2. **Core Features**:
   - PR submission form
   - GitHub API integration (verify PR)
   - Basic peer review (manual assignment)
   - Simple grading rubric

3. **UI Components**:
   - `ContributionProjectCard.tsx`
   - `PRSubmissionForm.tsx`
   - `PeerReviewInterface.tsx`
   - `MergedPRCelebration.tsx` (confetti animation!)

### Phase 2: Automation (Week 3-4)

1. CI/CD integration (auto-check tests)
2. Smart peer review matching (skill-based)
3. GitHub webhooks (track PR status automatically)
4. Automated XP rewards
5. Slack/Discord notifications

### Phase 3: Scale (Week 5-6)

1. Add 5 more projects (different tech stacks)
2. Mentor dashboard (review queue)
3. Code quality metrics (Complexity, test coverage)
4. Portfolio page (showcase merged PRs)
5. Certificate generation (with PR links)

### Phase 4: Community (Week 7-8)

1. Public leaderboards
2. Student showcase (best PRs of the week)
3. Office hours (live code review sessions)
4. Student-led workshops
5. Job board (companies hiring from platform)

---

## 💸 Monetization Strategy

### Free Tier

- 5 PRs per month
- Peer reviews only
- 1 project access
- Basic achievements

### VIBED Tier ($29/month)

- 20 PRs per month
- Mentor reviews (2 per month)
- All beginner/intermediate projects
- Priority review queue
- Certificate generation

### CRACKED Tier ($49/month)

- **Unlimited PRs**
- **Unlimited mentor reviews**
- **All projects (including advanced)**
- **Priority merge** (24hr guarantee)
- **1-on-1 code review** (1 hour/month)
- **Job referrals** (partner companies)
- **Portfolio builder** (custom domain)

---

## 📊 Success Metrics

### Student Engagement

- **Target**: 70% of students submit at least 1 PR
- **Measure**: PR submission rate
- **Goal**: 10 PRs/student/month (VIBED)

### Code Quality

- **Target**: 80% of PRs pass CI on first try
- **Measure**: CI pass rate
- **Goal**: Improve to 90% within 3 months

### Peer Review Quality

- **Target**: Reviews have 5+ actionable comments
- **Measure**: Comment count + helpfulness ratings
- **Goal**: 85% "helpful" rating from submitters

### Conversion

- **Target**: 15% Free → VIBED conversion
- **Measure**: Upgrade rate after 5th PR attempt (paywall)
- **Goal**: $10K MRR within 3 months

### Virality

- **Target**: 2.0 viral coefficient (each user brings 2 friends)
- **Measure**: Referral signups + social shares
- **Goal**: 1,000 students within 3 months

---

## 🚧 Technical Requirements

### GitHub OAuth Setup

```typescript
// Student connects GitHub account
// Platform gets permission to:
// - Read public repos (to verify forks)
// - Read PR status (to track submissions)
// - Write comments (to provide automated feedback)

// NextAuth.js provider configuration
GitHubProvider({
  clientId: process.env.GITHUB_ID,
  clientSecret: process.env.GITHUB_SECRET,
  authorization: {
    params: {
      scope: 'read:user repo', // Permissions needed
    },
  },
})
```

### CI/CD Template

```yaml
# .github/workflows/student-pr-check.yml
name: Student PR Check
on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Lint code
        run: npm run lint

      # Notify platform of results
      - name: Report to platform
        run: |
          curl -X POST ${{ secrets.PLATFORM_WEBHOOK_URL }} \
            -H "Content-Type: application/json" \
            -d '{
              "pr_number": "${{ github.event.pull_request.number }}",
              "status": "success",
              "checks": {
                "tests": "passed",
                "lint": "passed"
              }
            }'
```

### Webhook Handling

```typescript
// Platform endpoint: /api/webhooks/github
// Listens for PR events:
// - opened (record submission)
// - review_requested (assign peer)
// - approved (check if 2+ approvals)
// - merged (award XP, update status)

export async function POST(req: Request) {
  const event = req.headers.get('X-GitHub-Event');
  const payload = await req.json();

  switch (event) {
    case 'pull_request':
      if (payload.action === 'opened') {
        await handlePROpened(payload);
      } else if (payload.action === 'closed' && payload.pull_request.merged) {
        await handlePRMerged(payload);
      }
      break;

    case 'pull_request_review':
      if (payload.action === 'submitted') {
        await handleReviewSubmitted(payload);
      }
      break;

    case 'check_run':
      if (payload.action === 'completed') {
        await handleCheckCompleted(payload);
      }
      break;
  }

  return new Response('OK', { status: 200 });
}
```

---

## 🎯 Go-To-Market Timeline

- **Day 1**: Launch landing page + waitlist
- **Day 7**: Private beta (50 students)
- **Day 14**: Public beta (300 students)
- **Day 30**: Full launch + social media blitz
- **Day 60**: Influencer partnerships
- **Day 90**: First student case studies (hired!)

---

## 🔥 Differentiation from Competitors

### vs. FreeCodeCamp
- **They**: Submit CodePen links
- **Us**: Actual GitHub PRs to production apps

### vs. Boot.dev
- **They**: CLI-based challenges
- **Us**: Real codebases, real collaboration

### vs. Exercism
- **They**: Isolated exercises
- **Us**: Features in full applications

### vs. GitHub Copilot
- **They**: AI writes code
- **Us**: YOU write code, humans review

**Unique Value Prop**: *"The only platform where you're not just learning - you're already working."*

---

## ✅ Implementation Checklist

### Phase 1: Database & Backend (Week 1) ✅ COMPLETE
- [x] Update Prisma schema with new models
  - Added ContributionProject model
  - Added ContributionSubmission model
  - Added ContributionReview model
  - Added bestPracticesScore field
  - Updated User model with GitHub fields
- [x] Create GitHub service (`src/lib/services/githubService.ts`)
  - Implemented PR verification
  - Added CI/CD status checking
  - PR diff retrieval functionality
  - Automated comment system
  - URL parsing and validation
- [x] Run migration: `npx prisma db push`
- [x] Set up GitHub OAuth in NextAuth
- [x] Create API routes for PR submission
- [x] Create webhook endpoint for GitHub events

### Phase 2: UI Components (Week 1-2) ✅ COMPLETE
- [x] Build ContributionProjectCard component
  - Implemented with category badge, difficulty indicator, XP reward display
  - Added dark mode support and hover effects
  - Responsive layout for all screen sizes
- [x] Create PRSubmissionForm component
  - GitHub PR URL validation
  - Error handling and loading states
  - Submission guidelines display
- [x] Build FeatureList component
  - Display feature requirements and acceptance criteria
  - Test cases and estimated time display
  - XP reward indication
- [x] Create ProjectHeader component
  - Project metadata display
  - Category and premium badges
  - GitHub repository link
  - Statistics overview (difficulty, time, XP, submissions)
- [x] Build contribution projects listing page
  - Filter by category, difficulty, and premium status
  - Responsive grid layout
  - Loading and error states
- [x] Create individual project detail page
  - Feature selection and submission flow
  - Authentication integration
  - Progress tracking
  - Submission status updates
- [x] Build PeerReviewInterface component
  - Weighted rubric scoring (40/30/20/10)
  - GitHub diff display
  - Real-time score calculation
  - Form validation
- [x] Create MergedPRCelebration component
  - Confetti animation
  - XP counter animation
  - Badge unlock display
  - Social sharing
- [x] Build Dashboard page
  - Statistics overview
  - Submission and review lists
  - Tab navigation
- [x] Build Submission Detail page
  - PR status and CI/CD checks
  - Review progress tracker
  - Review history display
- [x] Build Review Queue page
  - Pending/completed review list
  - Filter by status
  - Review statistics

### Phase 2.5: Backend Integration ✅ COMPLETE
- [x] Create XP Service (`src/lib/services/xpService.ts`)
  - Award XP for PR merges
  - Award XP for reviews
  - Level calculation
  - First PR bonus
- [x] Create Achievement Service (`src/lib/services/achievementService.ts`)
  - 10 achievement definitions
  - Auto-checking logic
  - Achievement unlock notifications
- [x] Create peer reviewer assignment API
  - Smart matching algorithm
  - Load balancing
  - Notification sending
- [x] Integrate auto-assignment into submit flow
- [x] Enhance webhook with XP and achievements
- [x] Add XP/achievement checking to review API
- [x] Create dashboard API endpoint
- [x] Create review queue API endpoint
- [x] Create PR diff API endpoint

### Phase 3: First Template Project (Week 2)
- [ ] Create Portfolio Site repository
- [ ] Set up CI/CD workflow
- [ ] Define 5 feature specs
- [ ] Write PR template
- [ ] Create review rubric
- [ ] Seed database with project data

### Phase 4: Testing & Polish (Week 2-3)
- [ ] Test PR submission flow end-to-end
- [ ] Test peer review assignment
- [ ] Test GitHub webhook events
- [ ] Test XP rewards
- [ ] Mobile responsive testing

### Phase 5: Launch Prep (Week 3-4)
- [ ] Write launch blog post
- [ ] Create TikTok announcement video
- [ ] Design social media graphics
- [ ] Set up waitlist landing page
- [ ] Prepare email sequences
- [ ] Launch! 🚀

---

## 💡 Additional Ideas

### "Live Code Review Fridays"
- Weekly Twitch stream
- Mentor reviews 10 student PRs live
- Community votes on best PR of the week

### "Contribution Challenges"
- Monthly themed challenges
- "Build a feature in 48 hours"
- Winner gets free CRACKED tier for 3 months

### "Hire from the Leaderboard"
- Partner companies browse top contributors
- Direct hire pipeline
- Platform takes 5% recruiting fee

### "Student-to-Mentor Pipeline"
- Top performers become mentors
- Earn money reviewing code
- Build side income while learning

---

## 📝 Example Feature Specifications

### Feature 1: Dark Mode Toggle (Beginner)

**Description**: Add a dark mode toggle that persists user preference

**Requirements**:
- [ ] Create toggle button component
- [ ] Implement theme switching logic
- [ ] Store preference in localStorage
- [ ] Apply dark styles to all pages
- [ ] Add smooth transition animation

**Acceptance Criteria**:
- Toggle switches between light and dark themes
- Preference persists across browser sessions
- All text remains readable in both modes
- No layout shifts when switching themes

**Test Cases**:
- User can click toggle to switch themes
- Theme preference is saved to localStorage
- Page loads with saved theme preference
- All components support both themes

**XP Reward**: 100 XP

**Estimated Time**: 2-3 hours

---

## 🎓 Mentor Guidelines

### Code Review Checklist

**Functionality**:
- [ ] Feature works as specified
- [ ] All acceptance criteria met
- [ ] Edge cases handled
- [ ] No console errors

**Code Quality**:
- [ ] Follows project style guide
- [ ] Functions are small and focused
- [ ] Variables have clear names
- [ ] No duplicate code

**Best Practices**:
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance optimizations
- [ ] Security best practices

**Testing**:
- [ ] Unit tests included
- [ ] Tests pass
- [ ] Good test coverage
- [ ] Tests are meaningful

**Documentation**:
- [ ] Code comments where needed
- [ ] README updated if necessary
- [ ] PR description is clear
- [ ] Commit messages are descriptive

---

## 🚀 Launch Assets Needed

### Marketing Materials
1. Landing page copy
2. Demo video (3 minutes)
3. Social media graphics (10 variations)
4. Blog post (1500 words)
5. Email announcement
6. Press release

### Technical Assets
1. Template repository (Portfolio Site)
2. CI/CD workflow files
3. PR template markdown
4. Review rubric document
5. Feature specification templates
6. Student onboarding guide

---

**This system transforms Vibed to Cracked from a tutorial platform into a real-world dev training ground. Students don't just learn to code - they become contributors from day one.**

---

**Status**: Ready for implementation
**Next Step**: Update Prisma schema and run migrations
**Expected Launch**: 4-6 weeks from start
