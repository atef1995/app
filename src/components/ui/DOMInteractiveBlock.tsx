"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { Play, Code, Eye } from "lucide-react";
import { HTMLPreviewWindow } from "./HTMLPreviewWindow";
import CodeEditor from "../CodeEditor";
import BlockConsole from "./BlockConsole";
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
  height = 500,
}: DOMInteractiveBlockProps) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [currentCode, setCurrentCode] = useState(javascript);
  const [executed, setExecuted] = useState(false);
  const [executeCount, setExecuteCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const executeCountRef = useRef(0);

  // Create unique block ID based on title and description
  const blockId = useMemo(
    () =>
      btoa(title + description)
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 8),
    [title, description]
  );

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Reset code when javascript prop changes
  useEffect(() => {
    setCurrentCode(javascript);
    setExecuted(false);
    setExecuteCount(0);
    executeCountRef.current = 0;
    // Clear console via postMessage
    window.postMessage({ type: "dom-console-clear" }, "*");
  }, [javascript]);

  const executeCode = useCallback(() => {
    if (!isMounted) return;

    // Clear console via postMessage
    window.postMessage({ type: "dom-console-clear" }, "*");

    setExecuted(true);
    const newCount = executeCountRef.current + 1;
    executeCountRef.current = newCount;
    setExecuteCount(newCount);

    // Switch to preview tab with a slight delay to ensure state updates
    if (activeTab === "code") {
      setTimeout(() => {
        setActiveTab("preview");
      }, 500);
    }
  }, [isMounted, activeTab]);

  // Memoized preview component to prevent re-renders
  const PreviewComponent = useMemo(() => {
    return (
      <HTMLPreviewWindow
        key={`dom-preview-${executeCount}`}
        html={html}
        css={css}
        javascript={executed ? currentCode : ""}
        title="DOM Manipulation Result"
        height={height}
        forceUpdateTrigger={executeCount}
        blockId={blockId}
      />
    );
  }, [html, css, executed, currentCode, height, executeCount, blockId]);

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
              <CodeEditor
                initialCode={currentCode}
                onCodeChange={(code) => setCurrentCode(code)}
                placeholder="Write your JavaScript code here..."
                canRun={false}
              />
            </div>

            {/* Execute Button */}
            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                onClick={executeCode}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors cursor-pointer active:scale-95"
              >
                <Play className="w-4 h-4" />
                Run Code & See Result
              </button>
            </div>
          </div>
        )}

        {activeTab === "preview" && isMounted && (
          <div className="p-4">
            {PreviewComponent}

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <span className="font-mono">💡</span>
              <span>
                <strong>Tip:</strong> Click &apos;Run Code&apos; then switch to
                the Preview tab to see your DOM manipulation in action! Console
                output will appear above.
              </span>
            </div>
            {!executed && (
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg ">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Click {"'"}Run Code & See Result{"'"} in the JavaScript tab to
                  execute your code and see the changes.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Console Output - Shows for both tabs */}
      <BlockConsole blockId={blockId} />

      {/* Sample HTML Structure Info */}
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <details className="text-sm">
          <summary className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium">
            View HTML Structure
          </summary>
          <CodeEditor
            language="html"
            initialCode={html}
            height="200px"
            canRun={false}
            readOnly
          />
        </details>
      </div>
    </div>
  );
}
