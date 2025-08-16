"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, RotateCcw } from "lucide-react";

interface HTMLPreviewWindowProps {
  html: string;
  css?: string;
  javascript?: string;
  title?: string;
  height?: number;
  forceUpdateTrigger?: number;
}

export function HTMLPreviewWindow({
  html,
  css = "",
  javascript = "",
  title = "Preview",
  height = 300,
  forceUpdateTrigger = 0,
}: HTMLPreviewWindowProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [srcDoc, setSrcDoc] = useState("");
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    // Update force update counter when trigger changes
    setForceUpdate(forceUpdateTrigger);
  }, [forceUpdateTrigger]);

  useEffect(() => {
    // Create the full HTML document with a unique timestamp to force updates
    const timestamp = Date.now();
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            background: #f8fafc;
        }
        
        /* Default styles for demo elements */
        .box {
            width: 100px;
            height: 100px;
            background: #3b82f6;
            margin: 10px;
            display: inline-block;
            border-radius: 8px;
        }
        
        .message {
            padding: 12px;
            margin: 10px 0;
            border-radius: 6px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
        }
        
        .visible {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .hidden {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .highlighted {
            background: #fef3c7;
            border-color: #f59e0b;
        }
        
        .new-box {
            padding: 12px;
            margin: 8px 0;
            background: #dcfce7;
            border: 2px solid #16a34a;
            border-radius: 6px;
            color: #166534;
        }
        
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin: 4px;
            font-size: 14px;
        }
        
        button:hover {
            background: #2563eb;
        }
        
        input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin: 4px;
        }
        
        .item {
            padding: 8px;
            margin: 4px 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        
        ${css}
    </style>
</head>
<body>
    ${html}
    
    <script>
        // Timestamp: ${timestamp} - Force update: ${forceUpdate}
        try {
            ${javascript}
        } catch (error) {
            console.error('Preview Error:', error);
        }
    </script>
</body>
</html>`;

    setSrcDoc(fullHTML);
  }, [html, css, javascript, forceUpdate]);

  const resetPreview = () => {
    // Force re-render of the iframe by creating a new srcDoc
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.5;
            background: #f8fafc;
        }
        
        .box {
            width: 100px;
            height: 100px;
            background: #3b82f6;
            margin: 10px;
            display: inline-block;
            border-radius: 8px;
        }
        
        .message {
            padding: 12px;
            margin: 10px 0;
            border-radius: 6px;
            background: #f3f4f6;
            border: 1px solid #d1d5db;
        }
        
        .visible {
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        
        .hidden {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .highlighted {
            background: #fef3c7;
            border-color: #f59e0b;
        }
        
        .new-box {
            padding: 12px;
            margin: 8px 0;
            background: #dcfce7;
            border: 2px solid #16a34a;
            border-radius: 6px;
            color: #166534;
        }
        
        button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            margin: 4px;
            font-size: 14px;
        }
        
        button:hover {
            background: #2563eb;
        }
        
        input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            margin: 4px;
        }
        
        .item {
            padding: 8px;
            margin: 4px 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
        }
        
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

    setSrcDoc(fullHTML);
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-2">
            {title}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={resetPreview}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
            title="Reset Preview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-400"
            title={isVisible ? "Hide Preview" : "Show Preview"}
          >
            {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      {isVisible && (
        <div className="relative">
          <iframe
            className="w-full border-none"
            style={{ height: `${height}px` }}
            title="HTML Preview"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
          />
        </div>
      )}
    </div>
  );
}