"use client";

import React, { useState } from "react";
import { useMood } from "@/components/providers/MoodProvider";
import { useTutorial } from "@/hooks/useTutorial";
import { useTutorialNavigation } from "@/hooks/useTutorialNavigation";
import { useSubscription, checkContentAccess } from "@/hooks/useSubscription";
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

interface TutorialClientProps {
  category: string;
  slug: string;
}

export default function TutorialClient({
  category,
  slug,
}: TutorialClientProps) {
  const { currentMood } = useMood();
  const [contentLoaded, setContentLoaded] = useState(false);
  const { data } = useSubscription();

  // Use TanStack Query hook for tutorial data
  const { data: tutorial, isLoading, error, isError } = useTutorial(slug);

  // Use navigation hook for prev/next tutorial navigation
  const { data: navigationData, isLoading: isNavigationLoading } =
    useTutorialNavigation(slug, category);

  // Check if user can access this tutorial
  const accessCheck = tutorial
    ? checkContentAccess(
        data,
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

  const moodColors = getMoodColors(currentMood.id);

  // Handle loading state
  if (isLoading) {
    return <TutorialLoading />;
  }

  // Handle error state
  if (isError || !tutorial) {
    return <TutorialErrorState error={error?.message} category={category} />;
  }

  // Handle access control
  if (!accessCheck.canAccess) {
    return (
      <AccessControlWrapper accessCheck={accessCheck} category={category}>
        {null}
      </AccessControlWrapper>
    );
  }

  // Main render
  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
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
