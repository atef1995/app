import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';
import { requireAdmin } from '@/lib/auth-utils';

export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const body = await req.json();
    const { userIds, daysInactive = 3 } = body;

    // Find users who haven't been active recently and have reminder notifications enabled
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        id: userIds ? { in: userIds } : undefined,
        userSettings: {
          reminderNotifications: true,
        },
        // Users who haven't had recent progress
        OR: [
          {
            progress: {
              none: {
                updatedAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
          {
            tutorialProgress: {
              none: {
                updatedAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
          {
            challengeAttempts: {
              none: {
                createdAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
        ],
      },
      include: {
        userSettings: true,
        progress: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
        tutorialProgress: {
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
          include: {
            tutorial: true,
          },
        },
        challengeProgress: {
          where: {
            status: 'IN_PROGRESS',
          },
          take: 1,
          include: {
            challenge: true,
          },
        },
      },
    });

    const results = [];
    
    for (const user of inactiveUsers) {
      try {
        // Determine last activity and next suggested content
        const lastProgress = user.progress[0] || user.tutorialProgress[0];
        const lastActive = lastProgress?.updatedAt || user.createdAt;
        
        // Find next lesson or challenge
        let nextLesson = null;
        if (user.tutorialProgress[0]?.tutorial) {
          nextLesson = user.tutorialProgress[0].tutorial.title;
        } else if (user.challengeProgress[0]?.challenge) {
          nextLesson = user.challengeProgress[0].challenge.title;
        }

        // Calculate streak (simplified - could be more sophisticated)
        const recentProgress = await prisma.progress.count({
          where: {
            userId: user.id,
            updatedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
            },
          },
        });

        const reminderData = {
          lastActive,
          streak: recentProgress > 0 ? recentProgress : undefined,
          nextLesson: nextLesson || undefined,
        };

        const result = await emailService.sendStudyReminderEmail(user, reminderData);
        
        results.push({
          userId: user.id,
          email: user.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          lastActive,
          nextLesson,
        });
      } catch (error) {
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      totalUsers: inactiveUsers.length,
      results,
    });
  } catch (error) {
    console.error('Error sending study reminder emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get study reminder statistics
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const { searchParams } = new URL(req.url);
    const daysInactive = parseInt(searchParams.get('days') || '3');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysInactive);

    const inactiveUsersCount = await prisma.user.count({
      where: {
        userSettings: {
          reminderNotifications: true,
        },
        AND: [
          {
            progress: {
              none: {
                updatedAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
          {
            tutorialProgress: {
              none: {
                updatedAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
          {
            challengeAttempts: {
              none: {
                createdAt: {
                  gte: cutoffDate,
                },
              },
            },
          },
        ],
      },
    });

    const usersWithRemindersEnabled = await prisma.user.count({
      where: {
        userSettings: {
          reminderNotifications: true,
        },
      },
    });

    return NextResponse.json({
      inactiveUsersCount,
      usersWithRemindersEnabled,
      daysInactive,
    });
  } catch (error) {
    console.error('Error getting study reminder stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}