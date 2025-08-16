import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
    }

    // In a real implementation, you'd verify the token
    // For now, we'll just update based on email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        emailNotifications: false,
        reminderNotifications: false,
        achievementNotifications: false,
        weeklyProgressReports: false,
      },
      create: {
        userId: user.id,
        emailNotifications: false,
        reminderNotifications: false,
        achievementNotifications: false,
        weeklyProgressReports: false,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/unsubscribe?success=true`,
      { status: 302 }
    );
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/unsubscribe?error=true`,
      { status: 302 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await prisma.userSettings.upsert({
      where: {
        userId: user.id,
      },
      update: {
        emailNotifications: false,
        reminderNotifications: false,
        achievementNotifications: false,
        weeklyProgressReports: false,
      },
      create: {
        userId: user.id,
        emailNotifications: false,
        reminderNotifications: false,
        achievementNotifications: false,
        weeklyProgressReports: false,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from all emails',
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}