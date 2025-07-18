/*
  Warnings:

  - You are about to drop the `challenge_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutorial_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `correctAnswer` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `quizzes` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `quizzes` table. All the data in the column will be lost.
  - Made the column `tutorialId` on table `quiz_attempts` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `questions` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "challenge_progress_userId_challengeId_key";

-- DropIndex
DROP INDEX "tutorial_progress_userId_tutorialId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "challenge_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tutorial_progress";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" REAL,
    "timeSpent" INTEGER,
    "quizzesTaken" INTEGER NOT NULL DEFAULT 0,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "progress_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quiz_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "score" REAL NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "timeSpent" INTEGER,
    "mood" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quiz_attempts_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quiz_attempts" ("answers", "createdAt", "id", "mood", "passed", "quizId", "score", "timeSpent", "tutorialId", "userId") SELECT "answers", "createdAt", "id", "mood", "passed", "quizId", "score", "timeSpent", "tutorialId", "userId" FROM "quiz_attempts";
DROP TABLE "quiz_attempts";
ALTER TABLE "new_quiz_attempts" RENAME TO "quiz_attempts";
CREATE TABLE "new_quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tutorialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quizzes_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quizzes" ("createdAt", "id", "tutorialId") SELECT "createdAt", "id", "tutorialId" FROM "quizzes";
DROP TABLE "quizzes";
ALTER TABLE "new_quizzes" RENAME TO "quizzes";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "progress_userId_tutorialId_key" ON "progress"("userId", "tutorialId");
