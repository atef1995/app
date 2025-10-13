'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useState } from 'react';
import PromotionalEmailForm from '@/components/admin/PromotionalEmailForm';
import StudyReminderForm from '@/components/admin/StudyReminderForm';
import EmailStatsDashboard from '@/components/admin/EmailStatsDashboard';
import CronJobMonitor from '@/components/admin/CronJobMonitor';
import PeerReviewDashboard from '@/components/admin/PeerReviewDashboard';
import BroadcastEmailForm from '@/components/admin/BroadcastEmailForm';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', component: EmailStatsDashboard },
    { id: 'reviews', label: '👥 Peer Reviews', component: PeerReviewDashboard },
    { id: 'promotional', label: '📧 Promotional Emails', component: PromotionalEmailForm },
    { id: 'reminders', label: '⏰ Study Reminders', component: StudyReminderForm },
    { id: 'cron', label: '🤖 Cron Jobs', component: CronJobMonitor },
    { id: 'broadcast', label: '📢 Broadcast Emails', component: BroadcastEmailForm },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || EmailStatsDashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage system operations, peer reviews, and user engagement</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {session.user.name || session.user.email}
              </span>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                ADMIN
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}