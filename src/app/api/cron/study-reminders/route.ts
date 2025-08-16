import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/lib/services/emailService';

// This endpoint will be called by the cron job
export async function POST(req: NextRequest) {
  try {
    // Verify the request is from our cron job (simple auth token)
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET_TOKEN || 'default-cron-secret';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🕐 Starting automated study reminder job...');
    const jobStartTime = Date.now();

    // Configuration - these could be made configurable via database
    const DEFAULT_INACTIVE_DAYS = 3;
    const BATCH_SIZE = 50; // Process users in batches to avoid overwhelming the email service
    
    // Get current time info for time-based filtering
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    console.log(`🕐 Current time: ${currentTime} (${now.toISOString()})`);

    // Find users who haven't been active recently and have reminder notifications enabled
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - DEFAULT_INACTIVE_DAYS);

    console.log(`📊 Looking for users inactive since: ${cutoffDate.toISOString()}`);

    // Calculate time window (30 minutes before and after current time)
    const timeWindow = 30; // minutes
    const startTime = new Date(now.getTime() - timeWindow * 60 * 1000);
    const endTime = new Date(now.getTime() + timeWindow * 60 * 1000);
    
    const startTimeStr = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')}`;
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
    console.log(`⏰ Looking for users with reminder time between ${startTimeStr} and ${endTimeStr}`);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        userSettings: {
          reminderNotifications: true,
          // Filter by reminder time within the current window
          reminderTime: {
            gte: startTimeStr,
            lte: endTimeStr,
          },
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
          where: {
            completed: false,
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
          include: {
            tutorial: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
        tutorialProgress: {
          where: {
            status: {
              in: ['IN_PROGRESS', 'NOT_STARTED'],
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
          include: {
            tutorial: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
        challengeProgress: {
          where: {
            status: 'IN_PROGRESS',
          },
          take: 1,
          include: {
            challenge: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
      take: BATCH_SIZE,
    });

    console.log(`👥 Found ${inactiveUsers.length} inactive users eligible for reminders`);

    if (inactiveUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No inactive users found',
        stats: {
          totalProcessed: 0,
          emailsSent: 0,
          errors: 0,
          executionTime: Date.now() - jobStartTime,
        },
      });
    }

    const results = [];
    let emailsSent = 0;
    let errors = 0;

    for (const user of inactiveUsers) {
      try {
        // Determine last activity and next suggested content
        const lastProgress = user.progress[0] || user.tutorialProgress[0];
        const lastActive = lastProgress?.updatedAt || user.createdAt;
        
        // Find what the user should work on next
        let nextLesson = null;
        let progressInfo = null;

        if (user.tutorialProgress[0]?.tutorial) {
          nextLesson = user.tutorialProgress[0].tutorial.title;
          progressInfo = {
            type: 'tutorial',
            title: user.tutorialProgress[0].tutorial.title,
            slug: user.tutorialProgress[0].tutorial.slug,
            status: user.tutorialProgress[0].status,
          };
        } else if (user.challengeProgress[0]?.challenge) {
          nextLesson = user.challengeProgress[0].challenge.title;
          progressInfo = {
            type: 'challenge',
            title: user.challengeProgress[0].challenge.title,
            slug: user.challengeProgress[0].challenge.slug,
            status: user.challengeProgress[0].status,
          };
        } else if (user.progress[0]?.tutorial) {
          nextLesson = user.progress[0].tutorial.title;
          progressInfo = {
            type: 'tutorial',
            title: user.progress[0].tutorial.title,
            slug: user.progress[0].tutorial.slug,
            status: 'INCOMPLETE',
          };
        }

        // Calculate streak (count of different days with activity in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentActivities = await prisma.progress.findMany({
          where: {
            userId: user.id,
            updatedAt: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            updatedAt: true,
          },
        });

        // Count unique days of activity
        const uniqueDays = new Set(
          recentActivities.map(activity => 
            activity.updatedAt.toISOString().split('T')[0]
          )
        );
        const streak = uniqueDays.size;

        const reminderData = {
          lastActive,
          streak: streak > 0 ? streak : undefined,
          nextLesson: nextLesson || undefined,
          progressInfo,
        };

        console.log(`📧 Sending reminder to ${user.email} (last active: ${lastActive.toDateString()})`);
        
        const result = await emailService.sendStudyReminderEmail(user, reminderData);
        
        if (result.success) {
          emailsSent++;
          console.log(`✅ Reminder sent to ${user.email}`);
        } else {
          errors++;
          console.error(`❌ Failed to send reminder to ${user.email}:`, result.error);
        }
        
        results.push({
          userId: user.id,
          email: user.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
          lastActive: lastActive.toISOString(),
          nextLesson,
          progressInfo,
        });

        // Add a small delay between emails to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        errors++;
        console.error(`❌ Error processing user ${user.email}:`, error);
        results.push({
          userId: user.id,
          email: user.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const executionTime = Date.now() - jobStartTime;
    
    console.log(`🎉 Cron job completed in ${executionTime}ms`);
    console.log(`📊 Stats: ${emailsSent} sent, ${errors} errors, ${inactiveUsers.length} total processed`);

    // Log the cron job execution to database for monitoring
    try {
      await prisma.codeExecution.create({
        data: {
          code: 'CRON_STUDY_REMINDERS',
          result: `Sent ${emailsSent} reminders, ${errors} errors`,
          success: errors === 0,
          timeSpent: Math.round(executionTime / 1000),
          mood: 'SYSTEM',
          tutorialId: null,
        },
      });
    } catch (logError) {
      console.error('Failed to log cron execution:', logError);
    }

    return NextResponse.json({
      success: true,
      message: `Study reminders cron job completed successfully`,
      stats: {
        totalProcessed: inactiveUsers.length,
        emailsSent,
        errors,
        executionTime,
        cutoffDate: cutoffDate.toISOString(),
      },
      results: process.env.NODE_ENV === 'development' ? results : undefined, // Only include detailed results in dev
    });

  } catch (error) {
    console.error('❌ Cron job failed:', error);
    
    // Log the failed cron job
    try {
      await prisma.codeExecution.create({
        data: {
          code: 'CRON_STUDY_REMINDERS',
          result: 'Cron job failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
          timeSpent: 0,
          mood: 'SYSTEM',
          tutorialId: null,
        },
      });
    } catch (logError) {
      console.error('Failed to log cron failure:', logError);
    }

    return NextResponse.json({ 
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint for testing and manual trigger
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const testMode = searchParams.get('test') === 'true';
  
  if (testMode) {
    console.log('🧪 Running study reminders in test mode...');
    // In test mode, just return what would be processed
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 3);

    const inactiveUsersCount = await prisma.user.count({
      where: {
        userSettings: {
          reminderNotifications: true,
        },
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
        ],
      },
    });

    return NextResponse.json({
      testMode: true,
      message: 'Test mode - no emails sent',
      stats: {
        inactiveUsersCount,
        cutoffDate: cutoffDate.toISOString(),
      },
    });
  }

  return NextResponse.json({
    message: 'Study reminders cron endpoint',
    usage: {
      post: 'Trigger the cron job (requires Bearer token)',
      get: 'Test mode - add ?test=true to see stats without sending emails',
    },
  });
}