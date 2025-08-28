"use client";

import { useEffect, useRef } from "react";
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
  const hasStarted = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!canAccess || !tutorialId || !session?.user?.id) {
      return;
    }

    // Prevent multiple calls for the same tutorial in the same session
    const tutorialKey = `${session.user.id}-${tutorialId}`;
    if (hasStarted.current.has(tutorialKey)) {
      return;
    }

    // Mark tutorial as started for progress tracking and achievements using server action
    startTutorialAction(tutorialId)
      .then((result) => {
        if (result.success) {
          // Mark as started in this session to prevent duplicate calls
          hasStarted.current.add(tutorialKey);
          
          if (result.achievements && result.achievements.length > 0) {
            // Show achievement notifications
            result.achievements.forEach((achievement: UnlockedAchievement) => {
              toast.achievement(
                `🏆 Achievement Unlocked!`,
                `${achievement.achievement.icon} ${achievement.achievement.title} - ${achievement.achievement.description}`
              );
            });
          }
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