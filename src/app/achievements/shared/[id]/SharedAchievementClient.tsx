"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Star,
  ArrowLeft,
  ExternalLink,
  Share2,
  Users,
  Calendar,
  Target,
} from "lucide-react";

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  category: string;
  points: number;
  requirementValue: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  progress: number;
}

interface Sharer {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  unlockedAt: Date;
}

const rarityColors = {
  COMMON: "from-gray-400 to-gray-600",
  RARE: "from-blue-400 to-blue-600",
  EPIC: "from-purple-400 to-purple-600",
  LEGENDARY: "from-yellow-400 to-yellow-600",
};

const rarityEmojis = {
  COMMON: "🥉",
  RARE: "🥈",
  EPIC: "🥇",
  LEGENDARY: "💎",
};

export default function SharedAchievementClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, status } = useSession();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [sharer, setSharer] = useState<Sharer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;

    const fetchAchievement = async () => {
      try {
        // Get URL search parameters to check for sharedBy
        const urlParams = new URLSearchParams(window.location.search);
        const sharedBy = urlParams.get("sharedBy");

        const apiUrl = `/api/achievements/${resolvedParams.id}${
          sharedBy ? `?sharedBy=${sharedBy}` : ""
        }`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("Achievement not found");
        }

        const data = await response.json();
        setAchievement(data.achievement);

        if (data.sharer) {
          setSharer(data.sharer);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load achievement"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [resolvedParams]);

  const shareAchievement = async () => {
    if (!achievement) return;

    const shareData = {
      title: `🏆 ${achievement.title} - Vibed to Cracked`,
      text: `Check out this ${achievement.rarity.toLowerCase()} achievement I unlocked: "${
        achievement.title
      }"!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Share cancelled or failed");
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading achievement...</p>
        </div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Achievement Not Found
          </h1>
          <p className="text-gray-300 mb-6">
            This achievement might have been removed or the link is invalid.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-green-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Vibed to Cracked
          </Link>

          {/* Sharer Information */}
          {sharer && (
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-3">
                {sharer.image ? (
                  <Image
                    src={sharer.image}
                    alt={sharer.name || sharer.username || "User"}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {sharer.name || sharer.username || "Someone"} unlocked this
                    achievement!
                  </p>
                  <p className="text-gray-300 text-sm">
                    Unlocked on{" "}
                    {new Date(sharer.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-2xl">🎉</div>
              </div>
            </div>
          )}
        </div>

        {/* Achievement Display */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
            {/* Achievement Icon and Title */}
            <div className="mb-6">
              <div
                className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r ${
                  rarityColors[achievement.rarity]
                } mb-4`}
              >
                <span className="text-4xl">{achievement.icon}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">
                  {rarityEmojis[achievement.rarity]}
                </span>
                <h1 className="text-3xl font-bold text-white">
                  {achievement.title}
                </h1>
              </div>
              <p className="text-xl text-gray-300 capitalize">
                {achievement.rarity.toLowerCase()} Achievement
              </p>
            </div>

            {/* Description */}
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              {achievement.description}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <Target className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Category</p>
                <p className="text-white font-semibold capitalize">
                  {achievement.category}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Points</p>
                <p className="text-white font-semibold">{achievement.points}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 md:col-span-1 col-span-2">
                <Calendar className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Status</p>
                <p className="text-white font-semibold">
                  {achievement.isUnlocked && achievement.unlockedAt
                    ? new Date(achievement.unlockedAt).toLocaleDateString()
                    : achievement.isUnlocked
                    ? "Unlocked"
                    : "Not Unlocked"}
                </p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={shareAchievement}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors mb-6"
            >
              <Share2 className="h-4 w-4" />
              Share This Achievement
            </button>

            {/* Call to Action */}
            {status === "loading" ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : session ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Welcome back!
                </h3>
                <p className="text-gray-300 mb-4">
                  Ready to unlock more achievements? Continue your coding
                  journey!
                </p>
                <Link
                  href="/achievements"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Trophy className="h-4 w-4" />
                  View My Achievements
                </Link>
              </div>
            ) : (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-6">
                <Trophy className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Start Your Journey!
                </h3>
                <p className="text-gray-300 mb-4">
                  Join Vibed to Cracked and unlock achievements like this one!
                  Master Web Development through interactive challenges and
                  track your progress.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Sign Up Free
                  </Link>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition-colors border border-white/20"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
