"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { Tutorial, Category } from "@prisma/client";

type TutorialWithCategory = Tutorial & {
  category: Category;
};

interface TutorialRecommendationsProps {
  currentTutorialSlug: string;
  limit?: number;
  title?: string;
  description?: string;
}

const DifficultyBadge = ({ difficulty }: { difficulty: number }) => {
  const levels = ["Beginner", "Easy", "Medium", "Advanced", "Expert"];
  const colors = [
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  ];

  const level = levels[difficulty - 1] || "Unknown";
  const colorClass = colors[difficulty - 1] || colors[2];

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {level}
    </span>
  );
};

export function TutorialRecommendations({
  currentTutorialSlug,
  limit = 3,
  title = "Related Topics You Might Like",
  description,
}: TutorialRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<TutorialWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/tutorials/${currentTutorialSlug}/recommendations?limit=${limit}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to load recommendations");
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [currentTutorialSlug, limit]);

  if (loading) {
    return (
      <div className="my-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-gray-800 rounded-xl h-48 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="my-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((tutorial) => (
          <Link
            key={tutorial.id}
            href={`/tutorials/category/${tutorial.category.slug}/${tutorial.slug}`}
            className="group block"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-600 p-6 h-full flex flex-col">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {tutorial.category.name}
                </span>
                <DifficultyBadge difficulty={tutorial.difficulty} />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                {tutorial.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-grow">
                {tutorial.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{tutorial.estimatedTime}</span>
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Explore More Link */}
      <div className="mt-8 text-center">
        <Link
          href="/tutorials"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          <span>Explore all tutorials</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
