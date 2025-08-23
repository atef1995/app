"use client";

import { useEffect, useState, useRef } from "react";
import {
  Eye,
  EyeOff,
  RotateCcw,
  Code2,
  FileText,
  Palette,
  Play,
  Copy,
  Check,
} from "lucide-react";

interface SeparatedEditorPreviewProps {
  initialHtml: string;
  initialCss?: string;
  title?: string;
  height?: number;
  showHtmlEditor?: boolean;
  showCssEditor?: boolean;
  instructions?: string;
  mission?: string;
}

export function SeparatedEditorPreview({
  initialHtml,
  initialCss = "",
  title = "HTML & CSS Editor",
  height = 400,
  showHtmlEditor = true,
  showCssEditor = true,
  instructions,
  mission,
}: SeparatedEditorPreviewProps) {
  const [html, setHtml] = useState(initialHtml);
  const [css, setCss] = useState(initialCss);
  const [activeTab, setActiveTab] = useState<"html" | "css" | "preview">("css");
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setHtml(initialHtml);
  }, [initialHtml]);

  useEffect(() => {
    setCss(initialCss);
  }, [initialCss]);

  const generatePreviewHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Tutorial Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            background: #ffffff;
        }
        
        /* Your CSS goes here */
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
  };

  const handleCopy = async () => {
    const fullCode = `<!-- HTML -->
${html}

<style>
/* CSS */
${css}
</style>`;

    try {
      await navigator.clipboard.writeText(fullCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleReset = () => {
    setHtml(initialHtml);
    setCss(initialCss);
  };

  if (!isMounted) {
    return (
      <div
        className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ height: `${height}px` }}
      >
        <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-full rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
              title="Reset to original"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(!isVisible)}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10"
              title={isVisible ? "Hide preview" : "Show preview"}
            >
              {isVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      {(instructions || mission) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b-2 border-yellow-200 dark:border-yellow-700 px-4 py-3">
          {mission && (
            <div className="mb-2">
              <h4 className="text-yellow-800 dark:text-yellow-300 font-semibold text-sm mb-1">
                🎯 Your Mission:
              </h4>
              <p className="text-yellow-700 dark:text-yellow-200 text-sm">
                {mission}
              </p>
            </div>
          )}
          {instructions && (
            <div>
              <h4 className="text-yellow-800 dark:text-yellow-300 font-semibold text-sm mb-1">
                💡 Instructions:
              </h4>
              <p className="text-yellow-700 dark:text-yellow-200 text-sm">
                {instructions}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex">
          {showHtmlEditor && (
            <button
              onClick={() => setActiveTab("html")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
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
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "css"
                  ? "border-purple-500 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800"
                  : "border-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              }`}
            >
              <Palette className="w-4 h-4" />
              CSS
            </button>
          )}
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
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

      {/* Content Area */}
      <div style={{ height: `${height}px` }}>
        {/* HTML Editor */}
        {activeTab === "html" && showHtmlEditor && (
          <div className="h-full">
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                lineHeight: 1.5,
              }}
              placeholder="Write your HTML here..."
              onKeyDown={(e) => {
                // Handle tab key for indentation
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue = html.substring(0, start) + '  ' + html.substring(end);
                  setHtml(newValue);
                  // Set cursor position after the inserted spaces
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 2;
                  }, 0);
                }
              }}
            />
          </div>
        )}

        {/* CSS Editor */}
        {activeTab === "css" && showCssEditor && (
          <div className="h-full">
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 border-none resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 text-gray-900 dark:text-gray-100"
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 14,
                lineHeight: 1.5,
              }}
              placeholder="Write your CSS here..."
              onKeyDown={(e) => {
                // Handle tab key for indentation
                if (e.key === 'Tab') {
                  e.preventDefault();
                  const textarea = e.target as HTMLTextAreaElement;
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newValue = css.substring(0, start) + '  ' + css.substring(end);
                  setCss(newValue);
                  // Set cursor position after the inserted spaces
                  setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = start + 2;
                  }, 0);
                }
              }}
            />
          </div>
        )}

        {/* Preview */}
        {activeTab === "preview" && isVisible && (
          <div className="h-full">
            <iframe
              srcDoc={generatePreviewHTML()}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>

      {/* Footer with tips */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          <strong>💡 Pro Tip:</strong> In real projects, keep HTML and CSS in
          separate files. This editor simulates that workflow - edit CSS in the
          CSS tab, HTML in the HTML tab!
        </p>
      </div>
    </div>
  );
}
