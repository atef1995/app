"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { useTutorial } from "@/hooks/useTutorial";
import { useTutorialNavigation } from "@/hooks/useTutorialNavigation";
import { checkContentAccess } from "@/hooks/useSubscription";
import { useTutorialStart } from "@/hooks/useTutorialStart";
import { useTutorialCompletion } from "@/hooks/useTutorialCompletion";
import { useProgressiveLoading } from "@/hooks/useProgressiveLoading";
import getMoodColors from "@/lib/getMoodColors";
import TutorialLoading from "../../app/tutorials/category/[category]/[slug]/loading";

// Import new components
import TutorialHeader from "@/components/tutorial/TutorialHeader";
import TutorialContent from "@/components/tutorial/TutorialContent";
import TutorialQuizSection from "@/components/tutorial/TutorialQuizSection";
import TutorialNavigation from "@/components/tutorial/TutorialNavigation";
import AccessControlWrapper from "@/components/tutorial/AccessControlWrapper";
import AccessWarningBanner from "@/components/tutorial/AccessWarningBanner";
import TutorialErrorState from "@/components/tutorial/TutorialErrorState";
import AnonymousProgressBanner from "@/components/tutorial/AnonymousProgressBanner";
import AnonymousLimitReached from "@/components/tutorial/AnonymousLimitReached";

// Import anonymous tracking utilities
import {
  getAnonymousId,
  trackAnonymousTutorialView,
  hasReachedAnonymousLimit,
  updateAnonymousTutorialTime,
  getDeviceType,
  getBrowserName,
  getOSName,
} from '@/lib/anonymousId';

interface TutorialClientProps {
  category: string;
  slug: string;
  isAnonymous?: boolean;
}

export default function TutorialClient({
  category,
  slug,
  isAnonymous = false,
}: TutorialClientProps) {
  const { currentMood } = useMood();
  const [contentLoaded, setContentLoaded] = useState(false);
  const [anonymousLimitReached, setAnonymousLimitReached] = useState(false);

  // Get session directly instead of making API call
  // subscriptionInfo is pre-loaded in the session to prevent repeated DB queries
  const { data: session } = useSession();
  const subscriptionInfo = session?.user?.subscriptionInfo;

  // Use TanStack Query hook for tutorial data
  const { data: tutorial, isLoading, error, isError } = useTutorial(slug);

  // Use navigation hook for prev/next tutorial navigation
  const { data: navigationData, isLoading: isNavigationLoading } =
    useTutorialNavigation(slug, category);

  // Check if user can access this tutorial using cached session subscription
  const accessCheck = tutorial
    ? checkContentAccess(
        subscriptionInfo,
        tutorial.requiredPlan || tutorial.meta?.requiredPlan,
        tutorial.isPremium || tutorial.meta?.isPremium
      )
    : { canAccess: true };

  // Track tutorial start when tutorial loads
  useTutorialStart({
    tutorialId: tutorial?.id,
    canAccess: accessCheck.canAccess,
  });

  // Track tutorial completion when user finishes reading
  const { hasCompletedReading, isCompleting } = useTutorialCompletion({
    tutorialId: tutorial?.id,
    canAccess: accessCheck.canAccess,
  });

  // Progressive content loading
  useProgressiveLoading({
    mdxSource: tutorial?.mdxSource,
    onLoaded: () => setContentLoaded(true),
  });

  // Handle anonymous tracking
  useEffect(() => {
    if (isAnonymous && tutorial?.id) {
      // Check if limit reached
      if (hasReachedAnonymousLimit(5)) {
        setAnonymousLimitReached(true);
        return;
      }

      // Track tutorial view
      trackAnonymousTutorialView(tutorial.id, slug, category);

      // Send tracking data to server
      const anonymousId = getAnonymousId();
      fetch('/api/anonymous/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymousId,
          tutorialId: tutorial.id,
          tutorialSlug: slug,
          action: 'VIEW',
          device: getDeviceType(),
          browser: getBrowserName(),
          os: getOSName(),
        }),
      }).catch(err => console.error('Failed to track anonymous view:', err));

      // Track time spent every 30 seconds
      const interval = setInterval(() => {
        updateAnonymousTutorialTime(tutorial.id, 30);

        fetch('/api/anonymous/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonymousId,
            tutorialId: tutorial.id,
            action: 'TIME_UPDATE',
            timeSpent: 30,
          }),
        }).catch(err => console.error('Failed to track time:', err));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAnonymous, tutorial?.id, slug, category]);

  const moodColors = getMoodColors(currentMood.id);

  // Handle loading state
  if (isLoading) {
    return <TutorialLoading />;
  }

  // Handle error state
  if (isError || !tutorial) {
    return <TutorialErrorState error={error?.message} category={category} />;
  }

  // Handle anonymous limit reached
  if (isAnonymous && anonymousLimitReached) {
    return <AnonymousLimitReached category={category} />;
  }

  // Handle access control (for authenticated users)
  if (!isAnonymous && !accessCheck.canAccess) {
    return (
      <AccessControlWrapper accessCheck={accessCheck} category={category}>
        {null}
      </AccessControlWrapper>
    );
  }

  // Main render
  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      {/* Show anonymous progress banner */}
      {isAnonymous && <AnonymousProgressBanner />}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tutorial Header */}
          <TutorialHeader tutorial={tutorial} category={category} />

          {/* Access Warning Banner */}
          <AccessWarningBanner accessCheck={accessCheck} />

          {/* Tutorial Content */}
          <TutorialContent tutorial={tutorial} contentLoaded={contentLoaded} />

          {/* Quiz Section */}
          <TutorialQuizSection
            tutorial={tutorial}
            contentLoaded={contentLoaded}
          />

          {/* Tutorial Navigation */}
          <TutorialNavigation
            category={category}
            navigationData={navigationData?.data}
            isLoading={isNavigationLoading}
          />
        </div>
      </div>
    </div>
  );
}
