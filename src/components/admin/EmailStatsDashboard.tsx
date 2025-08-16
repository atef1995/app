"use client";

import { useState, useEffect, useCallback } from "react";

interface EmailStats {
  totalUsers: number;
  usersWithEmailEnabled: number;
  eligibleForPromotions: number;
}

interface ReminderStats {
  inactiveUsersCount: number;
  usersWithRemindersEnabled: number;
  daysInactive: number;
}

interface EmailConnectionStatus {
  isConnected: boolean;
  service: string;
  lastChecked: string;
  error?: string;
}

interface _RecentActivity {
  type: "welcome" | "promotional" | "reminder";
  count: number;
  date: string;
}

export default function EmailStatsDashboard() {
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null);
  const [reminderStats, setReminderStats] = useState<ReminderStats | null>(
    null
  );
  const [connectionStatus, setConnectionStatus] =
    useState<EmailConnectionStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const fetchAllStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch promotional email stats
      const promoResponse = await fetch("/api/email/promotional");
      if (promoResponse.ok) {
        const promoData = await promoResponse.json();
        setEmailStats(promoData);
      }

      // Fetch reminder stats
      const reminderResponse = await fetch("/api/email/study-reminder?days=3");
      if (reminderResponse.ok) {
        const reminderData = await reminderResponse.json();
        setReminderStats(reminderData);
      }

      // Check email connection status
      await checkEmailConnection();
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStats();
  }, [fetchAllStats]);

  const checkEmailConnection = async () => {
    try {
      const response = await fetch("/api/email/test-connection");
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus({
          isConnected: data.success,
          service: "Zoho Mail",
          lastChecked: new Date().toISOString(),
          error: data.error,
        });
      }
    } catch (_error) {
      setConnectionStatus({
        isConnected: false,
        service: "Zoho Mail",
        lastChecked: new Date().toISOString(),
        error: "Failed to check connection",
      });
    }
  };

  const testEmailConnection = async () => {
    setIsTestingConnection(true);
    await checkEmailConnection();
    setIsTestingConnection(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const engagementRate = emailStats
    ? Math.round(
        (emailStats.usersWithEmailEnabled / emailStats.totalUsers) * 100
      )
    : 0;

  const inactiveRate =
    reminderStats && emailStats
      ? Math.round(
          (reminderStats.inactiveUsersCount / emailStats.totalUsers) * 100
        )
      : 0;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email System Dashboard
        </h2>
        <p className="text-gray-600">
          Overview of your email campaigns and user engagement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-3xl">👥</div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-blue-600">
                {emailStats?.totalUsers || 0}
              </div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-3xl">📧</div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">
                {emailStats?.usersWithEmailEnabled || 0}
              </div>
              <div className="text-sm text-green-800">Email Subscribers</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-3xl">⏰</div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-orange-600">
                {reminderStats?.inactiveUsersCount || 0}
              </div>
              <div className="text-sm text-orange-800">
                Inactive Users (3+ days)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-3xl">📈</div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-purple-600">
                {engagementRate}%
              </div>
              <div className="text-sm text-purple-800">Engagement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Email Campaign Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            📊 Campaign Health
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Email Subscription Rate
                </span>
                <span className="text-sm font-medium">{engagementRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${engagementRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  User Inactivity Rate
                </span>
                <span className="text-sm font-medium">{inactiveRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: `${inactiveRate}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">
                  Reminder Opt-in Rate
                </span>
                <span className="text-sm font-medium">
                  {reminderStats && emailStats
                    ? Math.round(
                        (reminderStats.usersWithRemindersEnabled /
                          emailStats.totalUsers) *
                          100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      reminderStats && emailStats
                        ? Math.round(
                            (reminderStats.usersWithRemindersEnabled /
                              emailStats.totalUsers) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            🚀 Quick Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <div className="font-medium text-blue-900">
                  Promotional Campaign
                </div>
                <div className="text-sm text-blue-700">
                  {emailStats?.eligibleForPromotions || 0} users ready to
                  receive offers
                </div>
              </div>
              <button
                onClick={() => (window.location.hash = "#promotional")}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Create
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium text-orange-900">
                  Study Reminders
                </div>
                <div className="text-sm text-orange-700">
                  {reminderStats?.inactiveUsersCount || 0} inactive users need
                  motivation
                </div>
              </div>
              <button
                onClick={() => (window.location.hash = "#reminders")}
                className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
              >
                Send
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <div className="font-medium text-green-900">
                  Email Preferences
                </div>
                <div className="text-sm text-green-700">
                  Manage user notification settings
                </div>
              </div>
              <button
                onClick={() => window.open("/api/email/preferences", "_blank")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            🔧 System Status
          </h3>
          <button
            onClick={testEmailConnection}
            disabled={isTestingConnection}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isTestingConnection ? "Testing..." : "Test Connection"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">
              {connectionStatus?.isConnected ? "✅" : "❌"}
            </div>
            <div className="font-medium text-gray-900">Zoho Mail SMTP</div>
            <div
              className={`text-sm ${
                connectionStatus?.isConnected
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {connectionStatus?.isConnected ? "Connected" : "Disconnected"}
            </div>
            {connectionStatus?.error && (
              <div className="text-xs text-red-500 mt-1 max-w-32 mx-auto">
                {connectionStatus.error}
              </div>
            )}
            {connectionStatus?.lastChecked && (
              <div className="text-xs text-gray-400 mt-1">
                Last checked:{" "}
                {new Date(connectionStatus.lastChecked).toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <div className="font-medium text-gray-900">Auto Reminders</div>
            <div className="text-sm text-blue-600">
              {reminderStats?.usersWithRemindersEnabled
                ? "Active"
                : "Ready to Configure"}
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl mb-2">📨</div>
            <div className="font-medium text-gray-900">Template System</div>
            <div className="text-sm text-green-600">Active</div>
          </div>
        </div>
      </div>

      {/* Tips and Recommendations */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          💡 Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-xl mr-3">🎯</div>
              <div>
                <div className="font-medium text-gray-900">
                  Improve Engagement
                </div>
                <div className="text-sm text-gray-600">
                  {engagementRate < 70
                    ? "Consider surveying users about their email preferences to increase opt-in rates."
                    : "Great engagement! Keep providing valuable content to maintain high opt-in rates."}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="flex items-start">
              <div className="text-xl mr-3">📅</div>
              <div>
                <div className="font-medium text-gray-900">Optimize Timing</div>
                <div className="text-sm text-gray-600">
                  {inactiveRate > 20
                    ? "High inactivity detected. Consider more frequent, personalized reminders."
                    : "Good user retention! Current reminder frequency seems effective."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
