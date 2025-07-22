"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle, X, UserPlus } from "lucide-react";

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

interface FriendRequestsProps {
  requests: FriendRequest[];
  onRequestResponse: (requestId: string, action: "accept" | "decline") => Promise<void>;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const FriendRequests = ({ 
  requests, 
  onRequestResponse, 
  onSuccess, 
  onError 
}: FriendRequestsProps) => {
  const [acceptingRequest, setAcceptingRequest] = useState<string | null>(null);
  const [decliningRequest, setDecliningRequest] = useState<string | null>(null);

  const handleFriendRequestResponse = async (requestId: string, action: "accept" | "decline") => {
    if (action === "accept") {
      setAcceptingRequest(requestId);
    } else {
      setDecliningRequest(requestId);
    }
    
    try {
      await onRequestResponse(requestId, action);
      
      if (action === "accept") {
        onSuccess("Friend request accepted! 🎉");
      } else {
        onSuccess("Friend request declined.");
      }
    } catch {
      onError(`Failed to ${action} friend request`);
    } finally {
      if (action === "accept") {
        setAcceptingRequest(null);
      } else {
        setDecliningRequest(null);
      }
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

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No friend requests
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          When someone sends you a friend request, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        // Ensure sender exists and has required properties
        const sender = request.sender;
        const senderName = sender?.name || 'Unknown User';
        const senderUsername = sender?.username || 'user';
        const senderImage = sender?.image || '/default-avatar.png';
        
        return (
          <div
            key={request.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center gap-4">
              <Image
                src={senderImage}
                alt={`${senderName} avatar`}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {senderName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{senderUsername}
                </p>
              {request.message && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  &ldquo;{request.message}&rdquo;
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getTimeAgo(request.createdAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleFriendRequestResponse(request.id, "accept")}
                disabled={acceptingRequest === request.id || decliningRequest === request.id}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {acceptingRequest === request.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Accepting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </>
                )}
              </button>
              <button 
                onClick={() => handleFriendRequestResponse(request.id, "decline")}
                disabled={acceptingRequest === request.id || decliningRequest === request.id}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {decliningRequest === request.id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Declining...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Decline
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
};
