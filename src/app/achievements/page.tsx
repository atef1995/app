"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  Star,
  Award,
  Target,
  Zap,
  Users,
  ArrowLeft,
  Lock,
  CheckCircle,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  ExternalLink,
} from "lucide-react";

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt: Date | null;
  progress: number;
  maxProgress: number;
}

interface AchievementStats {
  totalPoints: number;
  unlockedCount: number;
  totalCount: number;
}

export default function AchievementsPage() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats>({
    totalPoints: 0,
    unlockedCount: 0,
    totalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [sharedAchievement, setSharedAchievement] = useState<Achievement | null>(null);
  const [showSharedModal, setShowSharedModal] = useState(false);

  const categories = [
    { id: "all", label: "All", icon: Trophy },
    { id: "learning", label: "Learning", icon: Target },
    { id: "challenge", label: "Challenges", icon: Award },
    { id: "speed", label: "Speed", icon: Zap },
    { id: "streak", label: "Streaks", icon: Star },
    { id: "social", label: "Social", icon: Users },
  ];

  const rarityColors = {
    COMMON: "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
    RARE: "border-blue-300 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/20",
    EPIC: "border-purple-300 bg-purple-50 dark:border-purple-600 dark:bg-purple-900/20",
    LEGENDARY: "border-yellow-300 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/20",
  };

  const rarityText = {
    COMMON: "text-gray-700 dark:text-gray-300",
    RARE: "text-blue-700 dark:text-blue-300",
    EPIC: "text-purple-700 dark:text-purple-300",
    LEGENDARY: "text-yellow-700 dark:text-yellow-300",
  };

  // Social sharing functions
  const generateShareText = (achievement: Achievement) => {
    return `🏆 Just unlocked "${achievement.title}" on Vibed to Cracked! ${achievement.icon}\n\n${achievement.description}\n\n+${achievement.points} points earned! 🚀\n\n#VibedToCracked #CodingAchievement #LearnToCode`;
  };

  const generateShareUrl = (achievement: Achievement) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const userParam = session?.user?.id ? `?sharedBy=${session.user.id}` : '';
    return `${baseUrl}/achievements/shared/${achievement.id}${userParam}`;
  };

  const shareToTwitter = (achievement: Achievement) => {
    const text = generateShareText(achievement);
    const url = generateShareUrl(achievement);
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToFacebook = (achievement: Achievement) => {
    const url = generateShareUrl(achievement);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  const shareToLinkedIn = (achievement: Achievement) => {
    const text = generateShareText(achievement);
    const url = generateShareUrl(achievement);
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
    window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
  };

  const copyShareLink = async (achievement: Achievement) => {
    const url = generateShareUrl(achievement);
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccess(achievement.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const nativeShare = async (achievement: Achievement) => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: `Achievement Unlocked: ${achievement.title}`,
          text: generateShareText(achievement),
          url: generateShareUrl(achievement),
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  const shareOverallProgress = () => {
    const progressPercentage = Math.round((stats.unlockedCount / stats.totalCount) * 100);
    const text = `🚀 My coding journey on Vibed to Cracked:\n\n🏆 ${stats.unlockedCount}/${stats.totalCount} achievements unlocked (${progressPercentage}%)\n⭐ ${stats.totalPoints} total points earned\n\nJoin me in learning to code! 💻\n\n#VibedToCracked #LearnToCode #CodingJourney`;
    
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      navigator.share({
        title: 'My Coding Progress - Vibed to Cracked',
        text: text,
        url: typeof window !== 'undefined' ? window.location.origin : '',
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback to Twitter sharing
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch("/api/achievements");
        if (response.ok) {
          const data = await response.json();
          setAchievements(data.achievements);
          setStats({
            totalPoints: data.totalPoints,
            unlockedCount: data.unlockedCount,
            totalCount: data.totalCount,
          });
        }
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAchievements();
    }
  }, [session]);

  // Handle shared achievement highlighting
  useEffect(() => {
    const fetchSharedAchievement = async () => {
      if (highlightId) {
        try {
          const response = await fetch(`/api/achievements/${highlightId}`);
          if (response.ok) {
            const data = await response.json();
            setSharedAchievement(data.achievement);
            setShowSharedModal(true);
          }
        } catch (error) {
          console.error("Error fetching shared achievement:", error);
        }
      }
    };

    fetchSharedAchievement();
  }, [highlightId]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuOpen && !(event.target as Element).closest('.share-menu-container')) {
        setShareMenuOpen(null);
      }
    };

    if (shareMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shareMenuOpen]);

  const filteredAchievements = achievements.filter(
    (achievement) => selectedCategory === "all" || achievement.category === selectedCategory
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading achievements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              🏆 Achievements
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Unlock rewards for your learning journey
            </p>
          </div>
          
          {/* Share Overall Progress */}
          {stats.unlockedCount > 0 && (
            <button
              onClick={() => shareOverallProgress()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors "
            >
              <Share2 className="w-4 h-4" />
              Share Progress
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalPoints}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.unlockedCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Unlocked</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.round((stats.unlockedCount / stats.totalCount) * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                achievement.isUnlocked
                  ? rarityColors[achievement.rarity as keyof typeof rarityColors]
                  : "border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800/50"
              } ${achievement.isUnlocked ? "" : "opacity-75"} ${
                highlightId === achievement.id ? "ring-4 ring-blue-500 ring-opacity-50 scale-105" : ""
              }`}
            >
              {/* Rarity Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    achievement.isUnlocked
                      ? rarityText[achievement.rarity as keyof typeof rarityText]
                      : "text-gray-500 dark:text-gray-400"
                  } bg-white dark:bg-gray-800 border`}
                >
                  {achievement.rarity}
                </span>
              </div>

              {/* Lock Overlay */}
              {!achievement.isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                  <Lock className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
              )}

              {/* Share Button for Unlocked Achievements */}
              {achievement.isUnlocked && (
                <div className="absolute top-3 left-3">
                  <div className="relative share-menu-container">
                    <button
                      onClick={() => setShareMenuOpen(shareMenuOpen === achievement.id ? null : achievement.id)}
                      className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all border"
                      title="Share achievement"
                    >
                      <Share2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    
                    {/* Share Dropdown */}
                    {shareMenuOpen === achievement.id && (
                      <div className="absolute top-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 z-10 min-w-48">
                        <div className="space-y-1">
                          {/* Native Share (if supported) */}
                          {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                              onClick={() => nativeShare(achievement)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Share
                            </button>
                          )}
                          
                          {/* Twitter */}
                          <button
                            onClick={() => shareToTwitter(achievement)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <Twitter className="w-4 h-4 text-blue-400" />
                            Twitter
                          </button>
                          
                          {/* Facebook */}
                          <button
                            onClick={() => shareToFacebook(achievement)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <Facebook className="w-4 h-4 text-blue-600" />
                            Facebook
                          </button>
                          
                          {/* LinkedIn */}
                          <button
                            onClick={() => shareToLinkedIn(achievement)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <Linkedin className="w-4 h-4 text-blue-700" />
                            LinkedIn
                          </button>
                          
                          {/* Copy Link */}
                          <button
                            onClick={() => copyShareLink(achievement)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            {copySuccess === achievement.id ? 'Copied!' : 'Copy Link'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Achievement Content */}
              <div className="text-center">
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {achievement.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {achievement.description}
                </p>

                {/* Progress Bar */}
                {!achievement.isUnlocked && achievement.maxProgress > 1 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Points */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {achievement.points} points
                  </span>
                </div>

                {/* Unlock Date */}
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try selecting a different category or start learning to unlock achievements!
            </p>
          </div>
        )}
      </div>

      {/* Shared Achievement Modal */}
      {showSharedModal && sharedAchievement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowSharedModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>

            {/* Achievement Display */}
            <div className="text-center">
              <div className="text-6xl mb-4">{sharedAchievement.icon}</div>
              <div className="mb-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  rarityText[sharedAchievement.rarity as keyof typeof rarityText]
                } bg-gray-100 dark:bg-gray-700 border`}>
                  {sharedAchievement.rarity}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                {sharedAchievement.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {sharedAchievement.description}
              </p>
              
              {/* Points */}
              <div className="flex items-center justify-center gap-2 text-lg mb-6">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {sharedAchievement.points} points
                </span>
              </div>

              {/* Call to Action */}
              <div className="space-y-3">
                {session ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievements.find(a => a.id === sharedAchievement.id)?.isUnlocked 
                        ? "You've already unlocked this achievement! 🎉"
                        : "You haven't unlocked this achievement yet. Keep learning!"
                      }
                    </p>
                    <Link
                      href="/dashboard"
                      className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Want to unlock this achievement too?
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href="/auth/signin"
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                      >
                        Sign Up Free
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                      >
                        Learn Now
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
