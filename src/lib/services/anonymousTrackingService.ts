/**
 * Anonymous Tracking Service
 *
 * Server-side service for tracking anonymous user behavior before signup.
 * Handles anonymous session creation, tracking, and conversion to user accounts.
 */

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface TutorialView {
  tutorialId: string;
  slug?: string;
  startedAt: string;
  timeSpent: number;
}

export interface AnonymousTrackingData {
  anonymousId: string;
  tutorialId?: string;
  tutorialSlug?: string;
  action: 'VIEW' | 'TIME_UPDATE' | 'LIMIT_REACHED' | 'PAGE_VIEW';
  timeSpent?: number;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  landingPage?: string;
  userAgent?: string;
  device?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
}

export class AnonymousTrackingService {
  /**
   * Create or update anonymous session
   */
  static async trackAnonymousSession(data: AnonymousTrackingData) {
    const { anonymousId, tutorialId, tutorialSlug, action, timeSpent } = data;

    try {
      // Find or create anonymous session
      let session = await prisma.anonymousSession.findUnique({
        where: { anonymousId },
      });

      if (!session) {
        // Create new session
        session = await prisma.anonymousSession.create({
          data: {
            anonymousId,
            source: data.source,
            medium: data.medium,
            campaign: data.campaign,
            referrer: data.referrer,
            landingPage: data.landingPage,
            userAgent: data.userAgent,
            device: data.device,
            browser: data.browser,
            os: data.os,
            ipAddress: data.ipAddress ? await this.hashIp(data.ipAddress) : null,
            tutorialsViewed: [],
            pagesViewed: 1,
          },
        });
      }

      // Update session based on action
      if (action === 'VIEW' && tutorialId) {
        await this.trackTutorialView(session.id, tutorialId, tutorialSlug);
      } else if (action === 'TIME_UPDATE' && tutorialId && timeSpent) {
        await this.updateTutorialTime(session.id, tutorialId, timeSpent);
      } else if (action === 'PAGE_VIEW') {
        await this.incrementPageViews(session.id);
      }

      return session;
    } catch (error) {
      console.error('Error tracking anonymous session:', error);
      throw error;
    }
  }

  /**
   * Track tutorial view for anonymous session
   */
  private static async trackTutorialView(
    sessionId: string,
    tutorialId: string,
    tutorialSlug?: string
  ) {
    const session = await prisma.anonymousSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return;

    const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
    const existing = viewed.find((t) => t.tutorialId === tutorialId);

    if (!existing) {
      viewed.push({
        tutorialId,
        slug: tutorialSlug,
        startedAt: new Date().toISOString(),
        timeSpent: 0,
      });

      await prisma.anonymousSession.update({
        where: { id: sessionId },
        data: {
          tutorialsViewed: viewed as unknown as Prisma.InputJsonValue,
          pagesViewed: { increment: 1 },
          lastActiveAt: new Date(),
        },
      });
    }
  }

  /**
   * Update time spent on tutorial for anonymous session
   */
  private static async updateTutorialTime(
    sessionId: string,
    tutorialId: string,
    timeSpent: number
  ) {
    const session = await prisma.anonymousSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) return;

    const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
    const tutorial = viewed.find((t) => t.tutorialId === tutorialId);

