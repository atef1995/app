-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tutorials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "mdxFile" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "order" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tutorials" ("content", "createdAt", "description", "difficulty", "id", "order", "published", "slug", "title", "updatedAt") SELECT "content", "createdAt", "description", "difficulty", "id", "order", "published", "slug", "title", "updatedAt" FROM "tutorials";
DROP TABLE "tutorials";
ALTER TABLE "new_tutorials" RENAME TO "tutorials";
CREATE UNIQUE INDEX "tutorials_slug_key" ON "tutorials"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
