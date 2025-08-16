"use client";

import { SaveStatus } from "@/hooks/useCodeProgress";
import { Check, Save, AlertCircle, Loader2 } from "lucide-react";

interface SaveIndicatorProps {
  saveStatus: SaveStatus;
  hasUnsavedChanges: boolean;
  onManualSave?: () => void;
  className?: string;
}

export function SaveIndicator({
  saveStatus,
  hasUnsavedChanges,
  onManualSave,
  className = "",
}: SaveIndicatorProps) {
  const getStatusConfig = () => {
    switch (saveStatus.status) {
      case "saving":
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: "Saving...",
          className: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
        };
      case "saved":
        return {
          icon: <Check className="w-4 h-4" />,
          text: "Saved",
          className: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
        };
      case "error":
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: saveStatus.message || "Save failed",
          className: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
        };
      default:
        if (hasUnsavedChanges) {
          return {
            icon: <Save className="w-4 h-4" />,
            text: "Unsaved changes",
            className: "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
          };
        }
        return {
          icon: <Check className="w-4 h-4" />,
          text: "Up to date",
          className: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700",
        };
    }
  };

  const config = getStatusConfig();

  const handleClick = () => {
    if (saveStatus.status === "error" || hasUnsavedChanges) {
      onManualSave?.();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${config.className} ${
          (saveStatus.status === "error" || hasUnsavedChanges) && onManualSave
            ? "cursor-pointer hover:opacity-80"
            : ""
        }`}
        onClick={handleClick}
        title={
          saveStatus.status === "error"
            ? "Click to retry saving"
            : hasUnsavedChanges
            ? "Click to save now"
            : config.text
        }
      >
        {config.icon}
        <span className="font-medium">{config.text}</span>
      </div>
      
      {saveStatus.status === "idle" && hasUnsavedChanges && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Auto-save in progress...
        </div>
      )}
    </div>
  );
}