'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface PromotionData {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
}

interface EmailResult {
  userId: string;
  email: string;
  success: boolean;
  messageId?: string;
  error?: string;
}

export default function PromotionalEmailForm() {
  const { data: _session } = useSession();
  const [promotion, setPromotion] = useState<PromotionData>({
    title: '',
    description: '',
    ctaText: '',
    ctaUrl: '',
  });
  const [targetUserIds, setTargetUserIds] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [stats, setStats] = useState<{ totalUsers: number; emailsSent: number } | null>(null);

  const handleInputChange = (field: keyof PromotionData, value: string) => {
    setPromotion(prev => ({ ...prev, [field]: value }));
  };

  const handleSendEmails = async () => {
    if (!promotion.title || !promotion.description || !promotion.ctaText || !promotion.ctaUrl) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setResults([]);

    try {
      const userIds = targetUserIds
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);

      const response = await fetch('/api/email/promotional', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: userIds.length > 0 ? userIds : undefined,
          promotion,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
        setStats({
          totalUsers: data.totalUsers || 0,
          emailsSent: data.results?.filter((r: EmailResult) => r.success).length || 0,
        });
      } else {
        alert(`Error: ${data.error || 'Failed to send emails'}`);
      }
    } catch (error) {
      console.error('Error sending promotional emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'promotional',
          testPromotion: promotion,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Test email sent successfully!');
      } else {
        alert(`Error: ${data.error || 'Failed to send test email'}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      alert('Failed to send test email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Promotional Email Campaign</h2>
        <p className="text-gray-600">Create and send promotional emails to your users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title *
            </label>
            <input
              type="text"
              value={promotion.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Limited Time Offer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={promotion.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your promotional offer..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call-to-Action Text *
            </label>
            <input
              type="text"
              value={promotion.ctaText}
              onChange={(e) => handleInputChange('ctaText', e.target.value)}
              placeholder="e.g., Claim Offer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Call-to-Action URL *
            </label>
            <input
              type="url"
              value={promotion.ctaUrl}
              onChange={(e) => handleInputChange('ctaUrl', e.target.value)}
              placeholder="https://example.com/offer"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target User IDs (Optional)
            </label>
            <textarea
              value={targetUserIds}
              onChange={(e) => setTargetUserIds(e.target.value)}
              placeholder="Comma-separated user IDs (leave empty to send to all eligible users)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Leave empty to send to all users with email notifications enabled
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleTestEmail}
              disabled={isLoading || !promotion.title}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Test Email'}
            </button>
            <button
              onClick={handleSendEmails}
              disabled={isLoading || !promotion.title || !promotion.description}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send Campaign'}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Email Preview</h3>
            <div className="border border-gray-300 rounded-md p-4 bg-gray-50">
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="bg-gradient-to-r from-pink-400 to-red-400 text-white p-4 rounded-t-md">
                  <h2 className="text-xl font-bold">{promotion.title || 'Campaign Title'} 🎉</h2>
                  <p className="text-sm opacity-90">Limited time offer just for you!</p>
                </div>
                <div className="p-4">
                  <p className="mb-4">Hey [User Name]!</p>
                  <p className="mb-4">{promotion.description || 'Your promotional description will appear here...'}</p>
                  <div className="bg-yellow-50 p-3 border-l-4 border-yellow-400 mb-4">
                    <strong>🎯 This offer is personalized for your [User Mood] learning style!</strong>
                  </div>
                  <p className="mb-4">Don&rsquo;t miss out on this opportunity to level up your JavaScript skills with premium content and features.</p>
                  {promotion.ctaText && promotion.ctaUrl && (
                    <a
                      href={promotion.ctaUrl}
                      className="inline-block bg-red-500 text-white px-6 py-3 rounded-full font-semibold text-center"
                    >
                      {promotion.ctaText}
                    </a>
                  )}
                  <p className="text-sm text-gray-500 mt-4">This offer expires soon. Take action now! ⏰</p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {stats && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Results</h3>
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.emailsSent}</div>
                    <div className="text-sm text-gray-600">Emails Sent</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                    <div className="text-sm text-gray-600">Total Recipients</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Results</h3>
              <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                {results.map((result, index) => (
                  <div key={index} className={`p-3 border-b ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{result.email}</span>
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