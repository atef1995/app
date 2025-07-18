"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Challenge } from "@/types/practice";
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
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getMoodColors = () => {
    switch (currentMood.id) {
      case "rush":
        return {
          gradient: "from-red-50 via-orange-50 to-yellow-50",
          border: "border-red-500",
          text: "text-red-700",
          bg: "bg-red-50",
        };
      case "grind":
        return {
          gradient: "from-gray-50 via-slate-50 to-blue-50",
          border: "border-blue-500",
          text: "text-blue-700",
          bg: "bg-blue-50",
        };
      default: // chill
        return {
          gradient: "from-purple-50 via-pink-50 to-indigo-50",
          border: "border-purple-500",
          text: "text-purple-700",
          bg: "bg-purple-50",
        };
    }
  };

  const moodColors = getMoodColors();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "algorithm":
        return "🧮";
      case "function":
        return "⚡";
      case "array":
        return "📋";
      case "object":
        return "🗂️";
      case "logic":
        return "🧩";
      default:
        return "💻";
    }
  };

  if (!session) {
    return null; // Middleware will handle redirect
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold">
            <span className="text-blue-600">Vibed</span> to{" "}
            <span className="text-purple-600">Cracked</span>
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Practice Challenges 💻
          </h1>
          <p className="text-gray-600 text-lg">
            Sharpen your JavaScript skills with hands-on coding challenges
          </p>
        </div>

        {/* Mood-Adapted Motivation */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-lg mb-8 border-l-4 ${moodColors.border}`}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {currentMood.name} Energy 🎯
          </h2>
          <p className={moodColors.text}>
            {currentMood.id === "rush" &&
              "Ready to code with high energy! 🚀 Let's tackle these challenges with speed and enthusiasm!"}
            {currentMood.id === "chill" &&
              "Perfect time for relaxed coding. 🌸 Take your time and enjoy the learning process."}
            {currentMood.id === "grind" &&
              "Great mindset for deep problem-solving. 🎯 Let's build strong foundations through deliberate practice."}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Filter Challenges
          </h2>
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="border text-purple-400 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border text-red-500 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading challenges...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/practice/${challenge.id}`}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl">{getTypeIcon(challenge.type)}</div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                      challenge.difficulty
                    )}`}
                  >
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {challenge.title}
                </h3>

                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {challenge.description}
                </p>

                {/* Mood-adapted description */}
                <div className={`${moodColors.bg} rounded-lg p-3 mb-4`}>
                  <p className={`${moodColors.text} text-xs leading-relaxed`}>
                    {challenge.moodAdapted[currentMood.id]}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>⏱️ {challenge.estimatedTime}</span>
                  <span className="text-purple-600 font-semibold">
                    Start Challenge →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results */}
        {challenges.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No challenges found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters to see more challenges
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
