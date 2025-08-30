"use client";

import React, { useState } from "react";
import { executeJavaScriptSimple } from "@/lib/codeRunner";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "@/components/providers/ThemeProvider";

interface CodeEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  onCodeChange?: (code: string) => void;
  canRun?: boolean;
  language?: string;
}

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  readOnly = false,
  height = "500px",
  placeholder,
  onCodeChange,
  canRun = true,
  language = "javascript",
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { resolvedTheme } = useTheme();
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);

  // Update code when initialCode changes
  React.useEffect(() => {
    setCode(initialCode);
    // Format code after it's been set
    if (initialCode.trim() && editorRef.current) {
      setTimeout(() => {
        editorRef.current?.getAction("editor.action.formatDocument")?.run();
      }, 100);
    }
  }, [initialCode]);

  // Call onCodeChange when code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // F11 to toggle fullscreen
      if (event.key === "F11" && !readOnly) {
        event.preventDefault();
        setIsExpanded(!isExpanded);
      }
      // ESC to exit fullscreen
      if (event.key === "Escape" && isExpanded) {
        event.preventDefault();
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded, readOnly]);

  const handleRunCode = async () => {
    if (!code.trim() || isRunning) return;

    setIsRunning(true);
    setResult(null);

    try {
      const startTime = Date.now();
      const executionResult = executeJavaScriptSimple(code);
      const executionTime = Date.now() - startTime;

      setResult({
        output: executionResult.logs,
        errors: executionResult.errors,
        executionTime,
      });
    } catch (error) {
      setResult({
        output: [],
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
        executionTime: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };
  const firstLetter = language.charAt(0);

  const lang = language.replace(firstLetter, firstLetter.toUpperCase());

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {lang}
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs rounded border border-gray-300 dark:border-gray-500 transition-colors flex items-center gap-1"
              title={
                isExpanded
                  ? "Exit fullscreen (ESC)"
                  : "Expand to fullscreen (F11)"
              }
            >
              {isExpanded ? (
                <>
                  <span className="text-xs">⤓</span>
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <span className="text-xs">⤢</span>
                  <span>Expand</span>
                </>
              )}
            </button>
            {canRun && (
              <button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded font-medium transition-colors"
              >
                {isRunning ? "⏳" : "▶"} Run
              </button>
            )}
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div
        className={`relative ${
          isExpanded ? "fixed inset-0 z-50 bg-white dark:bg-gray-800" : ""
        }`}
      >
        {isExpanded && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              JavaScript Console - Fullscreen
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-sm rounded border border-gray-300 dark:border-gray-500 transition-colors flex items-center gap-1"
              title="Exit fullscreen (ESC)"
            >
              <span>✕</span>
              <span>Close</span>
            </button>
          </div>
        )}

        <Editor
          height={isExpanded ? "calc(100vh - 140px)" : height}
          defaultLanguage={language}
          value={code}
          onChange={(value) => handleCodeChange(value || "")}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: readOnly,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            formatOnType: true,
            formatOnPaste: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            ...(placeholder && !code
              ? {
                  renderLineHighlight: "none",
                  hideCursorInOverviewRuler: true,
                  overviewRulerBorder: false,
                }
              : {}),
          }}
          onMount={(editor, monaco) => {
            // Store editor reference
            editorRef.current = editor;

            // Format initial code when editor mounts
            if (code.trim()) {
              setTimeout(() => {
                editor.getAction("editor.action.formatDocument")?.run();
              }, 100);
            }

            // Add placeholder support
            if (placeholder && !code) {
              const placeholderDecoration = editor.deltaDecorations(
                [],
                [
                  {
                    range: new monaco.Range(1, 1, 1, 1),
                    options: {
                      afterContentClassName: "placeholder-text",
                      isWholeLine: false,
                    },
                  },
                ]
              );

              // Add CSS for placeholder
              const style = document.createElement("style");
              style.textContent = `
                .placeholder-text::after {
                  content: "${placeholder}";
                  color: #999;
                  font-style: italic;
                  pointer-events: none;
                }
              `;
              document.head.appendChild(style);

              // Remove placeholder when user starts typing
              editor.onDidChangeModelContent(() => {
                const content = editor.getValue();
                if (content) {
                  editor.deltaDecorations(placeholderDecoration, []);
                }
              });
            }
          }}
        />
      </div>

      {/* Output */}
      {result && (
        <div className="border-t border-gray-200 dark:border-gray-600 h-80">
          <div className="flex flex-col p-3 bg-gray-50 dark:bg-gray-700 h-full">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </h4>
              <span className="text-xs text-gray-500">
                {result.executionTime}ms
              </span>
            </div>

            <div className="bg-black text-green-400 p-3 rounded font-mono text-sm overflow-y-auto text-balance h-full">
              {result.output.length > 0 ? (
                result.output.map((log, index) => (
                  <div key={index} className="mb-1 my-1">
                    {">"} {log}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No output</div>
              )}

              {result.errors.length > 0 && (
                <div className="mt-2">
                  {result.errors.map((error, index) => (
                    <div key={index} className="text-red-400 mb-1">
                      ❌ {error}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
