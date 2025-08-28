"use client";

import { useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "success" | "info";
  isLoading?: boolean;
}

const variantConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    iconBg: "bg-red-100",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    borderColor: "border-red-200",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-yellow-600",
    iconBg: "bg-yellow-100",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
    borderColor: "border-yellow-200",
  },
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    confirmButton: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    borderColor: "border-green-200",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    borderColor: "border-blue-200",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "info",
  isLoading = false,
}: ConfirmationModalProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border ${config.borderColor} dark:border-gray-700`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {!isLoading && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`p-3 rounded-full ${config.iconBg} dark:bg-opacity-20`}
            >
              <IconComponent
                className={`w-6 h-6 ${config.iconColor} dark:opacity-90`}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors ${
                config.confirmButton
              } ${isLoading ? "cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {confirmText}
                </div>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
