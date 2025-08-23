"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMood } from "@/components/providers/MoodProvider";
import { MOODS } from "@/lib/moods";
import { ToastContainer, Toast } from "@/components/ui/Toast";
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
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { SubscriptionManager } from "@/components/subscription/SubscriptionManager";
import { UsageStatistics } from "@/components/subscription/UsageStatistics";

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
    timezone: string;
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
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

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
      shareProgress: true,
      allowAnalytics: true,
    },
    learning: {
      dailyGoal: 30,
      reminderTime: "18:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      difficulty: "medium",
      autoSubmit: false,
    },
  });

  const [originalSettings, setOriginalSettings] = useState<UserSettings | null>(null);

  // Toast functions
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, []);

  const showError = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message });
  }, []);

  const showWarning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, []);

  const showInfo = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, []);

  // Validation functions
  const validateSettings = (settingsToValidate: UserSettings): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!settingsToValidate.name.trim()) {
      errors.name = "Name is required";
    }

    if (settingsToValidate.learning.dailyGoal < 5) {
      errors.dailyGoal = "Daily goal must be at least 5 minutes";
    }

    if (settingsToValidate.learning.dailyGoal > 480) {
      errors.dailyGoal = "Daily goal cannot exceed 8 hours (480 minutes)";
    }

    return errors;
  };

  // Check for unsaved changes
  useEffect(() => {
    if (originalSettings) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);
      setHasUnsavedChanges(hasChanges);
    }
  }, [settings, originalSettings]);

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
          const loadedSettings = {
            name: session.user?.name || "",
            email: session.user?.email || "",
            preferredMood: currentMood.id,
            notifications: {
              email: true,
              reminders: true,
              achievements: true,
              weeklyProgress: false,
            },
            privacy: {
              showProfile: true,
              shareProgress: true,
              allowAnalytics: true,
            },
            learning: {
              dailyGoal: 30,
              reminderTime: "18:00",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              difficulty: "medium" as const,
              autoSubmit: false,
            },
            ...data.settings,
          };
          setSettings(loadedSettings);
          setOriginalSettings(loadedSettings);
        } else {
          showError("Failed to load settings", "Please refresh the page and try again");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        showError("Connection error", "Failed to load your settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [session, router]); // Removed settings and showError from dependency array

  const handleSettingsChange = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    // Clear validation errors for changed fields
    const errors = { ...validationErrors };
    Object.keys(newSettings).forEach(key => {
      delete errors[key];
    });
    setValidationErrors(errors);
  };

  const handleSaveSettings = async () => {
    const errors = validateSettings(settings);
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      showError("Validation Error", "Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        // Update mood if changed
        if (settings.preferredMood !== currentMood.id) {
          const newMood = MOODS[settings.preferredMood];
          if (newMood) {
            setMood(newMood.id);
          }
        }

        setOriginalSettings(settings);
        setHasUnsavedChanges(false);
        showSuccess("Settings saved!", "Your preferences have been updated successfully");
      } else {
        throw new Error(data.error || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      showError("Save failed", error instanceof Error ? error.message : "Please try again");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      setValidationErrors({});
      showInfo("Settings reset", "Changes have been reverted to saved values");
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export-data");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibed-to-cracked-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess("Data exported", "Your learning data has been downloaded");
      } else {
        throw new Error("Export failed");
      }
    } catch (_error) {
      showError("Export failed", "Unable to export your data at this time");
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      showWarning("Confirm deletion", "Click the button again to permanently delete your account");
      return;
    }

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccess("Account deleted", "Your account has been permanently deleted");
        setTimeout(() => router.push("/"), 2000);
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      showError("Deletion failed", "Unable to delete your account at this time");
    }
  };

  // Get reminder preview
  const getReminderPreview = () => {
    const reminderTime = settings.learning.reminderTime;
    const timezone = settings.learning.timezone;
    
    if (!reminderTime) return "Not set";
    
    const now = new Date();
    const [hours, minutes] = reminderTime.split(':').map(Number);
    const reminderDate = new Date(now);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }
    
    return `Next reminder: ${reminderDate.toLocaleDateString()} at ${reminderTime} (${timezone})`;
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "learning", label: "Learning", icon: Brain },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading your settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
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

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <button
                  onClick={handleResetToDefaults}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
              )}
              
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
            </div>
          )}

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
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) =>
                          handleSettingsChange({ name: e.target.value })
                        }
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.name 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {validationErrors.name && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.name}</p>
                      )}
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
                          className={`p-4 rounded-lg border-2 transition-all text-left relative overflow-hidden ${
                            settings.preferredMood === mood.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-200 dark:ring-blue-800"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md"
                          }`}
                        >
                          {settings.preferredMood === mood.id && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                          
                          <div className="text-center mb-4">
                            <div className="text-3xl mb-2">{mood.emoji}</div>
                            <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                              {mood.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              {mood.description}
                            </div>
                          </div>

                          {/* Mood Impact Details */}
                          <div className="space-y-3 text-left">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Quiz Questions:</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {mood.quizSettings.questionsPerTutorial}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                              <span className={`font-medium px-2 py-1 rounded text-xs ${
                                mood.quizSettings.difficulty === 'easy' 
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : mood.quizSettings.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {mood.quizSettings.difficulty.charAt(0).toUpperCase() + mood.quizSettings.difficulty.slice(1)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Time Limit:</span>
                              <span className="font-medium text-gray-700 dark:text-gray-300">
                                {mood.quizSettings.timeLimit ? `${mood.quizSettings.timeLimit}s/question` : 'No limit'}
                              </span>
                            </div>

                            {/* Features */}
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                              <div className="flex flex-wrap gap-1">
                                {mood.features.animations && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                                    ✨ Animations
                                  </span>
                                )}
                                {mood.features.music && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                    🎵 {mood.features.music}
                                  </span>
                                )}
                                {mood.features.notifications && (
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                                    🔔 Alerts
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Current Mood Impact Summary */}
                    {settings.preferredMood && (
                      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                          <span className="text-xl">{MOODS[settings.preferredMood].emoji}</span>
                          Your {MOODS[settings.preferredMood].name} Experience
                        </h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          <p>• You&rsquo;ll see <strong>{MOODS[settings.preferredMood].quizSettings.questionsPerTutorial} questions per quiz</strong> at <strong>{MOODS[settings.preferredMood].quizSettings.difficulty}</strong> difficulty</p>
                          <p>• {MOODS[settings.preferredMood].quizSettings.timeLimit 
                            ? `Each question has a ${MOODS[settings.preferredMood].quizSettings.timeLimit} second time limit` 
                            : 'Take your time - no time pressure!'}</p>
                          <p>• {MOODS[settings.preferredMood].features.animations ? 'Enhanced with smooth animations and effects' : 'Clean, distraction-free interface for maximum focus'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Subscription Management
                    </h2>
                  </div>

                  <SubscriptionManager 
                    onUpgrade={(plan) => {
                      // Handle upgrade - redirect to pricing with selected plan
                      window.open(`/pricing?plan=${plan.toLowerCase()}`, '_blank');
                    }} 
                  />

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      Usage Statistics
                    </h3>
                    <UsageStatistics />
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
                        description:
                          "Daily reminders to keep up with your studies",
                        icon: Clock,
                      },
                      {
                        key: "achievements",
                        label: "Achievement Alerts",
                        description:
                          "Get notified when you unlock new achievements",
                        icon: Award,
                      },
                      {
                        key: "weeklyProgress",
                        label: "Weekly Progress Reports",
                        description:
                          "Summary of your learning progress each week",
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
                            checked={
                              settings.notifications[
                                notification.key as keyof typeof settings.notifications
                              ]
                            }
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

              {/* Learning Tab Enhanced */}
              {activeTab === "learning" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      Learning Preferences
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{getReminderPreview()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Daily Learning Goal (minutes) *
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="480"
                        step="5"
                        value={settings.learning.dailyGoal}
                        onChange={(e) =>
                          handleSettingsChange({
                            learning: {
                              ...settings.learning,
                              dailyGoal: parseInt(e.target.value) || 30,
                            },
                          })
                        }
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.dailyGoal 
                            ? 'border-red-300 dark:border-red-600' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      />
                      {validationErrors.dailyGoal && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors.dailyGoal}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Recommended: 30-60 minutes per day
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        value={settings.learning.reminderTime}
                        onChange={(e) =>
                          handleSettingsChange({
                            learning: {
                              ...settings.learning,
                              reminderTime: e.target.value,
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        📍 {settings.learning.timezone}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Difficulty
                      </label>
                      <select
                        value={settings.learning.difficulty}
                        onChange={(e) =>
                          handleSettingsChange({
                            learning: {
                              ...settings.learning,
                              difficulty: e.target.value as "easy" | "medium" | "hard",
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="easy">Easy - Take your time</option>
                        <option value="medium">Medium - Balanced pace</option>
                        <option value="hard">Hard - Challenge mode</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="autoSubmit"
                        checked={settings.learning.autoSubmit}
                        onChange={(e) =>
                          handleSettingsChange({
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
                        Auto-submit when timer expires
                      </label>
                    </div>
                  </div>

                  {/* Reminder Preview */}
                  {settings.notifications.reminders && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Reminder Preview</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        You&apos;ll receive daily study reminders at {settings.learning.reminderTime} in your local timezone. 
                        Reminders will include your current progress and suggest what to work on next.
                      </p>
                    </div>
                  )}
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
                        description:
                          "Allow others to see your profile and achievements",
                        icon: Eye,
                      },
                      {
                        key: "shareProgress",
                        label: "Share Learning Progress",
                        description:
                          "Share your progress with friends and study groups",
                        icon: Target,
                      },
                      {
                        key: "allowAnalytics",
                        label: "Analytics & Improvement",
                        description:
                          "Help us improve the platform with usage analytics",
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
                            checked={
                              settings.privacy[
                                privacy.key as keyof typeof settings.privacy
                              ]
                            }
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
                            Permanently delete your account and all data. This
                            action cannot be undone.
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
                          {showDeleteConfirm
                            ? "Confirm Delete"
                            : "Delete Account"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-between items-center pt-6 border-t dark:border-gray-600">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {hasUnsavedChanges && (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Unsaved changes</span>
                    </>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {hasUnsavedChanges && (
                    <button
                      onClick={handleResetToDefaults}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                      Cancel
                    </button>
                  )}
                  
                  <button
                    onClick={handleSaveSettings}
                    disabled={saving || !hasUnsavedChanges}
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
      </div>
    </>
  );
}
