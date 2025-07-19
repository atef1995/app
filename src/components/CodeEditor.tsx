"use client";

import React, { useState } from "react";
import { executeJavaScriptSimple } from "@/lib/codeRunner";
import Editor from "@monaco-editor/react";
import { useTheme } from "@/components/providers/ThemeProvider";

interface CodeEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  onCodeChange?: (code: string) => void;
}

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  readOnly = false,
  height = "300px",
  placeholder,
  onCodeChange,
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { resolvedTheme } = useTheme();

  // Update code when initialCode changes
  React.useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Call onCodeChange when code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

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
            JavaScript Console
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Toggle fullscreen"
            >
              {isExpanded ? "⤓" : "⤢"}
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded font-medium transition-colors"
            >
              {isRunning ? "⏳" : "▶"} Run
            </button>
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
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕ Close
            </button>
          </div>
        )}

        <Editor
          height={isExpanded ? "calc(100vh - 140px)" : height}
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => handleCodeChange(value || "")}
          theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
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
            // Add keyboard shortcut for running code
            editor.addCommand(
              monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
              () => {
                handleRunCode();
              }
            );

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

        {!readOnly && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 px-2 py-1 rounded">
            Ctrl+Enter to run
          </div>
        )}
      </div>

      {/* Output */}
      {result && (
        <div className="border-t border-gray-200 dark:border-gray-600">
          <div className="p-3 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </h4>
              <span className="text-xs text-gray-500">
                {result.executionTime}ms
              </span>
            </div>

            <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-40 overflow-y-auto">
              {result.output.length > 0 ? (
                result.output.map((log, index) => (
                  <div key={index} className="mb-1">
                    {log}
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
