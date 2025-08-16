'use client';

import { useState, useEffect, useCallback } from 'react';

interface ReminderStats {
  inactiveUsersCount: number;
  usersWithRemindersEnabled: number;
  daysInactive: number;
}

interface ReminderResult {
  userId: string;
  email: string;
  success: boolean;
  messageId?: string;
  error?: string;
  lastActive: string;
  nextLesson?: string;
}

export default function StudyReminderForm() {
  const [daysInactive, setDaysInactive] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [results, setResults] = useState<ReminderResult[]>([]);
  const [autoSchedule, setAutoSchedule] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [daysInactive]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/email/study-reminder?days=${daysInactive}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [daysInactive]);

  const handleSendReminders = async () => {
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/email/study-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          daysInactive,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
        await fetchStats(); // Refresh stats
      } else {
        alert(`Error: ${data.error || 'Failed to send reminders'}`);
      }
    } catch (error) {
      console.error('Error sending study reminders:', error);
      alert('Failed to send reminders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestReminder = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'reminder',
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Test reminder sent successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to send test reminder'}`);
      }
    } catch (error) {
      console.error('Error sending test reminder:', error);
      alert('Failed to send test reminder.');
    } finally {
      setIsLoading(false);
    }
  };

  const setupAutoSchedule = async () => {
    // This would integrate with a cron job or scheduling service
    alert('Auto-scheduling feature would be implemented with a background job service (like cron or AWS Lambda)');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Reminder System</h2>
        <p className="text-gray-600">Send automated reminders to inactive users with their progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">🎯 Smart Reminder Features</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Automatically detects inactive users</li>
              <li>• Includes current progress and next steps</li>
              <li>• Personalizes content based on user mood</li>
              <li>• Shows streak information and achievements</li>
              <li>• Respects user notification preferences</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Since Last Activity
            </label>
            <select
              value={daysInactive}
              onChange={(e) => setDaysInactive(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={1}>1 day</option>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={5}>5 days</option>
              <option value={7}>1 week</option>
              <option value={14}>2 weeks</option>
              <option value={30}>1 month</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Users who haven&rsquo;t been active for this many days will receive reminders
            </p>
          </div>

          {stats && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Current Statistics</h3>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inactive users ({daysInactive}+ days):</span>
                  <span className="font-semibold text-orange-600">{stats.inactiveUsersCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Users with reminders enabled:</span>
                  <span className="font-semibold text-green-600">{stats.usersWithRemindersEnabled}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eligible for reminders:</span>
                  <span className="font-semibold text-blue-600">{stats.inactiveUsersCount}</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoSchedule"
                checked={autoSchedule}
                onChange={(e) => setAutoSchedule(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="autoSchedule" className="ml-2 text-sm text-gray-700">
                Enable automatic daily reminders
              </label>
            </div>
            {autoSchedule && (
              <p className="text-xs text-gray-500 ml-6">
                Reminders will be sent automatically every day at 6 PM local time to eligible users
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTestReminder}
              disabled={isLoading}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Test Reminder'}
            </button>
            <button
              onClick={handleSendReminders}
              disabled={isLoading || !stats?.inactiveUsersCount}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : `Send to ${stats?.inactiveUsersCount || 0} Users`}
            </button>
          </div>

          {autoSchedule && (
            <button
              onClick={setupAutoSchedule}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Configure Auto-Schedule
            </button>
          )}
        </div>

        {/* Preview and Results Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Email Preview</h3>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 text-white p-4 rounded-t-md">
                  <h2 className="text-xl font-bold">Your Code is Calling! 💻</h2>
                  <p className="text-sm opacity-90">Time to get back in the chill zone</p>
                </div>
                <div className="p-4">
                  <p className="mb-4">Hey [User Name]! 👋</p>
                  <p className="mb-4">We noticed it&rsquo;s been {daysInactive} day{daysInactive > 1 ? 's' : ''} since your last coding session. Your JavaScript skills are missing you!</p>
                  
                  <div className="bg-green-50 p-3 rounded-lg mb-4 text-center">
                    <h3 className="font-bold text-green-800">🔥 Your Current Progress:</h3>
                    <div className="mt-2 space-y-1 text-sm text-green-700">
                      <p>• <strong>In Progress:</strong> JavaScript Arrays Tutorial</p>
                      <p>• <strong>Next Challenge:</strong> Array Methods Practice</p>
                      <p>• <strong>Current Streak:</strong> 5 days</p>
                      <p>• <strong>Completion:</strong> 65% through JavaScript Fundamentals</p>
                    </div>
                  </div>

                  <p className="mb-4">Remember, consistency is key to mastering JavaScript. Even 15 minutes of practice can make a huge difference!</p>
                  
                  <h3 className="font-semibold mb-2">📚 Your Personalized Study Plan:</h3>
                  <ul className="text-sm mb-4 space-y-1">
                    <li>🎯 Complete &ldquo;JavaScript Arrays&rdquo; tutorial (10 mins)</li>
                    <li>💪 Try the &ldquo;Array Methods&rdquo; challenge (15 mins)</li>
                    <li>🧠 Take the quiz to test your knowledge (5 mins)</li>
                    <li>🏆 Unlock your next achievement!</li>
                  </ul>
                  
                  <a
                    href="#"
                    className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full font-semibold"
                  >
                    Continue Learning
                  </a>
                  <p className="text-sm text-gray-500 mt-4">
                    Switch your mood in settings to match your energy! 🎭
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reminder Results</h3>
              <div className="bg-orange-50 border border-orange-200 rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.filter(r => r.success).length}
                    </div>
                    <div className="text-sm text-gray-600">Reminders Sent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                    <div className="text-sm text-gray-600">Total Recipients</div>
                  </div>
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                {results.map((result, index) => (
                  <div key={index} className={`p-3 border-b ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium">{result.email}</span>
                        {result.nextLesson && (
                          <p className="text-xs text-gray-600">Next: {result.nextLesson}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? 'Sent' : 'Failed'}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-xs text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}