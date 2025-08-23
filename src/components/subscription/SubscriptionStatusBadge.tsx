"use client";

import { Crown, Zap, Settings, AlertTriangle, Clock } from "lucide-react";
import { Plan, SubscriptionStatus } from "@/lib/subscriptionService";

interface SubscriptionStatusBadgeProps {
  plan: Plan;
  status: SubscriptionStatus;
  subscriptionEndsAt?: Date | null;
  showUpgradePrompt?: boolean;
  onUpgrade?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'card' | 'inline';
}

export function SubscriptionStatusBadge({ 
  plan, 
  status, 
  subscriptionEndsAt,
  showUpgradePrompt = false,
  onUpgrade,
  size = 'md',
  variant = 'badge'
}: SubscriptionStatusBadgeProps) {
  
  const getPlanIcon = () => {
    switch (plan) {
      case 'CRACKED':
        return <Zap className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`} />;
      case 'VIBED':
        return <Crown className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`} />;
      default:
        return <Settings className={`${size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-6 h-6' : 'w-4 h-4'}`} />;
    }
  };

  const getPlanColors = () => {
    switch (plan) {
      case 'CRACKED':
        return {
          bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
          text: 'text-white',
          border: 'border-purple-500',
          lightBg: 'bg-purple-50 dark:bg-purple-900/20',
          lightText: 'text-purple-900 dark:text-purple-100',
          lightBorder: 'border-purple-200 dark:border-purple-800'
        };
      case 'VIBED':
        return {
          bg: 'bg-gradient-to-r from-yellow-400 to-orange-500',
          text: 'text-white',
          border: 'border-yellow-500',
          lightBg: 'bg-yellow-50 dark:bg-yellow-900/20',
          lightText: 'text-yellow-900 dark:text-yellow-100',
          lightBorder: 'border-yellow-200 dark:border-yellow-800'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
          text: 'text-white',
          border: 'border-gray-500',
          lightBg: 'bg-gray-50 dark:bg-gray-900/20',
          lightText: 'text-gray-900 dark:text-gray-100',
          lightBorder: 'border-gray-200 dark:border-gray-800'
        };
    }
  };

  const getStatusInfo = () => {
    const now = new Date();
    const isExpired = subscriptionEndsAt && subscriptionEndsAt < now;
    const isExpiringSoon = subscriptionEndsAt && 
      subscriptionEndsAt > now && 
      subscriptionEndsAt.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000; // 7 days

    if (status === SubscriptionStatus.CANCELLED) {
      return {
        statusText: 'Cancelled',
        statusColor: 'text-red-600 dark:text-red-400',
        showWarning: true,
        warningText: subscriptionEndsAt ? `Access until ${subscriptionEndsAt.toLocaleDateString()}` : 'Access limited'
      };
    }

    if (isExpired) {
      return {
        statusText: 'Expired',
        statusColor: 'text-red-600 dark:text-red-400',
        showWarning: true,
        warningText: 'Subscription has expired'
      };
    }

    if (isExpiringSoon) {
      return {
        statusText: 'Expires Soon',
        statusColor: 'text-yellow-600 dark:text-yellow-400',
        showWarning: true,
        warningText: `Renews ${subscriptionEndsAt!.toLocaleDateString()}`
      };
    }

    if (status === SubscriptionStatus.ACTIVE) {
      return {
        statusText: 'Active',
        statusColor: 'text-green-600 dark:text-green-400',
        showWarning: false,
        warningText: subscriptionEndsAt ? `Renews ${subscriptionEndsAt.toLocaleDateString()}` : ''
      };
    }

    return {
      statusText: status,
      statusColor: 'text-gray-600 dark:text-gray-400',
      showWarning: false,
      warningText: ''
    };
  };

  const colors = getPlanColors();
  const statusInfo = getStatusInfo();

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} ${
        size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
      } font-medium`}>
        {getPlanIcon()}
        <span>{plan}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text} text-sm font-medium`}>
          {getPlanIcon()}
          <span>{plan}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={`text-sm ${statusInfo.statusColor}`}>
            {statusInfo.statusText}
          </span>
          {statusInfo.showWarning && (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
        </div>
        
        {statusInfo.warningText && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {statusInfo.warningText}
          </span>
        )}
      </div>
    );
  }

  // Card variant
  return (
    <div className={`p-4 rounded-lg border ${colors.lightBorder} ${colors.lightBg}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
            {getPlanIcon()}
          </div>
          <div>
            <h4 className={`font-semibold ${colors.lightText} ${
              size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
            }`}>
              {plan} Plan
            </h4>
            <p className={`text-xs ${statusInfo.statusColor}`}>
              {statusInfo.statusText}
            </p>
          </div>
        </div>
        
        {statusInfo.showWarning && (
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
        )}
      </div>

      {statusInfo.warningText && (
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {statusInfo.warningText}
          </span>
        </div>
      )}

      {showUpgradePrompt && plan !== 'CRACKED' && onUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {plan === 'FREE' ? 'Upgrade to Premium' : 'Upgrade to Cracked'}
        </button>
      )}
    </div>
  );
}