/**
 * Check Anonymous Limit API
 *
 * Checks if an anonymous user has reached the tutorial viewing limit.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnonymousTrackingService } from '@/lib/services/anonymousTrackingService';

const ANONYMOUS_TUTORIAL_LIMIT = 5;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const anonymousId = searchParams.get('anonymousId');

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Missing anonymousId' },
        { status: 400 }
      );
    }

    const session = await AnonymousTrackingService.getAnonymousSession(anonymousId);

    if (!session) {
      return NextResponse.json({
        limitReached: false,
        viewedCount: 0,
        limit: ANONYMOUS_TUTORIAL_LIMIT,
        remainingViews: ANONYMOUS_TUTORIAL_LIMIT,
      });
    }

    const tutorialsViewed = (session.tutorialsViewed as Array<{ tutorialId: string }>) || [];
    const viewedCount = tutorialsViewed.length;
    const limitReached = viewedCount >= ANONYMOUS_TUTORIAL_LIMIT;

    return NextResponse.json({
      limitReached,
      viewedCount,
      limit: ANONYMOUS_TUTORIAL_LIMIT,
      remainingViews: Math.max(0, ANONYMOUS_TUTORIAL_LIMIT - viewedCount),
    });
  } catch (error) {
    console.error('Error checking anonymous limit:', error);
    return NextResponse.json(
      { error: 'Failed to check limit' },
      { status: 500 }
    );
  }
}
