-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "requiredPlan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "quizzes_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_quizzes" ("createdAt", "id", "questions", "slug", "title", "tutorialId", "updatedAt") SELECT "createdAt", "id", "questions", "slug", "title", "tutorialId", "updatedAt" FROM "quizzes";
DROP TABLE "quizzes";
ALTER TABLE "new_quizzes" RENAME TO "quizzes";
CREATE UNIQUE INDEX "quizzes_slug_key" ON "quizzes"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
