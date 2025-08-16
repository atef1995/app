import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userSettings = await prisma.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        emailNotifications: true,
        reminderNotifications: true,
        achievementNotifications: true,
        weeklyProgressReports: true,
        reminderTime: true,
      },
    });

    if (!userSettings) {
      // Create default settings if they don't exist
      const defaultSettings = await prisma.userSettings.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          reminderNotifications: true,
          achievementNotifications: true,
          weeklyProgressReports: false,
          reminderTime: '18:00',
        },
        select: {
          emailNotifications: true,
          reminderNotifications: true,
          achievementNotifications: true,
          weeklyProgressReports: true,
          reminderTime: true,
        },
      });
      
      return NextResponse.json(defaultSettings);
    }

    return NextResponse.json(userSettings);
  } catch (error) {
    console.error('Error getting email preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      emailNotifications,
      reminderNotifications,
      achievementNotifications,
      weeklyProgressReports,
      reminderTime,
    } = body;

    const updatedSettings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        emailNotifications,
        reminderNotifications,
        achievementNotifications,
        weeklyProgressReports,
        reminderTime,
      },
      create: {
        userId: session.user.id,
        emailNotifications: emailNotifications ?? true,
        reminderNotifications: reminderNotifications ?? true,
        achievementNotifications: achievementNotifications ?? true,
        weeklyProgressReports: weeklyProgressReports ?? false,
        reminderTime: reminderTime ?? '18:00',
      },
      select: {
        emailNotifications: true,
        reminderNotifications: true,
        achievementNotifications: true,
        weeklyProgressReports: true,
        reminderTime: true,
      },
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error('Error updating email preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}