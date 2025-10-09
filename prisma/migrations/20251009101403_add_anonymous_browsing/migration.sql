-- AlterTable
ALTER TABLE "users" ADD COLUMN     "anonymousSessionId" TEXT,
ADD COLUMN     "conversionCampaign" TEXT,
ADD COLUMN     "conversionMedium" TEXT,
ADD COLUMN     "conversionSource" TEXT,
ADD COLUMN     "firstLandingPage" TEXT;

-- CreateTable
CREATE TABLE "anonymous_sessions" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "tutorialsViewed" JSONB NOT NULL DEFAULT '[]',
    "totalTimeSpent" INTEGER NOT NULL DEFAULT 0,
    "pagesViewed" INTEGER NOT NULL DEFAULT 0,
    "source" TEXT,
    "medium" TEXT,
    "campaign" TEXT,
    "referrer" TEXT,
    "landingPage" TEXT,
    "userAgent" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActiveAt" TIMESTAMP(3) NOT NULL,
    "convertedToUserId" TEXT,
    "convertedAt" TIMESTAMP(3),
    "ipAddress" TEXT,

    CONSTRAINT "anonymous_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "anonymous_sessions_anonymousId_key" ON "anonymous_sessions"("anonymousId");

-- CreateIndex
CREATE INDEX "anonymous_sessions_anonymousId_idx" ON "anonymous_sessions"("anonymousId");

-- CreateIndex
CREATE INDEX "anonymous_sessions_convertedToUserId_idx" ON "anonymous_sessions"("convertedToUserId");

-- CreateIndex
CREATE INDEX "anonymous_sessions_createdAt_idx" ON "anonymous_sessions"("createdAt");
