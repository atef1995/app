/**
 * Anonymous User Identification and Tracking
 *
 * Manages anonymous user sessions before signup for conversion tracking
 * and freemium browsing experience.
 */

const ANONYMOUS_ID_KEY = 'vibed_anonymous_id';
const SESSION_DATA_KEY = 'vibed_anonymous_session';
const ANONYMOUS_TUTORIAL_LIMIT = 5;

export interface AnonymousTutorialView {
  tutorialId: string;
  slug: string;
  category: string;
  startedAt: string;
  timeSpent: number;
}

export interface AnonymousSessionData {
  anonymousId: string;
  tutorialsViewed: AnonymousTutorialView[];
  source?: string;
  medium?: string;
  campaign?: string;
  landingPage?: string;
  createdAt: string;
}

/**
 * Generate browser fingerprint (simple version)
 *
 * Note: This is a basic fingerprint. For production, consider using
 * a library like FingerprintJS for more robust identification.
 */
function generateFingerprint(): string {
  if (typeof window === 'undefined') return 'server';

  const nav = navigator;
  const screen = window.screen;

  const components = [
    nav.userAgent,
    nav.language,
    screen.colorDepth.toString(),
    `${screen.width}x${screen.height}`,
    new Date().getTimezoneOffset().toString(),
    !!window.sessionStorage ? '1' : '0',
    !!window.localStorage ? '1' : '0',
  ];

  // Simple hash function
  const fingerprint = components.join('###');
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(36);
}

/**
 * Get or create anonymous ID
 *
 * Creates a unique identifier for anonymous users by combining:
 * - Browser fingerprint
 * - Random string
 * - Timestamp
 */
export function getAnonymousId(): string {
  if (typeof window === 'undefined') return ''; // SSR safety

  let anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);

  if (!anonymousId) {
    // Create new anonymous ID: fingerprint + random + timestamp
    const fingerprint = generateFingerprint();
    const random = Math.random().toString(36).substring(2, 15);
    const timestamp = Date.now().toString(36);

    anonymousId = `anon_${fingerprint}_${random}_${timestamp}`;
    localStorage.setItem(ANONYMOUS_ID_KEY, anonymousId);

    // Initialize session data
    const sessionData: AnonymousSessionData = {
      anonymousId,
      tutorialsViewed: [],
      createdAt: new Date().toISOString(),
    };

    // Extract UTM parameters if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('utm_source')) {
      sessionData.source = urlParams.get('utm_source') || undefined;
      sessionData.medium = urlParams.get('utm_medium') || undefined;
      sessionData.campaign = urlParams.get('utm_campaign') || undefined;
    }

    // Store landing page
    sessionData.landingPage = window.location.pathname + window.location.search;

    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
  }

  return anonymousId;
}

/**
 * Get anonymous session data
 */
export function getAnonymousSession(): AnonymousSessionData | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(SESSION_DATA_KEY);
  if (!data) {
    // If we have an ID but no session, initialize it
    const anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
    if (anonymousId) {
      const sessionData: AnonymousSessionData = {
        anonymousId,
        tutorialsViewed: [],
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionData));
      return sessionData;
    }
    return null;
  }

  try {
    return JSON.parse(data);
  } catch {
    console.error('Failed to parse anonymous session data');
    return null;
  }
}

/**
 * Track tutorial view for anonymous user
 */
export function trackAnonymousTutorialView(
  tutorialId: string,
  slug: string,
  category: string
): AnonymousSessionData | null {
  const session = getAnonymousSession();
  if (!session) return null;

  // Check if already viewing this tutorial
  const existing = session.tutorialsViewed.find(t => t.tutorialId === tutorialId);

  if (!existing) {
    session.tutorialsViewed.push({
      tutorialId,
      slug,
      category,
      startedAt: new Date().toISOString(),
      timeSpent: 0,
    });

    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));
  }

  return session;
}

/**
 * Update time spent on tutorial
 */
export function updateAnonymousTutorialTime(
  tutorialId: string,
  additionalSeconds: number
): void {
  const session = getAnonymousSession();
  if (!session) return;

  const tutorial = session.tutorialsViewed.find(t => t.tutorialId === tutorialId);
  if (tutorial) {
    tutorial.timeSpent += additionalSeconds;
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(session));
  }
}

/**
 * Check if user has hit anonymous viewing limit
 */
export function hasReachedAnonymousLimit(limit: number = ANONYMOUS_TUTORIAL_LIMIT): boolean {
  const session = getAnonymousSession();
  if (!session) return false;

  return session.tutorialsViewed.length >= limit;
}

/**
 * Get remaining anonymous views
 */
export function getRemainingAnonymousViews(limit: number = ANONYMOUS_TUTORIAL_LIMIT): number {
  const session = getAnonymousSession();
  if (!session) return limit;

  return Math.max(0, limit - session.tutorialsViewed.length);
}

/**
 * Get anonymous tutorial count
 */
export function getAnonymousTutorialCount(): number {
  const session = getAnonymousSession();
  if (!session) return 0;

  return session.tutorialsViewed.length;
}

/**
 * Get anonymous session data for signup conversion
 * This is called when user signs up to migrate their anonymous data
 */
export function getAnonymousDataForConversion() {
  return {
    anonymousId: getAnonymousId(),
    sessionData: getAnonymousSession(),
  };
}

/**
 * Clear anonymous data after successful signup
 * Call this after the anonymous data has been migrated to user account
 */
export function clearAnonymousData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(ANONYMOUS_ID_KEY);
  localStorage.removeItem(SESSION_DATA_KEY);
}

/**
 * Check if current user is anonymous (not logged in)
 */
export function isAnonymousUser(): boolean {
  if (typeof window === 'undefined') return false;

  const anonymousId = localStorage.getItem(ANONYMOUS_ID_KEY);
  return !!anonymousId;
}

/**
 * Get device type from user agent
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Get browser name from user agent
 */
export function getBrowserName(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;

  if (ua.includes('Firefox')) return 'firefox';
  if (ua.includes('SamsungBrowser')) return 'samsung';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'opera';
  if (ua.includes('Trident')) return 'ie';
  if (ua.includes('Edge')) return 'edge';
  if (ua.includes('Chrome')) return 'chrome';
  if (ua.includes('Safari')) return 'safari';

  return 'unknown';
}

/**
 * Get OS name from user agent
 */
export function getOSName(): string {
  if (typeof window === 'undefined') return 'unknown';

  const ua = navigator.userAgent;

  if (ua.includes('Win')) return 'windows';
  if (ua.includes('Mac')) return 'macos';
  if (ua.includes('Linux')) return 'linux';
  if (ua.includes('Android')) return 'android';
  if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) return 'ios';

  return 'unknown';
}

/**
 * Get comprehensive tracking data for anonymous session
 */
export function getAnonymousTrackingData() {
  if (typeof window === 'undefined') return null;

  return {
    anonymousId: getAnonymousId(),
    sessionData: getAnonymousSession(),
    device: getDeviceType(),
    browser: getBrowserName(),
    os: getOSName(),
    userAgent: navigator.userAgent,
    language: navigator.language,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
