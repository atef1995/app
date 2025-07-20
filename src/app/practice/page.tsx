"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Challenge } from "@/types/practice";
import {
  Search,
  Monitor,
  Zap,
  FileText,
  Folder,
  Puzzle,
  Calculator,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  getAllChallenges,
  getFilteredChallenges,
  challengeTypes,
  difficultyLevels,
} from "@/lib/challengeData";

export default function PracticePage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // Load challenges on mount and when filters change
  useEffect(() => {
    async function loadChallenges() {
      setLoading(true);
      try {
        let challengeData;
        if (selectedType === "all" && selectedDifficulty === "all") {
          challengeData = await getAllChallenges();
        } else {
          challengeData = await getFilteredChallenges({
            type: selectedType === "all" ? undefined : selectedType,
            difficulty:
              selectedDifficulty === "all" ? undefined : selectedDifficulty,
          });
        }
        setChallenges(challengeData);
      } catch (error) {
        console.error("Error loading challenges:", error);
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    }

    loadChallenges();
  }, [selectedType, selectedDifficulty]);

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

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient:
            "from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20",
          border: "border-red-500 dark:border-red-400",
          text: "text-red-700 dark:text-red-300",
          bg: "bg-red-50 dark:bg-red-900/20",
        };
      case "grind":
        return {
          gradient:
            "from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-slate-900/20 dark:to-blue-900/20",
          border: "border-blue-500 dark:border-blue-400",
          text: "text-blue-700 dark:text-blue-300",
          bg: "bg-blue-50 dark:bg-blue-900/20",
        };
      default: // chill
        return {
          gradient:
            "from-purple-50 via-pink-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20",
          border: "border-purple-500 dark:border-purple-400",
          text: "text-purple-700 dark:text-purple-300",
          bg: "bg-purple-50 dark:bg-purple-900/20",
        };
    }
  };

  const moodColors = getMoodColors();

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

  if (!session) {
    return null; // Middleware will handle redirect
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
            Practice Challenges{" "}
            <Monitor className="h-10 w-10 text-purple-600 dark:text-purple-400" />
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Sharpen your JavaScript skills with hands-on coding challenges
          </p>
        </div>

        {/* Mood-Adapted Motivation */}
        <div
          className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg dark:shadow-xl mb-8 border-l-4 ${moodColors.border}`}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
            {currentMood.name} Energy{" "}
            <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </h2>
          <p className={moodColors.text}>
            {currentMood.id === "rush" &&
              "Ready to code with high energy! Let's tackle these challenges with speed and enthusiasm!"}
            {currentMood.id === "chill" &&
              "Perfect time for relaxed coding. Take your time and enjoy the learning process."}
            {currentMood.id === "grind" &&
              "Great mindset for deep problem-solving. Let's build strong foundations through deliberate practice."}
          </p>
        </div>

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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/practice/${challenge.slug}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl dark:shadow-xl transition-all border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-600"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex justify-center">
                    {getTypeIcon(challenge.type)}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                      challenge.difficulty
                    )}`}
                  >
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {challenge.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
                  {challenge.description}
                </p>

                {/* Mood-adapted description */}
                <div className={`${moodColors.bg} rounded-lg p-3 mb-4`}>
                  <p className={`${moodColors.text} text-xs leading-relaxed`}>
                    {challenge.moodAdapted[currentMood.id]}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {challenge.estimatedTime}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                    Start Challenge <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {challenges.length === 0 && !loading && (
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
      </div>
    </div>
  );
}
