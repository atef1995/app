"use client";

import { useState } from "react";
import {
  Check,
  X,
  Play,
  RotateCcw,
  Code2,
  FileText,
  Palette,
  Lightbulb,
  Trophy,
} from "lucide-react";
import CodeEditor from "../CodeEditor";

interface TestCase {
  description: string;
  validate: (html: string, css: string, js: string) => boolean | Promise<boolean>;
}

interface ValidatedExerciseProps {
  title: string;
  instructions: string;
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  testCases: TestCase[];
  hints?: string[];
  solution?: {
    html?: string;
    css?: string;
    js?: string;
  };
  showHtmlEditor?: boolean;
  showCssEditor?: boolean;
  showJsEditor?: boolean;
}

export function ValidatedExercise({
  title,
  instructions,
  initialHtml = "",
  initialCss = "",
  initialJs = "",
  testCases,
  hints = [],
  solution,
  showHtmlEditor = true,
  showCssEditor = true,
  showJsEditor = true,
}: ValidatedExerciseProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [js, setJs] = useState(initialJs);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js" | "preview">("html");
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; description: string }>>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [allPassed, setAllPassed] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const generatePreviewHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercise Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
        }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        ${js}
    </script>
</body>
</html>`;
  };

  const runTests = async () => {
    setIsChecking(true);
    setTestResults([]);

    const results = [];
    let passedCount = 0;

    for (const testCase of testCases) {
      try {
        const passed = await testCase.validate(html, css, js);
        results.push({
          passed,
          description: testCase.description,
        });
        if (passed) passedCount++;
      } catch (error) {
        results.push({
          passed: false,
          description: `${testCase.description} (Error: ${error})`,
        });
      }
    }

    setTestResults(results);
    const allTestsPassed = passedCount === testCases.length;
    setAllPassed(allTestsPassed);
    setIsChecking(false);
  };

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
    setJs(initialJs);
    setTestResults([]);
    setAllPassed(false);
    setShowHints(false);
    setShowSolution(false);
  };

  const loadSolution = () => {
    if (solution) {
      if (solution.html) setHtml(solution.html);
      if (solution.css) setCss(solution.css);
      if (solution.js) setJs(solution.js);
      setShowSolution(true);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10 cursor-pointer"
              title="Reset exercise"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            {solution && (
              <button
                onClick={loadSolution}
                className="text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded hover:bg-white/10 text-xs font-medium cursor-pointer"
                title="Show solution"
              >
                Solution
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b-2 border-blue-200 dark:border-blue-700 px-4 py-3">
        <h4 className="text-blue-800 dark:text-blue-300 font-semibold text-sm mb-1">
          📝 Exercise Instructions:
        </h4>
        <p className="text-blue-700 dark:text-blue-200 text-sm">{instructions}</p>
      </div>

      {/* Success Message */}
      {allPassed && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b-2 border-green-200 dark:border-green-700 px-4 py-3">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
            <Trophy className="w-5 h-5" />
            <span className="font-semibold">
              Congratulations! You passed all tests! 🎉
            </span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex">
          {showHtmlEditor && (
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "html"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              HTML
            </button>
          )}
          {showCssEditor && (
            <button
              onClick={() => setActiveTab("css")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "css"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <Palette className="w-4 h-4" />
              CSS
            </button>
          )}
          {showJsEditor && (
            <button
              onClick={() => setActiveTab("js")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === "js"
                  ? "border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <Code2 className="w-4 h-4" />
              JavaScript
            </button>
          )}
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === "preview"
                ? "border-green-500 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800"
                : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            }`}
          >
            <Play className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div>
        {activeTab === "html" && showHtmlEditor && (
          <div className="h-[25rem]">
            <CodeEditor
              language="html"
              initialCode={html}
              onCodeChange={setHtml}
            />
          </div>
        )}

        {activeTab === "css" && showCssEditor && (
          <div className="h-[25rem]">
            <CodeEditor
              language="css"
              initialCode={css}
              onCodeChange={setCss}
            />
          </div>
        )}

        {activeTab === "js" && showJsEditor && (
          <div className="h-[25rem]">
            <CodeEditor
              language="javascript"
              initialCode={js}
              onCodeChange={setJs}
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div className="h-[25rem]">
            <iframe
              srcDoc={generatePreviewHTML()}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Test Results:
          </h4>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 p-2 rounded ${
                  result.passed
                    ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                }`}
              >
                {result.passed ? (
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm">{result.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {hints.length > 0 && (
        <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 font-medium cursor-pointer hover:text-yellow-700 dark:hover:text-yellow-300"
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? "Hide Hints" : "Need a Hint?"}
          </button>
          {showHints && (
            <div className="mt-3 space-y-2">
              {hints.map((hint, index) => (
                <div
                  key={index}
                  className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800 dark:text-yellow-200"
                >
                  <strong>Hint {index + 1}:</strong> {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Check Button */}
      <div className="border-t-2 border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <button
          onClick={runTests}
          disabled={isChecking}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isChecking ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Checking...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Check My Solution
            </>
          )}
        </button>
      </div>
    </div>
  );
}
