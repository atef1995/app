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
import { useFeedbackTrigger } from "@/hooks/useFeedbackTrigger";
import getMoodColors from "@/lib/getMoodColors";
import TutorialLoading from "../../app/tutorials/category/[category]/[slug]/loading";
import TutorialHeader from "@/components/tutorial/TutorialHeader";
import TutorialContent from "@/components/tutorial/TutorialContent";
import TutorialQuizSection from "@/components/tutorial/TutorialQuizSection";
import TutorialNavigation from "@/components/tutorial/TutorialNavigation";
import AccessControlWrapper from "@/components/tutorial/AccessControlWrapper";
import AccessWarningBanner from "@/components/tutorial/AccessWarningBanner";
import TutorialErrorState from "@/components/tutorial/TutorialErrorState";
import AnonymousProgressBanner from "@/components/tutorial/AnonymousProgressBanner";
import AnonymousLimitReached from "@/components/tutorial/AnonymousLimitReached";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";
import { submitFeedback } from "@/lib/services/feedbackService";
import { FeedbackFormData } from "@/types/feedback";

// Import anonymous tracking utilities
import {
  getAnonymousId,
  trackAnonymousTutorialView,
  hasReachedAnonymousLimit,
  updateAnonymousTutorialTime,
  getDeviceType,
  getBrowserName,
  getOSName,
} from "@/lib/anonymousId";

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

  // Initialize feedback trigger system (only for authenticated users)
  const {
    shouldShowModal: shouldShowFeedback,
    currentTutorial: feedbackTutorial,
    onTutorialComplete: handleFeedbackTrigger,
    onFeedbackSubmit: handleFeedbackSubmitted,
    onFeedbackDismiss: handleFeedbackDismissed,
  } = useFeedbackTrigger({
    config: {
      showAfterFirst: true,
      minInterval: 3,
      maxInterval: 5,
      useVariableIntervals: true,
      respectSessionDismissals: true,
    },
    minHoursBetweenPrompts: 24,
  });

  // Track tutorial start when tutorial loads
  useTutorialStart({
    tutorialId: tutorial?.id,
    canAccess: accessCheck.canAccess,
  });

  // Track tutorial completion when user finishes reading
  const { hasCompletedReading, isCompleting } = useTutorialCompletion({
    tutorialId: tutorial?.id,
    canAccess: accessCheck.canAccess,
    onComplete: (tutorialId) => {
      // Trigger feedback modal check when tutorial is completed
      if (!isAnonymous && tutorial) {
        handleFeedbackTrigger({
          tutorialId,
          tutorialSlug: tutorial.slug,
          tutorialTitle: tutorial.title,
          completedAt: new Date(),
        });
      }
    },
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
      fetch("/api/anonymous/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId,
          tutorialId: tutorial.id,
          tutorialSlug: slug,
          action: "VIEW",
          device: getDeviceType(),
          browser: getBrowserName(),
          os: getOSName(),
        }),
      }).catch((err) => console.error("Failed to track anonymous view:", err));

      // Track time spent every 30 seconds
      const interval = setInterval(() => {
        updateAnonymousTutorialTime(tutorial.id, 30);

        fetch("/api/anonymous/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anonymousId,
            tutorialId: tutorial.id,
            action: "TIME_UPDATE",
            timeSpent: 30,
          }),
        }).catch((err) => console.error("Failed to track time:", err));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAnonymous, tutorial?.id, slug, category]);

  const moodColors = getMoodColors(currentMood.id);

  /**
   * Handle feedback submission
   * Submits feedback to API and updates trigger state
   */
  const handleFeedbackSubmit = async (formData: FeedbackFormData) => {
    if (!feedbackTutorial) return;

    try {
      await submitFeedback({
        tutorialId: feedbackTutorial.tutorialId,
        rating: formData.rating!,
        helpful: formData.difficulty === "just-right",
        difficulty: formData.difficulty,
        feedback: formData.feedback,
        tags: formData.tags,
        quizHelpful: formData.quizHelpful,
        improvementAreas: formData.improvementAreas,
        positiveAspects: formData.positiveAspects,
        isAnonymous: formData.isAnonymous,
      });

      // Notify feedback system of successful submission
      handleFeedbackSubmitted(feedbackTutorial.tutorialId);
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      throw error;
    }
  };

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

      {/* Feedback Modal - only shown for authenticated users */}
      {!isAnonymous && shouldShowFeedback && feedbackTutorial && (
        <FeedbackModal
          isOpen={shouldShowFeedback}
          onClose={handleFeedbackDismissed}
          tutorialId={feedbackTutorial.tutorialId}
          tutorialTitle={feedbackTutorial.tutorialTitle}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
}
