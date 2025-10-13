# 🧪 Contribution Mode - Manual Testing Guide

**Last Updated**: 2025-10-13
**System Status**: Ready for Testing
**Prerequisites**: ~30 minutes to complete full test

---

## 📋 Overview

This guide will walk you through manually testing the complete GitHub PR-based contribution system from start to finish. You'll test the entire student workflow: browsing projects → submitting PRs → receiving reviews → earning XP.

---

## ✅ Prerequisites

### 1. GitHub Account Setup
- [ ] Have a GitHub account ready
- [ ] GitHub account has public repositories enabled
- [ ] You have permission to create repositories
- [ ] GitHub OAuth app is configured in the project

### 2. Database Setup
- [ ] Database is running (PostgreSQL)
- [ ] Migrations are applied: `npm run db:migrate`
- [ ] Seed data is loaded (includes portfolio-site-template project)
- [ ] You can access Prisma Studio: `npm run db:studio`

### 3. Development Environment
- [ ] Application is running: `npm run dev`
- [ ] Can access: http://localhost:3000
- [ ] GitHub OAuth is working (can sign in)
- [ ] Have your GitHub personal access token ready (optional, for testing API directly)

### 4. Test Repository
- [ ] You have the portfolio-site-template repository set up
  - Either fork: https://github.com/atef1995/portfolio-site-template
  - Or use your own test repo with CI/CD enabled

---

## 🎯 Test Scenarios

### **Scenario 1: Browse & Discover Projects** (5 min)

#### Steps:
1. Navigate to `/contributions`
2. Observe the projects page

#### What to Test:
- [ ] Projects page loads without errors
- [ ] Portfolio Site Template project is visible
- [ ] Project card shows:
  - [ ] Title and description
  - [ ] Difficulty level (⭐⭐ Intermediate)
  - [ ] XP reward (500 XP)
  - [ ] Estimated time (20 hours)
  - [ ] Category badge (Frontend)
- [ ] Filter buttons work (if implemented)
- [ ] Click on project card navigates to detail page

#### Expected Result:
✅ You see the portfolio-site-template project with all details clearly displayed

---

### **Scenario 2: View Project Details** (5 min)

#### Steps:
1. Click on "Portfolio Site Template" project
2. Navigate to `/contributions/projects/portfolio-site-template`

#### What to Test:
- [ ] Project detail page loads
- [ ] Header shows project info:
  - [ ] GitHub repository link
  - [ ] Difficulty, XP, time estimate
  - [ ] "Submit Your PR" button visible
- [ ] **Features Section**:
  - [ ] All 5 features are listed:
    1. Dark Mode Toggle (100 XP)
    2. Contact Form (150 XP)
    3. Blog Section (250 XP)
    4. Admin Dashboard (400 XP)
    5. Analytics Integration (350 XP)
  - [ ] Each feature shows requirements
  - [ ] Each feature shows acceptance criteria
  - [ ] Each feature shows test cases
- [ ] PR template is visible/downloadable
- [ ] Review criteria section is present

#### Expected Result:
✅ All project information is clearly displayed and readable

---

### **Scenario 3: Sign In with GitHub** (3 min)

#### Steps:
1. Click "Sign In" or "Submit Your PR" (if not signed in)
2. Authenticate with GitHub OAuth

#### What to Test:
- [ ] GitHub OAuth flow initiates
- [ ] Redirected to GitHub authorization page
- [ ] After authorization, redirected back to app
- [ ] User is now signed in
- [ ] GitHub profile info is captured:
  - [ ] Username
  - [ ] Profile URL
  - [ ] Access token (check Prisma Studio)

#### Verify in Prisma Studio:
```sql
SELECT id, email, githubUsername, githubProfileUrl, xp, level
FROM "User"
WHERE email = 'your@email.com';
```

#### Expected Result:
✅ Successfully signed in, GitHub data saved to database

---

### **Scenario 4: Fork & Create Test PR** (10 min)

#### Steps:
1. Fork the template repository on GitHub
2. Create a feature branch: `git checkout -b feature/dark-mode-toggle`
3. Make ANY small change (e.g., update README)
4. Commit and push: `git push origin feature/dark-mode-toggle`
5. Open a Pull Request on GitHub:
   - **Base repo**: Your fork's main branch
   - **Head branch**: feature/dark-mode-toggle
   - **Title**: "Add dark mode toggle"
   - **Description**: Use the PR template from the project page

