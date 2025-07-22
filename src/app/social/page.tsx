"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  UserPlus,
  Star,
  Trophy,
  Calendar,
  ArrowLeft,
  Activity,
  Bell,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/Toast";
import { FriendSearch } from "@/components/social/FriendSearch";
import { FriendRequests } from "@/components/social/FriendRequests";

interface Friend {
  id: string;
  name?: string;
  username?: string;
  image: string | null;
  totalPoints?: number;
  currentStreak?: number;
  mood?: string;
  lastActive?: Date;
  friendsSince?: Date;
}

interface FriendRequest {
  id: string;
  sender?: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  message?: string;
  createdAt: Date;
}

interface ProgressUpdateData {
  points?: number;
  score?: number;
  mood?: string;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

interface ProgressUpdate {
  id: string;
  user?: {
    id: string;
    name: string;
    username: string;
    image: string | null;
  };
  type: string;
  title: string;
  description: string;
  data?: ProgressUpdateData;
  createdAt: Date;
  reactions?: {
    id: string;
    type: string;
    userId: string;
    user: {
      name: string;
    };
  }[];
  _count?: {
    reactions: number;
  };
}

export default function FriendsPage() {
  const { data: session } = useSession();
  const { toasts, success, error, removeToast } = useToast();
  const [activeTab, setActiveTab] = useState("friends");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [progressFeed, setProgressFeed] = useState<ProgressUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "friends", label: "Friends", icon: Users },
    { id: "requests", label: "Requests", icon: UserPlus },
    { id: "feed", label: "Activity Feed", icon: Activity },
  ];

  const moodEmojis = {
    CHILL: "😌",
    RUSH: "🔥", 
    GRIND: "💪",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [friendsResponse, feedResponse, notificationsResponse] = await Promise.all([
          fetch("/api/social/friends"),
          fetch("/api/social/progress"),
          fetch("/api/social/notifications"),
        ]);

        if (friendsResponse.ok) {
          const friendsData = await friendsResponse.json();
          setFriends(friendsData.friends || []);
          setFriendRequests(friendsData.receivedRequests || []);
        }

        if (feedResponse.ok) {
          const feedData = await feedResponse.json();
          setProgressFeed(feedData.feed || []);
        }

        if (notificationsResponse.ok) {
          const notificationsData = await notificationsResponse.json();
          setNotifications(notificationsData.notifications || []);
          const unread = notificationsData.notifications.filter((n: Notification) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const handleFriendRequestResponse = async (requestId: string, action: "accept" | "decline") => {
    try {
      const response = await fetch("/api/social/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: action === "accept" ? "accept_request" : "decline_request",
          requestId,
        }),
      });

      if (response.ok) {
        // Remove the request from the list
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        
        if (action === "accept") {
          success("Friend request accepted! 🎉");
          // Refetch friends list to include the new friend
          const friendsResponse = await fetch("/api/social/friends");
          if (friendsResponse.ok) {
            const friendsData = await friendsResponse.json();
            setFriends(friendsData.friends || []);
          }
        } else {
          success("Friend request declined.");
        }
      } else {
        const errorData = await response.json();
        error(errorData.error || `Failed to ${action} friend request`);
      }
    } catch (err) {
      console.error(`Error ${action}ing friend request:`, err);
      error(`Failed to ${action} friend request`);
    }
  };

  const handleReaction = async (progressShareId: string, reactionType: string) => {
    try {
      const response = await fetch("/api/social/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          progressShareId,
          type: reactionType,
        }),
      });

      if (response.ok) {
        // Refresh the feed to show updated reactions
        const feedResponse = await fetch("/api/social/progress");
        if (feedResponse.ok) {
          const feedData = await feedResponse.json();
          setProgressFeed(feedData.feed || []);
        }
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const reactionTypes = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" },
    { type: "fire", emoji: "🔥", label: "Fire" },
    { type: "clap", emoji: "👏", label: "Clap" },
    { type: "mind_blown", emoji: "🤯", label: "Mind Blown" },
  ];

  const markNotificationAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/social/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          markAsRead: true,
        }),
      });

      if (notificationId) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
              👥 Friends & Social
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Connect with other learners and share your progress
            </p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px]"
                  aria-label={`${unreadCount} unread notifications`}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markNotificationAsRead()}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => !notification.read && markNotificationAsRead(notification.id)}
                        className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                          !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {getTimeAgo(notification.createdAt)}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === "requests" && friendRequests.length > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px]">
                    {friendRequests.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <div className="space-y-6">
            {/* Find Friends */}
            <FriendSearch 
              onFriendRequestSent={(userName) => success(`Friend request sent to ${userName}! 🎉`)}
              onError={(message) => error(message)}
            />

            {/* Friends List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {friends.map((friend) => {
                // Add null safety for all friend properties
                const friendName = friend.name || 'Unknown User';
                const friendUsername = friend.username || 'user';
                const friendImage = friend.image || '/default-avatar.png';
                const friendPoints = friend.totalPoints || 0;
                const friendStreak = friend.currentStreak || 0;
                const friendMood = friend.mood || 'CHILL';
                const friendLastActive = friend.lastActive ? new Date(friend.lastActive) : new Date();
                const friendsSince = friend.friendsSince ? new Date(friend.friendsSince) : new Date();
                
                return (
                  <div
                    key={friend.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={friendImage}
                        alt={`${friendName} avatar`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {friendName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{friendUsername}
                        </p>
                      </div>
                      <span className="text-xl">
                        {moodEmojis[friendMood as keyof typeof moodEmojis] || '😌'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Points</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {friendPoints.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Streak</span>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {friendStreak} days
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Last active</span>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getTimeAgo(friendLastActive)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Friends since {friendsSince.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {friends.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No friends yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add some friends to share your learning journey!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Friend Requests Tab */}
        {activeTab === "requests" && (
          <FriendRequests 
            requests={friendRequests}
            onRequestResponse={handleFriendRequestResponse}
            onSuccess={(message) => success(message)}
            onError={(message) => error(message)}
          />
        )}

        {/* Activity Feed Tab */}
        {activeTab === "feed" && (
          <div className="space-y-4">
            {progressFeed.map((update) => {
              const user = update.user;
              const userName = user?.name || 'Unknown User';
              const userImage = user?.image || '/default-avatar.png';
              
              return (
                <div
                  key={update.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-start gap-4">
                    <Image
                      src={userImage}
                      alt={`${userName} avatar`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {userName}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getTimeAgo(update.createdAt)}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {update.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {update.description}
                    </p>
                    
                    {/* Additional data based on type */}
                    {update.data && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {update.data.points && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full text-xs">
                            <Star className="w-3 h-3" />
                            +{update.data.points} points
                          </span>
                        )}
                        {update.data.score && (
                          <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                            <Trophy className="w-3 h-3" />
                            {update.data.score}% score
                          </span>
                        )}
                        {update.data.mood && (
                          <span className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                            {moodEmojis[update.data.mood as keyof typeof moodEmojis]}
                            {update.data.mood.toLowerCase()} mode
                          </span>
                        )}
                      </div>
                    )}

                    {/* Reactions */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {reactionTypes.map((reaction) => {
                          const userReacted = update.reactions?.some(
                            r => r.userId === session?.user?.id && r.type === reaction.type
                          );
                          const reactionCount = update.reactions?.filter(r => r.type === reaction.type).length || 0;
                          
                          return (
                            <button
                              key={reaction.type}
                              onClick={() => handleReaction(update.id, reaction.type)}
                              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${
                                userReacted
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                              }`}
                            >
                              <span>{reaction.emoji}</span>
                              {reactionCount > 0 && <span>{reactionCount}</span>}
                            </button>
                          );
                        })}
                      </div>
                      
                      {/* Show reaction summary */}
                      {update._count?.reactions && update._count.reactions > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {update._count.reactions} reaction{update._count.reactions !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
            })}

            {progressFeed.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  No activity yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Add some friends to see their learning progress and achievements!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
  </>
  );
}
