"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Send } from "lucide-react";

interface SearchUser {
  id: string;
  name: string;
  username: string;
  image?: string;
  lastActive?: Date;
  isOnline?: boolean;
}

interface FriendSearchProps {
  onFriendRequestSent: (userName: string) => void;
  onError: (message: string) => void;
}

export const FriendSearch = ({ onFriendRequestSent, onError }: FriendSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSearchUsers = useCallback((query: string) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // If empty query or less than 2 characters, clear results immediately
    if (!query.trim() || query.trim().length < 2) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    // Set searching state immediately for UX
    setSearching(true);

    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/social/search?q=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          const users = data.users || [];
          
          // Additional safety: limit results on frontend too
          setSearchResults(users.slice(0, 20));
        } else {
          const errorData = await response.json();
          console.error("Search error:", errorData.error);
          setSearchResults([]);
          onError(errorData.error || "Failed to search users");
        }
      } catch (error) {
        console.error("Error searching users:", error);
        setSearchResults([]);
        onError("Network error while searching users");
      } finally {
        setSearching(false);
      }
    }, 300);
  }, [onError]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSendRequestToUser = async (user: SearchUser) => {
    setSendingRequest(user.id);
    try {
      const response = await fetch("/api/social/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "send_request",
          targetUsername: user.username,
          message: "Hey! Let's learn together on Vibed to Cracked!",
        }),
      });

      if (response.ok) {
        onFriendRequestSent(user.name);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        const error = await response.json();
        onError(error.error || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      onError("Failed to send friend request");
    } finally {
      setSendingRequest(null);
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Find Friends
      </h2>
      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              debouncedSearchUsers(e.target.value);
            }}
            placeholder="Search by username or name (min 2 characters)..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Type at least 2 characters to search
            </p>
          )}
        </div>
        <div className="flex items-center">
          {searching && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Found {searchResults.length} user{searchResults.length !== 1 ? 's' : ''}
            {searchResults.length === 10 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                (showing first 10 results)
              </span>
            )}
          </h3>
          <div className="grid gap-3 max-h-96 overflow-y-auto">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="relative">
                  <Image
                    src={user.image || '/default-avatar.png'}
                    alt={user.name || 'User'}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name || 'Unknown User'}
                    </p>
                    {user.isOnline ? (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        Online
                      </span>
                    ) : user.lastActive && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(user.lastActive)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
                <button
                  onClick={() => handleSendRequestToUser(user)}
                  disabled={sendingRequest === user.id}
                  className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {sendingRequest === user.id ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Send Request
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
        <div className="text-center py-4 text-gray-600 dark:text-gray-400">
          No users found with that username or name
        </div>
      )}
    </div>
  );
};
