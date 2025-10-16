"use client";

import React, { useState } from "react";
import {
  executeJavaScriptAsync,
  executeTypeScriptWithCompiler,
  executeJavaScript,
  executeJavaScriptStream,
  executeTypeScript,
} from "@/lib/codeRunner";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "@/components/providers/ThemeProvider";
import Console from "./Console";

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
  isComplete?: boolean;
}

// Type for the execution functions
interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  logs?: string[];
  errors?: string[];
  exitCode?: number;
  compiled?: boolean;
  transpiledCode?: string;
}

interface CodeEditorProps {
  initialCode?: string;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
  onCodeChange?: (code: string) => void;
  canRun?: boolean;
  language?: string;
  useWebContainer?: boolean; // WebContainer execution (has CORS issues)
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = "",
  readOnly = false,
  height = "100%",
  placeholder,
  onCodeChange,
  canRun = true,
  language = "javascript",
  useWebContainer = false, // WebContainer has CORS issues
}) => {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const [streamingOutput, setStreamingOutput] = useState<string[]>([]);
  const { resolvedTheme } = useTheme();
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);

  // Update code when initialCode changes
  React.useEffect(() => {
    setCode(initialCode);
    // Format code after it's been set
    if (initialCode.trim() && editorRef.current) {
      setTimeout(() => {
        editorRef.current?.getAction("editor.action.formatDocument")?.run();
      }, 1000);
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
    setStreamingOutput([]);

    setResult({
      output: [],
      errors: [],
      executionTime: 0,
      isComplete: false,
    });

    try {
      const startTime = Date.now();

      if (useWebContainer) {
        if (language === "javascript" || language === "nodejs") {
          // Use streaming execution for real-time output
          try {
            await executeJavaScriptStream(
              code,
              language,
              // onOutput callback - streams each line as it's available
              (output: string) => {
                setStreamingOutput((prev) => [...prev, output]);
              },
              // onComplete callback - called when execution finishes
              (finalResult) => {
                const executionTime = Date.now() - startTime;
                setResult({
                  output: finalResult.logs,
                  errors: finalResult.errors,
                  executionTime,
                  isComplete: true,
                });
                setIsRunning(false);
                setForceUpdateCounter((prev) => prev + 1);
              }
            );
          } catch (streamingError) {
            console.error(
              "Streaming execution failed, falling back to regular execution:",
              streamingError
            );
            // Fallback to regular execution
            const executionResult = await executeJavaScript(code, language);
            if (executionResult) {
              const executionTime = Date.now() - startTime;
              setResult({
                output: executionResult.output
                  ? executionResult.output
                      .split("\n")
                      .filter((line: string) => line.trim())
                  : [],
                errors: executionResult.error
                  ? executionResult.error
                      .split("\n")
                      .filter((line: string) => line.trim())
                  : [],
                executionTime,
                isComplete: true,
              });
              setForceUpdateCounter((prev) => prev + 1);
            }
            setIsRunning(false);
          }
        } else if (language === "typescript") {
          const executionResult = await executeTypeScript(code);
          if (executionResult) {
            const executionTime = Date.now() - startTime;
            setResult({
              output: executionResult.output
                ? executionResult.output
                    .split("\n")
                    .filter((line: string) => line.trim())
                : [],
              errors: executionResult.error
                ? executionResult.error
                    .split("\n")
                    .filter((line: string) => line.trim())
                : [],
              executionTime,
              isComplete: true,
            });
            setForceUpdateCounter((prev) => prev + 1);
          }
          setIsRunning(false);
        }
      } else {
        // Fallback to non-WebContainer execution
        let executionResult: CodeExecutionResult | undefined;

        if (language === "javascript") {
          executionResult = await executeJavaScriptAsync(code);
        } else if (language === "typescript") {
          executionResult = await executeTypeScriptWithCompiler(code);
        }

        if (executionResult) {
          const executionTime = Date.now() - startTime;
          setResult({
            output: executionResult.logs || [],
            errors: executionResult.errors || [],
            executionTime,
            isComplete: true,
          });
        }
        setIsRunning(false);
      }
    } catch (error) {
      console.error("Execution error:", error);
      setResult({
        output: [],
        errors: [
          error instanceof Error ? error.message : "Unknown error occurred",
        ],
        executionTime: 0,
        isComplete: true,
      });
      setIsRunning(false);
    }
  };
  const firstLetter = language.charAt(0);

  const lang = language.replace(firstLetter, firstLetter.toUpperCase());

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <div className="hidden sm:flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
            {lang}
          </span>
        </div>

        {!readOnly && (
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs rounded border border-gray-300 dark:border-gray-500 transition-colors flex items-center justify-center gap-1 cursor-pointer touch-manipulation"
              title={
                isExpanded
                  ? "Exit fullscreen (ESC)"
                  : "Expand to fullscreen (F11)"
              }
            >
              {isExpanded ? (
                <>
                  <span className="text-xs">⤓</span>
                  <span className="hidden sm:inline">Collapse</span>
                </>
              ) : (
                <>
                  <span className="text-xs">⤢</span>
                  <span className="hidden sm:inline">Expand</span>
                </>
              )}
            </button>
            {canRun && (
              <button
                onClick={handleRunCode}
                disabled={isRunning || !code.trim()}
                className="px-3 py-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 text-white text-xs sm:text-sm rounded font-medium transition-colors cursor-pointer touch-manipulation"
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
          isExpanded ? "fixed inset-0 bg-white dark:bg-gray-800" : ""
        }`}
      >
        {isExpanded && (
          <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
              {lang} Console - Fullscreen
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs sm:text-sm rounded border border-gray-300 dark:border-gray-500 transition-colors flex items-center justify-center gap-1 cursor-pointer touch-manipulation flex-shrink-0"
              title="Exit fullscreen (ESC)"
            >
              <span>✕</span>
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        )}

        <Editor
          height={isExpanded ? "calc(100vh - 140px)" : height}
          defaultLanguage={
            language === "nodejs" || language === "node"
              ? "javascript"
              : language
          }
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
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            lineNumbersMinChars: 3,
            glyphMargin: false,
            folding: true,
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
              }, 1000);
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

      {/* Console Output */}
      <Console
        result={result}
        isRunning={isRunning}
        forceUpdateCounter={forceUpdateCounter}
        streamingOutput={streamingOutput}
      />
    </div>
  );
};

export default CodeEditor;