    if (tutorial) {
      tutorial.timeSpent = (tutorial.timeSpent || 0) + timeSpent;

      await prisma.anonymousSession.update({
        where: { id: sessionId },
        data: {
          tutorialsViewed: viewed as unknown as Prisma.InputJsonValue,
          totalTimeSpent: { increment: timeSpent },
          lastActiveAt: new Date(),
        },
      });
    }
  }

  /**
   * Increment page views for anonymous session
   */
  private static async incrementPageViews(sessionId: string) {
    await prisma.anonymousSession.update({
      where: { id: sessionId },
      data: {
        pagesViewed: { increment: 1 },
        lastActiveAt: new Date(),
      },
    });
  }

  /**
   * Get anonymous session stats
   */
  static async getAnonymousSession(anonymousId: string) {
    try {
      return await prisma.anonymousSession.findUnique({
        where: { anonymousId },
      });
    } catch (error) {
      console.error('Error getting anonymous session:', error);
      return null;
    }
  }

  /**
   * Check if anonymous user has reached tutorial limit
   */
  static async hasReachedLimit(anonymousId: string, limit: number = 5): Promise<boolean> {
    try {
      const session = await this.getAnonymousSession(anonymousId);
      if (!session) return false;

      const tutorialsViewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
      return tutorialsViewed.length >= limit;
    } catch (error) {
      console.error('Error checking anonymous limit:', error);
      return false; // Fail open to not block users
    }
  }

  /**
   * Get tutorial count for anonymous user
   */
  static async getTutorialCount(anonymousId: string): Promise<number> {
    try {
      const session = await this.getAnonymousSession(anonymousId);
      if (!session) return 0;

      const tutorialsViewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
      return tutorialsViewed.length;
    } catch (error) {
      console.error('Error getting tutorial count:', error);
      return 0;
    }
  }

  /**
   * Convert anonymous session to user account
   *
   * This is called after a user signs up. It:
   * 1. Marks the anonymous session as converted
   * 2. Migrates tutorial progress to the new user account
   * 3. Updates user with attribution data
   */
  static async convertAnonymousToUser(
    anonymousId: string,
    userId: string
  ) {
    try {
      const session = await prisma.anonymousSession.findUnique({
        where: { anonymousId },
      });

      if (!session) {
        console.warn(`No anonymous session found for ${anonymousId}`);
        return null;
      }

      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        // Mark session as converted
        await tx.anonymousSession.update({
          where: { id: session.id },
          data: {
            convertedToUserId: userId,
            convertedAt: new Date(),
          },
        });

        // Create TutorialProgress entries for viewed tutorials
        const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
        let migrated = 0;

        for (const tutorial of viewed) {
          try {
            await tx.tutorialProgress.create({
              data: {
                userId,
                tutorialId: tutorial.tutorialId,
                status: 'IN_PROGRESS',
                timeSpent: tutorial.timeSpent || 0,
              },
            });
            migrated++;
          } catch {
            // Ignore duplicates - user may have already started this tutorial
            console.warn('Tutorial progress already exists:', tutorial.tutorialId);
          }
        }

        // Update user with attribution data
        await tx.user.update({
          where: { id: userId },
          data: {
            conversionSource: session.source,
            conversionMedium: session.medium,
            conversionCampaign: session.campaign,
            firstLandingPage: session.landingPage,
            anonymousSessionId: session.id,
          },
        });

        return {
          session,
          tutorialsMigrated: migrated,
        };
      });

      console.log(
        `Successfully converted anonymous session ${anonymousId} to user ${userId}. ` +
        `Migrated ${result.tutorialsMigrated} tutorials.`
      );

      return result;
    } catch (error) {
      console.error('Error converting anonymous session:', error);
      throw error;
    }
  }

  /**
   * Hash IP address for privacy (GDPR compliance)
   */
  private static async hashIp(ip: string): Promise<string> {
    try {
      // For Node.js environment
      const cryptoModule = await import('crypto');
      return cryptoModule.createHash('sha256').update(ip).digest('hex');
    } catch {
      // Fallback for edge/serverless environments
      const encoder = new TextEncoder();
      const data = encoder.encode(ip);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  }

  /**
   * Clean up old anonymous sessions (GDPR compliance)
   *
   * Deletes sessions older than specified days that haven't converted.
   * Should be run as a cron job.
   */
  static async cleanupOldSessions(daysOld: number = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const deleted = await prisma.anonymousSession.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
          convertedToUserId: null, // Only delete non-converted sessions
        },
      });

      console.log(
        `Cleaned up ${deleted.count} anonymous sessions older than ${daysOld} days`
      );

      return deleted;
    } catch (error) {
      console.error('Error cleaning up old sessions:', error);
      throw error;
    }
  }

  /**
   * Get anonymous session statistics (for analytics)
   */
  static async getSessionStats(startDate?: Date, endDate?: Date) {
    try {
      const where: {
        createdAt?: {
          gte?: Date;
          lte?: Date;
        };
      } = {};

      if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
      }

      const [totalSessions, convertedSessions, avgTutorialsViewed] = await Promise.all([
        // Total anonymous sessions
        prisma.anonymousSession.count({ where }),

        // Converted sessions
        prisma.anonymousSession.count({
          where: {
            ...where,
            convertedToUserId: { not: null },
          },
        }),

        // Average tutorials viewed (requires raw query or aggregation)
        prisma.anonymousSession.findMany({ where, select: { tutorialsViewed: true } }),
      ]);

      // Calculate average tutorials viewed
      const totalTutorials = avgTutorialsViewed.reduce((sum, session) => {
        const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
        return sum + viewed.length;
      }, 0);

      const avgTutorials = totalSessions > 0 ? totalTutorials / totalSessions : 0;

      const conversionRate = totalSessions > 0
        ? (convertedSessions / totalSessions) * 100
        : 0;

      return {
        totalSessions,
        convertedSessions,
        unconvertedSessions: totalSessions - convertedSessions,
        conversionRate: Math.round(conversionRate * 100) / 100,
        avgTutorialsViewed: Math.round(avgTutorials * 100) / 100,
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      throw error;
    }
  }

  /**
   * Get top converting tutorials (which tutorials lead to signups)
   */
  static async getTopConvertingTutorials(limit: number = 10) {
    try {
      const sessions = await prisma.anonymousSession.findMany({
        where: {
          convertedToUserId: { not: null },
        },
        select: {
          tutorialsViewed: true,
        },
      });

      // Count tutorial views that led to conversion
      const tutorialCounts: { [key: string]: { count: number; slug: string } } = {};

      sessions.forEach(session => {
        const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
        viewed.forEach((tutorial) => {
          const id = tutorial.tutorialId;
          if (!tutorialCounts[id]) {
            tutorialCounts[id] = { count: 0, slug: tutorial.slug || '' };
          }
          tutorialCounts[id].count++;
        });
      });

      // Sort and return top tutorials
      return Object.entries(tutorialCounts)
        .map(([tutorialId, data]) => ({
          tutorialId,
          slug: data.slug,
          conversions: data.count,
        }))
        .sort((a, b) => b.conversions - a.conversions)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting top converting tutorials:', error);
      throw error;
    }
  }

  /**
   * Get conversion funnel data
   */
  static async getConversionFunnel() {
    try {
      const stats = await this.getSessionStats();

      // Get sessions by tutorial count
      const sessions = await prisma.anonymousSession.findMany({
        select: {
          tutorialsViewed: true,
          convertedToUserId: true,
        },
      });

      const funnel = {
        '0_tutorials': { total: 0, converted: 0 },
        '1_tutorial': { total: 0, converted: 0 },
        '2-3_tutorials': { total: 0, converted: 0 },
        '4-5_tutorials': { total: 0, converted: 0 },
        '5+_tutorials': { total: 0, converted: 0 },
      };

      sessions.forEach(session => {
        const viewed = (session.tutorialsViewed as unknown as TutorialView[]) || [];
        const count = viewed.length;
        const converted = !!session.convertedToUserId;

        let bucket: keyof typeof funnel = '0_tutorials';
        if (count === 0) bucket = '0_tutorials';
        else if (count === 1) bucket = '1_tutorial';
        else if (count <= 3) bucket = '2-3_tutorials';
        else if (count <= 5) bucket = '4-5_tutorials';
        else bucket = '5+_tutorials';

        funnel[bucket].total++;
        if (converted) funnel[bucket].converted++;
      });

      // Calculate conversion rates
      const funnelWithRates = Object.entries(funnel).map(([bucket, data]) => ({
        bucket,
        total: data.total,
        converted: data.converted,
        conversionRate: data.total > 0
          ? Math.round((data.converted / data.total) * 10000) / 100
          : 0,
      }));

      return {
        ...stats,
        funnel: funnelWithRates,
      };
    } catch (error) {
      console.error('Error getting conversion funnel:', error);
      throw error;
    }
  }
}
