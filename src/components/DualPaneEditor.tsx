"use client";

import React, { useState, useEffect, useRef } from "react";
import { executeJavaScriptStream } from "@/lib/codeRunner";
import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "@/components/providers/ThemeProvider";
import Console from "./Console";
import ProjectDownload from "./ProjectDownload";
import DualPanePreview from "./DualPanePreview";

interface ExecutionResult {
  output: string[];
  errors: string[];
  executionTime: number;
  isComplete?: boolean;
}

interface DualPaneEditorProps {
  frontendCode?: string;
  backendCode?: string;
  height?: string;
  title?: string;
  description?: string;
  onFrontendChange?: (code: string) => void;
  onBackendChange?: (code: string) => void;
  showPreview?: boolean;
  previewType?: "html" | "api" | "full";
}

const DualPaneEditor: React.FC<DualPaneEditorProps> = ({
  frontendCode = "",
  backendCode = "",
  height = "600px",
  title = "Frontend/Backend Editor",
  description = "Edit both frontend and backend code and see them work together",
  onFrontendChange,
  onBackendChange,
  showPreview = true,
  previewType = "full",
}) => {
  const [frontend, setFrontend] = useState(frontendCode);
  const [backend, setBackend] = useState(backendCode);
  const [activePane, setActivePane] = useState<"frontend" | "backend">(
    "frontend"
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [streamingOutput, setStreamingOutput] = useState<string[]>([]);
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

  const { resolvedTheme } = useTheme();
  const frontendEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const backendEditorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  // Update codes when props change
  useEffect(() => {
    setFrontend(frontendCode);
    setBackend(backendCode);
  }, [frontendCode, backendCode]);

  // Handle code changes
  const handleFrontendChange = (newCode: string) => {
    setFrontend(newCode);
    onFrontendChange?.(newCode);
  };

  const handleBackendChange = (newCode: string) => {
    setBackend(newCode);
    onBackendChange?.(newCode);
  };

  // Run backend code in WebContainer
  const runBackendCode = async () => {
    if (!backend.trim() || isRunning) return;

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

      await executeJavaScriptStream(
        backend,
        "nodejs",
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
    } catch (error) {
      console.error("Backend execution error:", error);
      setResult({
        output: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
        executionTime: 0,
        isComplete: true,
      });
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
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {title}
            </span>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              this is for demonstration only, download the project and try it
              locally!
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ProjectDownload frontendCode={frontend} backendCode={backend} />
          <button
            onClick={runBackendCode}
            disabled={isRunning || !backend.trim()}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-sm rounded font-medium transition-colors"
          >
            {isRunning ? "⏳" : "▶"} Run Backend
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex" style={{ height: height }}>
        {/* Code Editor Section */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            <button
              onClick={() => setActivePane("frontend")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activePane === "frontend"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              🌐 Frontend
              <span className="ml-1 text-xs">
                {previewType === "html" ? "HTML/JS" : "JavaScript"}
              </span>
            </button>
            <button
              onClick={() => setActivePane("backend")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activePane === "backend"
                  ? "border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              🖥️ Backend
              <span className="ml-1 text-xs">Node.js</span>
            </button>
          </div>

          {/* Editor Area */}
          <div className="flex-1 relative">
            <div
              className={`absolute inset-0 ${
                activePane === "frontend" ? "block" : "hidden"
              }`}
            >
              <Editor
                height="100%"
                defaultLanguage={previewType === "html" ? "html" : "javascript"}
                value={frontend}
                onChange={(value) => handleFrontendChange(value || "")}
                theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  formatOnType: true,
                  formatOnPaste: true,
                  automaticLayout: true,
                }}
                onMount={(editor) => {
                  frontendEditorRef.current = editor;
                }}
              />
            </div>

            <div
              className={`absolute inset-0 ${
                activePane === "backend" ? "block" : "hidden"
              }`}
            >
              <Editor
                height="100%"
                defaultLanguage="javascript"
                value={backend}
                onChange={(value) => handleBackendChange(value || "")}
                theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  wordWrap: "on",
                  formatOnType: true,
                  formatOnPaste: true,
                  automaticLayout: true,
                }}
                onMount={(editor) => {
                  backendEditorRef.current = editor;
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview/Output Section */}
        {showPreview && (
          <DualPanePreview previewType={previewType} frontendCode={frontend} />
        )}
      </div>

      {/* Console Output for Backend */}
      <Console
        result={result}
        isRunning={isRunning}
        forceUpdateCounter={forceUpdateCounter}
        streamingOutput={streamingOutput}
      />
    </div>
  );
};

export default DualPaneEditor;
