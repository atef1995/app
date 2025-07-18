import {
  getAllChallenges as dbGetAllChallenges,
  getChallengeById as dbGetChallengeById,
  getFilteredChallenges as dbGetFilteredChallenges,
  getChallengeTypes as dbGetChallengeTypes,
  getChallengeDifficulties as dbGetChallengeDifficulties,
} from "./challengeService";
import type { Challenge } from "@/types/practice";

// For client-side usage, we'll fetch from API
// For server-side usage, we'll use the database service directly

export async function getAllChallenges(): Promise<Challenge[]> {
  if (typeof window === "undefined") {
    // Server-side: use database service directly
    return await dbGetAllChallenges();
  } else {
    // Client-side: fetch from API
    try {
      const response = await fetch("/api/challenges");
      const data = await response.json();
      return data.challenges || [];
    } catch (error) {
      console.error("Error fetching challenges from API:", error);
      return [];
    }
  }
}

export async function getChallengeById(id: string): Promise<Challenge | null> {
  if (typeof window === "undefined") {
    // Server-side: use database service directly
    return await dbGetChallengeById(id);
  } else {
    // Client-side: fetch from API
    try {
      const response = await fetch(`/api/challenges/${id}`);
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return data.challenge || null;
    } catch (error) {
      console.error("Error fetching challenge from API:", error);
      return null;
    }
  }
}

export async function getFilteredChallenges(filters: {
  type?: string;
  difficulty?: string;
}): Promise<Challenge[]> {
  if (typeof window === "undefined") {
    // Server-side: use database service directly
    return await dbGetFilteredChallenges(filters);
  } else {
    // Client-side: fetch from API
    try {
      const params = new URLSearchParams();
      if (filters.type) params.set("type", filters.type);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);

      const response = await fetch(`/api/challenges?${params.toString()}`);
      const data = await response.json();
      return data.challenges || [];
    } catch (error) {
      console.error("Error fetching filtered challenges from API:", error);
      return [];
    }
  }
}

export async function getChallengeTypes(): Promise<string[]> {
  if (typeof window === "undefined") {
    // Server-side: use database service directly
    return await dbGetChallengeTypes();
  } else {
    // Client-side: derive from all challenges
    const challenges = await getAllChallenges();
    const types = [...new Set(challenges.map((c) => c.type))];
    return types;
  }
}

export async function getChallengeDifficulties(): Promise<string[]> {
  if (typeof window === "undefined") {
    // Server-side: use database service directly
    return await dbGetChallengeDifficulties();
  } else {
    // Client-side: derive from all challenges
    const challenges = await getAllChallenges();
    const difficulties = [...new Set(challenges.map((c) => c.difficulty))];
    return difficulties;
  }
}

// Static filter options for UI
export const challengeTypes = [
  { value: "all", label: "All Types" },
  { value: "function", label: "Functions" },
  { value: "array", label: "Arrays" },
  { value: "object", label: "Objects" },
  { value: "algorithm", label: "Algorithms" },
  { value: "logic", label: "Logic" },
];

export const difficultyLevels = [
  { value: "all", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];
