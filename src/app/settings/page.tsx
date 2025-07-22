"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import {
  User,
  Bell,
  Brain,
  Shield,
  Save,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  Target,
  Award,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface UserSettings {
  name: string;
  email: string;
  preferredMood: string;
  notifications: {
    email: boolean;
    reminders: boolean;
    achievements: boolean;
    weeklyProgress: boolean;
  };
  privacy: {
    showProfile: boolean;
    shareProgress: boolean;
    allowAnalytics: boolean;
  };
  learning: {
    dailyGoal: number;
    reminderTime: string;
    difficulty: "easy" | "medium" | "hard";
    autoSubmit: boolean;
  };
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { currentMood, setMood } = useMood();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  const [settings, setSettings] = useState<UserSettings>({
    name: "",
    email: "",
    preferredMood: currentMood.id,
    notifications: {
      email: true,
      reminders: true,
      achievements: true,
      weeklyProgress: false,
    },
    privacy: {
      showProfile: true,
      shareProgress: false,
      allowAnalytics: true,
    },
    learning: {
      dailyGoal: 30,
      reminderTime: "18:00",
      difficulty: "medium",
      autoSubmit: false,
    },
  });

  useEffect(() => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Load user settings
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/user/settings");
        if (response.ok) {
          const data = await response.json();
          setSettings((prevSettings) => ({
            ...prevSettings,
            name: session.user?.name || "",
            email: session.user?.email || "",
            ...data.settings,
          }));
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [session, router]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        // Update mood if changed
        if (settings.preferredMood !== currentMood.id) {
          const newMood = MOODS[settings.preferredMood];
          if (newMood) {
            setMood(newMood.id);
          }
        }
        
        // Show success message
        alert("Settings saved successfully! 🎉");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Account deleted successfully. We're sorry to see you go! 😢");
        router.push("/");
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "learning", label: "Learning", icon: Brain },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading settings...</p>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Customize your learning experience
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Profile Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) =>
                          setSettings({ ...settings, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        title="Email address (read-only)"
                        value={settings.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Email cannot be changed
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preferred Learning Mood
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.values(MOODS).map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() =>
                            setSettings({ ...settings, preferredMood: mood.id })
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.preferredMood === mood.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{mood.emoji}</div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {mood.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {mood.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Notification Preferences
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        key: "email",
                        label: "Email Notifications",
                        description: "Receive important updates via email",
                        icon: Mail,
                      },
                      {
                        key: "reminders",
                        label: "Learning Reminders",
                        description: "Daily reminders to keep up with your studies",
                        icon: Clock,
                      },
                      {
                        key: "achievements",
                        label: "Achievement Alerts",
                        description: "Get notified when you unlock new achievements",
                        icon: Award,
                      },
                      {
                        key: "weeklyProgress",
                        label: "Weekly Progress Reports",
                        description: "Summary of your learning progress each week",
                        icon: Calendar,
                      },
                    ].map((notification) => (
                      <div
                        key={notification.key}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <notification.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {notification.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {notification.description}
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            title={`Toggle ${notification.label}`}
                            checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                notifications: {
                                  ...settings.notifications,
                                  [notification.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Tab */}
              {activeTab === "learning" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Learning Preferences
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Daily Learning Goal (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="180"
                        step="5"
                        title="Daily learning goal in minutes"
                        value={settings.learning.dailyGoal}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            learning: {
                              ...settings.learning,
                              dailyGoal: parseInt(e.target.value) || 30,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        title="Daily reminder time"
                        value={settings.learning.reminderTime}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            learning: {
                              ...settings.learning,
                              reminderTime: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Difficulty
                      </label>
                      <select
                        title="Default difficulty level"
                        value={settings.learning.difficulty}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            learning: {
                              ...settings.learning,
                              difficulty: e.target.value as "easy" | "medium" | "hard",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoSubmit"
                        checked={settings.learning.autoSubmit}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            learning: {
                              ...settings.learning,
                              autoSubmit: e.target.checked,
                            },
                          })
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="autoSubmit"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Auto-submit on timer expiry
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Privacy & Security
                  </h2>
                  
                  <div className="space-y-4">
                    {[
                      {
                        key: "showProfile",
                        label: "Show Public Profile",
                        description: "Allow others to see your profile and achievements",
                        icon: Eye,
                      },
                      {
                        key: "shareProgress",
                        label: "Share Learning Progress",
                        description: "Share your progress with friends and study groups",
                        icon: Target,
                      },
                      {
                        key: "allowAnalytics",
                        label: "Analytics & Improvement",
                        description: "Help us improve the platform with usage analytics",
                        icon: Brain,
                      },
                    ].map((privacy) => (
                      <div
                        key={privacy.key}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <privacy.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {privacy.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {privacy.description}
                            </div>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            title={`Toggle ${privacy.label}`}
                            checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                privacy: {
                                  ...settings.privacy,
                                  [privacy.key]: e.target.checked,
                                },
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t dark:border-gray-600 pt-6">
                    <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                      Danger Zone
                    </h3>
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-900 dark:text-red-200">
                            Delete Account
                          </h4>
                          <p className="text-sm text-red-700 dark:text-red-300">
                            Permanently delete your account and all data. This action cannot be undone.
                          </p>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            showDeleteConfirm
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {showDeleteConfirm ? "Confirm Delete" : "Delete Account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t dark:border-gray-600">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
