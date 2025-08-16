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
    const { userIds, promotion } = body;

    if (!promotion || !promotion.title || !promotion.description || !promotion.ctaText || !promotion.ctaUrl) {
      return NextResponse.json({ error: 'Missing required promotion fields' }, { status: 400 });
    }

    // Get users who have email notifications enabled
    const targetUsers = await prisma.user.findMany({
      where: {
        id: userIds ? { in: userIds } : undefined,
        userSettings: {
          emailNotifications: true,
        },
      },
      include: {
        userSettings: true,
      },
    });

    const results = [];
    
    for (const user of targetUsers) {
      try {
        const result = await emailService.sendPromotionalEmail(user, promotion);
        results.push({
          userId: user.id,
          email: user.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
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
      totalUsers: targetUsers.length,
      results,
    });
  } catch (error) {
    console.error('Error sending promotional emails:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get promotional email statistics
export async function GET() {
  try {
    // Check if user is admin
    const adminCheck = await requireAdmin();
    if (adminCheck) return adminCheck;

    const usersWithEmailEnabled = await prisma.user.count({
      where: {
        userSettings: {
          emailNotifications: true,
        },
      },
    });

    const totalUsers = await prisma.user.count();

    return NextResponse.json({
      totalUsers,
      usersWithEmailEnabled,
      eligibleForPromotions: usersWithEmailEnabled,
    });
  } catch (error) {
    console.error('Error getting promotional email stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}