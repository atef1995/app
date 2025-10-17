"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import { useState } from "react";
import { ChallengeWithTests } from "@/lib/challengeService";
import Card, { CardAction } from "@/components/ui/Card";
import { PageLayout } from "@/components/ui/PageLayout";
import { MoodInfoCard } from "@/components/ui/MoodInfoCard";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { usePremiumContentHandler } from "@/hooks/usePremiumContentHandler";
import { useMoodColors } from "@/hooks/useMoodColors";
import { useChallengesWithFilters } from "@/hooks/useChallenges";
import { useChallengeProgress } from "@/hooks/useProgress";
import { SignupCTA } from "@/components/SignupCTA";
import {
  Search,
  Monitor,
  Zap,
  FileText,
  Folder,
  Puzzle,
  Calculator,
  CheckCircle,
  Clock,
} from "lucide-react";
import { challengeTypes, difficultyLevels } from "@/lib/challengeData";

export default function PracticePage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const { handlePremiumContent } = usePremiumContentHandler();
  const moodColors = useMoodColors();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Use TanStack Query hook for challenges with filters
  const {
    data: challenges = [],
    isLoading: loading,
    error: challengesError,
    isError: hasChallengesError,
  } = useChallengesWithFilters({
    type: selectedType,
    difficulty: selectedDifficulty,
  });

  // Get challenge progress for completion status
  const { data: challengeProgress = {}, isLoading: progressLoading } =
    useChallengeProgress(session?.user?.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "hard":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800";
    }
  };

  // Handle premium challenge click
  const handleChallengeClick = (challenge: ChallengeWithTests) => {
    handlePremiumContent(
      {
        title: challenge.title,
        isPremium: challenge.isPremium,
        requiredPlan:
          challenge.requiredPlan === "FREE" ? "VIBED" : challenge.requiredPlan,
        type: "challenge" as const,
      },
      () => {
        window.location.href = `/practice/${challenge.slug}`;
      }
    );
  };

  const getTypeIcon = (type: string) => {
    const iconClass = "h-6 w-6";
    switch (type) {
      case "algorithm":
        return (
          <Calculator
            className={`${iconClass} text-blue-600 dark:text-blue-400`}
          />
        );
      case "function":
        return (
          <Zap
            className={`${iconClass} text-yellow-600 dark:text-yellow-400`}
          />
        );
      case "array":
        return (
          <FileText
            className={`${iconClass} text-green-600 dark:text-green-400`}
          />
        );
      case "object":
        return (
          <Folder
            className={`${iconClass} text-purple-600 dark:text-purple-400`}
          />
        );
      case "logic":
        return (
          <Puzzle className={`${iconClass} text-red-600 dark:text-red-400`} />
        );
      default:
        return (
          <Monitor
            className={`${iconClass} text-gray-600 dark:text-gray-400`}
          />
        );
    }
  };

  const getChallengeStatus = (challengeId: string) => {
    const progress = challengeProgress[challengeId];
    if (!progress) return "NOT_STARTED";
    return progress.status;
  };

  const getStatusIndicator = (challengeId: string) => {
    const status = getChallengeStatus(challengeId);

    switch (status) {
      case "COMPLETED":
        return (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-xs font-medium">Completed</span>
          </div>
        );
      case "IN_PROGRESS":
        return (
          <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-medium">In Progress</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Handle challenges loading error
  if (hasChallengesError) {
    return (
      <PageLayout
        title="Practice Challenges"
        subtitle="Sharpen your JavaScript skills with hands-on coding challenges"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Error loading challenges:{" "}
              {challengesError?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Practice Challenges"
      subtitle="Sharpen your JavaScript skills with hands-on coding challenges"
      className="relative"
    >
      {/* Header Icon */}
      <div className="absolute top-6 right-6">
        <Monitor className="h-10 w-10 text-purple-600 dark:text-purple-400" />
      </div>

      {/* Show signup CTA for anonymous users */}
      {!session && (
        <div className="mb-12">
          <SignupCTA
            variant="banner"
            showBenefits={true}
            message="Start Coding Challenges to Build Real Skills"
          />
        </div>
      )}

      {/* Mood Info Card */}
      {session && <MoodInfoCard className="mb-8" />}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Filter Challenges
        </h2>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              aria-label="Filter by difficulty"
            >
              {difficultyLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              aria-label="Filter by challenge type"
            >
              {challengeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading challenges...
          </p>
        </div>
      ) : (
        <ContentGrid columns="3" className="mb-8">
          {challenges.map((challenge) => {
            return (
              <Card
                key={challenge.id}
                isPremium={challenge.isPremium}
                requiredPlan={
                  challenge.requiredPlan === "FREE"
                    ? "VIBED"
                    : (challenge.requiredPlan as "VIBED" | "CRACKED")
                }
                onPremiumClick={() => handleChallengeClick(challenge)}
                onClick={() => handleChallengeClick(challenge)}
                title={challenge.title}
                description={challenge.description}
                className="h-full"
                actions={
                  <div className="flex items-center justify-between w-full">
                    <CardAction.TimeInfo time={challenge.estimatedTime} />
                    <CardAction.Primary
                      onClick={() => handleChallengeClick(challenge)}
                    >
                      {getChallengeStatus(challenge.id) === "COMPLETED"
                        ? "Review Challenge"
                        : getChallengeStatus(challenge.id) === "IN_PROGRESS"
                        ? "Continue Challenge"
                        : "Start Challenge"}
                    </CardAction.Primary>
                  </div>
                }
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex justify-center">
                    {getTypeIcon(challenge.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    {progressLoading ? (
                      <div className="flex items-center gap-1">
                        <span className="p-2 rounded-full  text-xs font-medium blur-sm animate-pulse bg-gray-500/50">
                          Completed
                        </span>
                      </div>
                    ) : (
                      getStatusIndicator(challenge.id)
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {challenge.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {challenge.description}
                </p>

                {/* Mood-adapted description */}
                <div className={`${moodColors.bg} rounded-lg p-3`}>
                  <p className={`${moodColors.text} text-xs leading-relaxed`}>
                    {challenge.moodAdaptations.find(
                      (adaptation) =>
                        adaptation.mood.toLowerCase() ===
                        currentMood.id.toLowerCase()
                    )?.content || "Get ready to tackle this challenge!"}
                  </p>
                </div>
              </Card>
            );
          })}
        </ContentGrid>
      )}

      {/* No Results */}
      {!session === false && challenges.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mb-4 flex justify-center">
            <Search className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No challenges found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more challenges
          </p>
        </div>
      )}
    </PageLayout>
  );
}
