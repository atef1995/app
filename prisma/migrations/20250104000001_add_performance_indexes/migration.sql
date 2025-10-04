-- Add performance indexes for frequently queried fields
-- These indexes will dramatically improve query performance without affecting data

-- Tutorial table indexes (for category page queries)
CREATE INDEX IF NOT EXISTS "tutorials_categoryId_published_order_idx" ON "tutorials"("categoryId", "published", "order");
CREATE INDEX IF NOT EXISTS "tutorials_published_order_idx" ON "tutorials"("published", "order");
CREATE INDEX IF NOT EXISTS "tutorials_categoryId_idx" ON "tutorials"("categoryId");

-- Quiz table index (for tutorial-quiz relation queries)
CREATE INDEX IF NOT EXISTS "quizzes_tutorialId_idx" ON "quizzes"("tutorialId");

-- QuizAttempt table indexes (for user stats and achievement queries)
CREATE INDEX IF NOT EXISTS "quiz_attempts_userId_idx" ON "quiz_attempts"("userId");
CREATE INDEX IF NOT EXISTS "quiz_attempts_quizId_idx" ON "quiz_attempts"("quizId");

-- TutorialProgress table index (for achievement stats queries)
CREATE INDEX IF NOT EXISTS "tutorial_progress_userId_quizPassed_idx" ON "tutorial_progress"("userId", "quizPassed");

-- ChallengeProgress table index (for achievement stats queries)
CREATE INDEX IF NOT EXISTS "challenge_progress_userId_passed_idx" ON "challenge_progress"("userId", "passed");
