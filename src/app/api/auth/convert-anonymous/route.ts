/**
 * Convert Anonymous Session API
 *
 * Migrates anonymous user data to authenticated user account after signup.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { AnonymousTrackingService } from '@/lib/services/anonymousTrackingService';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { anonymousId } = body;

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Missing anonymousId' },
        { status: 400 }
      );
    }

    // Convert anonymous session to user
    const result = await AnonymousTrackingService.convertAnonymousToUser(
      anonymousId,
      session.user.id
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Anonymous session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tutorialsMigrated: result.tutorialsMigrated,
      message: result.tutorialsMigrated > 0
        ? `Welcome! We've saved your progress from ${result.tutorialsMigrated} tutorial${result.tutorialsMigrated > 1 ? 's' : ''}.`
        : 'Welcome to Vibed to Cracked!',
    });
  } catch (error) {
    console.error('Error converting anonymous session:', error);
    return NextResponse.json(
      { error: 'Failed to convert session' },
      { status: 500 }
    );
  }
}
