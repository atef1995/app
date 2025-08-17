"use client";

import { useState, useEffect } from "react";
import { Play, Code, Eye } from "lucide-react";
import { HTMLPreviewWindow } from "./HTMLPreviewWindow";

interface DOMInteractiveBlockProps {
  title: string;
  description: string;
  javascript: string;
  html: string;
  css?: string;
  height?: number;
}

export function DOMInteractiveBlock({
  title,
  description,
  javascript,
  html,
  css = "",
  height = 250,
}: DOMInteractiveBlockProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [currentCode, setCurrentCode] = useState(javascript);
  const [executed, setExecuted] = useState(false);
  const [executeCount, setExecuteCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset code when javascript prop changes
  useEffect(() => {
    setCurrentCode(javascript);
    setExecuted(false);
    setExecuteCount(0);
  }, [javascript]);

  const executeCode = () => {
    if (!isMounted) return;
    
    setExecuted(true);
    setExecuteCount((prev) => prev + 1);
    
    // Switch to preview tab with a slight delay to ensure state updates
    if (activeTab === "code") {
      setTimeout(() => {
        setActiveTab("preview");
      }, 100);
    }
  };

  return (
    <div className="my-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "code"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:cursor-pointer"
          }`}
        >
          <Code className="w-4 h-4" />
          JavaScript Code
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "preview"
              ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-b-2 border-blue-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:cursor-pointer"
          }`}
        >
          <Eye className="w-4 h-4" />
          Live Preview
        </button>
      </div>

      {/* Content */}
      <div className="relative">
        {activeTab === "code" && (
          <div className="p-4">
            {/* Code Editor */}
            <div className="relative">
              <textarea
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                className="w-full h-48 p-3 font-mono text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                spellCheck={false}
                placeholder="Write your JavaScript code here..."
              />
            </div>

            {/* Execute Button */}
            <div className="mt-4 flex justify-center">
              <button
                onClick={executeCode}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Run Code & See Result
              </button>
            </div>
          </div>
        )}

        {activeTab === "preview" && isMounted && (
          <div className="p-4">
            <HTMLPreviewWindow
              key={`dom-preview-${executeCount}-${currentCode.length}-${Date.now()}`}
              html={html}
              css={css}
              javascript={executed ? currentCode : ""}
              title="DOM Manipulation Result"
              height={height}
              forceUpdateTrigger={executeCount}
            />

            {!executed && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Click {"'"}Run Code & See Result{"'"} in the JavaScript tab to
                  execute your code and see the changes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sample HTML Structure Info */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium">
            View HTML Structure
          </summary>
          <pre className="mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
            {html}
          </pre>
        </details>
      </div>
    </div>
  );
}
