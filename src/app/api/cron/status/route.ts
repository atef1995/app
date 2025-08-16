import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(_req: NextRequest) {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    // Get cron job execution history from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cronHistory = await prisma.codeExecution.findMany({
      where: {
        code: {
          startsWith: 'CRON_',
        },
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    // Calculate statistics
    const totalJobs = cronHistory.length;
    const successfulJobs = cronHistory.filter(job => job.success).length;
    const failedJobs = totalJobs - successfulJobs;
    const successRate = totalJobs > 0 ? Math.round((successfulJobs / totalJobs) * 100) : 0;

    // Get last execution details
    const lastExecution = cronHistory[0];
    const lastSuccessfulExecution = cronHistory.find(job => job.success);

    // Group by date for chart data
    const executionsByDate = cronHistory.reduce((acc, job) => {
      const date = job.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, successful: 0, failed: 0, total: 0 };
      }
      acc[date].total++;
      if (job.success) {
        acc[date].successful++;
      } else {
        acc[date].failed++;
      }
      return acc;
    }, {} as Record<string, { date: string; successful: number; failed: number; total: number }>);

    const chartData = Object.values(executionsByDate).slice(-7); // Last 7 days

    // Parse results from recent successful executions to get email stats
    const recentSuccessfulJobs = cronHistory
      .filter(job => job.success && job.result)
      .slice(0, 10);

    const emailStats = recentSuccessfulJobs.reduce((acc, job) => {
      const match = job.result?.match(/Sent (\d+) reminders/);
      if (match) {
        acc.totalEmailsSent += parseInt(match[1]);
        acc.executionCount++;
      }
      return acc;
    }, { totalEmailsSent: 0, executionCount: 0 });

    const avgEmailsPerExecution = emailStats.executionCount > 0 
      ? Math.round(emailStats.totalEmailsSent / emailStats.executionCount) 
      : 0;

    return NextResponse.json({
      status: 'healthy',
      statistics: {
        totalJobs,
        successfulJobs,
        failedJobs,
        successRate,
        avgEmailsPerExecution,
        totalEmailsSent: emailStats.totalEmailsSent,
      },
      lastExecution: lastExecution ? {
        timestamp: lastExecution.createdAt,
        success: lastExecution.success,
        result: lastExecution.result,
        error: lastExecution.error,
        timeSpent: lastExecution.timeSpent,
      } : null,
      lastSuccessfulExecution: lastSuccessfulExecution ? {
        timestamp: lastSuccessfulExecution.createdAt,
        result: lastSuccessfulExecution.result,
        timeSpent: lastSuccessfulExecution.timeSpent,
      } : null,
      chartData,
      recentExecutions: cronHistory.slice(0, 10).map(job => ({
        timestamp: job.createdAt,
        success: job.success,
        result: job.result,
        error: job.error,
        timeSpent: job.timeSpent,
      })),
    });

  } catch (error) {
    console.error('Error fetching cron status:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cron status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}