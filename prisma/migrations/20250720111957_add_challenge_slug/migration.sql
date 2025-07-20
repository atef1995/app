/*
  Warnings:

  - Added the required column `slug` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_challenges" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'EASY',
    "type" TEXT NOT NULL DEFAULT 'FUNCTION',
    "estimatedTime" TEXT NOT NULL,
    "starter" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "requiredPlan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_challenges" ("createdAt", "description", "difficulty", "estimatedTime", "id", "isPremium", "order", "published", "requiredPlan", "solution", "starter", "title", "type", "updatedAt") SELECT "createdAt", "description", "difficulty", "estimatedTime", "id", "isPremium", "order", "published", "requiredPlan", "solution", "starter", "title", "type", "updatedAt" FROM "challenges";
DROP TABLE "challenges";
ALTER TABLE "new_challenges" RENAME TO "challenges";
CREATE UNIQUE INDEX "challenges_slug_key" ON "challenges"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