#### PR Template Example:
```markdown
## Description
Implementing dark mode toggle with localStorage persistence

## Feature Checklist
- [x] All requirements from the feature spec are met
- [x] Code follows the project style guide
- [x] All acceptance criteria are satisfied
- [x] Tests pass locally
- [x] No console errors or warnings

## Screenshots/Demo
[Screenshot of toggle button]

## Testing Steps
1. Click the theme toggle in header
2. Observe theme changes
3. Refresh page
4. Theme should persist

## Additional Notes
Using next-themes for implementation
```

#### What to Verify:
- [ ] PR is created successfully on GitHub
- [ ] PR is in "Open" state
- [ ] Copy the PR URL (you'll need this next)

#### Expected Result:
✅ You have an open PR with a valid URL like:
`https://github.com/YOUR_USERNAME/portfolio-site-template/pull/1`

---

### **Scenario 5: Submit PR for Review** (5 min)

#### Steps:
1. Go back to `/contributions/projects/portfolio-site-template`
2. Click "Submit Your PR" button
3. Paste your PR URL in the form
4. Select the feature (e.g., "Dark Mode Toggle")
5. Click "Submit for Review"

#### What to Test:
- [ ] Submission form appears
- [ ] Form validates URL format
- [ ] Feature dropdown shows all 5 features
- [ ] Submit button is enabled
- [ ] Form submits without errors

#### What Happens Behind the Scenes:
1. System verifies PR exists via GitHub API
2. System checks if PR is open (not closed/merged)
3. System verifies PR is from a fork
4. System checks CI/CD status (if available)
5. System creates ContributionSubmission record
6. System auto-assigns 2 peer reviewers
7. System posts welcome comment on GitHub PR
8. System sends notifications to reviewers

#### Verify in Prisma Studio:
```sql
-- Check submission was created
SELECT * FROM "ContributionSubmission"
ORDER BY "submittedAt" DESC LIMIT 1;

-- Check reviews were assigned
SELECT * FROM "ContributionReview"
WHERE "submissionId" = 'YOUR_SUBMISSION_ID';
```

#### Expected Result:
✅ Success message appears
✅ Redirected to submission detail page
✅ Submission shows "PENDING_REVIEW" status

---

### **Scenario 6: View Submission Dashboard** (3 min)

#### Steps:
1. Navigate to `/contributions/dashboard`
2. Observe your submissions

#### What to Test:
- [ ] Dashboard loads
- [ ] **Your Submissions** section shows:
  - [ ] Your PR submission
  - [ ] Status: "PENDING_REVIEW"
  - [ ] Review progress: "0/2 peer reviews"
  - [ ] CI/CD status indicators
- [ ] **Reviews Assigned to You** section shows:
  - [ ] Empty (unless you're assigned as reviewer)
- [ ] Stats display:
  - [ ] Total submissions
  - [ ] Reviews completed
  - [ ] XP earned from contributions

#### Expected Result:
✅ Your submission is visible with correct status

---

### **Scenario 7: View Submission Details** (3 min)

#### Steps:
1. From dashboard, click on your submission
2. Navigate to `/contributions/submissions/[id]`

#### What to Test:
- [ ] Submission detail page loads
- [ ] **Header Section**:
  - [ ] PR title
  - [ ] Status badge (Open, Pending Review, etc.)
  - [ ] PR number and branch name
  - [ ] "View on GitHub" button works
- [ ] **CI/CD Status** section:
  - [ ] Shows build, lint, tests status
  - [ ] Status indicators (✓ pass / ✗ fail)
- [ ] **Review Progress**:
  - [ ] Shows "0/2" peer reviews
  - [ ] Progress bar at 0%
  - [ ] Mentor status: "PENDING"
- [ ] **Reviews** section:
  - [ ] Empty (no reviews yet)

#### Expected Result:
✅ All submission details are displayed accurately

---

### **Scenario 8: Conduct Peer Review** (10 min)

**Note**: For this test, you need to act as a reviewer. Either:
- Create a second test account, OR
- Manually assign yourself as a reviewer in Prisma Studio

#### Manual Reviewer Assignment (Option 2):
```sql
-- Get your user ID
SELECT id FROM "User" WHERE email = 'your@email.com';

-- Get the submission ID
SELECT id FROM "ContributionSubmission" ORDER BY "submittedAt" DESC LIMIT 1;

-- Create a review assignment
INSERT INTO "ContributionReview" (
  "id",
  "submissionId",
  "reviewerId",
  "type",
  "status"
)
VALUES (
  gen_random_uuid(),
  'SUBMISSION_ID_HERE',
  'YOUR_USER_ID_HERE',
  'PEER',
  'PENDING'
);
```

#### Steps:
1. Navigate to `/contributions/reviews`
2. See your assigned review in "Pending" tab
3. Click "Start Review"

#### What to Test:
- [ ] Review interface loads
- [ ] **PR Diff Section**:
  - [ ] Shows files changed
  - [ ] Code diff displays (if GitHub API works)
- [ ] **Review Form**:
  - [ ] 4 scoring criteria (0-100 each):
    1. Code Quality
    2. Functionality
    3. Documentation
    4. Best Practices
  - [ ] Each has slider or input
  - [ ] Feedback text areas:
    - [ ] Strengths
    - [ ] Improvements
    - [ ] Suggestions
- [ ] Submit button enabled when all fields filled

#### Fill Out Review:
- Code Quality: 85
- Functionality: 90
- Documentation: 80
- Best Practices: 85
- Strengths: "Clean code, well-organized"
- Improvements: "Could add more comments"
- Suggestions: "Consider adding unit tests"

#### Submit Review

#### Expected Result:
✅ Review submits successfully
✅ You earn 25 XP
✅ Redirected back to review queue
✅ Submission now shows "1/2 peer reviews"

---

### **Scenario 9: Complete Second Review** (5 min)

#### Steps:
1. Repeat Scenario 8 with a different reviewer account
2. Complete second peer review

#### Expected Result:
✅ Submission now shows "2/2 peer reviews"
✅ Status may update to "READY_FOR_MERGE" (if mentor auto-approved)

---

### **Scenario 10: Merge PR & Celebration** (5 min)

**Note**: This requires webhook setup or manual trigger

#### Option A: Merge PR on GitHub (with webhooks)
1. Go to GitHub PR
2. Click "Merge Pull Request"
3. Confirm merge

#### Option B: Simulate Merge (without webhooks)
Manually update in Prisma Studio:
```sql
UPDATE "ContributionSubmission"
SET "prStatus" = 'MERGED', "mergedAt" = NOW()
WHERE id = 'YOUR_SUBMISSION_ID';
```

#### Then:
1. Refresh submission detail page
2. Observe celebration

#### What to Test:
- [ ] **Celebration Modal Appears**:
  - [ ] Confetti animation plays
  - [ ] Shows "PR Merged!" message
  - [ ] Displays XP earned (100-500 based on feature)
  - [ ] Shows any achievements unlocked
  - [ ] Has "Share" and "Close" buttons
- [ ] **XP Award**:
  - [ ] Check Prisma Studio for updated XP
  - [ ] Check if level increased
- [ ] **Achievement Check**:
  - [ ] "First Steps" achievement unlocked (if first PR)

#### Verify in Prisma Studio:
```sql
-- Check XP was awarded
SELECT xp, level FROM "User" WHERE id = 'YOUR_USER_ID';

-- Check achievements
SELECT * FROM "UserAchievement" WHERE "userId" = 'YOUR_USER_ID';
```

#### Expected Result:
✅ Celebration shows
✅ XP added to your account
✅ Achievement unlocked (if applicable)

---

### **Scenario 11: Review Queue Management** (3 min)

#### Steps:
1. Navigate to `/contributions/reviews`
2. Check both tabs

#### What to Test:
- [ ] **Pending Tab**:
  - [ ] Shows reviews awaiting your input
  - [ ] Each item shows:
    - [ ] Project name
    - [ ] Submitter
    - [ ] Time since submission
    - [ ] "Start Review" button
- [ ] **Completed Tab**:
  - [ ] Shows your completed reviews
  - [ ] Shows score you gave
  - [ ] Shows date completed
  - [ ] XP earned (25 per review)

#### Expected Result:
✅ Review queue correctly separates pending/completed

---

## 🔍 Additional Tests

### **Test: Subscription Limits**
1. Check free tier limit (5 PRs/month)
2. Try submitting 6th PR
3. Verify upgrade prompt appears

### **Test: Error Handling**
- Submit invalid PR URL → Should show error
- Submit closed PR → Should show error
- Submit PR not from fork → Should show error

### **Test: Mobile Responsiveness**
- Test all pages on mobile viewport
- Verify tables are scrollable
- Check that buttons are accessible

---

## 📊 Verification Checklist

After completing all scenarios, verify in Prisma Studio:

```sql
-- 1. Check contribution project exists
SELECT * FROM "ContributionProject" WHERE slug = 'portfolio-site-template';

-- 2. Check your submission
SELECT * FROM "ContributionSubmission" WHERE "userId" = 'YOUR_USER_ID';

-- 3. Check reviews
SELECT * FROM "ContributionReview" WHERE "submissionId" = 'YOUR_SUBMISSION_ID';

-- 4. Check XP updates
SELECT xp, level FROM "User" WHERE id = 'YOUR_USER_ID';

-- 5. Check achievements
SELECT a.title, ua."unlockedAt"
FROM "UserAchievement" ua
JOIN "Achievement" a ON ua."achievementId" = a.id
WHERE ua."userId" = 'YOUR_USER_ID';

-- 6. Check notifications
SELECT * FROM "Notification" WHERE "userId" = 'YOUR_USER_ID' ORDER BY "createdAt" DESC;
```

---

## 🐛 Known Issues & Workarounds

### Issue 1: GitHub API Rate Limit
**Problem**: Too many API calls exhaust rate limit
**Workaround**: Use authenticated requests with personal access token
**Solution**: Set `GITHUB_TOKEN` in environment variables

### Issue 2: Webhooks Not Working Locally
**Problem**: GitHub can't reach localhost
**Workaround**: Use ngrok or manual database updates
**Solution**: For testing, manually update submission status in Prisma Studio

### Issue 3: No Real CI/CD on Test Repo
**Problem**: Template repo doesn't have GitHub Actions
**Workaround**: System still works, just shows "pending" CI status
**Solution**: Add `.github/workflows/ci.yml` to template repo

---

## 🎯 Success Criteria

The system passes manual testing if:

- ✅ You can browse and view all project details
- ✅ You can submit a PR and see it in your dashboard
- ✅ Reviews can be assigned (manually or automatically)
- ✅ You can conduct a peer review with rubric scoring
- ✅ XP is awarded after review completion
- ✅ Celebration shows on PR merge (simulated or real)
- ✅ All data persists correctly to database
- ✅ No console errors during the entire workflow
- ✅ UI is responsive and intuitive

---

## 📝 Test Report Template

After testing, document your findings:

```markdown
## Test Session Report

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Duration**: X minutes
**Environment**: Development/Staging

### Scenarios Tested
- [x] Browse projects
- [x] View project details
- [x] Submit PR
- [x] Conduct review
- [x] XP award
- [x] Celebration

### Bugs Found
1. [Bug description]
2. [Bug description]

### Improvements Needed
1. [Suggestion]
2. [Suggestion]

### Overall Assessment
Pass / Needs Work

### Screenshots
[Attach relevant screenshots]
```

---

## 🚀 Next Steps After Testing

Once manual testing is complete:

1. **Fix Any Bugs**: Address issues found during testing
2. **Set Up Webhooks**: Configure GitHub webhooks for production
3. **Add CI/CD to Template**: Set up GitHub Actions on template repo
4. **Invite Beta Users**: Start with 5-10 real users
5. **Monitor First Submissions**: Watch for issues in real usage
6. **Collect Feedback**: Survey users about their experience
7. **Iterate**: Make improvements based on feedback

---

## 📞 Support

If you encounter issues during testing:

1. Check console for errors
2. Check Prisma Studio for data state
3. Review API logs in terminal
4. Check GitHub API responses
5. Consult documentation: `docs/CONTRIBUTION_MODE_COMPLETE.md`

---

**Happy Testing! 🎉**

The system is designed to handle real-world scenarios, so don't hesitate to test edge cases and try to break things. That's how we make it production-ready!
