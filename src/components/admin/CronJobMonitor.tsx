'use client';

import { useState, useEffect } from 'react';

interface CronStats {
  totalJobs: number;
  successfulJobs: number;
  failedJobs: number;
  successRate: number;
  avgEmailsPerExecution: number;
  totalEmailsSent: number;
}

interface CronExecution {
  timestamp: string;
  success: boolean;
  result?: string;
  error?: string;
  timeSpent?: number;
}

interface CronStatus {
  status: string;
  statistics: CronStats;
  lastExecution: CronExecution | null;
  lastSuccessfulExecution: CronExecution | null;
  recentExecutions: CronExecution[];
}

export default function CronJobMonitor() {
  const [cronStatus, setCronStatus] = useState<CronStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchCronStatus();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchCronStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCronStatus = async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/cron/status');
      if (response.ok) {
        const data = await response.json();
        setCronStatus(data);
      }
    } catch (error) {
      console.error('Error fetching cron status:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const triggerTestRun = async () => {
    try {
      const response = await fetch('/api/cron/study-reminders?test=true');
      if (response.ok) {
        const data = await response.json();
        alert(`Test completed!\nInactive users found: ${data.stats?.inactiveUsersCount || 0}`);
        fetchCronStatus(false);
      } else {
        alert('Test failed. Check console for details.');
      }
    } catch (error) {
      console.error('Error running test:', error);
      alert('Test failed. Check console for details.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cronStatus) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">Failed to load cron job status</div>
        <button 
          onClick={() => fetchCronStatus()}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const { statistics, lastExecution, recentExecutions } = cronStatus;
  const statusColor = statistics.successRate >= 90 ? 'green' : statistics.successRate >= 70 ? 'yellow' : 'red';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cron Job Monitor</h2>
          <p className="text-gray-600">Automated study reminder system status</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => fetchCronStatus(false)}
            disabled={isRefreshing}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            onClick={triggerTestRun}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Run
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className={`bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="text-3xl mr-4">
              {statusColor === 'green' ? '✅' : statusColor === 'yellow' ? '⚠️' : '❌'}
            </div>
            <div>
              <div className={`text-2xl font-bold text-${statusColor}-600`}>
                {statistics.successRate}%
              </div>
              <div className={`text-sm text-${statusColor}-800`}>Success Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📊</div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {statistics.totalJobs}
              </div>
              <div className="text-sm text-blue-800">Total Executions (30d)</div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📧</div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {statistics.totalEmailsSent}
              </div>
              <div className="text-sm text-purple-800">Emails Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {statistics.avgEmailsPerExecution}
              </div>
              <div className="text-sm text-orange-800">Avg per Run</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Last Execution Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Last Execution</h3>
          {lastExecution ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${lastExecution.success ? 'text-green-600' : 'text-red-600'}`}>
                  {lastExecution.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">
                  {new Date(lastExecution.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{lastExecution.timeSpent || 0}s</span>
              </div>
              {lastExecution.result && (
                <div>
                  <span className="text-gray-600">Result:</span>
                  <p className="text-sm bg-gray-50 p-2 rounded mt-1 font-mono">
                    {lastExecution.result}
                  </p>
                </div>
              )}
              {lastExecution.error && (
                <div>
                  <span className="text-red-600">Error:</span>
                  <p className="text-sm bg-red-50 p-2 rounded mt-1 font-mono text-red-700">
                    {lastExecution.error}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No executions found</p>
          )}
        </div>

        {/* System Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Cron Job Status</span>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full bg-${statusColor}-500 mr-2`}></div>
                <span className="text-sm font-medium">
                  {cronStatus.status === 'healthy' ? 'Healthy' : 'Issues Detected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Recent Success Rate</span>
              <span className={`font-medium text-${statusColor}-600`}>
                {statistics.successfulJobs}/{statistics.totalJobs}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Failed Jobs</span>
              <span className={`font-medium ${statistics.failedJobs > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {statistics.failedJobs}
              </span>
            </div>

            {statistics.successRate < 90 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                <div className="text-yellow-800 text-sm">
                  <strong>⚠️ Attention:</strong> Success rate is below 90%. 
                  Check recent errors and email configuration.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Executions Log */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Executions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentExecutions.map((execution, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(execution.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        execution.success 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {execution.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {execution.timeSpent || 0}s
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {execution.error || execution.result || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">🔧 Cron Job Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Windows (Task Scheduler)</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. Run as Administrator: <code className="bg-blue-100 px-2 py-1 rounded">scripts\setup-cron.bat</code></p>
              <p>2. Task will run daily at 6:00 PM</p>
              <p>3. Check Task Scheduler for status</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Manual Testing</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Test: <code className="bg-blue-100 px-2 py-1 rounded">node scripts/cron-study-reminders.js --test</code></p>
              <p>Run: <code className="bg-blue-100 px-2 py-1 rounded">node scripts/cron-study-reminders.js</code></p>
              <p>Or use the &ldquo;Test Run&rdquo; button above</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}