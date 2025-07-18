"use client";

import { useSession } from "next-auth/react";
import { useMood } from "@/components/providers/MoodProvider";
import Link from "next/link";

// Mock tutorial data - will be replaced with database queries
const TUTORIALS = [
  {
    id: 1,
    title: "JavaScript Basics",
    description: "Learn the fundamentals of JavaScript programming",
    level: "beginner",
    emoji: "🌱",
    lessons: 8,
    estimatedTime: "2 hours",
    topics: ["Variables", "Functions", "Loops", "Conditionals"],
  },
  {
    id: 2,
    title: "DOM Manipulation",
    description: "Master interacting with HTML elements using JavaScript",
    level: "intermediate",
    emoji: "🎯",
    lessons: 6,
    estimatedTime: "1.5 hours",
    topics: ["Selecting Elements", "Event Listeners", "Dynamic Content"],
  },
  {
    id: 3,
    title: "Arrays and Objects",
    description:
      "Master data structures and learn to organize information effectively",
    level: "beginner",
    emoji: "📊",
    lessons: 8,
    estimatedTime: "50 minutes",
    topics: ["Arrays", "Objects", "Methods", "Properties", "Data Structures"],
  },
];

export default function TutorialsPage() {
  const { data: session } = useSession();
  const { currentMood } = useMood();

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

  if (!session) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${moodColors.gradient} flex items-center justify-center`}
      >
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access tutorials.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodColors.gradient}`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold">
              <span className="text-blue-600">Vibed</span> to{" "}
              <span className="text-purple-600">Cracked</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Learning in{" "}
                <span className="font-semibold">{currentMood.name}</span> mode
                <span className="ml-2">{currentMood.emoji}</span>
              </span>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            JavaScript Tutorials
          </h1>
          <p className="text-gray-600">
            Interactive lessons tailored to your{" "}
            {currentMood.name.toLowerCase()} learning style
          </p>
        </div>

        {/* Mood Info Card */}
        <div
          className={`mb-8 p-6 rounded-2xl ${moodColors.bg} border-2 ${moodColors.border}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">{currentMood.emoji}</span>
            <div>
              <h3 className={`text-xl font-bold mb-2 ${moodColors.text}`}>
                {currentMood.name} Mode Active
              </h3>
              <p className={moodColors.text}>{currentMood.description}</p>
              <div className={`mt-2 text-sm ${moodColors.text}`}>
                Quiz difficulty: {currentMood.quizSettings.difficulty} •
                Questions per tutorial:{" "}
                {currentMood.quizSettings.questionsPerTutorial}
                {currentMood.quizSettings.timeLimit && (
                  <> • Time limit: {currentMood.quizSettings.timeLimit}s</>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TUTORIALS.map((tutorial) => (
            <div
              key={tutorial.id}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{tutorial.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {tutorial.title}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      tutorial.level === "beginner"
                        ? "bg-green-100 text-green-800"
                        : tutorial.level === "intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {tutorial.level}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{tutorial.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>📖</span>
                  <span>{tutorial.lessons} lessons</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>⏱️</span>
                  <span>{tutorial.estimatedTime}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-2">
                  Topics covered:
                </div>
                <div className="flex flex-wrap gap-1">
                  {tutorial.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={`/tutorials/${tutorial.id}`}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
              >
                Start Tutorial
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              More Tutorials Coming Soon!
            </h2>
            <p className="text-gray-600 mb-4">
              We&apos;re constantly adding new content. Have a topic you&apos;d
              like to see covered?
            </p>
            <button className="bg-purple-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
              Suggest a Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
