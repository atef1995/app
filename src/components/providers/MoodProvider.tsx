"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { MoodConfig, MoodId, UserMoodPreferences } from "@/types/mood";
import { MOODS } from "@/lib/moods";

interface MoodContextType {
  currentMood: MoodConfig;
  setMood: (moodId: MoodId) => void;
  isLoading: boolean;
  preferences: UserMoodPreferences | null;
  updatePreferences: (preferences: Partial<UserMoodPreferences>) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

export function MoodProvider({ children }: MoodProviderProps) {
  const [currentMoodId, setCurrentMoodId] = useState<MoodId>("chill");
  const [preferences, setPreferences] = useState<UserMoodPreferences | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Load user preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
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
  }, []);

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

  const setMood = (moodId: MoodId) => {
    setCurrentMoodId(moodId);
    setPreferences((prev) =>
      prev ? { ...prev, selectedMood: moodId } : { selectedMood: moodId }
    );
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
