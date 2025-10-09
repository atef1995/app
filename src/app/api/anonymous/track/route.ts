/**
 * Anonymous Tracking API
 *
 * Tracks anonymous user activity before signup for conversion attribution.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AnonymousTrackingService } from '@/lib/services/anonymousTrackingService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      anonymousId,
      tutorialId,
      tutorialSlug,
      action,
      timeSpent,
    } = body;

    if (!anonymousId) {
      return NextResponse.json(
        { error: 'Missing anonymousId' },
        { status: 400 }
      );
    }

    // Get additional context from request
    const userAgent = request.headers.get('user-agent') || undefined;
    const referrer = request.headers.get('referer') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') ||
                      request.headers.get('x-real-ip') ||
                      undefined;

    // Extract UTM params from referrer if available
    let source, medium, campaign, landingPage;
    if (referrer) {
      try {
        const url = new URL(referrer);
        source = url.searchParams.get('utm_source') || undefined;
        medium = url.searchParams.get('utm_medium') || undefined;
        campaign = url.searchParams.get('utm_campaign') || undefined;
        landingPage = url.pathname + url.search;
      } catch {
        // Invalid URL, ignore
      }
    }

    // Get device info from body (sent from client)
    const { device, browser, os } = body;

    // Track the activity
    await AnonymousTrackingService.trackAnonymousSession({
      anonymousId,
      tutorialId,
      tutorialSlug,
      action,
      timeSpent,
      source,
      medium,
      campaign,
      landingPage,
      referrer,
      userAgent,
      device,
      browser,
      os,
      ipAddress,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking anonymous activity:', error);
    return NextResponse.json(
      { error: 'Failed to track activity' },
      { status: 500 }
    );
  }
}
