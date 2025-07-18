"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { MoodConfig, MoodId, UserMoodPreferences } from "@/types/mood";
import { MOODS } from "@/lib/moods";

interface MoodContextType {
  currentMood: MoodConfig;
  setMood: (moodId: MoodId) => Promise<void>;
  isLoading: boolean;
  preferences: UserMoodPreferences | null;
  updatePreferences: (preferences: Partial<UserMoodPreferences>) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export function MoodProvider({ children }: MoodProviderProps) {
  const { data: session } = useSession();
  const [currentMoodId, setCurrentMoodId] = useState<MoodId>("chill");
  const [preferences, setPreferences] = useState<UserMoodPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences from session first, then localStorage as fallback
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Check for mood selected on homepage first (priority for new users)
        const selectedMoodFromHomepage = localStorage.getItem("selectedMood");
        if (selectedMoodFromHomepage && session?.user) {
          // User just signed in after selecting a mood on homepage
          const homepageMood = selectedMoodFromHomepage as MoodId;
          const homepagePrefs: UserMoodPreferences = {
            selectedMood: homepageMood,
          };
          setPreferences(homepagePrefs);
          setCurrentMoodId(homepageMood);

          // Update the database immediately for authenticated users
          try {
            const response = await fetch("/api/user/mood", {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ mood: homepageMood.toUpperCase() }),
            });

            if (!response.ok) {
              console.error("Failed to update mood in database");
            }
          } catch (error) {
            console.error("Error updating mood:", error);
          }

          // Clean up the temporary storage
          localStorage.removeItem("selectedMood");
          setIsLoading(false);
          return;
        }

        // If user is logged in, use session mood
        if (session?.user?.mood) {
          const sessionMood = session.user.mood.toLowerCase() as MoodId;
          const sessionPrefs: UserMoodPreferences = {
            selectedMood: sessionMood,
          };
          setPreferences(sessionPrefs);
          setCurrentMoodId(sessionMood);
          setIsLoading(false);
          return;
        }

        // Fallback to localStorage for non-authenticated users or existing preferences
        const saved = localStorage.getItem("mood-preferences");
        if (saved) {
          const parsed: UserMoodPreferences = JSON.parse(saved);
          setPreferences(parsed);
          setCurrentMoodId(parsed.selectedMood);
        } else {
          // Set default preferences
          const defaultPrefs: UserMoodPreferences = {
            selectedMood: "chill",
          };
          setPreferences(defaultPrefs);
        }
      } catch (error) {
        console.error("Error loading mood preferences:", error);
        const defaultPrefs: UserMoodPreferences = {
          selectedMood: "chill",
        };
        setPreferences(defaultPrefs);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [session]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (preferences && !isLoading) {
      try {
        localStorage.setItem("mood-preferences", JSON.stringify(preferences));
      } catch (error) {
        console.error("Error saving mood preferences:", error);
      }
    }
  }, [preferences, isLoading]);

  const setMood = async (moodId: MoodId) => {
    setCurrentMoodId(moodId);
    const newPreferences = preferences
      ? { ...preferences, selectedMood: moodId }
      : { selectedMood: moodId };

    setPreferences(newPreferences);

    // If user is authenticated, update the database
    if (session?.user) {
      try {
        const response = await fetch("/api/user/mood", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mood: moodId.toUpperCase() }),
        });

        if (!response.ok) {
          console.error("Failed to update mood in database");
        }
        // Note: Session will be updated on next page load/refresh
        // Avoiding session.update() here prevents unnecessary page refresh
      } catch (error) {
        console.error("Error updating mood:", error);
      }
    }
  };

  const updatePreferences = (newPreferences: Partial<UserMoodPreferences>) => {
    setPreferences((prev) =>
      prev
        ? { ...prev, ...newPreferences }
        : { selectedMood: currentMoodId, ...newPreferences }
    );
  };

  const currentMood = MOODS[currentMoodId];

  // Apply theme to document root
  useEffect(() => {
    if (currentMood && !isLoading) {
      const root = document.documentElement;
      root.style.setProperty("--mood-primary", currentMood.theme.primary);
      root.style.setProperty("--mood-secondary", currentMood.theme.secondary);
      root.style.setProperty("--mood-background", currentMood.theme.background);
      root.style.setProperty("--mood-text", currentMood.theme.text);
      root.style.setProperty("--mood-accent", currentMood.theme.accent);
    }
  }, [currentMood, isLoading]);

  const value: MoodContextType = {
    currentMood,
    setMood,
    isLoading,
    preferences,
    updatePreferences,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
}
