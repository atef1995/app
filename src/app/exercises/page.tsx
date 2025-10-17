"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Card, { CardAction } from "@/components/ui/Card";
import { PageLayout } from "@/components/ui/PageLayout";
import { ContentGrid } from "@/components/ui/ContentGrid";
import { fetchExercises } from "@/lib/services/exercisesService";
import CardSkeleton from "@/components/ui/skeletons/CardSkeleton";

interface Exercise {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  estimatedTime: number;
  topics: string[];
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  intermediate:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function ExercisesPage() {
  const { data: session } = useSession();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    try {
      setLoading(true);
      const fetchData = async () => {
        const data = await fetchExercises();
        if (data) setExercises(data);
      };
      fetchData();
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesFilter = filter === "all" || exercise.difficulty === filter;
    const matchesSearch =
      exercise.title.toLowerCase().includes(search.toLowerCase()) ||
      exercise.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageLayout
      title="Interactive Coding Exercises"
      subtitle="Master coding through hands-on practice. Solve real-world problems
            and build your portfolio."
    >
      <div className="max-w-7xl">
        {/* Guest Banner */}
        {!session?.user && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              You&apos;re browsing exercises as a guest. Sign up to save your
              progress and track your learning!
            </p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setFilter("beginner")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "beginner"
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => setFilter("intermediate")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "intermediate"
                  ? "bg-yellow-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Intermediate
            </button>
            <button
              onClick={() => setFilter("advanced")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "advanced"
                  ? "bg-red-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Exercises Grid */}
        <ContentGrid columns="3">
          {loading && [0, 1, 2, 3, 4].map((el) => <CardSkeleton key={el} />)}
          {filteredExercises.map((exercise) => {
            return (
              <Link
                key={exercise.slug}
                href={`${window.location.href}/${exercise.slug}`}
              >
                <Card
                  loading={loading}
                  onClick={() => {}}
                  key={exercise.slug}
                  title={exercise.title}
                  description={exercise.description}
                  footer={
                    exercise.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {exercise.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            {topic}
                          </span>
                        ))}
                        {exercise.topics.length > 3 && (
                          <span className="inline-block px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                            +{exercise.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {exercise.title}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        DIFFICULTY_COLORS[exercise.difficulty]
                      }`}
                    >
                      {exercise.difficulty.charAt(0).toUpperCase() +
                        exercise.difficulty.slice(1)}
                    </span>
                  </div>
                  <div className="flex flex-col space-y-5">
                    <CardAction.Info>{exercise.description}</CardAction.Info>
                    <CardAction.TimeInfo
                      time={exercise.estimatedTime}
                    ></CardAction.TimeInfo>
                  </div>
                </Card>
              </Link>
            );
          })}
        </ContentGrid>
      </div>
    </PageLayout>
  );
}
