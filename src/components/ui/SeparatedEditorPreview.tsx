"use client";

import { useState, useRef } from "react";
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

// Importing Prism grammars
import { Editor, PrismEditor } from "prism-react-editor";

import "prism-react-editor/prism/languages/css";
import "prism-react-editor/languages/html";
import "prism-react-editor/languages/jsx";

import "prism-react-editor/layout.css";
import "prism-react-editor/scrollbar.css";
import "prism-react-editor/invisibles.css";
import "prism-react-editor/themes/github-dark.css";
import "prism-react-editor/search.css";
import MyExtensions from "./MyExtensions";

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
  const [copied, setCopied] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const htmlEditorRef = useRef<PrismEditor | null>(null);
  const cssEditorRef = useRef<PrismEditor | null>(null);

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
    setResetKey((prev) => prev + 1); // Force re-mount editors
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6 h-[${height}px]`}
    >
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
      <div>
        {/* HTML Editor */}
        {activeTab === "html" && showHtmlEditor && (
          <div className="h-[30rem]">
            <Editor
              className="h-[30rem]"
              key={`html-${resetKey}`}
              onUpdate={(value) => setHtml(value)}
              language="html"
              value={initialHtml}
            >
              {(editor) => {
                htmlEditorRef.current = editor;
                return <MyExtensions editor={editor} />;
              }}
            </Editor>
          </div>
        )}

        {/* CSS Editor */}
        {activeTab === "css" && showCssEditor && (
          <div className="h-[30rem]">
            <Editor
              className="h-[30rem] max-h-dvh"
              key={`css-${resetKey}`}
              wordWrap
              onUpdate={(value) => setCss(value)}
              language="css"
              value={initialCss}
            >
              {(editor) => {
                cssEditorRef.current = editor;
                return <MyExtensions editor={editor} />;
              }}
            </Editor>
          </div>
        )}

        {/* Preview */}
        {activeTab === "preview" && isVisible && (
          <div className="h-full">
            <iframe
              srcDoc={generatePreviewHTML()}
              title="Preview"
              className="w-full h-full min-h-96 border-0"
              sandbox="allow-scripts"
            />
          </div>
        )}
      </div>
      {/* Preview */}
      {isVisible && (
        <div className="h-full">
          <iframe
            srcDoc={generatePreviewHTML()}
            title="Preview"
            className="w-full h-full min-h-96 border-0"
            sandbox="allow-scripts"
          />
        </div>
      )}

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
