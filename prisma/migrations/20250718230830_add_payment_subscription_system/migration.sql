-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "stripePaymentIntentId" TEXT,
    "stripeSessionId" TEXT,
    "plan" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'TRIAL',
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "currentPeriodStart" DATETIME NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_challenges" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
INSERT INTO "new_challenges" ("createdAt", "description", "difficulty", "estimatedTime", "id", "order", "published", "solution", "starter", "title", "type", "updatedAt") SELECT "createdAt", "description", "difficulty", "estimatedTime", "id", "order", "published", "solution", "starter", "title", "type", "updatedAt" FROM "challenges";
DROP TABLE "challenges";
ALTER TABLE "new_challenges" RENAME TO "challenges";
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
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "requiredPlan" TEXT NOT NULL DEFAULT 'FREE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tutorials" ("content", "createdAt", "description", "difficulty", "id", "mdxFile", "order", "published", "slug", "title", "updatedAt") SELECT "content", "createdAt", "description", "difficulty", "id", "mdxFile", "order", "published", "slug", "title", "updatedAt" FROM "tutorials";
DROP TABLE "tutorials";
ALTER TABLE "new_tutorials" RENAME TO "tutorials";
CREATE UNIQUE INDEX "tutorials_slug_key" ON "tutorials"("slug");
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" DATETIME,
    "image" TEXT,
    "mood" TEXT NOT NULL DEFAULT 'CHILL',
    "subscription" TEXT NOT NULL DEFAULT 'FREE',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
    "subscriptionEndsAt" DATETIME,
    "stripeCustomerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("createdAt", "email", "emailVerified", "id", "image", "mood", "name", "subscription", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "mood", "name", "subscription", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
