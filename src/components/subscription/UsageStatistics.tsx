"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  BookOpen, 
  Code, 
  Target, 
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface UsageData {
  tutorials: {
    completed: number;
    total: number;
    thisWeek: number;
    thisMonth: number;
    streak: number;
  };
  challenges: {
    completed: number;
    total: number;
    solved: number;
    attempted: number;
    successRate: number;
  };
  quizzes: {
    completed: number;
    averageScore: number;
    totalAttempts: number;
    perfectScores: number;
  };
  projects: {
    completed: number;
    total: number;
    averageRating: number;
    showcased: number;
  };
  timeStats: {
    totalMinutes: number;
    dailyAverage: number;
    weeklyAverage: number;
    longestSession: number;
  };
  achievements: {
    total: number;
    recent: Array<{
      id: string;
      title: string;
      description: string;
      earnedAt: string;
    }>;
  };
}

interface UsageStatisticsProps {
  userId?: string;
}

export function UsageStatistics({ userId }: UsageStatisticsProps) {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsageData();
  }, [userId]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/usage-stats');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error?.message || 'Failed to fetch usage statistics');
      }
    } catch (err) {
      setError('Failed to load usage statistics');
      console.error('Usage stats fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-4">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Error Loading Statistics</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchUsageData}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Usage Overview
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Tutorials
              </span>
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {data.tutorials.completed}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {data.tutorials.thisWeek} this week
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Challenges
              </span>
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {data.challenges.solved}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {formatPercentage(data.challenges.successRate)} success rate
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Quizzes
              </span>
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {data.quizzes.completed}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              {formatPercentage(data.quizzes.averageScore)} avg score
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Projects
              </span>
            </div>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {data.projects.completed}
            </div>
            <div className="text-sm text-yellow-600 dark:text-yellow-400">
              {data.projects.showcased} showcased
            </div>
          </div>
        </div>
      </div>

      {/* Time Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Time Spent Learning
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(data.timeStats.totalMinutes)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Time
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(data.timeStats.dailyAverage)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Daily Average
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(data.timeStats.weeklyAverage)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Weekly Average
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {formatTime(data.timeStats.longestSession)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Longest Session
            </div>
          </div>
        </div>
      </div>

      {/* Progress Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Learning Streak
            </h4>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {data.tutorials.streak}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Days in a row
            </div>
          </div>
          
          <div className="mt-4 bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
            <div className="text-sm text-green-800 dark:text-green-200">
              Keep it up! Complete a tutorial today to maintain your streak.
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Recent Achievements
            </h4>
          </div>
          
          {data.achievements.recent.length > 0 ? (
            <div className="space-y-3">
              {data.achievements.recent.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                >
                  <Award className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-sm text-purple-900 dark:text-purple-100">
                      {achievement.title}
                    </div>
                    <div className="text-xs text-purple-600 dark:text-purple-400">
                      {achievement.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">
                Complete challenges and tutorials to earn achievements!
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Detailed Statistics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Tutorial Progress
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-medium">{data.tutorials.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">This Month:</span>
                <span className="font-medium">{data.tutorials.thisMonth}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Available:</span>
                <span className="font-medium">{data.tutorials.total}</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Challenge Stats
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Solved:</span>
                <span className="font-medium">{data.challenges.solved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Attempted:</span>
                <span className="font-medium">{data.challenges.attempted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                <span className="font-medium">{formatPercentage(data.challenges.successRate)}</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Quiz Performance
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-medium">{data.quizzes.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Perfect Scores:</span>
                <span className="font-medium">{data.quizzes.perfectScores}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                <span className="font-medium">{formatPercentage(data.quizzes.averageScore)}</span>
              </div>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              Project Portfolio
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                <span className="font-medium">{data.projects.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Showcased:</span>
                <span className="font-medium">{data.projects.showcased}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Rating:</span>
                <span className="font-medium">{data.projects.averageRating.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}