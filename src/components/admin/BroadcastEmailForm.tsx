'use client';

import { useState } from 'react';

interface BroadcastEmailFormProps {
  onSuccess?: () => void;
}

type RecipientType = 'all' | 'free' | 'premium' | 'specific';

export default function BroadcastEmailForm({ onSuccess }: BroadcastEmailFormProps) {
  const [recipientType, setRecipientType] = useState<RecipientType>('all');
  const [specificEmails, setSpecificEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeUnsubscribe, setIncludeUnsubscribe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    sent?: number;
    failed?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/broadcast-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientType,
          specificEmails: specificEmails.split(',').map(e => e.trim()).filter(Boolean),
          subject,
          message,
          includeUnsubscribe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      setResult({
        success: true,
        message: 'Emails sent successfully!',
        sent: data.sent,
        failed: data.failed,
      });

      // Reset form
      setSubject('');
      setMessage('');
      setSpecificEmails('');

      if (onSuccess) onSuccess();
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send emails',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecipientCount = () => {
    switch (recipientType) {
      case 'specific':
        return specificEmails.split(',').filter(e => e.trim()).length;
      default:
        return 'fetching...';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Broadcast Email</h2>
        <p className="text-gray-600 mt-1">
          Send custom emails to your subscribers with unsubscribe functionality
        </p>
      </div>

      {result && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            result.success
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <div className="flex items-start">
            <span className="text-2xl mr-3">
              {result.success ? '✅' : '❌'}
            </span>
            <div>
              <p
                className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {result.message}
              </p>
              {result.success && result.sent !== undefined && (
                <p className="text-sm text-gray-600 mt-1">
                  Successfully sent: {result.sent} emails
                  {result.failed ? ` | Failed: ${result.failed}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recipient Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recipients
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRecipientType('all')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                recipientType === 'all'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">All Users</div>
              <div className="text-sm text-gray-600">Send to everyone</div>
            </button>

            <button
              type="button"
              onClick={() => setRecipientType('free')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                recipientType === 'free'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Free Users</div>
              <div className="text-sm text-gray-600">Free plan only</div>
            </button>

            <button
              type="button"
              onClick={() => setRecipientType('premium')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                recipientType === 'premium'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Premium Users</div>
              <div className="text-sm text-gray-600">Paid subscribers</div>
            </button>

            <button
              type="button"
              onClick={() => setRecipientType('specific')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                recipientType === 'specific'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">Specific Emails</div>
              <div className="text-sm text-gray-600">Custom list</div>
            </button>
          </div>
        </div>

        {/* Specific Emails Input */}
        {recipientType === 'specific' && (
          <div>
            <label
              htmlFor="specificEmails"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Addresses (comma-separated)
            </label>
            <textarea
              id="specificEmails"
              value={specificEmails}
              onChange={(e) => setSpecificEmails(e.target.value)}
              rows={3}
              placeholder="user1@example.com, user2@example.com, user3@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={recipientType === 'specific'}
            />
            <p className="text-sm text-gray-600 mt-1">
              Recipients: {getRecipientCount()}
            </p>
          </div>
        )}

        {/* Email Subject */}
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter email subject..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Email Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            placeholder="Write your email message here... (supports HTML)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            💡 Tip: You can use HTML formatting. Variables: {'{username}'}, {'{email}'}
          </p>
        </div>

        {/* Options */}
        <div className="border-t pt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeUnsubscribe"
              checked={includeUnsubscribe}
              onChange={(e) => setIncludeUnsubscribe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="includeUnsubscribe"
              className="ml-2 block text-sm text-gray-700"
            >
              Include unsubscribe link (recommended for compliance)
            </label>
          </div>
        </div>

        {/* Preview Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Preview</h3>
          <div className="bg-white p-4 border rounded">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Subject: {subject || '(No subject)'}
            </p>
            <div
              className="text-sm text-gray-600 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{
                __html: message || '<em>Message preview will appear here...</em>',
              }}
            />
            {includeUnsubscribe && (
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                <p>Unsubscribe link will be added here automatically</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-600">
            This will send to{' '}
            <strong>
              {recipientType === 'specific'
                ? `${getRecipientCount()} specific users`
                : `${recipientType} users`}
            </strong>
          </p>
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Sending...
              </>
            ) : (
              <>
                <span className="mr-2">📧</span>
                Send Emails
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
