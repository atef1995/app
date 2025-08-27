"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToastContext } from "@/components/providers/ToastProvider";
import { startTutorialAction } from "@/lib/actions";

interface UnlockedAchievement {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
}

interface UseTutorialStartProps {
  tutorialId: string | undefined;
  canAccess: boolean;
}

export const useTutorialStart = ({ 
  tutorialId, 
  canAccess 
}: UseTutorialStartProps) => {
  const { data: session } = useSession();
  const toast = useToastContext();

  useEffect(() => {
    if (!canAccess || !tutorialId || !session?.user?.id) {
      return;
    }

    // Mark tutorial as started for progress tracking and achievements using server action
    startTutorialAction(tutorialId)
      .then((result) => {
        if (
          result.success &&
          result.achievements &&
          result.achievements.length > 0
        ) {
          // Show achievement notifications
          result.achievements.forEach((achievement: UnlockedAchievement) => {
            toast.achievement(
              `🏆 Achievement Unlocked!`,
              `${achievement.achievement.icon} ${achievement.achievement.title} - ${achievement.achievement.description}`
            );
          });
        }

        if (!result.success && result.error) {
          console.error("Failed to mark tutorial as started:", result.error);
        }
      })
      .catch((error) => {
        console.error("Failed to mark tutorial as started:", error);
      });
  }, [tutorialId, session?.user?.id, toast, canAccess]);
};